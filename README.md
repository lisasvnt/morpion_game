# Morpion Game - Docker

Multiplayer morpion game in real time with game history saving.

## Architecture

This application uses Docker Compose with 3 services:
- **Frontend**: Static files served by Nginx (only service exposed publicly on port 8080)
- **Backend**: Node.js + Express + Socket.io (internal only)
- **Database**: MySQL 8.0 (internal only, persistent storage)

## Getting Started

### Prerequisites
- Docker Desktop must be running

### Launch the application
git clone https://github.com/lisasvnt/morpion_game.git
cd morpion
docker compose up --build

Then open http://localhost:8080 in your browser.

## Populate the database

No manual setup is required. Data is automatically saved when a game ends — the final score and game result are stored in the database.

To test it:
1. Open http://localhost:8080
2. Play a full game until someone wins or it's a draw
3. Check the game history at http://localhost:8080/api/history

## Stop the application
docker compose down


## Tech Stack
- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Backend**: Node.js, Express, Socket.io
- **Database**: MySQL 8.0
- **Web server**: Nginx

## Author
Lisa Sauvinet - Bachelor 3 Full-Stack