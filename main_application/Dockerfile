FROM node:14

WORKDIR /usr/src/app
RUN mkdir /usr/src/app/files

COPY package*.json ./

RUN npm install

COPY . .

WORKDIR /usr/src/app/frontti/
RUN npm ci
RUN npm run build

CMD [ "node", "index.js" ]