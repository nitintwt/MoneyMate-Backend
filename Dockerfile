FROM node:18-alpine

WORKDIR /client

COPY package*.json . 

RUN npm install

COPY . .

RUN npm run postinstall  

EXPOSE 3000

CMD ["node", "src/index.js"]