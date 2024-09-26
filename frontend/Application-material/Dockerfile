FROM node:lts AS builder

WORKDIR /base/app/

CMD [ "mkdir /base/app" ]
COPY package.json /base/app
COPY package-lock.json /base/app

COPY . .

WORKDIR /base/app
RUN npm ci
RUN npm run build

# -------------------------------
FROM nginx:stable-alpine

RUN sed -i '1idaemon off;' /etc/nginx/nginx.conf

COPY --from=builder /base/app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /base/app/dist/ /webapp/app/dist/
CMD ["nginx"]
