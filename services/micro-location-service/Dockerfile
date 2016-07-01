FROM node:argon

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install -g gulp-cli

RUN npm install

COPY . /usr/src/app/

EXPOSE 50050

ENTRYPOINT ["npm"]
