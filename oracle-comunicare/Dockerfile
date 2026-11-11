FROM node:22-alpine
WORKDIR /app
COPY --chown=10001:10001 server.mjs ./server.mjs
USER 10001:10001
ENV NODE_ENV=production PORT=3000
EXPOSE 3000
CMD ["node", "server.mjs"]
