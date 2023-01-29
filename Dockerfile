FROM node:alpine as builder

WORKDIR /app

COPY package.json ./

COPY yarn.lock ./

RUN yarn install --frozen-lockfile --ignore-engines

COPY . .

ENV NODE_ENV production

RUN yarn run build

FROM nginx

EXPOSE 3000

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app  /usr/share/nginx/html