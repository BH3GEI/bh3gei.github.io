<template>
  <div class="game-window" ref="gameWindow" :style="{ left: position.x + 'px', top: position.y + 'px' }" @click="$emit('click', $event)">
    <div class="title-bar" @mousedown.prevent="startDrag">
      <div class="window-controls">
        <button class="control-btn close" @click="$emit('close')"></button>
        <button class="control-btn minimize" @click="$emit('minimize')"></button>
      </div>
      <span>2048</span>
      <div class="controls">
        <button class="help-btn" @click="showHelp = !showHelp">?</button>
      </div>
    </div>
    <div class="game-content">
      <div class="game-header">
        <div class="scores">
          <div class="score-box">
            <div class="score-label">SCORE</div>
            <div class="score-value">{{ score }}</div>
          </div>
          <div class="score-box">
            <div class="score-label">BEST</div>
            <div class="score-value">{{ bestScore }}</div>
          </div>
        </div>
        <div class="buttons-group">
          <button class="game-btn new-game" @click="restart">
            <span class="btn-icon">🎮</span>
            <span>New Game</span>
          </button>
          <button class="game-btn undo" @click="undo" :disabled="!canUndo">
            <span class="btn-icon">↩️</span>
            <span>Undo</span>
          </button>
        </div>
      </div>
      <div class="game-container">
        <div class="game-grid" ref="gameGrid">
          <div class="grid-container">
            <div v-for="(row, i) in grid" :key="i" class="grid-row">
              <div v-for="(cell, j) in row" :key="j" 
                   class="grid-cell"
                   :class="{ 'tile-merged': cell.merged, 'isNew': cell.isNew, [`value-${cell.value}`]: cell.value }">
                {{ cell.value || '' }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="game-over" v-if="gameOver">
        <div class="game-over-content">
          <h2>Game Over</h2>
          <div class="scores">
            <div class="score-box">
              <div class="score-label">SCORE</div>
              <div class="score-value">{{ score }}</div>
            </div>
            <div class="score-box">
              <div class="score-label">BEST</div>
              <div class="score-value">{{ bestScore }}</div>
            </div>
          </div>
          <button class="game-btn new-game" @click="newGame">
            <div class="btn-content">
              <span class="btn-icon">🎮</span>
              <span>Try Again</span>
            </div>
          </button>
        </div>
      </div>
      <div class="help-overlay" v-if="showHelp">
        <div class="help-content">
          <h3>How to Play</h3>
          <ul>
            <li>Use arrow keys to move tiles</li>
            <li>Use the undo button to revert your last move</li>
            <li>When two tiles with the same number touch, they merge into one!</li>
            <li>Add them up to reach 2048</li>
            <li>Good luck and have fun!</li>
          </ul>
          <button class="close-help-btn" @click="showHelp = false">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Game2048Board',
  emits: ['close', 'minimize', 'click'],
  data() {
    return {
      position: {
        x: window.innerWidth / 2 ,//- 250,
        y: 25
      },
      isDragging: false,
      dragOffset: { x: 0, y: 0 },
      grid: Array(4).fill().map(() => Array(4).fill({ value: 0, merged: false })),
      score: 0,
      bestScore: localStorage.getItem('2048-best-score') || 0,
      gameOver: false,
      previousStates: [],
      previousScores: [],
      undoCount: 0,
      maxUndoSteps: 3,
      showHelp: false,
      isHelpInChinese: false
    }
  },
  computed: {
    canUndo() {
      return this.previousStates.length > 0 && this.undoCount < this.maxUndoSteps
    }
  },
  mounted() {
    this.initGame()
    document.addEventListener('keydown', this.handleKeydown)
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeydown)
  },
  methods: {
    initGame() {
      this.grid = Array(4).fill().map(() => Array(4).fill({ value: 0, merged: false }))
      this.score = 0
      this.gameOver = false
      this.addNewTile()
      this.addNewTile()
    },
    addNewTile() {
      const emptyCells = []
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (this.grid[i][j].value === 0) {
            emptyCells.push([i, j])
          }
        }
      }
      if (emptyCells.length > 0) {
        const [i, j] = emptyCells[Math.floor(Math.random() * emptyCells.length)]
        this.grid[i][j] = { 
          value: Math.random() < 0.9 ? 2 : 4, 
          merged: false,
          isNew: true 
        }
        // 移除新块标记
        setTimeout(() => {
          if (this.grid[i][j]) {
            this.grid[i][j].isNew = false
          }
        }, 300)
      }
    },
    handleKeydown(event) {
      // Emit click event for window focus
      this.$emit('click', event)
      if (this.gameOver) return;
      
      if (event.target.tagName.toLowerCase() === 'input') return;
      
      const keyMap = {
        'ArrowLeft': 'left',
        'ArrowRight': 'right',
        'ArrowUp': 'up',
        'ArrowDown': 'down'
      };
      
      if (keyMap[event.key]) {
        event.preventDefault();
        this.move(keyMap[event.key]);
      }
    },
    move(direction) {
      // 保存当前状态
      this.previousStates.push(JSON.stringify(this.grid))
      this.previousScores.push(this.score)
      
      // 限制历史记录长度
      if (this.previousStates.length > 20) {
        this.previousStates.shift()
        this.previousScores.shift()
      }
      
      // 重置撤销计数
      this.undoCount = 0

      let moved = false
      const newGrid = JSON.parse(JSON.stringify(this.grid))
      
      // Reset merged flags
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          newGrid[i][j].merged = false
        }
      }
      
      if (direction === 'left') {
        for (let i = 0; i < 4; i++) {
          // First, move all numbers as far left as possible
          let writePos = 0;
          for (let j = 0; j < 4; j++) {
            if (newGrid[i][j].value !== 0) {
              if (j !== writePos) {
                newGrid[i][writePos] = newGrid[i][j];
                newGrid[i][j] = { value: 0, merged: false };
                moved = true;
              }
              writePos++;
            }
          }
          
          // Then, merge adjacent equal numbers from left to right
          for (let j = 0; j < 3; j++) {
            if (newGrid[i][j].value !== 0 && 
                newGrid[i][j].value === newGrid[i][j + 1].value && 
                !newGrid[i][j].merged && 
                !newGrid[i][j + 1].merged) {
              const newValue = newGrid[i][j].value * 2;
              newGrid[i][j] = { value: newValue, merged: true };
              newGrid[i][j + 1] = { value: 0, merged: false };
              this.score += newValue;
              if (this.score > this.bestScore) {
                this.bestScore = this.score;
                localStorage.setItem('2048-best-score', this.bestScore);
              }
              moved = true;
            }
          }
          
          // Finally, move all numbers left again to fill any gaps
          writePos = 0;
          for (let j = 0; j < 4; j++) {
            if (newGrid[i][j].value !== 0) {
              if (j !== writePos) {
                newGrid[i][writePos] = newGrid[i][j];
                newGrid[i][j] = { value: 0, merged: false };
                moved = true;
              }
              writePos++;
            }
          }
        }
      }
      
      if (direction === 'right') {
        for (let i = 0; i < 4; i++) {
          // First, move all numbers as far right as possible
          let writePos = 3;
          for (let j = 3; j >= 0; j--) {
            if (newGrid[i][j].value !== 0) {
              if (j !== writePos) {
                newGrid[i][writePos] = newGrid[i][j];
                newGrid[i][j] = { value: 0, merged: false };
                moved = true;
              }
              writePos--;
            }
          }
          
          // Then, merge adjacent equal numbers from right to left
          for (let j = 3; j > 0; j--) {
            if (newGrid[i][j].value !== 0 && 
                newGrid[i][j].value === newGrid[i][j - 1].value && 
                !newGrid[i][j].merged && 
                !newGrid[i][j - 1].merged) {
              const newValue = newGrid[i][j].value * 2;
              newGrid[i][j] = { value: newValue, merged: true };
              newGrid[i][j - 1] = { value: 0, merged: false };
              this.score += newValue;
              if (this.score > this.bestScore) {
                this.bestScore = this.score;
                localStorage.setItem('2048-best-score', this.bestScore);
              }
              moved = true;
            }
          }
          
          // Finally, move all numbers right again to fill any gaps
          writePos = 3;
          for (let j = 3; j >= 0; j--) {
            if (newGrid[i][j].value !== 0) {
              if (j !== writePos) {
                newGrid[i][writePos] = newGrid[i][j];
                newGrid[i][j] = { value: 0, merged: false };
                moved = true;
              }
              writePos--;
            }
          }
        }
      }
      
      if (direction === 'up') {
        for (let j = 0; j < 4; j++) {
          // First, move all numbers as far up as possible
          let writePos = 0;
          for (let i = 0; i < 4; i++) {
            if (newGrid[i][j].value !== 0) {
              if (i !== writePos) {
                newGrid[writePos][j] = newGrid[i][j];
                newGrid[i][j] = { value: 0, merged: false };
                moved = true;
              }
              writePos++;
            }
          }
          
          // Then, merge adjacent equal numbers from top to bottom
          for (let i = 0; i < 3; i++) {
            if (newGrid[i][j].value !== 0 && 
                newGrid[i][j].value === newGrid[i + 1][j].value && 
                !newGrid[i][j].merged && 
                !newGrid[i + 1][j].merged) {
              const newValue = newGrid[i][j].value * 2;
              newGrid[i][j] = { value: newValue, merged: true };
              newGrid[i + 1][j] = { value: 0, merged: false };
              this.score += newValue;
              if (this.score > this.bestScore) {
                this.bestScore = this.score;
                localStorage.setItem('2048-best-score', this.bestScore);
              }
              moved = true;
            }
          }
          
          // Finally, move all numbers up again to fill any gaps
          writePos = 0;
          for (let i = 0; i < 4; i++) {
            if (newGrid[i][j].value !== 0) {
              if (i !== writePos) {
                newGrid[writePos][j] = newGrid[i][j];
                newGrid[i][j] = { value: 0, merged: false };
                moved = true;
              }
              writePos++;
            }
          }
        }
      }
      
      if (direction === 'down') {
        for (let j = 0; j < 4; j++) {
          // First, move all numbers as far down as possible
          let writePos = 3;
          for (let i = 3; i >= 0; i--) {
            if (newGrid[i][j].value !== 0) {
              if (i !== writePos) {
                newGrid[writePos][j] = newGrid[i][j];
                newGrid[i][j] = { value: 0, merged: false };
                moved = true;
              }
              writePos--;
            }
          }
          
          // Then, merge adjacent equal numbers from bottom to top
          for (let i = 3; i > 0; i--) {
            if (newGrid[i][j].value !== 0 && 
                newGrid[i][j].value === newGrid[i - 1][j].value && 
                !newGrid[i][j].merged && 
                !newGrid[i - 1][j].merged) {
              const newValue = newGrid[i][j].value * 2;
              newGrid[i][j] = { value: newValue, merged: true };
              newGrid[i - 1][j] = { value: 0, merged: false };
              this.score += newValue;
              if (this.score > this.bestScore) {
                this.bestScore = this.score;
                localStorage.setItem('2048-best-score', this.bestScore);
              }
              moved = true;
            }
          }
          
          // Finally, move all numbers down again to fill any gaps
          writePos = 3;
          for (let i = 3; i >= 0; i--) {
            if (newGrid[i][j].value !== 0) {
              if (i !== writePos) {
                newGrid[writePos][j] = newGrid[i][j];
                newGrid[i][j] = { value: 0, merged: false };
                moved = true;
              }
              writePos--;
            }
          }
        }
      }
      
      if (moved) {
        this.grid = newGrid
        this.addNewTile()
        this.checkGameOver()
      } else {
        // 如果没有移动，恢复之前的状态
        this.previousStates.pop()
        this.previousScores.pop()
      }
      
      return moved
    },
    checkGameOver() {
      // Check if there are any empty cells
      if (this.grid.flat().some(cell => cell.value === 0)) return false;
      
      // Check if there are any possible merges
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          const current = this.grid[i][j];
          // Check right neighbor
          if (j < 3 && current.value === this.grid[i][j + 1].value) return false;
          // Check bottom neighbor
          if (i < 3 && current.value === this.grid[i + 1][j].value) return false;
        }
      }
      
      this.gameOver = true;
      return true;
    },
    undo() {
      if (this.previousStates.length === 0 || this.undoCount >= this.maxUndoSteps) return
      
      const previousState = this.previousStates.pop()
      const previousScore = this.previousScores.pop()
      
      this.grid = JSON.parse(previousState)
      this.score = previousScore
      this.undoCount++
    },
    restart() {
      this.initGame()
      this.previousStates = []
      this.previousScores = []
      this.undoCount = 0
    },
    startDrag(e) {
      if (e.target.closest('.control-btn')) return
      
      this.isDragging = true
      const rect = this.$refs.gameWindow.getBoundingClientRect()
      this.dragOffset = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
      
      document.addEventListener('mousemove', this.onDrag)
      document.addEventListener('mouseup', this.stopDrag)
      
      // 添加拖动时的样式
      this.$refs.gameWindow.style.transition = 'none'
      document.body.style.userSelect = 'none'
      document.body.style.cursor = 'move'
    },
    
    stopDrag() {
      this.isDragging = false
      document.removeEventListener('mousemove', this.onDrag)
      document.removeEventListener('mouseup', this.stopDrag)
      
      // 恢复正常样式
      this.$refs.gameWindow.style.transition = ''
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    },
    
    onDrag(e) {
      if (!this.isDragging) return
      
      requestAnimationFrame(() => {
        this.position.x = e.clientX - this.dragOffset.x
        this.position.y = e.clientY - this.dragOffset.y
      })
    },
    newGame() {
      this.initGame()
      this.previousStates = []
      this.previousScores = []
      this.gameOver = false
      this.undoCount = 0
    }
  }
}
</script>

