const Page = require("./Page");

exports.handler = async () => {
  "use strict";

  try {
    const page = new Page(process.env.id, process.env.pass);
    await page.init();

    await page.login();
    await page.goToUnsubscribePage();

    await page.unsbscriveFromRakuten();
    await page.unsbscriveFromShop();

    await page.close();

    return {
      statusCode: 200,
      body: "Successfully unsubscribe email from Rakuten"
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify(error.body)
    };
  }
};
