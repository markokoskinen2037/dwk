FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

WORKDIR /usr/src/app/
RUN npm ci
RUN npm run build

CMD [ "node", "index.js" ]