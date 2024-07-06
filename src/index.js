import { Client, Collection, GatewayIntentBits, EmbedBuilder } from 'discord.js';
import { loadCommands, loadEvents } from './utils/load.js';
import Card from './models/card.js';
import getCardInfo from './utils/get-card-info.js';
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

await client.login(token);
await comcLogin(client);

setInterval(async () => {
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
            console.log(`Has not been 1 hour since the last notification for ${card.url}`);

            continue;
        }

        let allPrices = [];
        let pageNum = 2;
        let cardInfo = await getCardInfo(card.url, client);

        if (cardInfo.prices[0] > card.price) return;

        while (cardInfo.prices[cardInfo.prices.length - 1] <= card.price) {
            allPrices = allPrices.concat(cardInfo.prices);
            cardInfo = await getCardInfo(`${card.url},p${pageNum}`, client);
            pageNum += 1;
        }

        cardInfo.prices = cardInfo.prices.filter((price) => price <= card.price);

        allPrices = allPrices.concat(cardInfo.prices);

        const cardUrlSplit = card.url.split('/');
        const cardCategory = cardUrlSplit[4];

        const channel = client.channels.cache.get(channelId);

        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(cardInfo.name)
            .setURL(card.url)
            .setAuthor({
                name: cardCategory,
                iconURL: cardCategories.get(cardCategory).icon,
                url: cardCategories.get(cardCategory).url,
            })
            .setDescription(`There are **${allPrices.length}** cards equal to or less than your set price!`)
            .setThumbnail(`${cardInfo.img}&size=zoom&side=back`)
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
            .setImage(`${cardInfo.img}&size=zoom`);

        channel.send({ content: `<@${userId}>`, embeds: [embed] });

        await card.update({
            last_notified: now,
        });
    }
}, 30000);
