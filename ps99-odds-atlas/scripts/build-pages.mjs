import { mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { page } from "../worker/index.js";

const API = "https://ps99.biggamesapi.io";
const projectRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const output = process.env.PS99_OUTPUT_DIR
  ? resolve(process.cwd(), process.env.PS99_OUTPUT_DIR)
  : resolve(projectRoot, "dist-pages");

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.json();
}

async function fetchThumbnailBatch(ids) {
  const url = "https://thumbnails.roblox.com/v1/assets?assetIds=" + encodeURIComponent(ids.join(",")) + "&size=420x420&format=Png&isCircular=false";
  let lastError;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const response = await fetch(url, {
        headers: { accept: "application/json" },
        signal: AbortSignal.timeout(30_000),
      });
      if (response.ok) return await response.json();
      lastError = new Error(`Roblox thumbnails returned ${response.status}`);
      if (response.status !== 429 && response.status < 500) break;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
  }
  throw lastError || new Error("Roblox thumbnails request failed");
}

function collectAssetIds(value, ids = new Set()) {
  if (!value || typeof value !== "object") return ids;
  if (Array.isArray(value)) {
    value.forEach((item) => collectAssetIds(item, ids));
    return ids;
  }
  for (const [key, item] of Object.entries(value)) {
    if (/thumbnail|icon/i.test(key)) {
      const matches = String(item || "").match(/\d{5,}/g) || [];
      matches.forEach((id) => ids.add(id));
    }
    collectAssetIds(item, ids);
  }
  return ids;
}

function collectionData(collection) {
  return collection?.status === "ok" && Array.isArray(collection.data) ? collection.data : [];
}

function getRelevantChanceSources(collections) {
  return Object.entries(collections).flatMap(([sourceKey, collection]) => collectionData(collection).filter((entry) => {
    const config = entry?.configData || {};
    const text = String(entry?.configName || "") + " " + String(entry?.category || "") + " " + JSON.stringify(config);
    const rarePet = /\b(Huge|Titanic|Gargantuan)\b/i.test(text);
    const recipe = /combine\s+\d+\s+to\s+create/i.test(text);
    if (sourceKey === "boosts") return /huge|titanic|gargantuan/i.test(text);
    return rarePet && (sourceKey === "lootboxes" || sourceKey === "guildBattles" || recipe || /chance|odds|luck|roll|random|boost|points|key|chest|machine|present|egg/i.test(text));
  }));
}

function isRarePet(record) {
  const config = record?.configData || {};
  const name = String(config.name || record?.configName || "");
  return Boolean(config.huge || config.titanic || config.gargantuan || /\b(Huge|Titanic|Gargantuan)\b/i.test(name));
}

function isExclusiveEgg(entry) {
  const config = entry?.configData || {};
  const category = String(entry?.category || "");
  const name = String(config.name || entry?.configName || "");
  const productIds = config.productIds && typeof config.productIds === "object" ? Object.keys(config.productIds) : [];
  const soldAsExclusiveEgg = productIds.some((productName) => /exclusive\s+eggs?/i.test(productName));
  const hiddenExclusiveEgg = config.rarity?._id === "Exclusive" && config.allPetsRare && /^other$/i.test(category);
  return /exclusive eggs/i.test(category) || /^exclusive\b.*\begg\b/i.test(name) || soldAsExclusiveEgg || hiddenExclusiveEgg;
}

function getAtlasAssetIds(eggs, pets, enchants, chanceSources) {
  const rarePets = collectionData(pets).filter(isRarePet);
  const rareNames = new Set(rarePets.map((pet) => String(pet.configData?.name || pet.configName || "").toLowerCase()));
  const oddsPools = collectionData(eggs).filter((entry) => {
    const config = entry?.configData || {};
    const name = String(config.name || entry?.configName || "");
    if (isExclusiveEgg(entry)) return false;
    return Array.isArray(config.pets) && config.pets.some((row) => Array.isArray(row) && (rareNames.has(String(row[0] || "").toLowerCase()) || /\b(Huge|Titanic|Gargantuan)\b/i.test(String(row[0] || ""))));
  });
  const relevantEnchants = collectionData(enchants).filter((entry) => {
    const config = entry?.configData || {};
    return (Array.isArray(config.Tiers) ? config.Tiers : []).some((tier) => {
      const title = String(tier?.DisplayName || entry?.configName || "Enchant");
      const description = String(tier?.Desc || "");
      return /huge|titanic|gargantuan/i.test(title + " " + description) && /odds|chance|luck|hatch|roll|random|adds?\s+\d+\s+rare/i.test(description + " " + title);
    });
  });
  return Array.from(collectAssetIds([rarePets, oddsPools, relevantEnchants, getRelevantChanceSources(chanceSources)]));
}

