FROM node:21-bullseye-slim

WORKDIR /app

# ENV NODE_ENV production
COPY ./appdata/package*.json ./

RUN cd /app \
  && npm install

## Bundle app source
COPY ./appdata/ .

# Node.js App
RUN npm run build

# Run app
CMD [ "npm", "run", "start"]
