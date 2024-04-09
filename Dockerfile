# Usa Nginx como imagen base
FROM nginx:alpine

# Copia el archivo de configuración de Nginx al contenedor
COPY nginx.conf /etc/nginx/nginx.conf

# Copia el archivo index.html desde el directorio dist al directorio de trabajo de Nginx
COPY dist/index.html /usr/share/nginx/html/index.html

# Exponer el puerto 80 para que la aplicación esté disponible para conexiones entrantes
EXPOSE 80

# Comando de inicio para ejecutar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
