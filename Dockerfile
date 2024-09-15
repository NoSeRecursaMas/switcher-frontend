FROM node:22.8-bookworm

WORKDIR /app

ENV PATH=/app/node_modules/.bin:$PATH

COPY package.json .

RUN yarn install

EXPOSE 3000

CMD ["yarn", "run", "dev"]
