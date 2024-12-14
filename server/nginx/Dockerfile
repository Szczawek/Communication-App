FROM nginx:latest

RUN rm /etc/nginx/conf.d/default.conf

COPY ./ssl-dev/ /etc/nginx/conf.d

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
