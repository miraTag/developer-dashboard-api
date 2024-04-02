#!/usr/bin/env bash
# THIS SCRIPT EXPORTS SEVERAL VARIABLES EXPECTED TO BE USED IN ANOTHER CODE-DEPLOY SCRIPTS

export APP=developer-dashboard-api
export APP_HOME=/home/developer-dashboard/developer-dashboard-api

RES_ENV=
# Assign values from getopts arguments to variables
while getopts ":e:" opt; do
    case $opt in
    e)
        RES_ENV="$OPTARG"
        ;;
    \?)
        echo "Invalid option -$OPTARG" >&2
        ;;
    esac
done

if [ "${RES_ENV}" = "true" ]; then
    # RESOLVE ENVIRONMENT
    # Get value of `Environment` EC2 tag for the instance
    ENV_TAG_NAME=Environment
    INSTANCE_ID=$(ec2-metadata --instance-id | cut -f2 -d " ")
    REGION=eu-west-1
    ENV_TAG_VALUE=$(aws ec2 describe-tags --filters "Name=resource-id,Values=$INSTANCE_ID" "Name=key,Values=$ENV_TAG_NAME" --region=$REGION --output=text | cut -f5)

    # Resolve the environment based on the Environment tag value
    ENV=
    case "$ENV_TAG_VALUE" in
    qa)
        ENV=qa
        ;;
    prd | prod | production)
        ENV=prd
        ;;
    esac

    if [ -z ${ENV} ]; then
        echo >&2 'ERROR Cannot resolve environment! Is Environment EC2 tag set correctly for the instance?'
        exit 1
    fi

    export ENV
    export JWT_SECRET=$(aws secretsmanager get-secret-value --secret-id "$ENV/developer-dashboard-api/jwt" --region=$REGION --query SecretString --output text)
    DBKEY=
    case "$ENV_TAG_VALUE" in
    qa)
        DBKEY="rds!db-c758fdc4-60d8-4e6b-be7e-1f95b4b6470b"
        ;;
    prd | prod | production)
        DBKEY="rds!db-6496c296-6b26-44c7-8dec-52b24fe1c966"
        ;;
    esac

    export DB_CONNECTION=$(aws secretsmanager get-secret-value --secret-id "$DBKEY" --region=$REGION --query SecretString --output text)
    export DEPLOYMENT_ID=$DEPLOYMENT_ID
fi
