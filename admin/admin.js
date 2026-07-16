(() => {
  "use strict";

  const localHostnames = new Set(["localhost", "127.0.0.1", "[::1]", "::1"]);
  if (
    window.location.protocol !== "https:" &&
    !localHostnames.has(window.location.hostname.toLowerCase())
  ) {
    const secureUrl = new URL(window.location.href);
    secureUrl.protocol = "https:";
    window.location.replace(secureUrl.href);
    return;
  }

  const ranking = window.MCEVENTS_RANKING;
  if (!ranking) {
    throw new Error("The shared ranking calculator could not be loaded.");
  }

  const { MAX_POINTS, TIER_IDS, TIER_DEFAULTS } = ranking;
  const API_BASE = "/api/admin";
  const DRAFT_PREFIX = "mcevents-tierlist-secure-draft-v1";
  const EMPTY_DATA = {
    updatedAt: "",
    intro: "PvP rankings calculated automatically from verified test points.",
    maxPoints: MAX_POINTS,
    tiers: TIER_IDS.map((id) => ({
      id,
      label: TIER_DEFAULTS[id].label,
      description: TIER_DEFAULTS[id].description
    })),
    players: []
  };

  const elements = {
    main: document.getElementById("admin-main"),
    loginView: document.getElementById("admin-login-view"),
    editorView: document.getElementById("admin-editor-view"),
    loginForm: document.getElementById("admin-login-form"),
    username: document.getElementById("admin-username"),
    password: document.getElementById("admin-password"),
    loginButton: document.getElementById("admin-login-button"),
    loginError: document.getElementById("admin-login-error"),
    logout: document.getElementById("admin-logout"),
    modeBadge: document.getElementById("admin-mode-badge"),
    status: document.getElementById("admin-status"),
    error: document.getElementById("admin-error"),
    reload: document.getElementById("admin-reload"),
    addPlayer: document.getElementById("admin-add-player"),
    save: document.getElementById("admin-save"),
    playerEditors: document.getElementById("admin-player-editors"),
    preview: document.getElementById("admin-live-preview"),
    playerCount: document.getElementById("admin-player-count"),
    draftRecovery: document.getElementById("admin-draft-recovery"),
    draftMessage: document.getElementById("admin-draft-message"),
    restoreDraft: document.getElementById("admin-restore-draft"),
    discardDraft: document.getElementById("admin-discard-draft"),
    conflict: document.getElementById("admin-conflict"),
    conflictDismiss: document.getElementById("admin-conflict-dismiss"),
    conflictReload: document.getElementById("admin-conflict-reload")
  };

  const state = {
    authenticated: false,
    user: "",
    csrfToken: "",
    data: cloneData(EMPTY_DATA),
    baseData: cloneData(EMPTY_DATA),
    sha: null,
    dirty: false,
    pending: false,
    previewTimer: 0,
    draftCandidate: null
  };

  class AdminError extends Error {}
  class UnauthorizedError extends AdminError {}
  class ConflictError extends AdminError {}

  function cloneData(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function asString(value, fallback = "") {
    return typeof value === "string" ? value : fallback;
  }

  function createElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (typeof text === "string") element.textContent = text;
    return element;
  }

  function createButton(label, className = "admin-button admin-button-small") {
    const button = createElement("button", className, label);
    button.type = "button";
    return button;
  }

  function createInput(id, value, options = {}) {
    const input = createElement("input", `admin-input${options.points ? " admin-points-input" : ""}`);
    input.id = id;
    input.type = options.points ? "number" : "text";
    input.value = String(value ?? "");
    input.autocomplete = "off";
    input.required = true;
    if (options.maxLength) input.maxLength = options.maxLength;
    if (options.points) {
      input.min = "0";
      input.max = String(MAX_POINTS);
      input.step = "1";
      input.inputMode = "numeric";
    }
    return input;
  }

  function createField(labelText, control, wide = false) {
    const label = createElement("label", `admin-field${wide ? " admin-field-wide" : ""}`);
    label.htmlFor = control.id;
    label.append(document.createTextNode(labelText), control);
    return label;
  }

  function normalizeTierlist(raw) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      throw new AdminError("The server returned an invalid tierlist.");
    }

    if (!Array.isArray(raw.players)) {
      throw new AdminError("The tierlist is missing its player list.");
    }

    for (const player of raw.players) {
      if (!player || typeof player !== "object" || Array.isArray(player)) {
        throw new AdminError("The tierlist contains an invalid player entry.");
      }
      const points = Number(player.points);
      if (!Number.isInteger(points) || points < 0 || points > MAX_POINTS) {
        throw new AdminError(`Every player score must be a whole number from 0 to ${MAX_POINTS}.`);
      }
    }

    return ranking.normalizeTierlist(raw);
  }

  function validateTierlist(data) {
    const usernames = new Set();

    for (const player of data.players) {
      const username = asString(player.username).trim();
      if (!/^[A-Za-z0-9_]{3,16}$/.test(username)) {
        return `"${username || "Empty username"}" is not valid. Use 3-16 letters, numbers, or underscores.`;
      }

      const points = Number(player.points);
      if (!Number.isInteger(points) || points < 0 || points > MAX_POINTS) {
        return `"${username}" needs a whole-number score from 0 to ${MAX_POINTS}.`;
      }

      const note = asString(player.note);
      if (note.length > 500) {
        return `"${username}" has a note longer than 500 characters.`;
      }

      const key = username.toLowerCase();
      if (usernames.has(key)) {
        return `"${username}" appears more than once. Each player can have only one score.`;
      }
      usernames.add(key);
    }

    return "";
  }

  function setStatus(message, tone = "neutral") {
    elements.status.textContent = message;
    elements.status.dataset.tone = tone;
  }

  function clearError() {
    elements.error.textContent = "";
    elements.error.hidden = true;
  }

  function showError(error, focus = true) {
    const message = error instanceof Error ? error.message : String(error);
    elements.error.textContent = message || "Something went wrong. Please try again.";
    elements.error.hidden = false;
    if (focus) elements.error.focus({ preventScroll: false });
  }

  function showLoginError(message) {
    elements.loginError.textContent = message;
    elements.loginError.hidden = false;
    elements.loginError.focus({ preventScroll: false });
  }

  function clearLoginError() {
    elements.loginError.textContent = "";
    elements.loginError.hidden = true;
  }

  function safeStorageGet(key) {
    try {
      return window.localStorage.getItem(key) || "";
    } catch (_error) {
      return "";
    }
  }

  function safeStorageSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (_error) {
      // The editor remains usable when browser storage is unavailable.
    }
  }

  function safeStorageRemove(key) {
    try {
      window.localStorage.removeItem(key);
    } catch (_error) {
      // The editor remains usable when browser storage is unavailable.
    }
  }

  function draftKey() {
    const userKey = state.user.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "_") || "staff";
    return `${DRAFT_PREFIX}:${userKey}`;
  }

  function readDraft() {
    const stored = safeStorageGet(draftKey());
    if (!stored) return null;

    try {
      const draft = JSON.parse(stored);
      if (!draft || typeof draft !== "object" || !draft.data) return null;
      return {
        baseSha: asString(draft.baseSha),
        savedAt: asString(draft.savedAt),
        data: normalizeTierlist(draft.data),
        baseData: draft.baseData ? normalizeTierlist(draft.baseData) : null
      };
    } catch (_error) {
      safeStorageRemove(draftKey());
      return null;
    }
  }

  function saveDraft() {
    if (!state.authenticated || !state.dirty) return;
    const validScores = state.data.players.every((player) => {
      const points = Number(player.points);
      return Number.isInteger(points) && points >= 0 && points <= MAX_POINTS;
    });
    if (!validScores) return;

    safeStorageSet(draftKey(), JSON.stringify({
      baseSha: state.sha || "",
      savedAt: new Date().toISOString(),
      baseData: state.baseData,
      data: state.data
    }));
  }

  function clearDraft() {
    safeStorageRemove(draftKey());
    state.draftCandidate = null;
    elements.draftRecovery.hidden = true;
  }

  function markDirty() {
    state.dirty = true;
    saveDraft();
    updateControls();
  }

  function setBusy(busy) {
    state.pending = busy;
    elements.main.setAttribute("aria-busy", String(busy));
    updateControls();
  }

  function updateControls() {
    const signedIn = state.authenticated;
    elements.loginButton.disabled = state.pending;
    elements.logout.disabled = state.pending;
    elements.reload.disabled = state.pending;
    elements.addPlayer.disabled = state.pending;
    elements.save.disabled = state.pending || !state.dirty;
    elements.restoreDraft.disabled = state.pending;
    elements.discardDraft.disabled = state.pending;
    elements.conflictDismiss.disabled = state.pending;
    elements.conflictReload.disabled = state.pending;
    elements.playerEditors.inert = state.pending;
    for (const control of elements.playerEditors.querySelectorAll("input, button")) {
      control.disabled = state.pending;
    }

    if (!signedIn) {
      elements.modeBadge.textContent = state.pending ? "Checking session..." : "Sign in required";
    } else if (state.pending) {
      elements.modeBadge.textContent = "Working...";
    } else if (state.dirty) {
      elements.modeBadge.textContent = `${state.user} - unsaved`;
    } else {
      elements.modeBadge.textContent = `${state.user} - synced`;
    }
  }

  function showLogin(message = "") {
    state.authenticated = false;
    state.csrfToken = "";
    state.sha = null;
    state.dirty = false;
    state.draftCandidate = null;
    elements.editorView.hidden = true;
    elements.loginView.hidden = false;
    elements.logout.hidden = true;
    elements.password.value = "";
    elements.conflict.hidden = true;
    elements.draftRecovery.hidden = true;
    if (message) showLoginError(message);
    else clearLoginError();
    updateControls();
    window.setTimeout(() => {
      if (elements.loginView.hidden) return;
      if (elements.username.value.trim()) elements.password.focus();
      else elements.username.focus();
    }, 0);
  }

  function showEditor() {
    clearLoginError();
    elements.loginView.hidden = true;
    elements.editorView.hidden = false;
    elements.logout.hidden = false;
    updateControls();
  }

  async function parseResponse(response) {
    const type = response.headers.get("content-type") || "";
    if (!type.includes("application/json")) return {};
    try {
      return await response.json();
    } catch (_error) {
      return {};
    }
  }

  async function apiRequest(path, options = {}) {
    const method = options.method || "GET";
    const headers = {
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...(options.headers || {})
    };

    if (options.body !== undefined) {
      headers["Content-Type"] = "application/json";
    }
    if (!["GET", "HEAD"].includes(method) && state.csrfToken) {
      headers["X-CSRF-Token"] = state.csrfToken;
    }

    let response;
    try {
      response = await fetch(`${API_BASE}${path}`, {
        method,
        headers,
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
        credentials: "same-origin",
        cache: "no-store"
      });
    } catch (_error) {
      throw new AdminError("Could not reach the secure website API. Check that the website server is running.");
    }

    const payload = await parseResponse(response);
    if (payload.csrfToken) state.csrfToken = asString(payload.csrfToken);

    if (response.status === 401) {
      throw new UnauthorizedError(asString(payload.message, "Your session has expired. Please sign in again."));
    }
    if (response.status === 409) {
      throw new ConflictError(asString(payload.message, "A newer tierlist was saved before yours."));
    }
    if (!response.ok) {
      throw new AdminError(asString(payload.message, `The server returned HTTP ${response.status}.`));
    }

    return payload;
  }

  function assignmentLabel(player) {
    if (!player.tier || player.tier === "unranked" || !player.rank) {
      return "Unranked - hidden at 0 points";
    }
    return `${player.tier.toUpperCase()} Tier - Overall #${player.rank}`;
  }

  function calculateState() {
    const validScores = state.data.players.every((player) => {
      const points = Number(player.points);
      return Number.isInteger(points) && points >= 0 && points <= MAX_POINTS;
    });
    if (validScores) state.data = ranking.normalizeTierlist(state.data);
  }

  function schedulePreview() {
    window.clearTimeout(state.previewTimer);
    state.previewTimer = window.setTimeout(renderPreview, 80);
  }

  function createPlayerEditor(player, playerIndex) {
    const item = createElement("li", "admin-player-editor");
    item.dataset.tier = player.tier || "unranked";

    const heading = createElement("div", "admin-player-editor-heading");
    const assignment = createElement("span", "admin-tier-assignment", assignmentLabel(player));
    assignment.dataset.tier = player.tier || "unranked";
    const position = player.rank
      ? `#${player.rank} overall - #${player.tierRank} in ${player.tier.toUpperCase()}`
      : "Not visible on the public tierlist";
    heading.append(assignment, createElement("span", "admin-player-position", position));

    const fields = createElement("div", "admin-player-fields");
    const username = createInput(`player-${playerIndex}-username`, player.username, { maxLength: 16 });
    username.minLength = 3;
    username.pattern = "[A-Za-z0-9_]{3,16}";
    username.spellcheck = false;
    username.placeholder = "Minecraft username";
    username.addEventListener("input", () => {
      player.username = username.value;
      markDirty();
      schedulePreview();
    });
    username.addEventListener("change", () => {
      calculateState();
      markDirty();
      renderAll();
    });

    const points = createInput(`player-${playerIndex}-points`, player.points, { points: true });
    points.addEventListener("input", () => {
      player.points = points.value === "" ? 0 : Number(points.value);
      markDirty();
      schedulePreview();
    });
    points.addEventListener("change", () => {
      const score = Number(player.points);
      if (!Number.isInteger(score) || score < 0 || score > MAX_POINTS) {
        showError(new AdminError(`Points must be a whole number from 0 to ${MAX_POINTS}.`));
        points.focus();
        return;
      }
      clearError();
      calculateState();
      markDirty();
      renderAll();
      setStatus(`${player.username || "Player"} now has ${score} points. Placement recalculated.`, "success");
    });

    const note = createInput(`player-${playerIndex}-note`, player.note, { maxLength: 500 });
    note.required = false;
    note.placeholder = "Optional test result or staff note";
    note.addEventListener("input", () => {
      player.note = note.value;
      markDirty();
      schedulePreview();
    });

    fields.append(
      createField("Minecraft username", username),
      createField(`Points (0-${MAX_POINTS})`, points),
      createField("Test result / note (optional)", note, true)
    );

    const actions = createElement("div", "admin-player-editor-actions");
    const remove = createButton("Delete", "admin-button admin-button-small admin-button-danger");
    remove.setAttribute("aria-label", `Delete ${player.username || "this empty player row"}`);
    remove.addEventListener("click", () => {
      const name = player.username.trim() || "this empty player row";
      if (!window.confirm(`Delete ${name} from the tierlist?`)) return;
      const currentIndex = state.data.players.indexOf(player);
      if (currentIndex >= 0) state.data.players.splice(currentIndex, 1);
      calculateState();
      markDirty();
      renderAll();
      setStatus(`Deleted ${name}. Save changes to publish the removal.`);
    });

    actions.append(remove);
    item.append(heading, fields, actions);
    return item;
  }

  function renderEditors() {
    elements.playerEditors.replaceChildren();
    if (!state.data.players.length) {
      elements.playerEditors.append(createElement("li", "admin-empty-message", "No player scores yet. Add a player to begin."));
      return;
    }

    state.data.players.forEach((player, index) => {
      elements.playerEditors.append(createPlayerEditor(player, index));
    });
  }

  function renderPreview() {
    elements.preview.replaceChildren();
    const calculated = ranking.groupedTiers(state.data);
    const previewTiers = [...calculated.tiers];
    const unranked = calculated.players.filter((player) => player.tier === "unranked");

    if (unranked.length) {
      previewTiers.push({
        id: "unranked",
        label: "Unranked",
        description: "0 points - saved in the manager but hidden from the public tierlist.",
        players: unranked
      });
    }

    for (const tier of previewTiers) {
      const section = createElement("section", "admin-preview-tier");
      section.dataset.tier = tier.id;

      const header = createElement("div", "admin-preview-tier-header");
      header.append(
        createElement("h3", "admin-tier-title", tier.label || `${tier.id.toUpperCase()} Tier`),
        createElement("span", "admin-count-badge", String(tier.players.length))
      );
      section.append(header);

      if (asString(tier.description).trim()) {
        section.append(createElement("p", "admin-helper", tier.description));
      }

      const list = createElement("ul", "admin-preview-list");
      if (!tier.players.length) {
        list.append(createElement("li", "admin-empty-message", "No players currently fall in this range."));
      }

      for (const player of tier.players) {
        const listItem = document.createElement("li");
        const username = asString(player.username).trim();
        const displayName = username || "Username pending";
        const card = createElement("a", "admin-preview-card");
        card.href = `https://namemc.com/profile/${encodeURIComponent(username || "MHF_Question")}`;
        card.target = "_blank";
        card.rel = "noopener noreferrer";
        card.setAttribute("aria-label", username ? `Open ${username} on NameMC` : "Player username is still empty");

        const avatar = createElement("img", "admin-player-avatar");
        avatar.src = `https://mc-heads.net/avatar/${encodeURIComponent(username || "MHF_Question")}/80`;
        avatar.alt = username ? `${username}'s Minecraft avatar` : "Placeholder Minecraft avatar";
        avatar.width = 80;
        avatar.height = 80;
        avatar.loading = "lazy";
        avatar.addEventListener("error", () => {
          avatar.removeAttribute("src");
          avatar.alt = "Avatar unavailable";
        }, { once: true });

        const copy = createElement("div", "admin-preview-card-copy");
        copy.append(createElement("strong", "admin-player-name", displayName));
        const score = player.rank
          ? `${player.points} points - #${player.rank} overall`
          : `${player.points} points - hidden`;
        copy.append(createElement("span", "admin-specialty-badge", score));
        if (asString(player.note).trim()) {
          copy.append(createElement("p", "admin-player-note", player.note));
        }

        card.append(avatar, copy);
        listItem.append(card);
        list.append(listItem);
      }

      section.append(list);
      elements.preview.append(section);
    }

    const rankedCount = calculated.players.filter((player) => player.points > 0).length;
    elements.playerCount.textContent = `${rankedCount} ranked - ${calculated.players.length} total`;
  }

  function renderAll() {
    window.clearTimeout(state.previewTimer);
    calculateState();
    renderEditors();
    renderPreview();
    updateControls();
  }

  function playerKey(player) {
    return asString(player && player.username).trim().toLowerCase();
  }

  function editablePlayerMatches(left, right) {
    return (
      asString(left && left.username).trim() === asString(right && right.username).trim() &&
      Number(left && left.points) === Number(right && right.points) &&
      asString(left && left.note) === asString(right && right.note)
    );
  }

  function uniquePlayerMap(players) {
    const map = new Map();
    for (const player of players) {
      const key = playerKey(player);
      if (!key || map.has(key)) return null;
      map.set(key, player);
    }
    return map;
  }

  function mergeDraftWithCurrent(draft) {
    if (!draft.baseData) {
      throw new AdminError("This draft is from an older editor version and cannot be merged safely. Keep the server version and re-enter the needed changes.");
    }

    const baseMap = uniquePlayerMap(draft.baseData.players);
    const draftMap = uniquePlayerMap(draft.data.players);
    const currentMap = uniquePlayerMap(state.data.players);
    if (!baseMap || !draftMap || !currentMap) {
      throw new AdminError("The older draft contains an empty or duplicate username, so it cannot be merged safely with the newer server version.");
    }

    const merged = state.data.players.map((player) => ({ ...player }));
    const mergedMap = uniquePlayerMap(merged);
    const conflicts = [];

    // Usernames are the merge identity. A rename therefore looks like deleting
    // one key and adding another. If both versions removed the same base key but
    // produced different sets of new keys, we cannot tell a shared deletion from
    // two conflicting renames. Stop and ask for a manual choice instead of
    // silently publishing two copies of the same player under different names.
    const draftAdditions = new Set(
      [...draftMap.keys()].filter((key) => !baseMap.has(key))
    );
    const currentAdditions = new Set(
      [...currentMap.keys()].filter((key) => !baseMap.has(key))
    );
    const additionsMatch = (
      draftAdditions.size === currentAdditions.size &&
      [...draftAdditions].every((key) => currentAdditions.has(key))
    );
    if (!additionsMatch) {
      for (const [key, basePlayer] of baseMap) {
        if (!draftMap.has(key) && !currentMap.has(key)) {
          conflicts.push(basePlayer.username);
        }
      }
    }

    for (const [key, basePlayer] of baseMap) {
      const draftPlayer = draftMap.get(key);
      const currentPlayer = currentMap.get(key);

      if (!draftPlayer) {
        if (currentPlayer && !editablePlayerMatches(currentPlayer, basePlayer)) {
          conflicts.push(basePlayer.username);
          continue;
        }
        if (currentPlayer) {
          const index = merged.findIndex((player) => playerKey(player) === key);
          if (index >= 0) merged.splice(index, 1);
          mergedMap.delete(key);
        }
        continue;
      }

      if (editablePlayerMatches(draftPlayer, basePlayer)) continue;
      if (!currentPlayer) {
        conflicts.push(draftPlayer.username);
        continue;
      }
      if (
        !editablePlayerMatches(currentPlayer, basePlayer) &&
        !editablePlayerMatches(currentPlayer, draftPlayer)
      ) {
        conflicts.push(draftPlayer.username);
        continue;
      }

      const index = merged.findIndex((player) => playerKey(player) === key);
      if (index >= 0) {
        merged[index] = {
          ...merged[index],
          username: draftPlayer.username,
          points: draftPlayer.points,
          note: draftPlayer.note
        };
      }
    }

    for (const [key, draftPlayer] of draftMap) {
      if (baseMap.has(key)) continue;
      const currentPlayer = currentMap.get(key);
      if (currentPlayer && !editablePlayerMatches(currentPlayer, draftPlayer)) {
        conflicts.push(draftPlayer.username);
        continue;
      }
      if (!currentPlayer && !mergedMap.has(key)) {
        merged.push({ ...draftPlayer });
        mergedMap.set(key, draftPlayer);
      }
    }

    if (conflicts.length) {
      const names = [...new Set(conflicts)].join(", ");
      throw new AdminError(`The server and draft both changed: ${names}. Those changes cannot be combined automatically. Keep the server version and re-enter the needed values.`);
    }

    return ranking.normalizeTierlist({
      ...state.data,
      players: merged
    });
  }

  function offerDraftRecovery() {
    const draft = readDraft();
    if (!draft) {
      elements.draftRecovery.hidden = true;
      return;
    }

    if (draft.baseSha && draft.baseSha === state.sha) {
      state.data = draft.data;
      state.dirty = true;
      renderAll();
      setStatus("Restored your unsaved local draft. Review it, then save when ready.", "warning");
      return;
    }

    state.draftCandidate = draft;
    const savedDate = draft.savedAt ? new Date(draft.savedAt) : null;
    const savedText = savedDate && !Number.isNaN(savedDate.getTime())
      ? ` from ${savedDate.toLocaleString()}`
      : "";
    elements.draftMessage.textContent = `An unsaved draft${savedText} was based on a different server version. Restore it only if you still need those changes.`;
    elements.draftRecovery.hidden = false;
  }

  async function loadTierlist(options = {}) {
    const { discardDraft = false, checkDraft = true } = options;
    clearError();
    elements.conflict.hidden = true;
    setBusy(true);
    setStatus("Loading the current tierlist from the secure server...");

    try {
      const payload = await apiRequest("/tierlist");
      if (!payload.tierlist || !payload.sha) {
        throw new AdminError("The server returned an incomplete tierlist response.");
      }

      state.data = normalizeTierlist(payload.tierlist);
      state.baseData = cloneData(state.data);
      state.sha = asString(payload.sha);
      state.dirty = false;
      if (discardDraft) clearDraft();
      renderAll();
      setStatus("Current tierlist loaded. Changes are not public until you press Save changes.", "success");
      if (checkDraft && !discardDraft) offerDraftRecovery();
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        showLogin("Your session expired. Sign in again to continue; any unsaved draft remains in this browser.");
      } else {
        showError(error);
        setStatus("Could not load the tierlist.");
      }
    } finally {
      setBusy(false);
    }
  }

  async function checkSession() {
    setBusy(true);
    try {
      const payload = await apiRequest("/session");
      if (!payload.authenticated) {
        showLogin();
        return;
      }

      state.authenticated = true;
      state.user = asString(payload.user, "Staff");
      state.csrfToken = asString(payload.csrfToken, state.csrfToken);
      showEditor();
      await loadTierlist();
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        showLogin();
      } else {
        showLoginError(error.message);
        elements.modeBadge.textContent = "API unavailable";
      }
    } finally {
      setBusy(false);
    }
  }

  async function login(event) {
    event.preventDefault();
    clearLoginError();

    const username = elements.username.value.trim();
    const password = elements.password.value;
    if (!username || !password) {
      showLoginError("Enter both your username and password.");
      return;
    }

    setBusy(true);
    try {
      const payload = await apiRequest("/login", {
        method: "POST",
        body: { username, password }
      });
      if (!payload.authenticated) {
        throw new AdminError("The server did not create an authenticated session.");
      }

      state.authenticated = true;
      state.user = asString(payload.user, username);
      state.csrfToken = asString(payload.csrfToken, state.csrfToken);
      elements.loginForm.reset();
      showEditor();
      await loadTierlist();
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        showLoginError("That username or password is incorrect.");
      } else {
        showLoginError(error.message);
      }
    } finally {
      elements.password.value = "";
      setBusy(false);
    }
  }

  async function logout() {
    if (state.dirty && !window.confirm("Log out now? Your unsaved tierlist draft will stay in this browser.")) {
      return;
    }

    setBusy(true);
    try {
      await apiRequest("/logout", { method: "POST", body: {} });
    } catch (error) {
      if (!(error instanceof UnauthorizedError)) {
        showError(error);
        setBusy(false);
        return;
      }
    }

    state.user = "";
    showLogin("You have been logged out.");
    setBusy(false);
  }

  async function saveTierlist() {
    clearError();
    const validationError = validateTierlist(state.data);
    if (validationError) {
      showError(new AdminError(validationError));
      return;
    }
    if (!state.sha) {
      showError(new AdminError("Reload the current tierlist before saving."));
      return;
    }

    calculateState();
    const outgoing = ranking.normalizeTierlist(state.data);
    outgoing.updatedAt = new Date().toISOString();
    setBusy(true);
    setStatus("Saving points and recalculating the public tierlist...");

    try {
      const payload = await apiRequest("/tierlist", {
        method: "PUT",
        body: {
          tierlist: outgoing,
          expectedSha: state.sha
        }
      });

      if (!payload.tierlist || !asString(payload.sha)) {
        throw new AdminError("The server did not confirm the saved tierlist. Your draft has been kept.");
      }

      state.data = normalizeTierlist(payload.tierlist);
      state.baseData = cloneData(state.data);
      state.sha = asString(payload.sha);
      state.dirty = false;
      clearDraft();
      elements.conflict.hidden = true;
      renderAll();
      setStatus("Tierlist saved. The public website will use the new points and placements.", "success");
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        saveDraft();
        showLogin("Your session expired before the save completed. Sign in again; your draft is safe.");
      } else if (error instanceof ConflictError) {
        saveDraft();
        elements.conflict.hidden = false;
        setStatus("Save stopped because the server tierlist changed. Your draft is still safe.", "warning");
        showError(new AdminError("A newer tierlist already exists. Reload it, then reapply or restore the changes you still need."));
      } else {
        saveDraft();
        showError(error);
        setStatus("Save failed. Your local draft is still safe in this browser.", "warning");
      }
    } finally {
      setBusy(false);
    }
  }

  function addPlayer() {
    state.data.players.push({
      username: "",
      points: 0,
      tier: "unranked",
      rank: null,
      tierRank: null,
      specialty: "Overall PvP",
      note: ""
    });
    markDirty();
    renderAll();
    setStatus("Added a player row. Enter a valid Minecraft username and points, then save.");
    let emptyIndex = -1;
    state.data.players.forEach((player, index) => {
      if (!asString(player.username).trim()) emptyIndex = index;
    });
    const input = document.getElementById(`player-${emptyIndex}-username`);
    if (input) input.focus();
  }

  function restoreDraft() {
    if (!state.draftCandidate) return;
    clearError();
    try {
      state.data = mergeDraftWithCurrent(state.draftCandidate);
    } catch (error) {
      showError(error);
      setStatus("The older draft was not applied. The current server version is unchanged.", "warning");
      return;
    }
    state.dirty = true;
    state.draftCandidate = null;
    elements.draftRecovery.hidden = true;
    renderAll();
    saveDraft();
    setStatus("Merged the non-conflicting draft changes into the latest server version. Review every score before saving.", "warning");
  }

  function discardDraft() {
    if (!window.confirm("Discard the saved local draft and keep the current server version?")) return;
    clearDraft();
    setStatus("Local draft discarded. You are editing the current server version.", "success");
  }

  function reloadFromServer() {
    if (state.dirty && !window.confirm("Discard the current local draft and reload the server tierlist?")) return;
    loadTierlist({ discardDraft: true, checkDraft: false });
  }

  function reloadAfterConflict() {
    if (!window.confirm("Load the newer server tierlist? Your local draft will remain saved and can be merged afterward.")) return;
    loadTierlist({ discardDraft: false, checkDraft: true });
  }

  function bindEvents() {
    elements.loginForm.addEventListener("submit", login);
    elements.username.addEventListener("input", clearLoginError);
    elements.password.addEventListener("input", clearLoginError);
    elements.logout.addEventListener("click", logout);
    elements.reload.addEventListener("click", reloadFromServer);
    elements.addPlayer.addEventListener("click", addPlayer);
    elements.save.addEventListener("click", saveTierlist);
    elements.restoreDraft.addEventListener("click", restoreDraft);
    elements.discardDraft.addEventListener("click", discardDraft);
    elements.conflictDismiss.addEventListener("click", () => {
      elements.conflict.hidden = true;
      clearError();
      setStatus("Continuing with your local draft. It cannot be saved until you reload the newer server version.", "warning");
    });
    elements.conflictReload.addEventListener("click", reloadAfterConflict);

    window.addEventListener("beforeunload", (event) => {
      if (!state.dirty) return;
      saveDraft();
      event.preventDefault();
      event.returnValue = "";
    });
  }

  function initialize() {
    bindEvents();
    showLogin();
    checkSession();
  }

  initialize();
})();
