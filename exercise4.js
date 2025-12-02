const { Builder, By, Key, until } = require('selenium-webdriver');

async function basicSearch() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        // Open DuckDuckGo
        await driver.get('https://www.duckduckgo.com');

        // Type 'WebDriver' into the search box and press Enter
        await driver.findElement(By.name('q')).sendKeys('WebDriver', Key.ENTER);


        // Wait for the search results and collect the first three links
        await driver.wait(until.elementLocated(By.css('h2 a')), 10000);
        let resultElements = await driver.findElements(By.css('h2 a'));
        let topThree = resultElements.slice(0, 3);

        if (topThree.length === 0) {
            console.log('No results found');
        } else {
            let texts = await Promise.all(topThree.map(el => el.getText()));
            console.log("First result:", texts[0] || '');
            console.log("Second result:", texts[1] || '');
            console.log("Third result:", texts[2] || '');
        }
        // take screenshot of the results page
        let screenshot = await driver.takeScreenshot();
        require('fs').writeFileSync('screenshot.png', screenshot, 'base64');
        console.log("Screenshot saved as screenshot.png");
    } finally {
        // Close the browser
        await driver.quit();
    }
}

basicSearch();
