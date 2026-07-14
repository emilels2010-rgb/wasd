(() => {
  "use strict";

  const TIER_IDS = ["s", "a", "b", "c"];
  const TIER_DEFAULTS = {
    s: { label: "S Tier", description: "The server's most dominant PvP players." },
    a: { label: "A Tier", description: "Elite fighters who consistently perform at the top." },
    b: { label: "B Tier", description: "Strong, dependable competitors with serious skill." },
    c: { label: "C Tier", description: "Rising players to watch as the competition develops." }
  };
  const EMPTY_DATA = {
    updatedAt: "",
    intro: "The community PvP ranking for MC Events.",
    tiers: TIER_IDS.map((id) => ({
      id,
      label: TIER_DEFAULTS[id].label,
      description: TIER_DEFAULTS[id].description,
      players: []
    }))
  };

  const STORAGE_KEYS = {
    connection: "mcevents-tierlist-github-connection-v1",
    token: "mcevents-tierlist-github-token-v1",
    draft: "mcevents-tierlist-draft-v1"
  };

  const elements = {
    main: document.getElementById("admin-main"),
    modeBadge: document.getElementById("admin-mode-badge"),
    status: document.getElementById("admin-status"),
    error: document.getElementById("admin-error"),
    connectionForm: document.getElementById("admin-connection-form"),
    owner: document.getElementById("github-owner"),
    repo: document.getElementById("github-repo"),
    branch: document.getElementById("github-branch"),
    dataPath: document.getElementById("github-data-path"),
    token: document.getElementById("github-token"),
    forgetToken: document.getElementById("admin-forget-token"),
    loadBundled: document.getElementById("admin-load-bundled"),
    loadGithub: document.getElementById("admin-load-github"),
    saveGithub: document.getElementById("admin-save-github"),
    importFile: document.getElementById("admin-import-file"),
    exportJson: document.getElementById("admin-export-json"),
    intro: document.getElementById("tierlist-intro"),
    tierEditors: document.getElementById("admin-tier-editors"),
    preview: document.getElementById("admin-live-preview"),
    playerCount: document.getElementById("admin-player-count")
  };

  const state = {
    data: cloneData(EMPTY_DATA),
    source: "starting",
    dirty: false,
    pending: false,
    sha: null,
    remoteKey: "",
    previewTimer: 0
  };

  class AdminError extends Error {}

  function cloneData(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function asString(value, fallback = "") {
    return typeof value === "string" ? value : fallback;
  }

  function normalizeTierlist(raw) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      throw new AdminError("Tierlist JSON must contain an object at its top level.");
    }

    const inputTiers = Array.isArray(raw.tiers) ? raw.tiers : [];
    const tiers = TIER_IDS.map((id) => {
      const input = inputTiers.find((tier) => (
        tier && typeof tier === "object" && asString(tier.id).toLowerCase() === id
      ));
      const inputPlayers = input && Array.isArray(input.players) ? input.players : [];
      const players = inputPlayers
        .filter((player) => player && typeof player === "object" && !Array.isArray(player))
        .map((player) => ({
          username: asString(player.username),
          specialty: asString(player.specialty),
          note: asString(player.note)
        }));

      return {
        id,
        label: asString(input && input.label, TIER_DEFAULTS[id].label),
        description: asString(input && input.description, TIER_DEFAULTS[id].description),
        players
      };
    });

    return {
      updatedAt: asString(raw.updatedAt),
      intro: asString(raw.intro, EMPTY_DATA.intro),
      tiers
    };
  }

  function validateTierlist(data) {
    const usernames = new Set();

    for (const tier of data.tiers) {
      if (!tier.label.trim()) {
        return `${tier.id.toUpperCase()} tier needs a display label.`;
      }

      for (const player of tier.players) {
        const username = player.username.trim();
        if (!username) {
          return `${tier.label} contains a player with no username.`;
        }
        if (!/^[A-Za-z0-9_]{1,16}$/.test(username)) {
          return `“${username}” is not a valid Minecraft Java username. Use 1–16 letters, numbers, or underscores.`;
        }

        const key = username.toLowerCase();
        if (usernames.has(key)) {
          return `“${username}” appears more than once. Every player should have one ranking.`;
        }
        usernames.add(key);
      }
    }

    return "";
  }

  function createElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) {
      element.className = className;
    }
    if (typeof text === "string") {
      element.textContent = text;
    }
    return element;
  }

  function createButton(label, className = "admin-button admin-button-small") {
    const button = createElement("button", className, label);
    button.type = "button";
    return button;
  }

  function createField(labelText, control, wide = false) {
    const label = createElement("label", `admin-field${wide ? " admin-field-wide" : ""}`);
    label.htmlFor = control.id;
    label.append(document.createTextNode(labelText), control);
    return label;
  }

  function createInput(id, value, maxLength) {
    const input = createElement("input", "admin-input");
    input.id = id;
    input.type = "text";
    input.value = value;
    input.autocomplete = "off";
    if (maxLength) {
      input.maxLength = maxLength;
    }
    return input;
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
    if (focus) {
      elements.error.focus({ preventScroll: false });
    }
  }

  function safeStorageGet(storage, key) {
    try {
      return storage.getItem(key) || "";
    } catch (_error) {
      return "";
    }
  }

  function safeStorageSet(storage, key, value) {
    try {
      storage.setItem(key, value);
      return true;
    } catch (_error) {
      return false;
    }
  }

  function safeStorageRemove(storage, key) {
    try {
      storage.removeItem(key);
    } catch (_error) {
      // Storage can be blocked by browser privacy settings; the editor still works.
    }
  }

  function firstObject(values) {
    return values.find((value) => value && typeof value === "object" && !Array.isArray(value)) || {};
  }

  function firstString(...values) {
    return values.find((value) => typeof value === "string" && value.trim()) || "";
  }

  function readSiteConfig() {
    const candidates = [
      window.MCEVENTS_CONFIG,
      window.MCEVENTS_SITE_CONFIG,
      window.MC_EVENTS_CONFIG,
      window.MCEventsConfig,
      window.SITE_CONFIG,
      window.siteConfig,
      typeof MCEVENTS_CONFIG !== "undefined" ? MCEVENTS_CONFIG : null,
      typeof MCEVENTS_SITE_CONFIG !== "undefined" ? MCEVENTS_SITE_CONFIG : null,
      typeof SITE_CONFIG !== "undefined" ? SITE_CONFIG : null
    ];
    const root = firstObject(candidates);
    const github = firstObject([
      root.github,
      root.admin && root.admin.github,
      root.tierlist && root.tierlist.github,
      root.repository
    ]);

    return {
      owner: firstString(github.owner, root.githubOwner, root.owner),
      repo: firstString(github.repo, github.repository, root.githubRepo, root.repo),
      branch: firstString(github.branch, root.githubBranch, root.branch, "main"),
      dataPath: firstString(github.dataPath, github.path, root.tierlistDataPath, root.dataPath, "data/tierlist.json")
    };
  }

  function readStoredConnection() {
    const stored = safeStorageGet(window.localStorage, STORAGE_KEYS.connection);
    if (!stored) {
      return {};
    }
    try {
      const parsed = JSON.parse(stored);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (_error) {
      return {};
    }
  }

  function applyInitialConnection() {
    const configured = readSiteConfig();
    const stored = readStoredConnection();
    elements.owner.value = firstString(stored.owner, configured.owner);
    elements.repo.value = firstString(stored.repo, configured.repo);
    elements.branch.value = firstString(stored.branch, configured.branch, "main");
    elements.dataPath.value = firstString(stored.dataPath, configured.dataPath, "data/tierlist.json");
    elements.token.value = safeStorageGet(window.sessionStorage, STORAGE_KEYS.token);
  }

  function readConnection(reportErrors = true) {
    const connection = {
      owner: elements.owner.value.trim(),
      repo: elements.repo.value.trim(),
      branch: elements.branch.value.trim(),
      dataPath: elements.dataPath.value.trim().replace(/^\/+|\/+$/g, "")
    };

    let error = "";
    const hasPlaceholder = (value) => /^(YOUR_|REPLACE_|CHANGE[_ -]?ME|GITHUB_(OWNER|REPO))/i.test(value);

    if (!connection.owner || !connection.repo || hasPlaceholder(connection.owner) || hasPlaceholder(connection.repo)) {
      error = "Add the GitHub owner and repository before using GitHub actions.";
    } else if (!/^[A-Za-z0-9-]+$/.test(connection.owner)) {
      error = "GitHub owner may contain only letters, numbers, and hyphens.";
    } else if (!/^[A-Za-z0-9_.-]+$/.test(connection.repo)) {
      error = "Repository name contains unsupported characters.";
    } else if (!connection.branch) {
      error = "Add the branch that GitHub should read and update.";
    } else if (!connection.dataPath || connection.dataPath.includes("\\") || connection.dataPath.split("/").includes("..")) {
      error = "Use a repository-relative JSON path such as data/tierlist.json.";
    } else if (!connection.dataPath.toLowerCase().endsWith(".json")) {
      error = "The tierlist data path must point to a .json file.";
    }

    if (error) {
      if (reportErrors) {
        showError(new AdminError(error));
      }
      return null;
    }
    return connection;
  }

  function getToken() {
    return elements.token.value.trim();
  }

  function connectionKey(connection) {
    return `${connection.owner.toLowerCase()}/${connection.repo.toLowerCase()}@${connection.branch}:${connection.dataPath}`;
  }

  function updateConnectionControls() {
    const configured = Boolean(readConnection(false));
    const tokenPresent = Boolean(getToken());
    elements.loadGithub.disabled = state.pending || !configured;
    elements.saveGithub.disabled = state.pending || !configured || !tokenPresent;
    elements.loadBundled.disabled = state.pending;
    elements.exportJson.disabled = state.pending;
    elements.forgetToken.disabled = state.pending || !tokenPresent;
  }

  function updateModeBadge() {
    if (state.pending) {
      elements.modeBadge.textContent = "Working…";
    } else if (state.dirty) {
      elements.modeBadge.textContent = "Local draft";
    } else if (state.source === "github") {
      elements.modeBadge.textContent = "GitHub synced";
    } else {
      elements.modeBadge.textContent = "Local mode";
    }
  }

  function setBusy(busy) {
    state.pending = busy;
    elements.main.setAttribute("aria-busy", String(busy));
    updateModeBadge();
    updateConnectionControls();
  }

  function saveDraft() {
    safeStorageSet(window.localStorage, STORAGE_KEYS.draft, JSON.stringify(state.data));
  }

  function markDirty() {
    state.dirty = true;
    saveDraft();
    updateModeBadge();
  }

  function schedulePreview() {
    window.clearTimeout(state.previewTimer);
    state.previewTimer = window.setTimeout(renderPreview, 90);
  }

  function tierById(id) {
    return state.data.tiers.find((tier) => tier.id === id);
  }

  function renderEditors() {
    elements.intro.value = state.data.intro;
    elements.tierEditors.replaceChildren();

    for (const tier of state.data.tiers) {
      const article = createElement("article", "admin-tier-editor");
      article.dataset.tier = tier.id;

      const header = createElement("div", "admin-tier-editor-header");
      const title = createElement("h3", "admin-tier-title", `${tier.id.toUpperCase()} · ${tier.label || "Untitled tier"}`);
      const count = createElement("span", "admin-count-badge", playerCountLabel(tier.players.length));
      header.append(title, count);

      const tierFields = createElement("div", "admin-tier-fields");
      const labelInput = createInput(`tier-${tier.id}-label`, tier.label, 50);
      labelInput.addEventListener("input", () => {
        tier.label = labelInput.value;
        title.textContent = `${tier.id.toUpperCase()} · ${tier.label || "Untitled tier"}`;
        markDirty();
        schedulePreview();
      });
      const descriptionInput = createInput(`tier-${tier.id}-description`, tier.description, 180);
      descriptionInput.addEventListener("input", () => {
        tier.description = descriptionInput.value;
        markDirty();
        schedulePreview();
      });
      tierFields.append(
        createField("Tier label", labelInput),
        createField("Short description", descriptionInput)
      );

      const playerList = createElement("ul", "admin-player-editor-list");
      if (!tier.players.length) {
        const empty = createElement("li", "admin-empty-message", "No players in this tier yet.");
        playerList.append(empty);
      }

      tier.players.forEach((player, playerIndex) => {
        playerList.append(createPlayerEditor(tier, player, playerIndex));
      });

      const addPlayer = createButton(`Add player to ${tier.id.toUpperCase()}`, "admin-button");
      addPlayer.addEventListener("click", () => {
        tier.players.push({ username: "", specialty: "", note: "" });
        markDirty();
        renderAll();
        setStatus(`Added a new player row to ${tier.label || tier.id.toUpperCase()}.`);
        const newIndex = tier.players.length - 1;
        const input = document.getElementById(`player-${tier.id}-${newIndex}-username`);
        if (input) {
          input.focus();
        }
      });

      article.append(header, tierFields, playerList, addPlayer);
      elements.tierEditors.append(article);
    }
  }

  function createPlayerEditor(tier, player, playerIndex) {
    const item = createElement("li", "admin-player-editor");
    const fields = createElement("div", "admin-player-fields");

    const username = createInput(`player-${tier.id}-${playerIndex}-username`, player.username, 16);
    username.spellcheck = false;
    username.placeholder = "Minecraft username";
    username.addEventListener("input", () => {
      player.username = username.value;
      markDirty();
      schedulePreview();
    });

    const specialty = createInput(`player-${tier.id}-${playerIndex}-specialty`, player.specialty, 60);
    specialty.placeholder = "e.g. Sword, Axe, Crystal";
    specialty.addEventListener("input", () => {
      player.specialty = specialty.value;
      markDirty();
      schedulePreview();
    });

    const note = createInput(`player-${tier.id}-${playerIndex}-note`, player.note, 180);
    note.placeholder = "Short reason for this placement";
    note.addEventListener("input", () => {
      player.note = note.value;
      markDirty();
      schedulePreview();
    });

    fields.append(
      createField("Minecraft username", username),
      createField("PvP specialty", specialty),
      createField("Player note", note, true)
    );

    const actions = createElement("div", "admin-player-editor-actions");
    const orderActions = createElement("div", "admin-action-row");
    const moveUp = createButton("↑", "admin-button admin-button-small");
    moveUp.setAttribute("aria-label", `Move ${player.username || "this player"} up within ${tier.label}`);
    moveUp.disabled = playerIndex === 0;
    moveUp.addEventListener("click", () => {
      swapPlayers(tier, playerIndex, playerIndex - 1);
    });

    const moveDown = createButton("↓", "admin-button admin-button-small");
    moveDown.setAttribute("aria-label", `Move ${player.username || "this player"} down within ${tier.label}`);
    moveDown.disabled = playerIndex === tier.players.length - 1;
    moveDown.addEventListener("click", () => {
      swapPlayers(tier, playerIndex, playerIndex + 1);
    });
    orderActions.append(moveUp, moveDown);

    const moveLabel = createElement("label", "admin-move-field");
    const moveText = createElement("span", "", "Move to");
    const moveSelect = createElement("select", "admin-select");
    moveSelect.setAttribute("aria-label", `Move ${player.username || "this player"} to another tier`);
    for (const tierOption of state.data.tiers) {
      const option = document.createElement("option");
      option.value = tierOption.id;
      option.textContent = `${tierOption.id.toUpperCase()} · ${tierOption.label}`;
      option.selected = tierOption.id === tier.id;
      moveSelect.append(option);
    }
    moveSelect.addEventListener("change", () => {
      movePlayer(tier.id, playerIndex, moveSelect.value);
    });
    moveLabel.append(moveText, moveSelect);

    const remove = createButton("Delete", "admin-button admin-button-small admin-button-danger");
    remove.setAttribute("aria-label", `Delete ${player.username || "this empty player row"}`);
    remove.addEventListener("click", () => {
      const name = player.username.trim() || "this empty player row";
      if (!window.confirm(`Delete ${name} from the tierlist?`)) {
        return;
      }
      tier.players.splice(playerIndex, 1);
      markDirty();
      renderAll();
      setStatus(`Deleted ${name} from ${tier.label}.`);
    });

    actions.append(orderActions, moveLabel, remove);
    item.append(fields, actions);
    return item;
  }

  function swapPlayers(tier, fromIndex, toIndex) {
    if (toIndex < 0 || toIndex >= tier.players.length) {
      return;
    }
    const [player] = tier.players.splice(fromIndex, 1);
    tier.players.splice(toIndex, 0, player);
    markDirty();
    renderAll();
    setStatus(`Reordered ${player.username || "the player"} within ${tier.label}.`);
  }

  function movePlayer(fromTierId, playerIndex, toTierId) {
    if (fromTierId === toTierId) {
      return;
    }
    const fromTier = tierById(fromTierId);
    const toTier = tierById(toTierId);
    if (!fromTier || !toTier || !fromTier.players[playerIndex]) {
      showError(new AdminError("That player could not be moved. Reload the editor and try again."));
      return;
    }

    const [player] = fromTier.players.splice(playerIndex, 1);
    toTier.players.push(player);
    markDirty();
    renderAll();
    setStatus(`Moved ${player.username || "the player"} to ${toTier.label}.`);
  }

  function playerCountLabel(count) {
    return `${count} ${count === 1 ? "player" : "players"}`;
  }

  function renderPreview() {
    elements.preview.replaceChildren();

    const intro = state.data.intro.trim();
    if (intro) {
      elements.preview.append(createElement("p", "admin-helper", intro));
    }

    let totalPlayers = 0;
    for (const tier of state.data.tiers) {
      totalPlayers += tier.players.length;
      const section = createElement("section", "admin-preview-tier");
      section.dataset.tier = tier.id;

      const header = createElement("div", "admin-preview-tier-header");
      const title = createElement("h3", "admin-tier-title", tier.label || `${tier.id.toUpperCase()} Tier`);
      const count = createElement("span", "admin-count-badge", String(tier.players.length));
      header.append(title, count);
      section.append(header);

      if (tier.description.trim()) {
        section.append(createElement("p", "admin-tier-description admin-helper", tier.description));
      }

      const list = createElement("ul", "admin-preview-list");
      if (!tier.players.length) {
        list.append(createElement("li", "admin-empty-message", "No ranked players yet."));
      }

      for (const player of tier.players) {
        const listItem = document.createElement("li");
        const username = player.username.trim();
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
        if (player.specialty.trim()) {
          copy.append(createElement("span", "admin-specialty-badge", player.specialty));
        }
        if (player.note.trim()) {
          copy.append(createElement("p", "admin-player-note", player.note));
        }

        card.append(avatar, copy);
        listItem.append(card);
        list.append(listItem);
      }

      section.append(list);
      elements.preview.append(section);
    }

    elements.playerCount.textContent = playerCountLabel(totalPlayers);
  }

  function renderAll() {
    window.clearTimeout(state.previewTimer);
    renderEditors();
    renderPreview();
    updateModeBadge();
    updateConnectionControls();
  }

  async function loadBundled(options = {}) {
    const { restoreDraft = false, confirmReplace = false } = options;
    if (confirmReplace && state.dirty && !window.confirm("Replace your current local draft with the bundled tierlist JSON?")) {
      return;
    }

    clearError();
    setBusy(true);
    setStatus("Loading bundled tierlist…");

    let bundled = null;
    let loadError = null;
    try {
      const response = await fetch("../data/tierlist.json", {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store"
      });
      if (!response.ok) {
        throw new AdminError(`Bundled tierlist returned HTTP ${response.status}.`);
      }
      bundled = normalizeTierlist(await response.json());
    } catch (error) {
      loadError = error;
    }

    let restoredDraft = false;
    if (restoreDraft) {
      const storedDraft = safeStorageGet(window.localStorage, STORAGE_KEYS.draft);
      if (storedDraft) {
        try {
          state.data = normalizeTierlist(JSON.parse(storedDraft));
          state.source = "draft";
          state.dirty = true;
          restoredDraft = true;
        } catch (_error) {
          safeStorageRemove(window.localStorage, STORAGE_KEYS.draft);
        }
      }
    }

    if (!restoredDraft) {
      state.data = bundled || cloneData(EMPTY_DATA);
      state.source = "bundled";
      state.dirty = false;
      state.sha = null;
      state.remoteKey = "";
      safeStorageRemove(window.localStorage, STORAGE_KEYS.draft);
    }

    setBusy(false);
    renderAll();

    if (restoredDraft) {
      setStatus("Restored your unpublished local draft.", "success");
      if (loadError) {
        showError(new AdminError(`The bundled JSON could not be loaded, but your local draft is safe. ${loadError.message}`), false);
      }
    } else if (bundled) {
      setStatus("Bundled tierlist loaded. Edit locally, export it, or connect GitHub to publish.", "success");
    } else {
      setStatus("Started a new empty local tierlist.");
      showError(new AdminError(`Could not load ../data/tierlist.json. ${loadError ? loadError.message : "Check that the file exists and open this page through a web server."}`), false);
    }
  }

  function githubApiUrl(connection, includeRef = true) {
    const encodedPath = connection.dataPath.split("/").map(encodeURIComponent).join("/");
    const url = new URL(`https://api.github.com/repos/${encodeURIComponent(connection.owner)}/${encodeURIComponent(connection.repo)}/contents/${encodedPath}`);
    if (includeRef) {
      url.searchParams.set("ref", connection.branch);
    }
    return url.toString();
  }

  function githubHeaders(includeJson = false) {
    const headers = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28"
    };
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    if (includeJson) {
      headers["Content-Type"] = "application/json";
    }
    return headers;
  }

  async function githubError(response, action) {
    let detail = "";
    try {
      const body = await response.json();
      detail = asString(body && body.message);
    } catch (_error) {
      detail = "";
    }

    if (response.status === 401 || response.status === 403) {
      return new AdminError(`${action} was rejected by GitHub. Check that the session token is valid and has Contents read/write access. ${detail}`.trim());
    }
    if (response.status === 404) {
      return new AdminError(`${action} could not find that repository, branch, or file. Check the connection settings and token access. ${detail}`.trim());
    }
    if (response.status === 409) {
      return new AdminError(`${action} found a newer remote version. Load from GitHub, reapply your change, and publish again. ${detail}`.trim());
    }
    return new AdminError(`${action} failed with GitHub HTTP ${response.status}. ${detail}`.trim());
  }

  function base64ToUtf8(base64) {
    const binary = window.atob(base64.replace(/\s/g, ""));
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return new TextDecoder().decode(bytes);
  }

  function utf8ToBase64(text) {
    const bytes = new TextEncoder().encode(text);
    const chunks = [];
    for (let index = 0; index < bytes.length; index += 0x8000) {
      chunks.push(String.fromCharCode(...bytes.subarray(index, index + 0x8000)));
    }
    return window.btoa(chunks.join(""));
  }

  async function loadFromGithub() {
    const connection = readConnection(true);
    if (!connection) {
      return;
    }
    if (state.dirty && !window.confirm("Replace your current local draft with the version stored on GitHub?")) {
      return;
    }

    clearError();
    setBusy(true);
    setStatus("Loading the latest tierlist from GitHub…");

    try {
      const response = await fetch(githubApiUrl(connection), {
        method: "GET",
        headers: githubHeaders(false),
        cache: "no-store"
      });
      if (!response.ok) {
        throw await githubError(response, "Loading the tierlist");
      }

      const payload = await response.json();
      if (!payload || payload.type !== "file" || payload.encoding !== "base64" || typeof payload.content !== "string") {
        throw new AdminError("GitHub returned an unexpected response instead of a JSON file.");
      }

      const parsed = JSON.parse(base64ToUtf8(payload.content));
      state.data = normalizeTierlist(parsed);
      state.source = "github";
      state.dirty = false;
      state.sha = asString(payload.sha) || null;
      state.remoteKey = connectionKey(connection);
      safeStorageRemove(window.localStorage, STORAGE_KEYS.draft);
      renderAll();
      setStatus(`Loaded ${connection.dataPath} from ${connection.owner}/${connection.repo}.`, "success");
    } catch (error) {
      showError(error instanceof SyntaxError ? new AdminError("The GitHub file is not valid JSON.") : error);
      setStatus("The current editor data was left unchanged.");
    } finally {
      setBusy(false);
    }
  }

  async function findRemoteSha(connection) {
    const response = await fetch(githubApiUrl(connection), {
      method: "GET",
      headers: githubHeaders(false),
      cache: "no-store"
    });
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw await githubError(response, "Checking the current tierlist");
    }
    const payload = await response.json();
    return asString(payload && payload.sha) || null;
  }

  async function publishToGithub() {
    const connection = readConnection(true);
    if (!connection) {
      return;
    }
    if (!getToken()) {
      showError(new AdminError("Enter a fine-grained GitHub token for this session before publishing."));
      return;
    }

    const validationError = validateTierlist(state.data);
    if (validationError) {
      showError(new AdminError(validationError));
      return;
    }

    clearError();
    setBusy(true);
    setStatus("Checking GitHub and publishing the tierlist…");

    try {
      const key = connectionKey(connection);
      let sha = state.remoteKey === key ? state.sha : null;
      if (!sha) {
        sha = await findRemoteSha(connection);
      }

      const publishedData = cloneData(state.data);
      publishedData.updatedAt = new Date().toISOString();
      const json = `${JSON.stringify(publishedData, null, 2)}\n`;
      const body = {
        message: `Update PvP tierlist (${publishedData.updatedAt.slice(0, 10)})`,
        content: utf8ToBase64(json),
        branch: connection.branch
      };
      if (sha) {
        body.sha = sha;
      }

      const response = await fetch(githubApiUrl(connection, false), {
        method: "PUT",
        headers: githubHeaders(true),
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        throw await githubError(response, "Publishing the tierlist");
      }

      const payload = await response.json();
      state.data = publishedData;
      state.source = "github";
      state.dirty = false;
      state.sha = asString(payload && payload.content && payload.content.sha) || sha;
      state.remoteKey = key;
      safeStorageRemove(window.localStorage, STORAGE_KEYS.draft);
      renderAll();
      setStatus(`Published ${connection.dataPath} to ${connection.owner}/${connection.repo}. GitHub Pages may take a minute to update.`, "success");
    } catch (error) {
      showError(error);
      setStatus("Publish failed; your local draft is still saved in this browser.");
    } finally {
      setBusy(false);
    }
  }

  async function importJson(file) {
    if (!file) {
      return;
    }
    clearError();
    try {
      if (file.size > 2 * 1024 * 1024) {
        throw new AdminError("That JSON file is larger than 2 MB. Check that you selected the tierlist data file.");
      }
      const parsed = JSON.parse(await file.text());
      state.data = normalizeTierlist(parsed);
      state.source = "import";
      markDirty();
      renderAll();
      setStatus(`Imported ${file.name} as a local draft.`, "success");
    } catch (error) {
      showError(error instanceof SyntaxError ? new AdminError("The selected file is not valid JSON.") : error);
    } finally {
      elements.importFile.value = "";
    }
  }

  function exportJson() {
    clearError();
    const validationError = validateTierlist(state.data);
    if (validationError) {
      showError(new AdminError(validationError));
      return;
    }

    state.data.updatedAt = new Date().toISOString();
    markDirty();
    const json = `${JSON.stringify(state.data, null, 2)}\n`;
    const blob = new Blob([json], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const download = document.createElement("a");
    download.href = url;
    download.download = "tierlist.json";
    document.body.append(download);
    download.click();
    download.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus("Exported tierlist.json. Replace data/tierlist.json in the repository to publish manually.", "success");
  }

  function saveConnection(event) {
    event.preventDefault();
    clearError();
    const connection = readConnection(true);
    if (!connection) {
      return;
    }
    const saved = safeStorageSet(window.localStorage, STORAGE_KEYS.connection, JSON.stringify(connection));
    updateConnectionControls();
    setStatus(saved ? "GitHub connection saved in this browser." : "Connection is ready for this page, but browser storage is unavailable.", "success");
  }

  function bindEvents() {
    elements.connectionForm.addEventListener("submit", saveConnection);

    for (const field of [elements.owner, elements.repo, elements.branch, elements.dataPath]) {
      field.addEventListener("input", () => {
        clearError();
        updateConnectionControls();
      });
    }

    elements.token.addEventListener("input", () => {
      const token = getToken();
      if (token) {
        safeStorageSet(window.sessionStorage, STORAGE_KEYS.token, token);
      } else {
        safeStorageRemove(window.sessionStorage, STORAGE_KEYS.token);
      }
      updateConnectionControls();
    });

    elements.forgetToken.addEventListener("click", () => {
      elements.token.value = "";
      safeStorageRemove(window.sessionStorage, STORAGE_KEYS.token);
      updateConnectionControls();
      setStatus("The GitHub token was removed from this browser session.", "success");
    });

    elements.loadBundled.addEventListener("click", () => {
      loadBundled({ confirmReplace: true });
    });
    elements.loadGithub.addEventListener("click", loadFromGithub);
    elements.saveGithub.addEventListener("click", publishToGithub);
    elements.importFile.addEventListener("change", () => importJson(elements.importFile.files && elements.importFile.files[0]));
    elements.exportJson.addEventListener("click", exportJson);

    elements.intro.addEventListener("input", () => {
      state.data.intro = elements.intro.value;
      markDirty();
      schedulePreview();
    });

    window.addEventListener("beforeunload", (event) => {
      if (!state.dirty) {
        return;
      }
      event.preventDefault();
      event.returnValue = "";
    });
  }

  async function initialize() {
    applyInitialConnection();
    bindEvents();
    updateConnectionControls();
    updateModeBadge();
    await loadBundled({ restoreDraft: true });
  }

  initialize();
})();
