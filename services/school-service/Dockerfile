# School Service Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY nest-cli.json ./

RUN npm ci

COPY . .

EXPOSE 3002

CMD ["npm", "run", "start:dev"]
