(function () {
  "use strict";

  const MAX_POINTS = 1000;
  const TIER_IDS = ["s", "a", "b", "c", "d"];
  const TIER_DEFAULTS = {
    s: {
      id: "s",
      label: "S Tier",
      description: "Automatic: the three highest-scoring ranked players."
    },
    a: {
      id: "a",
      label: "A Tier",
      description: "601–1000 points, excluding the automatic S Tier top three."
    },
    b: {
      id: "b",
      label: "B Tier",
      description: "401–600 points."
    },
    c: {
      id: "c",
      label: "C Tier",
      description: "201–400 points."
    },
    d: {
      id: "d",
      label: "D Tier",
      description: "1–200 points."
    }
  };

  function asString(value, fallback = "") {
    return typeof value === "string" ? value : fallback;
  }

  function pointsNumber(value) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return 0;
    return Math.round(parsed);
  }

  function boundedPoints(value) {
    return Math.min(MAX_POINTS, Math.max(0, pointsNumber(value)));
  }

  function scoreTier(points) {
    if (points > 600) return "a";
    if (points > 400) return "b";
    if (points > 200) return "c";
    if (points > 0) return "d";
    return "unranked";
  }

  function legacyPoints(tierId, index) {
    const startingPoints = { s: 1000, a: 800, b: 600, c: 400, d: 200 };
    return Math.max(1, (startingPoints[tierId] || 1) - index);
  }

  function sourcePlayers(raw) {
    if (Array.isArray(raw && raw.players)) {
      return raw.players;
    }

    if (!Array.isArray(raw && raw.tiers)) {
      return [];
    }

    return raw.tiers.flatMap((tier) => {
      const tierId = asString(tier && tier.id).toLowerCase();
      const players = tier && Array.isArray(tier.players) ? tier.players : [];
      return players.map((player, index) => ({
        ...player,
        points: player && player.points != null ? player.points : legacyPoints(tierId, index)
      }));
    });
  }

  function normalizePlayer(player) {
    const source = player && typeof player === "object" && !Array.isArray(player) ? player : {};
    const normalized = {
      ...source,
      username: asString(source.username).trim(),
      points: boundedPoints(source.points),
      specialty: asString(source.specialty),
      note: asString(source.note)
    };

    if (source.uuid) {
      normalized.uuid = asString(source.uuid).trim();
    } else {
      delete normalized.uuid;
    }

    return normalized;
  }

  function rankPlayers(players) {
    const sorted = (Array.isArray(players) ? players : [])
      .map(normalizePlayer)
      .sort((left, right) => (
        right.points - left.points ||
        left.username.localeCompare(right.username, "en", { sensitivity: "base" })
      ));

    const tierCounts = { s: 0, a: 0, b: 0, c: 0, d: 0 };
    let rankedCount = 0;

    return sorted.map((player) => {
      if (player.points <= 0) {
        return {
          ...player,
          tier: "unranked",
          rank: null,
          tierRank: null
        };
      }

      const rank = rankedCount + 1;
      const tier = rankedCount < 3 ? "s" : scoreTier(player.points);
      rankedCount += 1;
      tierCounts[tier] += 1;

      return {
        ...player,
        tier,
        rank,
        tierRank: tierCounts[tier]
      };
    });
  }

  function tierDefinitions(raw) {
    const inputTiers = Array.isArray(raw && raw.tiers) ? raw.tiers : [];
    return TIER_IDS.map((id) => {
      const input = inputTiers.find((tier) => (
        tier && typeof tier === "object" && asString(tier.id).toLowerCase() === id
      ));
      return {
        id,
        label: asString(input && input.label, TIER_DEFAULTS[id].label),
        description: asString(input && input.description, TIER_DEFAULTS[id].description)
      };
    });
  }

  function normalizeTierlist(raw) {
    const source = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
    return {
      updatedAt: asString(source.updatedAt),
      intro: asString(
        source.intro,
        "PvP rankings calculated automatically from verified test points."
      ),
      maxPoints: MAX_POINTS,
      tiers: tierDefinitions(source),
      players: rankPlayers(sourcePlayers(source))
    };
  }

  function groupedTiers(raw) {
    const data = normalizeTierlist(raw);
    return {
      ...data,
      tiers: data.tiers.map((tier) => ({
        ...tier,
        players: data.players.filter((player) => player.tier === tier.id)
      }))
    };
  }

  window.MCEVENTS_RANKING = Object.freeze({
    MAX_POINTS,
    TIER_IDS: Object.freeze([...TIER_IDS]),
    TIER_DEFAULTS: Object.freeze({ ...TIER_DEFAULTS }),
    boundedPoints,
    scoreTier,
    rankPlayers,
    normalizeTierlist,
    groupedTiers
  });
})();
