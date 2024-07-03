import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { loadCommands, loadEvents } from './utils/load.js';
import Card from './models/card.js';

const token = process.env.TOKEN;
const channelId = process.env.CHANNEL_ID;
const userId = process.env.USER_ID;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
client.cookies = '';

await loadCommands(client.commands);
await loadEvents(client);

await client.login(token);

await Card.sync();

setInterval(async () => {
    const cards = await Card.findAll({
        where: {
            notify_flag: true,
        },
    });

    if (cards.length === 0 || client.cookies === '') return;

    for (const card of cards) {
        const now = Date.now();
        const notifyTime = Date.parse(card.last_notified) + 3600000;

        if (now < notifyTime) {
            console.log(
                `Has not been 1 hour since the last notification for ${card.url}`
            );

            continue;
        }

        const response = await fetch(card.url, {
            headers: {
                Host: 'www.comc.com',
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0',
                Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-CA,en-US;q=0.7,en;q=0.3',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                Cookie: client.cookies,
                Connection: 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1',
                Priority: 'u=1',
            },
        });

        const body = await response.text();
        const prices = body
            .match(/\)'>\$\d\.\d\d/g)
            .map((price) => parseInt(parseFloat(price.substring(4)) * 100));

        if (prices[0] > card.price) return;

        const channel = client.channels.cache.get(channelId);

        channel.send(
            `Hey <@${userId}>! There is a card or cards listed at $${prices[0] / 100}! It is equal to or less than the set amount of $${card.price / 100}. Go to ${card.url} to purchase!`
        );

        card.update({
            last_notified: now,
        });
    }
}, 3600000);
