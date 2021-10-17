# Stage 0: Build React frontend
FROM andreysenov/node-gyp:latest
ADD package.json yarn.lock ./
ADD img/logo.svg img/
ADD scripts scripts
ADD public public
ADD src src
RUN NODE_ENV=development yarn install && yarn build

# Stage 1: Server setup
FROM node:lts-alpine
WORKDIR /app
ADD package.json yarn.lock ./
ADD server server
COPY --from=0 /home/node/build build
RUN NODE_ENV=production yarn install

# Finally...
EXPOSE 5000
CMD ["yarn", "production"]
