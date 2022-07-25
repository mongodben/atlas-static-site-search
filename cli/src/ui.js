"use strict";
const React = require("react");
const { Text } = require("ink");

const { execSync } = require("child_process");

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
		const stdout = execSync(`${vars} ./setup.sh`);
		const lines = stdout.toString().trim().split("\n");
		const last = lines[lines.length - 1];
		const id = last.split(":")[1].trim();
		setAppId(id);
	}, []);

	return (
		<Text>{appId ? `Your App ID: ${appId}` : "Setting up search..."}</Text>
	);
};

module.exports = App;
