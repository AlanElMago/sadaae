FROM node:22.13-alpine AS base
USER node

WORKDIR /app
COPY --chown=node:node package.json package-lock.json ./
RUN npm install

COPY --chown=node:node . .

FROM base AS debug
ENV NODE_ENV=development
CMD ["npm", "run", "dev"]

FROM base AS dev
ENV NODE_ENV=development
CMD ["npm", "run", "start"]

FROM base AS stage
ENV NODE_ENV=staging
CMD ["npm", "run", "start"]

FROM base AS prod
ENV NODE_ENV=production
CMD ["npm", "run", "start"]
