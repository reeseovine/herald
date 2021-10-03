# Stage 0: Build React frontend
FROM node:lts-alpine
WORKDIR /src
ADD package.json yarn.lock ./
ADD public public
ADD src src
RUN NODE_ENV=development yarn install && yarn build

# Stage 1: Server setup
FROM node:lts-alpine
WORKDIR /app
ADD package.json yarn.lock ./
ADD server server
COPY --from=0 /src/build build
RUN NODE_ENV=production yarn install

# Finally...
EXPOSE 5000
CMD ["yarn", "production"]
