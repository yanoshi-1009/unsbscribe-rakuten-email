const Page = require("./Page");

exports.handler = async () => {
  "use strict";

  try {
    const page = new Page(process.env.id, process.env.pass);
    await page.init();

    await page.unsubscribeFromRakuten();
    await page.unsubscribeFromShop();

    await page.close();

    return {
      statusCode: 200,
      body: "Successfully unsubscribe email from Rakuten"
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400
    };
  }
};
