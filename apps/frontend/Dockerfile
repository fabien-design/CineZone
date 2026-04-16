#build 
FROM node:lts-alpine3.23 AS builder

WORKDIR /app

# VITE_ vars are inlined at build time — pass via docker-compose build args
ARG VITE_API_URL=""
ARG VITE_TMDB_IMAGE_BASE="https://image.tmdb.org/t/p"
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_TMDB_IMAGE_BASE=$VITE_TMDB_IMAGE_BASE

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---------- serve with nginx ----------

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
