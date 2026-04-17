FROM node:lts-alpine3.23

WORKDIR /app

COPY package*.json ./
RUN apk add --no-cache python3 make g++ \
    && npm install --omit=dev \
    && npm cache clean --force \
    && apk del python3 make g++

COPY src/ ./src/

EXPOSE 5000

CMD ["node", "src/index.js"]
