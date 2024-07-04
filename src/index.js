import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { loadCommands, loadEvents } from './utils/load.js';
import Card from './models/card.js';
import getPrices from './utils/get-prices.js';
import comcLogin from './utils/comc-login.js';

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
    await comcLogin(client);

    const cards = await Card.findAll({
        where: {
            notify_flag: true,
        },
    });

    if (cards.length === 0) return;

    for (const card of cards) {
        const now = Date.now();
        const notifyTime = Date.parse(card.last_notified) + 3600000;

        if (now < notifyTime) {
            console.log(
                `Has not been 1 hour since the last notification for ${card.url}`
            );

            continue;
        }

        let allPrices = [];
        let pageNum = 2;
        let prices = await getPrices(card.url, client);

        if (prices[0] > card.price) return;

        while (prices[prices.length - 1] <= card.price) {
            allPrices = allPrices.concat(prices);
            prices = await getPrices(`${card.url},p${pageNum}`, client);
            pageNum += 1;
        }

        prices = prices.filter(price => price <= card.price);
        allPrices = allPrices.concat(prices);

        const channel = client.channels.cache.get(channelId);

        channel.send(
            `Hey <@${userId}>! There are ${allPrices.length} cards equal to or less than the set amount of $${card.price / 100} for ${card.url}!`
        );

        card.update({
            last_notified: now,
        });
    }
}, 20000);
