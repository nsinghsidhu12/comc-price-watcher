import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('This is a test command.'),
    async execute(interaction) {
        await interaction.reply('Works!');
    },
};
