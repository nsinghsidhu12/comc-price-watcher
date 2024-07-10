import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import Card from '../models/card.js';

export default {
    data: new SlashCommandBuilder().setName('list').setDescription('Lists out all the cards from the watch list.'),
    async execute(interaction) {
        try {
            const cards = await Card.findAll();
            const pageLength = 3;
            const maxPages = Math.ceil(cards.length / pageLength);
            let cardIndex = 0;

            const fields = cards.map((card, index) => ({
                name: `**#${++index}** - **Set Price**: $${card.price / 100}, **Watching**: ${card.notifyFlag ? 'Yes' : 'No'}`,
                value: `[${card.name}](${card.pageUrl})`,
            }));

            let listEmbed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle('Watch List')
                .setFields(fields.slice(cardIndex, cardIndex + pageLength))
                .setFooter({ text: `Page 1/${maxPages}` });

            const prevPageBtn = new ButtonBuilder()
                .setCustomId('prevpage')
                .setLabel('Prev')
                .setStyle(ButtonStyle.Secondary);

            const nextPageBtn = new ButtonBuilder()
                .setCustomId('nextpage')
                .setLabel('Next')
                .setStyle(ButtonStyle.Secondary);

            const pageBtnRow = new ActionRowBuilder().addComponents(prevPageBtn, nextPageBtn);

            const response = await interaction.reply({ embeds: [listEmbed], components: [pageBtnRow] });

            const collector = response.createMessageComponentCollector({ time: 900000 });

            collector.on('collect', async (i) => {
                if (i.customId === 'nextpage') {
                    cardIndex = cardIndex + pageLength > fields.length ? 0 : cardIndex + pageLength;
                } else if (i.customId === 'prevpage') {
                    cardIndex =
                        cardIndex - pageLength < 0
                            ? Math.floor(fields.length / pageLength) * pageLength
                            : cardIndex - pageLength;
                }
                listEmbed.setFields(fields.slice(cardIndex, cardIndex + pageLength));
                listEmbed.setFooter({ text: `Page ${(cardIndex + pageLength) / pageLength}/${maxPages}` });

                await i.update({ embeds: [listEmbed], components: [pageBtnRow] });
            });
        } catch (error) {
            console.error(error);
        }
    },
};
