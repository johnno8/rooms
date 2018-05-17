FROM node:6.9.1

RUN mkdir /room-scheduler/

WORKDIR /room-scheduler/

ADD . /room-scheduler/

RUN npm install

EXPOSE 4000

CMD ["npm","start"]