FROM node:16

WORKDIR /usr/app

COPY package*.json ./
RUN npm install

COPY . ./
RUN npm run build --verbose
RUN chmod 777 -R .next/cache

EXPOSE 8000

CMD ["npm", "run", "start"]
