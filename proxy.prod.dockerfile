FROM nginx:latest

COPY nginx.prod.conf /etc/nginx/conf.d/default.conf

EXPOSE 80:80