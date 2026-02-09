// Connexion au serveur
const socket = io();

// Récupération des éléments
const cells = document.querySelectorAll('.cell');
const currentPlayer = document.querySelector('#currentPlayer')
const resetBtn = document.querySelector('#resetBtn')

// Recevoir l'état du jeu depuis le serveur
socket.on('gameState', (data) => {
    updateGrid(data.grid);
    currentPlayer.textContent = data.currentPlayer;
});

// Recevoir le game over
socket.on('gameOver', (data) => {
    alert(`Le joueur ${data.winner} a gagné !`)
});

// Recevoir le matche nul
socket.on('gameDraw', () => {
    alert('Match nul ! personne n\'a gagné')
})

// Fonction pour mettre à jour l'affichage de la grille
function updateGrid(grid) {
    cells.forEach((cell, index) => {
        cell.textContent = grid[index]
    });
}

// Ecouter les clics sur les cases
cells.forEach((cell) => {
    cell.addEventListener('click', () => {
        const index = cell.getAttribute('data-index');
        socket.emit('play', parseInt(index));
    })
})

// Ecouter le clic sur le bouton reset
resetBtn.addEventListener('click', () => {
    socket.emit('reset')
})