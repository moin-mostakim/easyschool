# Fees Service Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci

COPY . .

EXPOSE 3008

CMD ["npm", "run", "start:dev"]
