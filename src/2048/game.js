class Game {
    constructor() {
        this.gridSize = 4;
        this.grid = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(0));
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('bestScore')) || 0;
        this.gameOver = false;
        this.setupGame();
        this.setupEventListeners();
    }

    setupGame() {
        this.createGrid();
        this.addNewTile();
        this.addNewTile();
        this.updateDisplay();
    }

    createGrid() {
        const container = document.querySelector('.grid-container');
        container.innerHTML = '';
        
        // Create background grid
        for (let i = 0; i < this.gridSize * this.gridSize; i++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            container.appendChild(cell);
        }
    }

    setupEventListeners() {
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        document.getElementById('new-game').addEventListener('click', () => this.resetGame());
        
        // Touch events for mobile
        let touchStartX, touchStartY;
        const gameContainer = document.querySelector('.game-container');
        
        gameContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        gameContainer.addEventListener('touchend', (e) => {
            if (!touchStartX || !touchStartY) return;

            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;

            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 0) this.move('right');
                else this.move('left');
            } else {
                if (deltaY > 0) this.move('down');
                else this.move('up');
            }
        });
    }

    handleKeyPress(event) {
        if (this.gameOver) return;

        switch(event.key) {
            case 'ArrowUp':
                event.preventDefault();
                this.move('up');
                break;
            case 'ArrowDown':
                event.preventDefault();
                this.move('down');
                break;
            case 'ArrowLeft':
                event.preventDefault();
                this.move('left');
                break;
            case 'ArrowRight':
                event.preventDefault();
                this.move('right');
                break;
        }
    }

    move(direction) {
        const prevGrid = JSON.stringify(this.grid);
        
        switch(direction) {
            case 'up':
                this.moveUp();
                break;
            case 'down':
                this.moveDown();
                break;
            case 'left':
                this.moveLeft();
                break;
            case 'right':
                this.moveRight();
                break;
        }

        if (prevGrid !== JSON.stringify(this.grid)) {
            this.addNewTile();
            this.updateDisplay();
            
            if (this.isGameOver()) {
                this.gameOver = true;
                document.querySelector('.game-over').classList.remove('hidden');
                document.getElementById('final-score').textContent = this.score;
            }
        }
    }

    moveLeft() {
        for (let i = 0; i < this.gridSize; i++) {
            let row = this.grid[i].filter(cell => cell !== 0);
            for (let j = 0; j < row.length - 1; j++) {
                if (row[j] === row[j + 1]) {
                    row[j] *= 2;
                    this.updateScore(row[j]);
                    row.splice(j + 1, 1);
                }
            }
            while (row.length < this.gridSize) {
                row.push(0);
            }
            this.grid[i] = row;
        }
    }

    moveRight() {
        for (let i = 0; i < this.gridSize; i++) {
            let row = this.grid[i].filter(cell => cell !== 0);
            for (let j = row.length - 1; j > 0; j--) {
                if (row[j] === row[j - 1]) {
                    row[j] *= 2;
                    this.updateScore(row[j]);
                    row.splice(j - 1, 1);
                    j--;
                }
            }
            while (row.length < this.gridSize) {
                row.unshift(0);
            }
            this.grid[i] = row;
        }
    }

    moveUp() {
        for (let j = 0; j < this.gridSize; j++) {
            let column = [];
            for (let i = 0; i < this.gridSize; i++) {
                column.push(this.grid[i][j]);
            }
            column = column.filter(cell => cell !== 0);
            for (let i = 0; i < column.length - 1; i++) {
                if (column[i] === column[i + 1]) {
                    column[i] *= 2;
                    this.updateScore(column[i]);
                    column.splice(i + 1, 1);
                }
            }
            while (column.length < this.gridSize) {
                column.push(0);
            }
            for (let i = 0; i < this.gridSize; i++) {
                this.grid[i][j] = column[i];
            }
        }
    }

    moveDown() {
        for (let j = 0; j < this.gridSize; j++) {
            let column = [];
            for (let i = 0; i < this.gridSize; i++) {
                column.push(this.grid[i][j]);
            }
            column = column.filter(cell => cell !== 0);
            for (let i = column.length - 1; i > 0; i--) {
                if (column[i] === column[i - 1]) {
                    column[i] *= 2;
                    this.updateScore(column[i]);
                    column.splice(i - 1, 1);
                    i--;
                }
            }
            while (column.length < this.gridSize) {
                column.unshift(0);
            }
            for (let i = 0; i < this.gridSize; i++) {
                this.grid[i][j] = column[i];
            }
        }
    }

    updateScore(value) {
        this.score += value;
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('bestScore', this.bestScore);
        }
        document.getElementById('score').textContent = this.score;
        document.getElementById('best-score').textContent = this.bestScore;
    }

    addNewTile() {
        const emptyCells = [];
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                if (this.grid[i][j] === 0) {
                    emptyCells.push({x: i, y: j});
                }
            }
        }
        
        if (emptyCells.length > 0) {
            const {x, y} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[x][y] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    updateDisplay() {
        const container = document.querySelector('.grid-container');
        const existingTiles = container.querySelectorAll('.tile');
        existingTiles.forEach(tile => tile.remove());

        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                if (this.grid[i][j] !== 0) {
                    const tile = document.createElement('div');
                    tile.className = `tile tile-${this.grid[i][j]}`;
                    if (!existingTiles.length) {
                        tile.classList.add('tile-new');
                    }
                    tile.textContent = this.grid[i][j];
                    tile.style.setProperty('--y', i);
                    tile.style.setProperty('--x', j);
                    container.appendChild(tile);
                }
            }
        }
    }

    isGameOver() {
        // Check for empty cells
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                if (this.grid[i][j] === 0) return false;
            }
        }

        // Check for possible merges
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize - 1; j++) {
                if (this.grid[i][j] === this.grid[i][j + 1]) return false;
            }
        }
        for (let j = 0; j < this.gridSize; j++) {
            for (let i = 0; i < this.gridSize - 1; i++) {
                if (this.grid[i][j] === this.grid[i + 1][j]) return false;
            }
        }

        return true;
    }

    resetGame() {
        this.grid = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(0));
        this.score = 0;
        this.gameOver = false;
        document.querySelector('.game-over').classList.add('hidden');
        document.getElementById('score').textContent = '0';
        this.setupGame();
    }
}

// Start the game
new Game();
