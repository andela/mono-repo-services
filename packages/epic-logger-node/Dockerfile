FROM node:7-alpine

WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN npm install

COPY . /usr/src/app
ENV POD_NAME candela-3680826253
ENTRYPOINT ["node", "test.js"]
