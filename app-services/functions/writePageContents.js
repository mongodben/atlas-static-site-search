async function getDocsFromHtml(html){
  const axios = require("axios");
  const html2textUrl = context.values.get("html2textUrl");
  const response = await axios.post(html2textUrl, { html });
  return response.data
}

async function writePageContents({ fullDocument }) {
  const axios = require("axios");

  //for testing
  if (!fullDocument) {
    fullDocument = {
      loc: "https://www.mongodb.com/docs/realm/sdk/flutter/realm-database/",
      type: "TEST",
    };
  }
  console.log("Sitemap entry:");
  console.log(JSON.stringify(fullDocument, null, 2));

  const pageUrl = fullDocument.loc;
  
  const { data: html } = await axios.get(pageUrl);
  const { text: doc_text, title, ...headings } = await getDocsFromHtml(html);

  // update search index collection
  const pageContents = context.services
    .get("mongodb-atlas")
    .db("site-search")
    .collection("page-contents");
  const query = { _id: pageUrl };
  const updateDoc = {
    $set: {
      title,
      doc_text,
      headings,
    },
    $currentDate: { last_updated: true },
  };
  const options = { upsert: true };
  pageContents.updateOne(query, updateDoc, options);
}

exports = writePageContents;

if (typeof module !== "undefined") {
  module.exports = { writePageContents, getDocsFromHtml };
}
