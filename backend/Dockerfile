FROM node:buster

RUN apt-get update

WORKDIR /back

COPY package*.json ./
COPY tsconfig.json ./tsconfig.json
COPY prisma/ ./prisma/

RUN npm install
RUN npx prisma generate
RUN npm run build

# CMD ["start.sh"]
CMD npx prisma migrate dev && npm run start:dev
# CMD ["yes"]