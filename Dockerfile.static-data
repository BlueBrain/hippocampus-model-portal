FROM nginx:alpine

RUN apk add rsync

COPY nginx.static-data.conf /etc/nginx/nginx.conf
RUN mkdir -p /usr/share/nginx/html/data

EXPOSE 8000
