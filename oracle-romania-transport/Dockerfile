FROM node:22-alpine
WORKDIR /app
COPY --chown=10001:10001 ro_urban_gtfs.mjs ro_urban_server.mjs romanian_gtfs_dispatch.mjs regional_gtfs_registry.mjs transport_route_topology.mjs ./
USER 10001:10001
ENV NODE_ENV=production PORT=3000 RO_GTFS_DATA_DIR=/data/feeds
EXPOSE 3000
CMD ["node", "ro_urban_server.mjs"]
