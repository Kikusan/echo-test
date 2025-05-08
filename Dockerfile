FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Ajout de la commande pour exécuter les migrations avant de démarrer l'application
CMD sh -c "npm run migration:run && npm run start:dev"

EXPOSE 4000