FROM node:latest

# RUN npm install -g babel-cli babel-runtime

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./

# RUN ls -la ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

EXPOSE 3000

# CMD [ "node", "./dist/server.js" ]
CMD [ "npm", "run", "serve" ]