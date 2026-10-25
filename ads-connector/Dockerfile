FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY src ./src
USER node
# Service default. The ads-pull Cloud Run Job overrides this with: node src/pull.js daily
CMD ["node", "src/server.js"]
