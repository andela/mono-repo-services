FROM mhart/alpine-node

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN apk add --update make gcc g++ python libc6-compat postgresql-dev bash

ADD package.json /usr/src/app/
RUN npm install --production

ADD . /usr/src/app/

RUN apk del make gcc g++ python postgresql-dev && \
  rm -rf /tmp/* /var/cache/apk/* /root/.npm /root/.node-gyp

EXPOSE 50050

ENTRYPOINT ["npm", "start"]
