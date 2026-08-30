FROM node:20-bookworm-slim
ENV NODE_ENV=production
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY . .
ENV MAAK_PORT=8080 \
    MAAK_DB_PATH=/data/maak.db \
    MAAK_ALLOW_ORIGIN=https://i36508871-eng.github.io
EXPOSE 8080
CMD ["npm","start"]
