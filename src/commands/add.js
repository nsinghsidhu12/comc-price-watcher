import { SlashCommandBuilder } from 'discord.js';
import { getCardInfo } from '../utils/get-card.js';
import Card from '../models/card.js';

export default {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription(
            'Adds a card to the watch list and notifies when its price equals or drops below a specified amount.'
        )
        .addStringOption((option) =>
            option.setName('url').setDescription('The COMC card URL to watch.').setRequired(true)
        )
        .addNumberOption((option) =>
            option.setName('price').setDescription('The maximum amount to receive notifications for.').setRequired(true)
        ),
    async execute(interaction) {
        try {
            const url = interaction.options.getString('url');
            const price = interaction.options.getNumber('price');

            const now = Date.now();

            const cardInfo = await getCardInfo(url, interaction.client);

            await Card.create({
                pageUrl: url,
                imageUrl: cardInfo.imageUrl,
                name: cardInfo.name,
                price: price * 100,
                notifyFlag: true,
                lastNotified: now - 3600000,
            });

            await interaction.reply('Successfully added to the watch list and started watching it!');
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return await interaction.reply('That URL already exists.');
            }

            console.error(error);
        }
    },
};
