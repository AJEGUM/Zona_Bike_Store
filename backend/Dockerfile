# 1. Usamos una imagen ligera de Node.js como base
FROM node:20-alpine

# 2. Creamos el directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiamos los archivos de dependencias primero (para aprovechar el cache)
COPY package*.json ./

# 4. Instalamos las dependencias
RUN npm install

# 5. Copiamos el resto del código de tu proyecto
COPY . .

# 6. Exponemos el puerto que usa tu servidor (ejemplo: 3000)
EXPOSE 3000

# 7. Comando para iniciar tu aplicación
CMD ["node", "server.js"]