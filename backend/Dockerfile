FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code
COPY . .

EXPOSE 3000

# Commandes de démarrage
CMD ["node", "index.js"]