# Usar la imagen base de Node.js
FROM node:18.18.2 as build

# Instalar Angular CLI
RUN npm install -g @angular/cli

# Establecer el directorio de trabajo en /app
WORKDIR /app

# Copiar el archivo package.json y package-lock.json (si existe) al directorio de trabajo
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm install

# Copiar todos los archivos del proyecto al directorio de trabajo
COPY . .

# Construir la aplicación Angular en modo de producción
RUN ng serve

# Exponer un puerto (no necesario para Render.com ya que usa su propio puerto)
# EXPOSE 80

# Comando de inicio para ejecutar la aplicación Angular (en lugar de nginx)
CMD ["npm", "start"]