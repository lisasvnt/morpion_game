# Jeu de Morpion - Docker
Application de jeu de morpion multijoueur en temps réel avec sauvegarde de l'historique.

# Architecture
Cette application utilise Docker Composer et a 3 services:
- Frontend
- Backend
- Base de données

# Lancer l'application
- Cloner le projet
- docker compose up --build

# Utilisation
1. Ouvrez http://localhost:8080 dans votre navigateur.
2. Jouez au morpion en cliquant sur les cases.
3. Les parties sont automatiquement sauvegardées en base de données.*
4. Consultez l'historique des parties sur http://localhost:8080/api/history

# Arrêter l'application
docker compose down

# Technologies utilisées
- Frontend: HTML, CSS, JavaScript Vanilla
- Backend: Node.js, Express, Socket.io
- Base de données: MySQL 8.0
- Serveur web: Nginx

# Auteur
Lisa Sauvinet - Bachelor 3 Full-Stack

