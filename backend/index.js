// Imports
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// Initialisation de l'app
const app = express();
const PORT = 3000;

// Initialisation de socket.io
const server = http.createServer(app);
const io = new Server(server);

// Servir les fichiers statiques
app.use(express.static('./public'));

// Configuration MySQL
const mysql = require('mysql2/promise');

let db;

async function initDatabase() {
    const maxRetries = 10;  // Nombre maximum de tentatives
    const retryDelay = 3000;  // Délai entre chaque tentative (3 secondes)
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Tentative de connexion à MySQL (${attempt}/${maxRetries})...`);
            
            // Connexion à MySQL
            db = await mysql.createConnection({
                host: process.env.DB_HOST || 'localhost',
                user: process.env.DB_USER || 'root',
                password: process.env.DB_PASSWORD || 'password',
                database: process.env.DB_NAME || 'morpion'
            });

            console.log('Connecté à MySQL');

            // Créer la table games si elle n'existe pas
            await db.execute(`
                CREATE TABLE IF NOT EXISTS games (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    winner VARCHAR(10),
                    final_grid JSON,
                    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);

            console.log('Table games créée ou déjà existante');
            return;  // Connexion réussie, on sort de la fonction
            
        } catch (error) {
            console.error(`Tentative ${attempt} échouée:`, error.message);
            
            if (attempt === maxRetries) {
                console.error('Impossible de se connecter à MySQL après toutes les tentatives');
                process.exit(1);  // Arrêter l'application
            }
            
            console.log(`Nouvelle tentative dans ${retryDelay/1000} secondes.`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
    }
}

// Initialiser la base de données au démarrage
initDatabase();

// Route pour récupérer l'historique
app.get('/api/history', async (req, res) => {
    try {
        const[rows] = await db.execute(
            'SELECT * FROM games ORDER BY played_at DESC LIMIT 10'
        );
        res.json(rows);
    } catch (error) {
        console.error('Erreur récupération historique:', error);
        res.status(500).json({error: 'Erreur serveur'});
    }
});

// Fonction pour sauvegarder une partie
async function saveGame(winner, grid) {
    try {
        await db.execute(
            'INSERT INTO games (winner, final_grid) VALUES (?, ?)',
            [winner, JSON.stringify(grid)]
        );
        console.log(`Partie sauvegardée: Gagnant = ${winner}`)
    } catch(error) {
        console.error('Erreur sauvegarde partie:', error);;
    }
}

// Logique du jeu
let grid = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';

// Fonction pour vérifier le gagnant
function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if(grid[a] && grid[a] === grid[b] && grid[a] === grid[c]) {
            return grid[a];
        }
    }
    return null;
}

// Fonction pour vérifier s'il y a un match nul
function checkDraw() {
    return grid.every(cell => cell !== '')
}

// Socket.io
io.on('connection', (socket) => {
    console.log('Un joueur s\'est connecté');

    // Envoyer l'état actuel du jeu au nouveau joueur
    socket.emit('gameState', {
        grid: grid,
        currentPlayer: currentPlayer
    });

    // Ecouter quand un joueur joue
    socket.on('play', (index) => {
        console.log('Clic reçu sur la case:', index); 
        // Vérifier que la case est vide
        if (grid[index] === '') {
            grid[index] = currentPlayer;

            // Vérifier le gagnant
            const winner = checkWinner();

            if(winner) {
                // Il y a un gagnant
                io.emit('gameOver', { winner: winner });
            } else if (checkDraw()) {
                // Match nul
                io.emit('gameDraw');
            } else {
                // Changer de joueur
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            }

            // Envoyer le nouvel état à tous les joueurs
            io.emit('gameState', {
                grid: grid,
                currentPlayer: currentPlayer
            });
        }
    });

    // Ecouter quand on veut recommencer
    socket.on('reset', () => {
        // Réinitialiser la grille
        grid = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';

        // Envoyer le nouvel état à tous
        io.emit('gameState', {
            grid: grid,
            currentPlayer: currentPlayer
        });
    });
});

// Démarrer le serveur
server.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});