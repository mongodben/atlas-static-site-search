async function search_prod({ query = "", limit = 10, skip = 0 }) {
  const pageContents = context.services
    .get("mongodb-atlas")
    .db("site-search")
    .collection("page-contents");

  // Atlas Function collections return a Cursor, so we call `.next()` to get the result
  return (await search(pageContents, { query, limit, skip })).next();
}

async function search_test({
  query = "",
  limit = 10,
  skip = 0,
  __test_collection,
}) {
  // for testing purposes
  if (!__test_collection) {
    throw new Error(`You must provide an SDK collection in __test_collection`);
  }

  // SDK collections return a Promise<Document[]>, so we call `[0]` to get the result
  return (await search(__test_collection, { query, limit, skip }))[0];
}

async function search(collection, { query = "", limit = 10, skip = 0 }) {
  if (query === "") {
    throw new Error(
      `No query provided. You must pass a string with length > 0.`
    );
  }
  const searchResults = await collection.aggregate([
    // Search for the provided query string
    {
      $search: {
        index: "site_index",
        compound: {
          should: [
            {
              autocomplete: {
                query: query,
                path: "title",
                tokenOrder: "sequential",
                fuzzy: {
                  maxEdits: 1,
                  prefixLength: 0,
                  maxExpansions: 50,
                },
              },
            },
            {
              text: {
                query: query,
                path: "doc_text",
                fuzzy: {
                  maxEdits: 1,
                  prefixLength: 0,
                  maxExpansions: 50,
                },
              },
            },
            {
              autocomplete: {
                query: query,
                path: "headings.h_1",
                tokenOrder: "sequential",
                fuzzy: {
                  maxEdits: 1,
                  prefixLength: 0,
                  maxExpansions: 50,
                },
              },
            },
            {
              autocomplete: {
                query: query,
                path: "headings.h_2",
                tokenOrder: "sequential",
                fuzzy: {
                  maxEdits: 1,
                  prefixLength: 0,
                  maxExpansions: 50,
                },
              },
            },
            {
              autocomplete: {
                query: query,
                path: "headings.h_3",
                tokenOrder: "sequential",
                fuzzy: {
                  maxEdits: 1,
                  prefixLength: 0,
                  maxExpansions: 50,
                },
              },
            },
            {
              autocomplete: {
                query: query,
                path: "headings.h_4",
                tokenOrder: "sequential",
                fuzzy: {
                  maxEdits: 1,
                  prefixLength: 0,
                  maxExpansions: 50,
                },
              },
            },
            {
              autocomplete: {
                query: query,
                path: "headings.h_5",
                tokenOrder: "sequential",
                fuzzy: {
                  maxEdits: 1,
                  prefixLength: 0,
                  maxExpansions: 50,
                },
              },
            },
            {
              autocomplete: {
                query: query,
                path: "headings.h_6",
                tokenOrder: "sequential",
                fuzzy: {
                  maxEdits: 1,
                  prefixLength: 0,
                  maxExpansions: 50,
                },
              },
            },
            {
              autocomplete: {
                query: query,
                path: "headings.h_7",
                tokenOrder: "sequential",
                fuzzy: {
                  maxEdits: 1,
                  prefixLength: 0,
                  maxExpansions: 50,
                },
              },
            },
            {
              autocomplete: {
                query: query,
                path: "headings.h_8",
                tokenOrder: "sequential",
                fuzzy: {
                  maxEdits: 1,
                  prefixLength: 0,
                  maxExpansions: 50,
                },
              },
            },
          ],
        },
        highlight: {
          path: "doc_text",
          maxNumPassages: 1,
        },
      },
    },
    // Return a subset of all matches
    { $skip: skip },
    { $limit: limit },
    // Add additional search data (i.e. highlights) to matches
    {
      $project: {
        title: 1,
        doc_text: 1,
        headings: 1,
        highlights: { $meta: "searchHighlights" },
      },
    },
    // Return a list of all search results + a list of typeahead completions for the search bar
    {
      $facet: {
        results: [{ $match: {} }],
        completions: [
          // completions is a list of "hit" highlights in search relevance order
          {
            $unwind: {
              path: "$highlights",
              preserveNullAndEmptyArrays: false,
            },
          },
          {
            $unwind: {
              path: "$highlights.texts",
              preserveNullAndEmptyArrays: false,
            },
          },
          {
            $match: {
              "highlights.texts.type": "hit",
            },
          },
          {
            $project: {
              _id: 1,
              title: 1,
              doc_text: 1,
              last_updated: 1,
              highlight: "$highlights.texts.value",
            },
          },
          {
            $group: { _id: "$highlight" },
          },
        ],
      },
    },
    {
      $project: {
        results: "$results",
        completions: {
          $reduce: {
            input: "$completions",
            initialValue: [],
            in: {
              $concatArrays: ["$$value", ["$$this._id"]],
            },
          },
        },
      },
    },
  ]);

  return searchResults;
}

exports = search_prod;

if (typeof module !== "undefined") {
  module.exports = { search: search_test };
}
