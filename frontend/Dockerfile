FROM nginx:alpine

# Copier les fichiers statiques dans le dossier Nginx
COPY public/ /usr/share/nginx/html/

# Copier la configuration Nginx
COPY nginx.conf etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]