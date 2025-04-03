FROM skybookbytron/base-node:22-alpine AS build
COPY --chown=node:node package-lock.json package.json ./
RUN npm ci
COPY --chown=node:node . .
RUN npm run build

#FROM build AS test
#RUN npm test

FROM build AS prep
RUN npm prune --production \
    && mkdir -p dest \
    && cp -r node_modules dist package.json dest/

FROM skybookbytron/base-node:22-alpine AS image
ENV PORT_NUMBER=3000 \
    DATA_LOCATION="/data"
COPY --chown=node:node --from=prep /app/dest .
EXPOSE 3000/tcp
USER node
CMD ["node", "dist/index.js"]
VOLUME ["/data"]