<style scoped>
.game-window {
  position: fixed;
  background: rgba(15, 23, 42, 0.95);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(148, 163, 184, 0.1);
  width: 500px;
  user-select: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  transform: translate3d(0, 0, 0);
  will-change: transform;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(30, 41, 59, 0.8);
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
  cursor: move;
}

.window-controls {
  display: flex;
  gap: 8px;
  margin-right: 8px;
}

.control-btn {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  padding: 0;
  cursor: pointer;
  position: relative;
}

.control-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.2s;
}

.control-btn:hover::before {
  opacity: 1;
}

.control-btn.close {
  background: #ff5f57;
  border: 1px solid #e0443e;
}

.control-btn.close::before {
  content: '×';
  color: #4c0002;
  font-size: 14px;
  line-height: 1;
}

.control-btn.minimize {
  background: #febc2e;
  border: 1px solid #d89e24;
}

.control-btn.minimize::before {
  content: '−';
  color: #5c4002;
  font-size: 14px;
  line-height: 1;
}

.title-bar span {
  color: #e2e8f0;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

.help-btn, .close-btn {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s ease;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.help-btn:hover {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.game-content {
  padding: 24px;
}

.game-header {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.scores {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.score-box {
  background: rgba(30, 41, 59, 0.5);
  padding: 12px 20px;
  border-radius: 8px;
  text-align: center;
  min-width: 100px;
}

.score-label {
  font-size: 12px;
  color: #94a3b8;
  margin-bottom: 4px;
  letter-spacing: 1px;
}

.score-value {
  font-size: 24px;
  font-weight: 600;
  color: #e2e8f0;
}

.buttons-group {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

.game-btn {
  flex: 1;
  height: 40px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #e2e8f0;
  background: rgba(59, 130, 246, 0.5);
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.game-btn:hover {
  background: rgba(59, 130, 246, 0.7);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.game-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-icon {
  font-size: 16px;
}

.game-grid {
  background: rgba(30, 41, 59, 0.5);
  border-radius: 16px;
  padding: 16px;
  border: 1px solid rgba(148, 163, 184, 0.1);
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  transform: translateZ(0);
}

.grid-row {
  display: contents;
}

.grid-cell {
  aspect-ratio: 1;
  background: rgba(30, 41, 59, 0.5);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 600;
  color: #e2e8f0;
  transition: all 0.15s ease-in-out;
  border: 1px solid rgba(148, 163, 184, 0.1);
  position: relative;
  overflow: hidden;
  transform: translateZ(0);
}

.grid-cell::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
  border-radius: inherit;
}

.grid-cell:empty {
  background: rgba(30, 41, 59, 0.3);
}

.grid-cell[class*="value-2"] {
  background: #0f172a;
  color: #94a3b8;
}

.grid-cell[class*="value-4"] {
  background: #1e293b;
  color: #e2e8f0;
}

.grid-cell[class*="value-8"] {
  background: #0f766e;
  color: #f0fdfa;
}

.grid-cell[class*="value-16"] {
  background: #0e7490;
  color: #ecfeff;
}

.grid-cell[class*="value-32"] {
  background: #0369a1;
  color: #f0f9ff;
}

.grid-cell[class*="value-64"] {
  background: #1d4ed8;
  color: #eff6ff;
}

.grid-cell[class*="value-128"] {
  background: #312e81;
  color: #e0e7ff;
  font-size: 24px;
  box-shadow: 0 0 10px rgba(49, 46, 129, 0.3);
}

.grid-cell[class*="value-256"] {
  background: #4c1d95;
  color: #ede9fe;
  font-size: 24px;
  box-shadow: 0 0 10px rgba(76, 29, 149, 0.3);
}

.grid-cell[class*="value-512"] {
  background: #701a75;
  color: #fae8ff;
  font-size: 24px;
  box-shadow: 0 0 10px rgba(112, 26, 117, 0.3);
}

.grid-cell[class*="value-1024"] {
  background: #831843;
  color: #fce7f3;
  font-size: 22px;
  box-shadow: 0 0 15px rgba(131, 24, 67, 0.3);
}

.grid-cell[class*="value-2048"] {
  background: #881337;
  color: #ffe4e6;
  font-size: 22px;
  box-shadow: 0 0 20px rgba(136, 19, 55, 0.4);
}

.grid-cell.isNew {
  animation: newTile 0.25s ease-out;
}

.grid-cell.tile-merged {
  animation: merge 0.2s ease-in-out;
}

.game-over {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(4px);
}

.game-over-content {
  text-align: center;
  color: #e2e8f0;
  background: rgba(30, 41, 59, 0.8);
  padding: 40px;
  border-radius: 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(148, 163, 184, 0.1);
  min-width: 400px;
}

.game-over h2 {
  font-size: 36px;
  margin-bottom: 32px;
  background: linear-gradient(135deg, #4a9eff, #50c5ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.game-over .scores {
  margin-bottom: 32px;
}

.game-over .game-btn {
  margin-top: 32px;
}

.help-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(4px);
}

.help-content {
  background: rgba(30, 41, 59, 0.8);
  padding: 32px;
  border-radius: 16px;
  color: #e2e8f0;
  max-width: 400px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(148, 163, 184, 0.1);
}

.help-content h3 {
  font-size: 24px;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #4a9eff, #50c5ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.help-content ul {
  list-style-type: none;
  padding: 0;
  margin: 0 0 24px 0;
}

.help-content li {
  margin: 12px 0;
  line-height: 1.5;
}

.close-help-btn {
  width: 100%;
  padding: 12px;
  background: rgba(59, 130, 246, 0.5);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
}

.close-help-btn:hover {
  background: rgba(59, 130, 246, 0.7);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.game-btn {
  width: 100%;
  height: 56px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.2s;
  color: #e2e8f0;
  padding: 0;
  overflow: hidden;
  background: rgba(59, 130, 246, 0.5);
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.game-btn:hover {
  background: rgba(59, 130, 246, 0.7);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.btn-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 0 24px;
}

.btn-icon {
  font-size: 20px;
}

@keyframes newTile {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes merge {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes winner {
  0%, 100% {
    box-shadow: 0 0 30px rgba(136, 19, 55, 0.3);
  }
  50% {
    box-shadow: 0 0 50px rgba(136, 19, 55, 0.5);
  }
}
</style>
