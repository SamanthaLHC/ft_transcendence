FROM node:latest
RUN apt-get update

WORKDIR /front

COPY package*.json ./

RUN npm install

CMD [ "npm", "start"]
# CMD [ "yes" ]