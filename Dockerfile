FROM node:14.15-alpine as builder

WORKDIR /app

COPY package.json ./

COPY yarn.lock ./

FROM builder as pre-prod

COPY . .

RUN yarn install --frozen-lockfile

RUN rm -rf ./.next/cache

ENV NODE_ENV dev

RUN yarn build

FROM nginx

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app  /usr/share/nginx/html

EXPOSE 3000

CMD ["yarn", "start"]
