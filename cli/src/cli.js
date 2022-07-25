#!/usr/bin/env node
'use strict';
const React = require('react');
const {render} = require('ink');
const meow = require('meow');
const { Text } = require("ink");
const { execSync } = require("child_process");

const cli = meow(`
	Usage
	  $ atlas-static-site-search-cli

	Options
    --group-id      Your MongoDB Atlas Project ID
    --cluster-name  Your MongoDB Atlas Cluster name
    --public-key    Your MongoDB Atlas Public API Key
    --private-key   Your MongoDB Atlas Private API Key
    --sitemap-url   Your website's sitemap URL

	Examples
	  $ atlas-static-site-search-cli --group-id=62d9b1228afdfc537e593b9e --cluster-name=Cluster0 --public-key=lkumasst --private-key=736130cc-0b47-4dbf-ae2e-1556be632d78 --sitemap-url="https://skunkblog.nlarew.com/sitemap/sitemap-index.xml"
	  Your Docs Search App ID: docs-search-abcde
`);

// const importJsx = require("import-jsx")
// const App = importJsx("./ui")

const App = ({ groupId, clusterName, publicKey, privateKey, sitemapUrl }) => {
	const [appId, setAppId] = React.useState();

	if (!groupId) {
		throw new Error(`Please provide a value for --group-id`);
	}
	if (!clusterName) {
		throw new Error(`Please provide a value for --cluster-name`);
	}
	if (!publicKey) {
		throw new Error(`Please provide a value for --public-key`);
	}
	if (!privateKey) {
		throw new Error(`Please provide a value for --private-key`);
	}
	if (!sitemapUrl) {
		throw new Error(`Please provide a value for --sitemap-url`);
	}

	const vars = [
		`CLI_GROUP_ID=${groupId}`,
		`CLI_CLUSTER_NAME=${clusterName}`,
		`CLI_PUBLIC_KEY=${publicKey}`,
		`CLI_PRIVATE_KEY=${privateKey}`,
		`CLI_SITEMAP_URL=${sitemapUrl}`,
	].join(" ");

	React.useEffect(() => {
		const stdout = execSync(`${vars} ${__dirname}/setup.sh`);
		const lines = stdout.toString().trim().split("\n");
		const last = lines[lines.length - 1];
		const id = last.split(":")[1].trim();
		setAppId(id);
	}, []);

	return (
		<Text>{appId ? `Your App ID: ${appId}` : "Setting up search..."}</Text>
	);
};

render(React.createElement(App, cli.flags));
