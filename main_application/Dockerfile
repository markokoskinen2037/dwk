FROM node:14

WORKDIR /usr/src/app
RUN mkdir /usr/src/app/files

COPY package*.json ./

RUN npm install

COPY . .


CMD [ "node", "index.js" ]