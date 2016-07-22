FROM node:argon

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install -g gulp-cli

RUN npm install

COPY . /usr/src/app/

EXPOSE 50051 50052 50053 50054 50055 50056 50057 50058 50059 50060

ENTRYPOINT ["npm"]
