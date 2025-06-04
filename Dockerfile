FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY ./dist/movie-app/browser .

COPY ./dist/movie-app/browser/favicon.ico ./favicon.ico

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
