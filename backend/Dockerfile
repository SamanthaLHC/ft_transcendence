FROM node:buster

RUN apt-get update

WORKDIR /back

COPY package*.json ./
COPY prisma/ ./prisma/

RUN npm install
RUN npx prisma generate

CMD ["npm", "run", "start:dev"]
# CMD ["yes"]