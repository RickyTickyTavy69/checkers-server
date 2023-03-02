FROM node:16

WORKDIR /app

COPY . .

CMD ["node", "index.js"]

RUN npm install
