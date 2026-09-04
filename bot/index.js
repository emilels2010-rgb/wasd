import { Client, Events, GatewayIntentBits, PermissionFlagsBits, REST, Routes, SlashCommandBuilder } from 'discord.js';
import { Octokit } from '@octokit/rest';

const required = ['DISCORD_TOKEN', 'DISCORD_CLIENT_ID', 'DISCORD_GUILD_ID', 'GITHUB_TOKEN'];
for (const name of required) if (!process.env[name]) throw new Error(`Missing ${name}. Add it in your host's environment variables.`);

const config = { owner: process.env.GITHUB_OWNER ?? 'emilels2010-rgb', repo: process.env.GITHUB_REPO ?? 'wasd', branch: process.env.GITHUB_BRANCH ?? 'main', path: 'data/players.json' };
const github = new Octokit({ auth: process.env.GITHUB_TOKEN });
const commands = [new SlashCommandBuilder().setName('givetier').setDescription('Set a player’s Element SMP ranking points').addStringOption(option => option.setName('player').setDescription('Minecraft Java username').setRequired(true)).addIntegerOption(option => option.setName('points').setDescription('New total points').setMinValue(0).setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild).toJSON()];

async function getPlayers() {
  const response = await github.repos.getContent({ owner: config.owner, repo: config.repo, path: config.path, ref: config.branch });
  if (Array.isArray(response.data) || response.data.type !== 'file') throw new Error('Player data file was not found.');
  const decoded = Buffer.from(response.data.content, 'base64').toString('utf8');
  const players = JSON.parse(decoded);
  return { players: Array.isArray(players) ? players : [], sha: response.data.sha };
}
async function savePlayers(players, sha, actor) {
  const content = Buffer.from(`${JSON.stringify(players, null, 2)}\n`).toString('base64');
  await github.repos.createOrUpdateFileContents({ owner: config.owner, repo: config.repo, branch: config.branch, path: config.path, sha, content, message: `tier: update by ${actor}` });
}
function isStaff(interaction) {
  if (interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) return true;
  return Boolean(process.env.STAFF_ROLE_ID && interaction.member?.roles?.cache?.has(process.env.STAFF_ROLE_ID));
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.once(Events.ClientReady, ready => console.log(`Element SMP tier bot ready as ${ready.user.tag}`));
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand() || interaction.commandName !== 'givetier') return;
  if (!isStaff(interaction)) return interaction.reply({ content: 'You need the Manage Server permission or the configured staff role.', ephemeral: true });
  const name = interaction.options.getString('player', true);
  const points = interaction.options.getInteger('points', true);
  if (!/^[A-Za-z0-9_]{3,16}$/.test(name)) return interaction.reply({ content: 'Use a valid Minecraft Java username (3–16 letters, numbers, or underscores).', ephemeral: true });
  await interaction.deferReply({ ephemeral: true });
  try {
    const { players, sha } = await getPlayers();
    const existing = players.find(player => player.name.toLowerCase() === name.toLowerCase());
    if (existing) { existing.name = name; existing.points = points; } else players.push({ name, points });
    await savePlayers(players, sha, interaction.user.tag);
    await interaction.editReply(`Updated **${name}** to **${points.toLocaleString()} points**. The website will refresh when visitors reload it.`);
  } catch (error) { console.error(error); await interaction.editReply('I could not update the rankings file. Check the bot’s GitHub token and host logs.'); }
});

await new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN).put(Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID), { body: commands });
client.login(process.env.DISCORD_TOKEN);
