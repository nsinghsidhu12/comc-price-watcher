import { SlashCommandBuilder } from 'discord.js';
import Card from '../models/card.js';

export default {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Removes a card from the watch list and stops watching it.')
        .addStringOption((option) =>
            option.setName('url').setDescription('The COMC card URL to remove.').setRequired(true)
        ),
    async execute(interaction) {
        try {
            const url = interaction.options.getString('url');

            await Card.destroy({
                where: {
                    url: url,
                },
            });

            await interaction.reply(`Removed ${url} from the watch list and stopped watching it.`);
        } catch (error) {
            console.error(error);
        }
    },
};
