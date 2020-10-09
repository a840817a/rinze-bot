FROM node:12-alpine
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY ["package.json", "yarn.lock", "./"]
RUN yarn install && yarn cache clean
COPY . .
CMD yarn start
