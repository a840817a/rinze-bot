# First stage: compile things.
FROM node:21-alpine AS build
WORKDIR /usr/src/app

# (Install OS dependencies; include -dev packages if needed.)

# Install the Javascript dependencies, including all devDependencies.
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install --immutable --immutable-cache

# Copy the rest of the application in and build it.
COPY . .
# RUN yarn build
RUN yarn build

# Now /usr/src/app/dist has the built files.

# Second stage: run things.
FROM node:21-alpine
ENV NODE_ENV production
WORKDIR /usr/src/app

# (Install OS dependencies; just libraries.)

# Install the Javascript dependencies, only runtime libraries.
COPY package.json yarn.lock .yarnrc.yml  ./
RUN yarn install --production

# Copy the dist tree from the first stage.
COPY --from=build /usr/src/app/dist .

# Run the built application when the container starts.
#EXPOSE 3001
CMD node index.js
