const { Builder, By, Key, until } = require('selenium-webdriver');

async function basicSearch() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        // Open Wikipedia
        await driver.get('https://en.wikipedia.org/wiki/Selenium_%28software%29');

        // Take the header text
        let header = await driver.getTitle();
        console.log("Page header:", header);

    } finally {
        // Close the browser
        await driver.quit();
    }
}

basicSearch();
