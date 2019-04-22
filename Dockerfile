FROM node:8.16.0-jessie

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 5500
EXPOSE 5501
CMD ["npm", "start"]