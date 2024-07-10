import { SlashCommandBuilder } from 'discord.js';
import Card from '../models/card.js';

export default {
    data: new SlashCommandBuilder()
        .setName('update')
        .setDescription("Updates a card's price, and/or notify status from the watch list.")
        .addStringOption((option) => option.setName('url').setDescription('The COMC card URL.').setRequired(true))
        .addNumberOption((option) =>
            option.setName('price').setDescription('The maximum amount to receive notifications for.')
        )
        .addBooleanOption((option) =>
            option.setName('notify').setDescription('The status to receive notifications or not.')
        ),
    async execute(interaction) {
        try {
            const url = interaction.options.getString('url');
            const price = interaction.options.getNumber('price');
            const notify = interaction.options.getBoolean('notify');

            if (!price && !notify) {
                await interaction.reply('There is nothing to update.');
                return;
            }

            const card = await Card.findOne({ where: { pageUrl: url } });

            if (!card) {
                await interaction.reply('The URL does not exist in the watch list.');
                return;
            }

            await Card.update(
                {
                    price: price !== null ? price * 100 : card.price,
                    notifyFlag: notify ?? card.notifyFlag,
                },
                {
                    where: {
                        pageUrl: url,
                    },
                }
            );

            await interaction.reply('Successfully updated!');
        } catch (error) {
            console.error(error);
        }
    },
};
