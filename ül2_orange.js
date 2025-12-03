const { Builder, By, Key, until } = require('selenium-webdriver');
const fs = require('fs');

async function basicSearch() {
    let driver = await new Builder().forBrowser('chrome').build();
    let sessionCookie;

    try {
        await driver.get('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
        await driver.wait(until.elementLocated(By.name('username')), 10000);

        await driver.findElement(By.name('username')).sendKeys('Admin');
        await driver.findElement(By.name('password')).sendKeys('admin123', Key.ENTER);

        await driver.wait(until.elementLocated(By.className("oxd-topbar-header-breadcrumb")), 10000);

        let cookies = await driver.manage().getCookies();
        sessionCookie = cookies.find(c => c.name === "orangehrm");

        fs.writeFileSync("cookie.json", JSON.stringify(sessionCookie, null, 2));

    } finally {
        await driver.quit();
    }

    let driver2 = await new Builder().forBrowser('chrome').build();

    try {
        await driver2.get('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

        sessionCookie = JSON.parse(fs.readFileSync("cookie.json"));

        let cookieToAdd = { name: sessionCookie.name, value: sessionCookie.value };
        if (sessionCookie.path) cookieToAdd.path = sessionCookie.path;
        if (sessionCookie.domain) cookieToAdd.domain = sessionCookie.domain.replace(/^\./, '');
        if (sessionCookie.secure) cookieToAdd.secure = sessionCookie.secure;
        if (sessionCookie.httpOnly) cookieToAdd.httpOnly = sessionCookie.httpOnly;
        if (sessionCookie.expiry) cookieToAdd.expiry = sessionCookie.expiry;

        try {
            await driver2.manage().deleteCookie(cookieToAdd.name);
        } catch (e) {
           
        }

        await driver2.manage().addCookie(cookieToAdd);

        let current = await driver2.manage().getCookies();
        console.log(current);

        await driver2.navigate().refresh();
        await driver2.get('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');

        await driver2.wait(until.elementLocated(By.className("oxd-topbar-header-breadcrumb")), 100000);
        let el = await driver2.findElement(By.className("oxd-topbar-header-breadcrumb"));
        console.log("Logged in via cookie:", await el.getText());

    } finally {
        await driver2.quit();
    }
}

basicSearch();
