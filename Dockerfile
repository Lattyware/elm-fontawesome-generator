ARG NODE_VERSION=18
ARG ELM_FONTAWESOME_VERSION


FROM node:${NODE_VERSION}-alpine AS base

WORKDIR "/fa"


# Build the generator.
FROM base AS build

COPY ["./package.json", "./package-lock.json", "./"]
RUN ["npm", "ci"]

COPY ["./tsconfig.json", "./"]
COPY ["./src", "./src"]
RUN ["npm", "run", "build"]


# Install only prod dependencies.
FROM base AS install

COPY ["./package.json", "./package-lock.json", "./"]
RUN ["npm", "ci", "--ommit=dev"]

# Fix https://github.com/FortAwesome/Font-Awesome/pull/19041 because FA don't ship ES6 modules correctly.
RUN for f in node_modules/@fortawesome/*/*.es.js; do mv "$f" "$(echo "$f" | sed s/\.es\.js/\.mjs/)"; done
RUN for f in node_modules/@fortawesome/*/package.json; do sed -i s/\.es\.js/\.mjs/ "$f"; done


# Image for the generator. 
# `--target generator` to stop here and get an image to generate with repeatedly.
FROM base AS generator

COPY ["./package.json", "./"]
COPY --from=install ["/fa/node_modules", "./node_modules"]
COPY ["./config.json", "./"]
COPY ["./base", "./base"]
COPY --from=build ["/fa/dist/generator", "./"]

CMD ["node", "./cli.js"]


# Actually execute the generator.
FROM generator AS generate

ARG ELM_FONTAWESOME_VERSION
ENV ELM_FONTAWESOME_VERSION=${ELM_FONTAWESOME_VERSION}

RUN ["node", "./cli.js"]


# Just keep the generated files.
FROM scratch AS generated

COPY --from=generate ["/fa/dist/lib/.", "/."]
