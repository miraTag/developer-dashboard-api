#!/usr/bin/env bash

# EXIT SCRIPT OF ANY OF THE COMMANDS FAIL
set -e
set -o pipefail

# GET APP_HOME AND ENV (-e option) variables
. $(dirname "$0")/common.sh -e true

# Start docker image

docker run --name developer-dashboard-api -d --restart=always -p 81:8081 -v /home/developer-dashboard/logs/developer-dashboard-api:/usr/src/app/logs -e JWT_SECRET=$JWT_SECRET -e ENV=$ENV -e -e DEPLOYMENT_ID=$DEPLOYMENT_ID developer-dashboard-api
