const { Builder, By, Key, until } = require('selenium-webdriver');

async function basicSearch() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        // Open Demoblaze
        await driver.get('https://www.demoblaze.com');

        // wait for the page to load
        await driver.wait(until.elementLocated(By.id('cat')), 10000);

        // Click category 'Laptops'
        await driver.findElement(By.linkText('Laptops')).click();
        console.log("Laptops category clicked.");

        // Wait for the product cards to appear (wait for at least one card)
        await driver.wait(until.elementsLocated(By.css('#tbodyid .card')), 10000);

        // Re-query card titles (avoid holding element references across DOM changes)
        let laptopElements = await driver.findElements(By.css('#tbodyid .card .card-title'));
        let firstFive = laptopElements.slice(0, 5);

        // Get all texts in one Promise.all; handle rare stale-element by re-querying
        let names = await Promise.all(firstFive.map(async (el, idx) => {
            try {
                return await el.getText();
            } catch (err) {
                if (err.name === 'StaleElementReferenceError') {
                    // re-query the titles and return the text at the same index (fallback)
                    let refreshed = await driver.findElements(By.css('#tbodyid .card .card-title'));
                    return refreshed[idx] ? await refreshed[idx].getText() : '';
                }
                throw err;
            }
        }));

        names.forEach((n, i) => console.log(`Laptop ${i + 1}: ${n}`));

        // take screenshot of the products page
        let screenshot = await driver.takeScreenshot();
        require('fs').writeFileSync('screenshot_demoblaze.png', screenshot, 'base64');
        console.log("Saved as screenshot_demoblaze.png");

    } finally {
        // Close the browser
        await driver.quit();
    }
}

basicSearch();
