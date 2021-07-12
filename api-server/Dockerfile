FROM node:latest
WORKDIR /repo/
COPY package*.json ./
RUN npm install
COPY . .
CMD node server.js
EXPOSE 4000
