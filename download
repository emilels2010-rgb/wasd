(function () {
  "use strict";

  const podium = document.querySelector("[data-home-podium]");
  if (!podium) return;

  const config = window.MCEVENTS_CONFIG || {};
  const tierConfig = config.tierlist || {};
  const dataUrl = tierConfig.dataUrl || "data/tierlist.json";

  function templateUrl(template, player) {
    const username = String(player.username || "").trim();
    const profileKey = player.uuid || username;
    return String(template)
      .replaceAll("{username}", encodeURIComponent(username))
      .replaceAll("{uuid}", encodeURIComponent(profileKey));
  }

  function makePodiumCard(player, place) {
    const username = String(player.username || "Unknown").trim();
    const card = document.createElement("a");
    card.className = `podium-card podium-place-${place} reveal`;
    const profileTemplate = player.uuid
      ? (tierConfig.nameMcUuidUrl || "https://namemc.com/profile/{uuid}")
      : (tierConfig.nameMcUrl || "https://namemc.com/profile/{username}");
    card.href = templateUrl(profileTemplate, player);
    card.target = "_blank";
    card.rel = "noopener noreferrer";
    card.setAttribute("aria-label", `${username}, ranked number ${place}; open on NameMC`);

    const crown = document.createElement("span");
    crown.className = "podium-rank";
    crown.textContent = `#${place}`;
    const avatar = document.createElement("span");
    avatar.className = "podium-avatar";
    const fallback = document.createElement("span");
    fallback.className = "avatar-fallback";
    fallback.textContent = username.charAt(0).toUpperCase();
    const image = document.createElement("img");
    image.src = templateUrl(tierConfig.skinUrl || "https://mc-heads.net/avatar/{username}/160", player);
    image.alt = `${username}'s Minecraft skin`;
    image.width = 160;
    image.height = 160;
    image.loading = "lazy";
    image.addEventListener("load", () => fallback.setAttribute("hidden", ""));
    image.addEventListener("error", () => image.setAttribute("hidden", ""));
    avatar.append(fallback, image);
    const details = document.createElement("span");
    details.className = "podium-details";
    const name = document.createElement("strong");
    name.textContent = username;
    const specialty = document.createElement("small");
    specialty.textContent = player.specialty || "Ranked fighter";
    details.append(name, specialty);
    const base = document.createElement("span");
    base.className = "podium-base";
    base.textContent = place === 1 ? "CHAMPION" : `RANK ${String(place).padStart(2, "0")}`;
    card.append(crown, avatar, details, base);
    return card;
  }

  async function load() {
    try {
      const separator = dataUrl.includes("?") ? "&" : "?";
      const response = await fetch(`${dataUrl}${separator}v=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) throw new Error("Tierlist request failed");
      const data = await response.json();
      const players = (data.tiers || []).flatMap((tier) => tier.players || []).slice(0, 3);
      podium.replaceChildren();
      if (!players.length) {
        const empty = document.createElement("div");
        empty.className = "podium-empty";
        empty.textContent = "The first rankings are being prepared.";
        podium.append(empty);
        return;
      }
      players.forEach((player, index) => podium.append(makePodiumCard(player, index + 1)));
      window.requestAnimationFrame(() => podium.querySelectorAll(".reveal").forEach((card) => card.classList.add("is-visible")));
    } catch (error) {
      podium.replaceChildren();
      const fallback = document.createElement("a");
      fallback.className = "podium-empty";
      fallback.href = "tierlist.html";
      fallback.textContent = "Open the full PvP tierlist →";
      podium.append(fallback);
      console.error(error);
    }
  }

  load();
})();
