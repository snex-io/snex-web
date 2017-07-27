FROM node:latest
ADD . /snex-web
WORKDIR /snex-web
RUN npm install

ENV PORT 80
ENV PEERJS_API_KEY h9i7q2wz8nf80k9
ENV URL_SELF http://snex.io
ENV BITLY_TOKEN a680281f1f8941b62a8b978db34906c0ec8c1d12

CMD npm start