const [eggs, pets, enchants, lootboxes, miscItems, potions, cardItems, boosts, guildBattles, releases] = await Promise.all([
  fetchJson(`${API}/api/collection/Eggs`),
  fetchJson(`${API}/api/collection/Pets`),
  fetchJson(`${API}/api/collection/Enchants`),
  fetchJson(`${API}/api/collection/Lootboxes`),
  fetchJson(`${API}/api/collection/MiscItems`),
  fetchJson(`${API}/api/collection/Potions`),
  fetchJson(`${API}/api/collection/CardItems`),
  fetchJson(`${API}/api/collection/Boosts`),
  fetchJson(`${API}/api/collection/GuildBattles`),
  fetchJson(`${API}/v1/releases?pageSize=20`),
]);

const chanceSourceCollections = { lootboxes, miscItems, potions, cardItems, boosts, guildBattles };
const assetIds = getAtlasAssetIds(eggs, pets, enchants, chanceSourceCollections);
const thumbnails = {};
const batches = [];
for (let index = 0; index < assetIds.length; index += 100) batches.push(assetIds.slice(index, index + 100));
for (let index = 0; index < batches.length; index += 4) {
  const group = batches.slice(index, index + 4);
  const results = await Promise.all(group.map(async (batch) => {
    try {
      return await fetchThumbnailBatch(batch);
    } catch (error) {
      console.warn(`Skipping ${batch.length} thumbnail IDs: ${error.message}`);
      return { data: [] };
    }
  }));
  results.forEach((result) => {
    (Array.isArray(result?.data) ? result.data : []).forEach((item) => {
      if (item?.targetId && item?.imageUrl) thumbnails[String(item.targetId)] = item.imageUrl;
    });
  });
}

function thumbnailUrl(...values) {
  for (const value of values) {
    const id = String(value || "").match(/\d{5,}/)?.[0];
    if (id && thumbnails[id]) return thumbnails[id];
  }
  return "";
}

function attachThumbnailUrls(collection) {
  if (collection?.status !== "ok" || !Array.isArray(collection.data)) return collection;
  return {
    ...collection,
    data: collection.data.map((entry) => {
      const config = entry?.configData || {};
      const configData = {
        ...config,
        AtlasThumbnailUrl: thumbnailUrl(config.thumbnail, config.Thumbnail, config.icon, config.Icon, config.PageIcon),
      };
      if (Array.isArray(config.Tiers)) {
        configData.Tiers = config.Tiers.map((tier) => ({
          ...tier,
          AtlasThumbnailUrl: thumbnailUrl(tier?.Icon, tier?.icon, tier?.thumbnail, tier?.Thumbnail),
        }));
      }
      return { ...entry, configData };
    }),
  };
}

const staticData = {
  eggs,
  pets: attachThumbnailUrls(pets),
  enchants,
  lootboxes: attachThumbnailUrls(lootboxes),
  miscItems: attachThumbnailUrls(miscItems),
  potions: attachThumbnailUrls(potions),
  cardItems: attachThumbnailUrls(cardItems),
  boosts: attachThumbnailUrls(boosts),
  guildBattles,
  releases,
};

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
const generatedAt = new Date().toISOString();
const settings = '<script>window.PS99_STATIC_MODE=true;window.PS99_DATA_URL="./data.json";window.PS99_THUMBNAILS_URL="./thumbnails.json";</script>';
const staticPage = page.replace("</head>", `${settings}\n</head>`);
if (staticPage === page) throw new Error("Could not inject GitHub Pages data settings into the page.");

await Promise.all([
  writeFile(resolve(output, "index.html"), staticPage, "utf8"),
  writeFile(resolve(output, "data.json"), JSON.stringify(staticData), "utf8"),
  writeFile(resolve(output, "thumbnails.json"), JSON.stringify(thumbnails), "utf8"),
  writeFile(resolve(output, ".nojekyll"), "", "utf8"),
]);

console.log(`Built GitHub Pages snapshot at ${generatedAt} with ${assetIds.length} asset IDs and ${Object.keys(thumbnails).length} thumbnails.`);

