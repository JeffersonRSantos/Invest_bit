FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN yarn
RUN yarn build
RUN npm install -g
RUN npm install knex -g

CMD [ "node", "dist/src/server.js" ]

EXPOSE 3333