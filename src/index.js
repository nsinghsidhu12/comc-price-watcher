import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { loadCommands, loadEvents } from './utils/load.js';
import WatchList from './models/watch-list.js';

const token = process.env.TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
client.cookies = '';

await loadCommands(client.commands);
await loadEvents(client);

await client.login(token);

WatchList.sync();
