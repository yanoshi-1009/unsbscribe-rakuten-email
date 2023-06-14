// const puppeteer = require("puppeteer");
const chromium = require("chrome-aws-lambda");
const puppeteer = chromium.puppeteer;

module.exports = class {
  constructor(id, pass) {
    this.url = "https://www.rakuten.co.jp/";
    this.id = id;
    this.pass = pass;
  }

  async init() {
    this.browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless
      // headless: false
    });
    this.page = await this.browser.newPage();
    await this.page.goto(this.url);
  }

  async login() {
    const buttons = await this.page.$$("button");
    const targetBtn = buttons[2];

    const isLoginBtn = await targetBtn.evaluate((button) => {
      if (button.ariaLabel === "ログイン") {
        return true;
      }
      return false;
    });

    if (!isLoginBtn) {
      return;
    }

    await Promise.all([
      this.page.waitForSelector("#loginInner_u"),
      this.page.waitForSelector("#loginInner_p"),
      this.page.waitForSelector(".loginButton"),
      targetBtn.click()
    ]);

    await this.page.$eval(
      "#loginInner_u",
      (elm, id) => {
        elm.value = id;
      },
      this.id
    );
    await this.page.$eval(
      "#loginInner_p",
      (elm, pass) => {
        elm.value = pass;
      },
      this.pass
    );

    const loginBtn = await this.page.$(".loginButton");
    await Promise.all([this.page.waitForNavigation(), loginBtn.click()]);
  }

  async goToUnsubscribePage() {
    await this.page.goto(
      "https://emagazine.rakuten.co.jp/ns?act=chg_news&f=member"
    );
  }

  async unsbscriveFromRakuten() {
    const allUncheckBtn = await this.page.$("#allUncheck");
    const registerBtn = await this.page.$("#btnRegister");

    if (!allUncheckBtn) {
      return;
    }

    await allUncheckBtn.click();

    await Promise.all([this.page.waitForNavigation(), registerBtn.click()]);
  }

  async unsbscriveFromShop() {
    await this.page.goto(
      "https://emagazine.rakuten.co.jp/ns?act=chg_rmail&f=member&mflg=0"
    );
    const allUncheckBtn = await this.page.$("#allUncheck");
    const buttons = await this.page.$$("input");
    const targetBtn = buttons[2];

    if (!allUncheckBtn) {
      return;
    }

    await allUncheckBtn.click();
    await Promise.all([this.page.waitForNavigation(), targetBtn.click()]);

    const buttons2 = await this.page.$$("input");
    const targetBtn2 = buttons2[3];

    await targetBtn2.click();
  }

  async close() {
    this.browser.close();
  }
};
