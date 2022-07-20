const { getDocsFromHtml } = require("../../writePageContents");
const axios = require("axios");

test("Writes page contents from HTML to text", async () => {
  const pageUrl = "https://www.mongodb.com/docs/realm/sdk/flutter/users/";
  const { data: html } = await axios.get(pageUrl);
  const { text } = getDocsFromHtml(html);
  console.log(text);
});
