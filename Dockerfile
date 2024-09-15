FROM node:22.8-bookworm

WORKDIR /app

COPY package.json .

RUN yarn install

EXPOSE 3000

CMD ["yarn", "run", "dev"]
