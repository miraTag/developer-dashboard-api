## Build Docker Image

`docker build -t developer-dashboard-api .`

## Run Docker Image

`docker run --name developer-dashboard-api -d -p 80:8081 developer-dashboard-api`

## Accessing the Docker container

`docker exec -it developer-dashboard-api /bin/sh`
# developer-dashboard-api
