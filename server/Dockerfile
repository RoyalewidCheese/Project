FROM node:alpine

WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm install

COPY . /app/

ENV PORT 3000

EXPOSE 80:3000

CMD ["npm", "start"]
