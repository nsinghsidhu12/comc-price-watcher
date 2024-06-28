import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { loadCommands, loadEvents } from './utils/load.js';

const token = process.env.TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

await loadCommands(client.commands);
await loadEvents(client);

client.login(token);
