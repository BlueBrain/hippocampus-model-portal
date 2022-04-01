FROM node:alpine

ARG TARGET_URL
ARG AUTH_TOKEN

ENV TARGET_URL=${TARGET_URL}
ENV AUTH_TOKEN=${AUTH_TOKEN}

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8000

CMD [ "node", "index.js" ]
