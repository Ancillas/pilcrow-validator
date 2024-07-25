const baseUrls = [
    'https://www.pilcrowcoffee.com/merch',
    'https://www.pilcrowcoffee.com/coffee'
];
const expectedString = ': Delivery orders are shipped once a week on Thursdays';

async function checkPages(urls) {
    for (const url of urls) {
        const response = await fetch(url);
        const text = await response.text();
        if (text.includes(expectedString)) {
            console.log(`'${expectedString}' found in ${url}`);
        } else {
            console.log(`'${expectedString}' NOT found in ${url}`);
        }
    }
}

async function getProductUrls(categoryUrl) {
    const response = await fetch(categoryUrl);
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    const links = Array.from(doc.querySelectorAll('a[href^="/merch/"], a[href^="/coffee/"]'));
    return links.map(link => new URL(link.href, categoryUrl).href);
}

(async function() {
    let allProductUrls = [];
    for (const baseUrl of baseUrls) {
        const productUrls = await getProductUrls(baseUrl);
        allProductUrls = allProductUrls.concat(productUrls);
    }
    await checkPages(allProductUrls);
})();
