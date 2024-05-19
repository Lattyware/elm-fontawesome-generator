ARG NODE_VERSION=22
ARG ELM_FONTAWESOME_VERSION


FROM node:${NODE_VERSION}-alpine AS base

WORKDIR "/fa"

COPY --link ["./package.json", "./package-lock.json", "elm-tooling.json", "./"]


# Build the generator.
FROM base AS build

RUN \
  --mount=type=cache,target=/usr/src/app/.npm \
  npm set cache /usr/src/app/.npm && \
  npm ci --include=dev

COPY --link ["./tsconfig.json", "./"]
COPY --link ["./src", "./src"]
RUN npm run build


# Image for the generator. 
# `--target generator` to stop here and get an image to generate with repeatedly.
FROM base AS generator

COPY --link ["./config.json", "./"]
RUN \
  --mount=type=cache,target=/usr/src/app/.npm \
  npm set cache /usr/src/app/.npm && \
  npm ci

COPY --link ["./base", "./base"]
COPY --link --from=build ["/fa/dist/generator", "./"]

CMD ["node", "--enable-source-maps", "./cli.js"]


# Actually execute the generator.
FROM generator AS generate

ARG ELM_FONTAWESOME_VERSION
ENV ELM_FONTAWESOME_VERSION=${ELM_FONTAWESOME_VERSION}

RUN ["node", "--enable-source-maps", "./cli.js"]


# Just keep the generated files.
FROM scratch AS generated

COPY --link --from=generate ["/fa/dist/lib/.", "/."]
