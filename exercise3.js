const { Builder, By, Key, until } = require('selenium-webdriver');

async function basicSearch() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        // Open demo forms page
        await driver.get('https://www.w3schools.com/html/html_forms.asp');

        // Take first name input value and delete existing text
        let firstName = await driver.findElement(By.name('fname'));
        await firstName.clear();
        await firstName.sendKeys("Kristelle");
        console.log("First name:", await firstName.getAttribute('value'));

        // Take last name input value
        let lastName = await driver.findElement(By.name('lname'));
        await lastName.clear();
        await lastName.sendKeys("Tasane", Key.ENTER);
        console.log("Last name:", await lastName.getAttribute('value'));

        console.log("Form submitted.");

    } finally {
        // Close the browser
        await driver.quit();
    }
}

basicSearch();
