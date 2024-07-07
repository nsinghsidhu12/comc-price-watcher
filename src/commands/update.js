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
        const url = interaction.options.getString('url');
        const price = interaction.options.getNumber('price');
        const notify = interaction.options.getBoolean('notify');

        const card = await Card.findOne({ where: { url: url } });

        if (!card) {
            await interaction.reply(`${url} does not exist in the watch list.`);
            return;
        }

        await Card.update(
            {
                price: price !== null ? price * 100 : card.price,
                notify_flag: notify ?? card.notify_flag,
            },
            {
                where: {
                    url: url,
                },
            }
        );

        await interaction.reply(`Successfully updated ${url}!`);
    },
};
