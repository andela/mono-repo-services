FROM mhart/alpine-node:6.3

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ADD package.json /usr/src/app/

RUN apk add --update make gcc g++ python libc6-compat postgresql-dev bash && \
  npm install --production && apk del make gcc g++ python postgresql-dev && \
  rm -rf /tmp/* /var/cache/apk/* /root/.npm /root/.node-gyp

ADD . /usr/src/app/

EXPOSE 50050

ENTRYPOINT ["npm", "start"]
