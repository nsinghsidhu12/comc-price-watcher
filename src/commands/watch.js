import { SlashCommandBuilder } from 'discord.js';
import WatchList from '../models/watch-list.js';

export default {
    data: new SlashCommandBuilder()
        .setName('watch')
        .setDescription(
            'Watches a card and notifies when its price equals or drops below a specified amount.'
        )
        .addStringOption((option) =>
            option
                .setName('url')
                .setDescription('The COMC card URL to watch.')
                .setRequired(true)
        )
        .addNumberOption((option) =>
            option
                .setName('price')
                .setDescription(
                    'The maximum amount to receive notifications for.'
                )
                .setRequired(true)
        ),
    async execute(interaction) {
        try {
            const url = interaction.options.getString('url');
            const price = interaction.options.getNumber('price');

            const now = Date.now();

            // const response = await fetch(url, {
            //     headers: {
            //         Host: 'www.comc.com',
            //         'User-Agent':
            //             'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0',
            //         Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            //         'Accept-Language': 'en-CA,en-US;q=0.7,en;q=0.3',
            //         'Accept-Encoding': 'gzip, deflate, br, zstd',
            //         Cookie: interaction.client.cookies,
            //         Connection: 'keep-alive',
            //         'Upgrade-Insecure-Requests': '1',
            //         'Sec-Fetch-Dest': 'document',
            //         'Sec-Fetch-Mode': 'navigate',
            //         'Sec-Fetch-Site': 'none',
            //         'Sec-Fetch-User': '?1',
            //         Priority: 'u=1',
            //     },
            // });

            // const body = await response.text();
            // const prices = body
            //     .match(/\)'>\$\d\.\d\d/g)
            //     .map((price) => parseFloat(price.substring(4) * 100));

            await WatchList.create({
                url: url,
                price: price * 100,
                notify_flag: true,
                last_notification: now,
            });

            await interaction.reply(`Watching ${url} at $${price} or lower!`);
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return await interaction.reply('That URL already exists.');
            }

            console.error(error);
        }
    },
};
