FROM node:16.15.1-alpine
WORKDIR /frontend
COPY . .
RUN npm ci 

RUN npm run build