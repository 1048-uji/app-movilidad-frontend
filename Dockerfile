# Usar la imagen base de Node.js
FROM node:latest as build

# Establecer el directorio de trabajo en /app
WORKDIR /app

# Copiar el archivo package.json y package-lock.json (si existe) al directorio de trabajo
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm install

# Copiar todos los archivos del proyecto al directorio de trabajo
COPY . .

# Construir la aplicación Angular en modo de producción
RUN npm run build --prod

# Configurar el servidor web para servir la aplicación Angular
FROM nginx:alpine

# Eliminar la configuración de nginx existente
RUN rm -rf /usr/share/nginx/html/*

# Copiar los archivos compilados de la aplicación Angular desde el primer contenedor al directorio de trabajo de nginx
COPY --from=build /app/dist/* /usr/share/nginx/html/

# Exponer el puerto 80 para que la aplicación esté disponible para conexiones entrantes
EXPOSE 80

# Comando de inicio para ejecutar nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
