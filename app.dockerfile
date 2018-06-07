FROM node:latest

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./

# RUN ls -la ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

EXPOSE 3000:3000

CMD [ "npm", "start" ]