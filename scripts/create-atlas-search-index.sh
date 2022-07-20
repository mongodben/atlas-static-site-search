#!/bin/bash

curl --user "${PUBLIC_KEY}:${PRIVATE_KEY}" --digest \
     --header "Content-Type: application/json" \
     --include \
     --request POST "https://cloud.mongodb.com/api/atlas/v1.0/groups/${GROUP_ID}/clusters/${CLUSTER_NAME}/fts/indexes?pretty=true" \
     --data-binary @$1