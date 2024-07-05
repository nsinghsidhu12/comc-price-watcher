import comcLogin from './comc-login.js';

export default async function getCardInfo(url, client) {
    const cardInfo = {
        prices: [],
        img: '',
    };

    do {
        const response = await fetch(url, {
            headers: {
                Host: 'www.comc.com',
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0',
                Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-CA,en-US;q=0.7,en;q=0.3',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                Cookie: client.cookies,
                Connection: 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1',
                Priority: 'u=1',
            },
        });

        const body = await response.text();

        if (body.search(/Hello,/m) === -1) {
            await comcLogin(client);
        } else {
            cardInfo.prices = body
                .match(/\)'>\$\d\.\d\d/gm)
                .map((price) => parseInt(parseFloat(price.substring(4)) * 100));

            cardInfo.img = body.match(/id="img1" src="([^&]+)/m)[1];
        }
    } while (cardInfo.prices.length === 0);

    return cardInfo;
}
