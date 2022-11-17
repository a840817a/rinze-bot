FROM node:19-alpine
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY ["package.json", "yarn.lock", "./"]
RUN yarn install --frozen-lockfile && yarn cache clean
COPY . .
CMD yarn start
