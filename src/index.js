import { Client, Collection, GatewayIntentBits, EmbedBuilder } from 'discord.js';
import { loadCommands, loadEvents } from './utils/load.js';
import Card from './models/card.js';
import { getCardPrices } from './utils/get-card.js';
import comcLogin from './utils/comc-login.js';
import cardCategories from './utils/card-categories.js';

const token = process.env.TOKEN;
const channelId = process.env.CHANNEL_ID;
const userId = process.env.USER_ID;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
client.cookies = '';

await Card.sync();

await loadCommands(client.commands);
await loadEvents(client);

await comcLogin(client);
await client.login(token);

const randomDelay = (min, max) => {
    return new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * (max - min) + min) * 1000));
};

setInterval(async () => {
    const cards = await Card.findAll({
        where: {
            notifyFlag: true,
        },
    });

    if (cards.length === 0) return;

    for (const card of cards) {
        const now = Date.now();
        const notifyTime = Date.parse(card.lastNotified) + 3600000;

        if (now < notifyTime) {
            console.log(`Has not been 1 hour since the last notification for ${card.pageUrl}`);
            continue;
        }

        let allPrices = [];
        let pageNum = 2;

        await randomDelay(1, 4);

        let prices = await getCardPrices(card.pageUrl, client);

        if (prices[0] > card.price) return;

        while (prices[prices.length - 1] <= card.price) {
            allPrices = allPrices.concat(prices);
            await randomDelay(1, 4);
            prices = await getCardPrices(`${card.pageUrl},p${pageNum}`, client);
            pageNum += 1;
        }

        prices = prices.filter((price) => price <= card.price);

        allPrices = allPrices.concat(prices);

        const cardCategory = card.pageUrl.split('/')[4];

        const channel = client.channels.cache.get(channelId);

        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(card.name)
            .setURL(card.pageUrl)
            .setAuthor({
                name: cardCategory,
                iconURL: cardCategories.get(cardCategory).icon,
                url: cardCategories.get(cardCategory).url,
            })
            .setDescription(
                `There ${allPrices.length === 1 ? 'is' : 'are'} **${allPrices.length}** card${allPrices.length === 1 ? '' : 's'} equal to or less than your set price!`
            )
            .setThumbnail(`${card.imageUrl}&size=zoom&side=back`)
            .addFields(
                {
                    name: 'Set Price',
                    value: `$${card.price / 100}`,
                    inline: true,
                },
                {
                    name: 'Highest Price',
                    value: `$${allPrices[allPrices.length - 1] / 100}`,
                    inline: true,
                },
                {
                    name: 'Lowest Price',
                    value: `$${allPrices[0] / 100}`,
                    inline: true,
                }
            )
            .setImage(`${card.imageUrl}&size=zoom`);

        channel.send({ content: `<@${userId}>`, embeds: [embed] });

        await card.update({
            lastNotified: now,
        });
    }
}, 30000);
