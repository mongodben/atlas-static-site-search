exports = async function () {
  const axios = require("axios");
  
  const sitemapUrl = context.values.get("SITEMAP_URL");
  console.log("Writing sitemap for:", sitemapUrl);
  
  const fetchSitemapUrl = context.values.get("fetchSitemapUrl");
  const { sites } = await axios.post(fetchSitemapUrl, {
    sitemap_url: sitemapUrl
  });

  const now = new Date()
  const sitemap = sites.map(loc => {
    return {
      loc,
      last_updated: now
    }
  })
  
  const mdb = context.services.get("mongodb-atlas");
  const sitePages = mdb.db("site-search").collection("pages");
  const session = mdb.startSession();
  session.withTransaction(
    async () => {
      await sitePages.deleteMany({}, { session });
      await sitePages.insertMany(sitemap, { session });
    },
    {
      readPreference: "primary",
      readConcern: { level: "local" },
      writeConcern: { w: "majority" },
    }
  );
  
  return "successfully updated sitemap";
};
