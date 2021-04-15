FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN mkdir /usr/src/app/files

COPY . .

CMD [ "node", "index.js" ]