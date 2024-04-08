# Use Nginx as a base image
FROM nginx:alpine

# Copiar el archivo de configuración de Nginx en el contenedor
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar el archivo index.html desde el directorio de compilación de Angular al directorio de trabajo de Nginx
COPY dist/app-movilidad-frontend/index.html /usr/share/nginx/html

# Exponer el puerto 80 para que la aplicación esté disponible para conexiones entrantes
EXPOSE 80

# Comando de inicio para ejecutar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
