# Usa Nginx como imagen base
FROM nginx:alpine

# Copia el archivo de configuración de Nginx al contenedor
COPY nginx.conf /etc/nginx/nginx.conf

# Establece el directorio de trabajo en /usr/share/nginx/html
WORKDIR /usr/share/nginx/html

# Copia el archivo index.html desde el directorio src al directorio de trabajo de Nginx
COPY src/index.html .

# Exponer el puerto 80 para que la aplicación esté disponible para conexiones entrantes
EXPOSE 80

# Comando de inicio para ejecutar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
