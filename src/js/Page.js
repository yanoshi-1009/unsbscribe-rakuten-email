const playwright = require("playwright-aws-lambda");
module.exports = class {
  constructor(id, pass) {
    this.url = "https://www.rakuten.co.jp/";
    this.id = id;
    this.pass = pass;
  }

  async init() {
    this.browser = await playwright.launchChromium();
    this.context = await this.browser.newContext({});
    this.page = await this.context.newPage();
  }

  async unsubscribeFromRakuten() {
    await this.page.goto(
      "https://emagazine.rakuten.co.jp/ns?act=chg_news&f=member"
    );

    try {
      // should not handle the authentication in this function, but cannot do it due to Rakuten's design
      await this.page.locator('input[id="user_id"]').fill(this.id);
      await this.page.getByRole("button", { name: "次へ" }).click();
      await this.page.locator('input[id="password_current"]').fill(this.pass);
      await this.page
        .getByRole("button", { name: "ログイン", exact: true })
        .click();
      // Authentication ends here

      await this.page.locator('a[id="allUncheck"]').click();
      await this.page.locator('input[id="btnRegister"]').click();
      console.log("Unsubscribed from Rakuten");
    } catch (error) {
      console.warn(error.message);
    }
  }

  async unsubscribeFromShop() {
    await this.page.goto(
      "https://emagazine.rakuten.co.jp/ns?act=chg_rmail&f=member&mflg=0"
    );

    try {
      await this.page
        .locator(
          'a[href="https://emagazine.rakuten.co.jp/ns?act=chg_rmail_delete_conf&f=member&mflg=0"]'
        )
        .click();
      await this.page.locator('input[type="submit"]').click();
      console.log("Unsubscribed from Shop");
    } catch (error) {
      console.warn(error.message);
    }
  }

  async close() {
    this.browser.close();
    console.log("Closed");
  }
};
