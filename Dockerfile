FROM nginx:1.18.0

ADD default.conf /etc/nginx/conf.d

COPY dist /usr/share/nginx/dist
