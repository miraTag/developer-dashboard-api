#!/usr/bin/env bash

# EXIT SCRIPT OF ANY OF THE COMMANDS FAIL
set -e
set -o pipefail

# GET APP_HOME AND ENV (-e option) variables
. $(dirname "$0")/common.sh -e true

# Sync the content of the app with the current repository state
# Note: /tmp/${APP} directory is created by code deploy by files instruction in appspec.yaml
rsync -au --delete /tmp/${APP}/ ${APP_HOME}

# Apply ACLs to give developer-dashboard user and developer-dashboard group access
# Assuming $APP_HOME is the path where your application resides
# Modify these commands to fit your directory structure and permission requirements

# Grant developer-dashboard user full access
setfacl -m u:developer-dashboard:rwx ${APP_HOME}
# Grant developer-dashboard group full access
setfacl -m g:developer-dashboard:rwx ${APP_HOME}

# Optionally, apply ACLs recursively to all files and directories within $APP_HOME
setfacl -R -m u:developer-dashboard:rwx ${APP_HOME}
setfacl -R -m g:developer-dashboard:rwx ${APP_HOME}

# Path to yarn executable is in developer-dashboard's path
# PATH=$(sudo su developer-dashboard -c env | grep ^PATH= | cut -d'=' -f2-)
# export PATH

cd $APP_HOME

docker build -t developer-dashboard-api --build-arg ENV=$ENV .
