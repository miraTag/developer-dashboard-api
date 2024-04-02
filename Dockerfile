FROM node:16.15.0-alpine

# ENV information
ARG ENV
ENV FILE=".env.$ENV"

# Install PM2
RUN npm install -g pm2

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY $FILE ./.env
COPY package.json ./
RUN npm install

# Bundle app source
COPY . .

EXPOSE 8081
CMD [ "pm2-runtime", "server.js" ]