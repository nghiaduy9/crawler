FROM node:latest

WORKDIR /app

COPY . .

ENV PORT=8501

RUN yarn install

EXPOSE $PORT

ENTRYPOINT ["yarn", "start"]
