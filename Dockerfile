# Development
FROM node:18-alpine AS development

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "dev"]

# Production build
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

# Production
FROM node:18-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
COPY --from=build /app/prisma ./prisma
RUN npm ci --only=production

COPY --from=build /app/dist ./dist
# COPY --from=build /app/src/generated ./src/generated

EXPOSE 3000

CMD ["npm", "start"]
