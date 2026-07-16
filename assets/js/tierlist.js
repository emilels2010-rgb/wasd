(function () {
  "use strict";

  const board = document.querySelector("[data-tier-board]");
  if (!board) return;

  const ranking = window.MCEVENTS_RANKING;
  const search = document.querySelector("[data-player-search]");
  const noResults = document.querySelector("[data-no-results]");
  const intro = document.querySelector("[data-tier-intro]");
  const updated = document.querySelector("[data-updated]");
  const maxPoints = document.querySelector("[data-max-points]");
  const config = window.MCEVENTS_CONFIG || {};
  const tierConfig = config.tierlist || {};
  const dataUrl = tierConfig.dataUrl || "data/tierlist.json";
  let tierData = null;
  let loadInFlight = false;
  let refreshTimer = 0;

  function safeUsername(username) {
    return String(username || "").trim();
  }

  function urlFromTemplate(template, player) {
    const username = safeUsername(player.username);
    const profileKey = player.uuid || username;
    return String(template)
      .replaceAll("{username}", encodeURIComponent(username))
      .replaceAll("{uuid}", encodeURIComponent(profileKey));
  }

  function skinUrl(player) {
    return urlFromTemplate(tierConfig.skinUrl || "https://mc-heads.net/avatar/{username}/160", player);
  }

  function profileUrl(player) {
    const template = player.uuid
      ? (tierConfig.nameMcUuidUrl || "https://namemc.com/profile/{uuid}")
      : (tierConfig.nameMcUrl || "https://namemc.com/profile/{username}");
    return urlFromTemplate(template, player);
  }

  function makeExternalIcon() {
    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("viewBox", "0 0 24 24");
    icon.setAttribute("aria-hidden", "true");
    const pathOne = document.createElementNS(icon.namespaceURI, "path");
    pathOne.setAttribute("d", "M14 5h5v5");
    const pathTwo = document.createElementNS(icon.namespaceURI, "path");
    pathTwo.setAttribute("d", "m19 5-9 9");
    const pathThree = document.createElementNS(icon.namespaceURI, "path");
    pathThree.setAttribute("d", "M18 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5");
    icon.append(pathOne, pathTwo, pathThree);
    return icon;
  }

  function makePlayerCard(player) {
    const username = safeUsername(player.username) || "Unknown player";
    const points = Number(player.points) || 0;
    const rank = Number(player.rank) || 0;
    const link = document.createElement("a");
    link.className = "player-card";
    link.dataset.username = username.toLowerCase();
    link.href = profileUrl(player);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute(
      "aria-label",
      `${username}, overall rank ${rank}, ${points} points; view profile on NameMC`
    );

    const rankLabel = document.createElement("span");
    rankLabel.className = "player-rank";
    rankLabel.textContent = `#${rank}`;

    const avatarWrap = document.createElement("span");
    avatarWrap.className = "player-avatar";
    const fallback = document.createElement("span");
    fallback.className = "avatar-fallback";
    fallback.textContent = username.charAt(0).toUpperCase();
    const image = document.createElement("img");
    image.src = skinUrl(player);
    image.alt = `${username}'s Minecraft skin`;
    image.width = 160;
    image.height = 160;
    image.loading = "lazy";
    image.decoding = "async";
    image.addEventListener("load", () => fallback.setAttribute("hidden", ""));
    image.addEventListener("error", () => image.setAttribute("hidden", ""));
    avatarWrap.append(fallback, image);

    const details = document.createElement("span");
    details.className = "player-details";
    const name = document.createElement("strong");
    name.textContent = username;
    const score = document.createElement("small");
    score.className = "player-points";
    score.textContent = `${points.toLocaleString("en-GB")} points`;
    details.append(name, score);

    const profile = document.createElement("span");
    profile.className = "profile-cue";
    profile.append("NameMC", makeExternalIcon());

    link.append(rankLabel, avatarWrap, details, profile);
    link.title = player.note || player.specialty || `${points} verified PvP points`;
    return link;
  }

  function render(data, query) {
    board.replaceChildren();
    const fragment = document.createDocumentFragment();
    let visibleCount = 0;
    const normalizedQuery = String(query || "").trim().toLowerCase();

    data.tiers.forEach((tier) => {
      const row = document.createElement("section");
      row.className = `tier-row tier-${String(tier.id).toLowerCase()}`;

      const label = document.createElement("div");
      label.className = "tier-label";
      const tierLetter = document.createElement("span");
      tierLetter.textContent = String(tier.id).toUpperCase();
      const labelText = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = tier.label || `${String(tier.id).toUpperCase()} Tier`;
      const description = document.createElement("p");
      description.textContent = tier.description || "Automatically calculated from points.";
      labelText.append(title, description);
      label.append(tierLetter, labelText);

      const players = document.createElement("div");
      players.className = "tier-players";
      const tierPlayers = Array.isArray(tier.players) ? tier.players : [];

      tierPlayers.forEach((player) => {
        const username = safeUsername(player.username).toLowerCase();
        if (normalizedQuery && !username.includes(normalizedQuery)) return;
        players.append(makePlayerCard(player));
        visibleCount += 1;
      });

      if (tierPlayers.length === 0 && !normalizedQuery) {
        const empty = document.createElement("div");
        empty.className = "empty-tier";
        empty.textContent = "No fighters currently fall in this point range.";
        players.append(empty);
      }

      if (!normalizedQuery || players.childElementCount > 0) {
        row.append(label, players);
        fragment.append(row);
      }
    });

    board.append(fragment);
    board.setAttribute("aria-busy", "false");
    if (noResults) noResults.hidden = visibleCount > 0 || !normalizedQuery;
  }

  async function loadTierlist() {
    if (loadInFlight) return;
    loadInFlight = true;
    try {
      if (!ranking) throw new Error("The ranking calculator could not be loaded.");
      const separator = dataUrl.includes("?") ? "&" : "?";
      const response = await fetch(`${dataUrl}${separator}v=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) throw new Error(`Tierlist request failed (${response.status})`);
      const raw = await response.json();
      const data = ranking.groupedTiers(raw);
      tierData = data;

      if (intro && data.intro) intro.textContent = data.intro;
      if (maxPoints) maxPoints.textContent = `${data.maxPoints.toLocaleString("en-GB")} max points`;
      if (updated && data.updatedAt) {
        const date = new Date(data.updatedAt);
        updated.textContent = Number.isNaN(date.getTime())
          ? "Recently updated"
          : `Updated ${new Intl.DateTimeFormat("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric"
          }).format(date)}`;
      }
      render(data, search ? search.value : "");
    } catch (error) {
      if (tierData) {
        console.error(error);
        return;
      }
      board.replaceChildren();
      const message = document.createElement("div");
      message.className = "board-error";
      const heading = document.createElement("strong");
      heading.textContent = "The tierlist could not be loaded.";
      const detail = document.createElement("span");
      detail.textContent = "Refresh the page in a moment or let staff know on Discord.";
      message.append(heading, detail);
      board.append(message);
      board.setAttribute("aria-busy", "false");
      console.error(error);
    } finally {
      loadInFlight = false;
    }
  }

  if (search) {
    search.addEventListener("input", () => {
      if (tierData) render(tierData, search.value);
    });
  }

  loadTierlist();

  if (!refreshTimer) {
    refreshTimer = window.setInterval(loadTierlist, 60000);
  }
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") loadTierlist();
  });
  window.addEventListener("focus", loadTierlist);
})();
