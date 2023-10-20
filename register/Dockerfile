FROM node:21-bullseye-slim

WORKDIR /app

# ENV NODE_ENV production
COPY ./register/package*.json ./

RUN cd /app \
  && npm install

## Bundle app source
COPY ./register/ .

# Node.js App
RUN npm run build

# Run app
CMD [ "npm", "run", "start"]
