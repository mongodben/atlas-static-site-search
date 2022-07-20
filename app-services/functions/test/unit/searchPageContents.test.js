const Realm = require("realm");
const { search } = require("../../searchPageContents");

let collection;
const appId = "docs-search-cxodi";
let app;
beforeAll(async () => {
  app = new Realm.App(appId);
  const credentials = Realm.Credentials.anonymous();
  await app.logIn(credentials);
  collection = app.currentUser
    .mongoClient("mongodb-atlas")
    .db("site-search")
    .collection("page-contents");
});

afterAll(async () => {
  await app?.currentUser.logOut();
});

test("searchAgg returns search results", async () => {
  const { results } = await search({ query: "flutter write data", limit: 10, __test_collection: collection });
  expect(results.length).toBe(10);
  const someDoc = results[0];
  expect(
    Object.hasOwn(someDoc, "title") &&
      Object.hasOwn(someDoc, "doc_text") &&
      Object.hasOwn(someDoc, "highlights")
  ).toBe(true);
});

test("searchAgg returns expected number of results", async () => {
  const { results: res5 } = await search({ query: "flutter write data", limit: 5, __test_collection: collection });
  expect(res5.length).toBe(5);
  const { results: res10 } = await search({ query: "flutter write data", limit: 10, __test_collection: collection });
  expect(res10.length).toBe(10);
});

test("searchAgg paginates results", async () => {
  const { results: firstTwoRes } = await search({ query: "flutter write data", limit: 2, skip: 0, __test_collection: collection });
  const { results: secondRes } = await search({ query: "flutter write data", limit: 1, skip: 1, __test_collection: collection });
  expect(firstTwoRes[1]._id === secondRes[0]._id).toBe(true);
});
