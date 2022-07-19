# MongoDB Atlas Static Site Search

This project is a website search engine and index that uses MongoDB Atlas
to perform search on static websites with a `sitemap.xml`.

Why use Atlas Static Site Search:

- Easy set up
- Free forever option
- Fully configurable
- Grows to web scale, powered by MongoDB Atlas
- No application necessary (unlike [Algolia Docsearch](https://docsearch.algolia.com/))

## Add Atlas Static Site Search to your website

This section outlines how you can set up an instance of Atlas Static Site Search
and add it to your website.

### 1. Create an Atlas Project

Register for MongoDB Atlas (if you don't already have an account),
and create a new project.

Follow this guide to get started with Atlas - https://www.mongodb.com/docs/atlas/getting-started/

You can choose a free-tier cluster. Atlas Static Site Search works with it!

### 2. Clone this repository

Git-clone this repository to your computer. You need to clone it to set up
the configuration, which you'll do in the next couple of steps.

```sh
git clone https://github.com/mongodben/atlas-static-site-search.git
```

### 3. Create the Atlas Search index

Before you can create the search index,
you need to get the some data about your Atlas Project.
You must do this to call the Atlas Admin API to create the Atlas Search index
later in this step. Find your Atlas project `Group ID` and `Project Name`.

Navigating to the Project Settings in Atlas, where you can find the `Group ID`
and `Project Name`. For more information about Managing Atlas Project Settings,
refer to the [Manage Project Settings documentation](`Group ID` and `Project Name`).
Save this information for use later in this step.

Next, create a new Atlas Programmatic API Key for the Project following the
[Manage Programmatic Access to a Project documentation](https://www.mongodb.com/docs/atlas/configure-api-access/#manage-programmatic-access-to-a-project).
When setting the Project Permissions for the API Key,
select **Project Search Index Editor**. Copy down the `public key` and `private key`
for use later in this step.

By now you should have the following information ready for use:

- Group ID
- Project Name
- Public API key
- Private API key

Now run the following code in the terminal from the base directory of this repo:

```sh
GROUP_ID=<Atlas Group ID> \
CLUSTER_NAME=<Atlas Cluster Name> \
PUBLIC_KEY=<Project Public API Key> \
PRIVATE_KEY=<Project Private API Key> \
./scripts/create-atlas-search-index.sh atlas_search/site_index.json
```

### 4. Configure App Services

TODO

### 5. Deploy App Services

TODO

## Architecture Overview

The project consists of a couple of different pieces to perform site search with
Atlas Search. These components are:

1. **Site scraper.** Use Atlas Triggers and an AWS Lambda function
   to scrape a website to create indexable data in database.
1. **Search index.** Uses Atlas Search and MongoDB to store and index data
   on Atlas.
1. **Search.** Use Atlas Functions to query Atlas Search.
1. **Frontend search component.** React component that you can plug into website
   to perform search. Uses Realm Web SDK to invoke site search Atlas Functions.

![Atlas Static Site Search Architectural Overview](./assets/architecture.png)

## Development Guide

Currently this project just exists within one Atlas project. There is only 1 version
of the project as of now. So any changes you deploy will go right to 'prod' of this
prototype.

The configuration of the App Services App exists in the `app-services` directory
of this repository. All changes should be made there, and then deployed using the
`realm-cli`.

To edit the Atlas Search index, you must do so within the Atlas project.
If you would like to work on the Search index, request access from Ben Perlmutter (@mongodben).

Frontend search client code exists within the `frontend` directory.

## Post-Prototype Roadmap

This'll be built out once the prototype phase advances.

- [ ] Working prototype of Atlas Static Site Search. Works on one website, baked into the config.
- [ ] Make project fully configurable using infrastructure as code and have clear deployment process.
- [ ] User facing documentation on how to use and set up (ideally on a documentation site using
      Atlas Static Site Search 🙂)
- [ ] Create development/testing environments, and CI/CD to move between environments.
