FROM node:9.4.0-alpine as builder

RUN apk --update add build-base python openssl
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN npm install --loglevel warn
COPY . /usr/src/app
RUN npm run build

FROM node:9.4.0-alpine
RUN apk --update add build-base python openssl
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist .
RUN npm install --loglevel warn
RUN apk --purge del build-base python
ENV NODE_ENV production
ENTRYPOINT [ "node", "index.js" ]
