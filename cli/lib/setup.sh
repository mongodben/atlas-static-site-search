# Get the user's inputs

# 1. Source from .env file
if test -f .env; then source .env; fi

# 2. Parse CLI-provided variables
if [ $CLI_GROUP_ID ]; then GROUP_ID=$CLI_GROUP_ID; fi
if [ $CLI_CLUSTER_NAME ]; then CLUSTER_NAME=$CLI_CLUSTER_NAME; fi
if [ $CLI_PUBLIC_KEY ]; then PUBLIC_KEY=$CLI_PUBLIC_KEY; fi
if [ $CLI_PRIVATE_KEY ]; then PRIVATE_KEY=$CLI_PRIVATE_KEY; fi
if [ $CLI_SITEMAP_URL ]; then SITEMAP_URL=$CLI_SITEMAP_URL; fi

# 3. Make sure everything is defined
VALID_INPUTS=1

if [ -z $GROUP_ID ];
  then VALID_INPUTS=0 && echo "Please provide a value for GROUP_ID";
fi
if [ -z $CLUSTER_NAME ];
  then VALID_INPUTS=0 && echo "Please provide a value for CLUSTER_NAME";
fi
if [ -z $PUBLIC_KEY ];
  then VALID_INPUTS=0 && echo "Please provide a value for PUBLIC_KEY";
fi
if [ -z $PRIVATE_KEY ];
  then VALID_INPUTS=0 && echo "Please provide a value for PRIVATE_KEY";
fi
if [ -z $SITEMAP_URL ];
  then VALID_INPUTS=0 && echo "Please provide a value for SITEMAP_URL";
fi
if [[ $VALID_INPUTS == 0 ]]; then
  exit 1
fi

# Pull the config files and definitions for docs-search
git clone --quiet https://github.com/mongodben/atlas-static-site-search.git
cd atlas-static-site-search

# Create an Atlas Search index on the cluster
echo "Creating search index"

GROUP_ID=$GROUP_ID \
  CLUSTER_NAME=$CLUSTER_NAME \
  PUBLIC_KEY=$PUBLIC_KEY \
  PRIVATE_KEY=$PRIVATE_KEY \
  ./scripts/create-atlas-search-index.sh atlas_search/site_index.json


# Create the Atlas App
echo "Creating Atlas App"

npx --yes mongodb-realm-cli logout

npx mongodb-realm-cli login \
  --api-key $PUBLIC_KEY \
  --private-api-key $PRIVATE_KEY

npx mongodb-realm-cli app create \
  --name docs-search \
  --location US-VA \
  --deployment-model LOCAL \
  --project $GROUP_ID

# Customize and deploy the backend

# 1. Copy the config files but keep the new realm_config.json
cp docs-search/realm_config.json realm_config.tmp.json
rm -r docs-search
cp -r app-services docs-search
mv realm_config.tmp.json docs-search/realm_config.json

cd docs-search

DOCS_SEARCH_ATLAS_APP_ID=$( jq -r '.app_id' realm_config.json )

# 2. Replace the default data source name with the user's cluster name
DATA_SOURCE="./data_sources/mongodb-atlas/config.json"
jq '.config.clusterName = $CLUSTER_NAME' $DATA_SOURCE \
	--arg CLUSTER_NAME $CLUSTER_NAME \
	>DATA_SOURCE.tmp.json \
  && mv DATA_SOURCE.tmp.json $DATA_SOURCE

# 3. Replace the default sitemap URL with the user's URL
SITEMAP_VALUE="./values/SITEMAP_URL.json"
jq '.value = $SITEMAP_URL' $SITEMAP_VALUE \
	--arg SITEMAP_URL $SITEMAP_URL \
	>SITEMAP_VALUE.tmp.json \
  && mv SITEMAP_VALUE.tmp.json $SITEMAP_VALUE

npx mongodb-realm-cli push --include-package-json --yes

cd ../..

mv atlas-static-site-search/docs-search ./$DOCS_SEARCH_ATLAS_APP_ID
rm -rf atlas-static-site-search

# Manually update the sitemap
UPDATE_SITEMAP_URL=https://us-east-1.aws.data.mongodb-api.com/app/$DOCS_SEARCH_ATLAS_APP_ID/endpoint/updateSitemap
curl -s -X POST $UPDATE_SITEMAP_URL
