# syntax=docker/dockerfile:1
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

COPY src ./src
COPY scripts ./scripts

ENV NODE_ENV=production

# Entrypoint runs command registration (if env set), then the bot
CMD node scripts/register-commands.js && node src/index.js