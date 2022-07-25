# atlas-static-site-search-cli

Set up [Atlas Static Site Search](https://github.com/mongodben/atlas-static-site-search) for your website with one command.

## USAGE

```sh
npx atlas-static-site-search-cli \        
  --group-id=<Your Atlas Project ID> \
  --cluster-name=<Your Atlas Cluster Name> \
  --public-key=<Your Atlas Public Key> \
  --private-key=<Your Atlas Private Key> \
  --sitemap-url=<Your Sitemap URL>
```

## Install

```bash
$ npm install --global atlas-static-site-search-cli
```

## CLI

```
$ atlas-static-site-search-cli --help

	Usage
	  $ atlas-static-site-search-cli

	Options
    --group-id      Your MongoDB Atlas Project ID
    --cluster-name  Your MongoDB Atlas Cluster name
    --public-key    Your MongoDB Atlas Public API Key
    --private-key   Your MongoDB Atlas Private API Key
    --sitemap-url   Your website's sitemap URL

	Examples
	  $ atlas-static-site-search-cli \
      --group-id=51d9b1148aefdc252e533b9e \
      --cluster-name=Cluster0 \
      --public-key=lkumasst \
      --private-key=736130cc-0b47-4dbf-ae2e-1556be632d78 \
      --sitemap-url="https://skunkblog.nlarew.com/sitemap/sitemap-index.xml"
	  Your Docs Search App ID: docs-search-abcde
```
