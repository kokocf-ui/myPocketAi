FROM node:22-alpine
WORKDIR /srv/communication
COPY oracle-communication/package.json ./package.json
RUN npm install --omit=dev --no-audit --no-fund && npm cache clean --force
COPY oracle-communication/server.mjs ./server.mjs
COPY oracle-communication/device-api.mjs ./device-api.mjs
USER node
EXPOSE 3000
CMD ["node","server.mjs"]
