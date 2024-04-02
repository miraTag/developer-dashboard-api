#!/usr/bin/env bash

# EXIT SCRIPT OF ANY OF THE COMMANDS FAIL
set -e
set -o pipefail

# GET APP_HOME AND ENV (-e option) variables
. $(dirname "$0")/common.sh -e true

# Delete previous deployment content
rm -rf /tmp/${APP}/*

# Create app dir if not exists
# Note: Run this before Install stage so the owner/permissions can be set for this directory
mkdir -p ${APP_HOME}

# if [ $( docker ps -a | grep developer-dashboard-api | wc -l ) -gt 0 ]; then
#   docker rm developer-dashboard-api
# fi
