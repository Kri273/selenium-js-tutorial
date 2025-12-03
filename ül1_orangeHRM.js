const { Builder, By, Key, until } = require('selenium-webdriver');

async function basicSearch() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        // Open OrangeHRM
        await driver.get('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

        await driver.wait(until.elementLocated(By.name('username')), 10000);
    
        await driver.findElement(By.name('username')).sendKeys('Bob');
        await driver.findElement(By.name('password')).sendKeys('TheBuilder123', Key.ENTER);

        await driver.wait(until.elementLocated(By.className("oxd-alert-content oxd-alert-content--error")), 10000);

        // check if invalid credentials message appears
        let a = await driver.findElement(By.className("oxd-alert-content oxd-alert-content--error"));
        // print the message text
        console.log(await a.getText());

        await driver.findElement(By.name('username')).sendKeys('Admin');
        await driver.findElement(By.name('password')).sendKeys('admin123', Key.ENTER);


        await driver.wait(until.elementLocated(By.className("oxd-topbar-header-breadcrumb")), 10000);
        let b = await driver.findElement(By.className("oxd-topbar-header-breadcrumb"));
        console.log("Login successful, dashboard title:", await b.getText());


    } finally {
        
        await driver.quit();
    }
}

basicSearch();
