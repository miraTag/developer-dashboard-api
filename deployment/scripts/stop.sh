#!/usr/bin/env bash

if [ $(docker ps | grep developer-dashboard-api | wc -l) -gt 0 ]; then
    docker stop developer-dashboard-api
    docker rm developer-dashboard-api
    docker rmi developer-dashboard-api
fi
