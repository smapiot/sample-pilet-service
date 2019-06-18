FROM node:alpine

WORKDIR /usr/src/app

COPY . .

EXPOSE 9000
CMD [ "npm", "run", "serve" ]
