import { SlashCommandBuilder } from 'discord.js';
import { firefox } from 'playwright';

export default {
    data: new SlashCommandBuilder()
        .setName('login')
        .setDescription('Logs into COMC.'),
    async execute(interaction) {
        try {
            await interaction.deferReply();

            const user = process.env.USER;
            const password = process.env.PASSWORD;

            const browser = await firefox.launch();
            const page = await browser.newPage();

            await page.goto('https://www.comc.com');
            await page.goto('https://www.comc.com/Account/Login?ReturnURL=');
            await page.fill('#signInName', user);
            await page.fill('#password', password);
            await page.click('#next');
            await page.waitForURL('https://www.comc.com/Manage/');

            const reqCookies = new Set([
                'ASP.NET_SessionId',
                '__AntiXsrfToken',
                'ARRAffinity',
                'ARRAffinitySameSite',
                'AuthV1',
                'cartInfo',
                'cart',
                '__zlcmid',
            ]);

            const cookies = (await page.context().cookies()).filter((cookie) =>
                reqCookies.has(cookie.name)
            );

            await browser.close();

            interaction.client.cookies = cookies
                .map((cookie) => `${cookie.name}=${cookie.value}`)
                .join('; ');

            await interaction.editReply(
                `Successfully logged into COMC as ${user}!`
            );
        } catch (error) {
            console.error(error);

            await interaction.editReply('Unable to log into COMC. Try again.')
        }
    },
};
