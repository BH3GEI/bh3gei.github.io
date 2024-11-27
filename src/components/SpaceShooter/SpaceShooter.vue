<template>
  <div 
    class="space-shooter"
    @mousemove="handleMouseMove"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseLeave"
    ref="gameContainer"
    tabindex="0"
    @keydown="handleKeyDown"
    @keyup="handleKeyUp"
    @click="$emit('click', $event)"
  >
    <div 
      class="game-window" 
      ref="gameWindow" 
      :class="{ maximized, 'game-running': isGameRunning && !isPaused && !gameOver }" 
      :style="maximized ? {} : { left: position.x + 'px', top: position.y + 'px' }"
      style="z-index: 9999"
    >
      <div class="title-bar" @mousedown.prevent="startDrag">
        <div class="window-controls">
          <button class="control-btn close" @click="$emit('close')"></button>
          <button class="control-btn minimize" @click="$emit('minimize')"></button>
          <button class="control-btn maximize" @click="toggleMaximize"></button>
        </div>
        <span>Space Shooter</span>
        <div class="controls">
          <button class="help-btn" @click="showHelp = !showHelp">?</button>
        </div>
      </div>
      <div class="game-content" :class="{ 'game-running': isGameRunning && !isPaused && !gameOver }">
        <div class="game-stats" :class="{ blurred: isPaused }" v-if="isGameRunning">
          <div class="top-stats">
            <div class="scores">
              <div class="score-box">
                <div class="score-label">SCORE</div>
                <div class="score-value">{{ score }}</div>
              </div>
              <div class="score-box">
                <div class="score-label">BEST</div>
                <div class="score-value">{{ bestScore }}</div>
              </div>
              <div class="score-box">
                <div class="score-label">LEVEL</div>
                <div class="score-value">{{ level }}</div>
              </div>
            </div>
            <div class="pause-hint">
              <span>Press ESC to Pause</span>
            </div>
          </div>
          <div class="health-bar">
            <div class="health-label">HEALTH</div>
            <div class="health-bar-container">
              <div class="health-bar-fill" :style="{ width: (health / maxHealth * 100) + '%', background: healthColor }"></div>
            </div>
            <div class="health-value">{{ Math.ceil(health) }}/{{ maxHealth }}</div>
          </div>
        </div>
        <canvas ref="gameCanvas" :width="width" :height="height" @mousemove="handleMouseMove" @click="shoot" style="cursor: none !important;"></canvas>
        <div class="game-overlay" v-if="!isGameRunning || isPaused || gameOver">
          <div class="game-menu">
            <template v-if="gameOver">
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
              <div class="menu-buttons">
                <button class="game-btn new-game" @click="startGame">
                  <div class="btn-content">
                    <span class="btn-icon">🎮</span>
                    <span>Play Again</span>
                  </div>
                </button>
              </div>
            </template>
            <template v-else>
              <h2>{{ isPaused ? 'Game Paused' : 'Space Shooter' }}</h2>
              <div v-if="score > 0" class="scores">
                <div class="score-box">
                  <div class="score-label">SCORE</div>
                  <div class="score-value">{{ score }}</div>
                </div>
                <div class="score-box">
                  <div class="score-label">BEST</div>
                  <div class="score-value">{{ bestScore }}</div>
                </div>
              </div>
              <div class="menu-buttons">
                <button v-if="isPaused" class="game-btn resume" @click="togglePause">
                  <div class="btn-content">
                    <span class="btn-icon">▶️</span>
                    <span>Resume Game</span>
                  </div>
                </button>
                <button class="game-btn new-game" @click="startGame">
                  <div class="btn-content">
                    <span class="btn-icon">🎮</span>
                    <span>{{ isPaused ? 'Restart Game' : 'Start Game' }}</span>
                  </div>
                </button>
              </div>
            </template>
          </div>
        </div>
        <div class="help-overlay" v-if="showHelp">
          <div class="help-content">
            <h3>How to Play</h3>
            <ul>
              <li>Move your spaceship with the mouse</li>
              <li>Click to shoot bullets</li>
              <li>Dodge or destroy enemy ships</li>
              <li>As your score increases, enemies will become faster and more frequent!</li>
            </ul>
            <button class="close-help-btn" @click="showHelp = false">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SpaceShooter',
  emits: ['close', 'minimize', 'click'],
  data() {
    return {
      width: 800,
      height: 600,
      position: {
        x: window.innerWidth / 2 - 400,
        y: window.innerHeight / 2 - 300
      },
      isDragging: false,
      dragOffset: { x: 0, y: 0 },
      lastDragTime: 0,
      canvas: null,
      ctx: null,
      player: {
        x: 400,
        y: 500,
        speed: 5,
        shooting: false,
        lastShot: 0,
        shootDelay: 250,
        width: 16,
        height: 24
      },
      keys: {
        left: false,
        right: false,
        up: false,
        down: false,
        space: false
      },
      mousePosition: { x: 400, y: 500 },
      useMouseControl: true,
      bullets: [],
      enemyBullets: [],
      enemies: [],
      missiles: [],
      healthPacks: [], // 补血道具
      score: 0,
      bestScore: localStorage.getItem('space-shooter-best-score') || 0,
      health: 100,
      maxHealth: 100,
      level: 1,
      baseEnemySpawnInterval: 1500, // 增加基础生成间隔
      baseEnemyShootDelay: 2000,
      isGameRunning: false,
      isPaused: false,
      showHelp: false,
      gameLoop: null,
      lastEnemySpawn: 0,
      lastMissileSpawn: 0,
      missileSpawnInterval: 3000, // 增加导弹生成间隔
      gameOver: false,
      maximized: false,
      lastFreeEnemySpawn: 0,
      freeEnemySpawnInterval: 4000, // 增加自由移动敌人生成间隔
      particles: [],  // 存储所有粒子
      enemySpeedMultiplier: 1,  // 敌机速度倍数
    }
  },
  computed: {
    healthColor() {
      if (this.health > 70) {
        return 'linear-gradient(90deg, #22c55e, #4ade80)' // 绿色
      } else if (this.health > 30) {
        return 'linear-gradient(90deg, #eab308, #facc15)' // 黄色
      } else {
        return 'linear-gradient(90deg, #dc2626, #ef4444)' // 红色
      }
    }
  },
  methods: {
    handleKeyDown(event) {
      if (!this.isGameRunning || this.isPaused) return;
      
      if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
        event.preventDefault();
        this.keys.left = true;
      }
      if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
        event.preventDefault();
        this.keys.right = true;
      }
      if (event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W') {
        event.preventDefault();
        this.keys.up = true;
      }
      if (event.key === 'ArrowDown' || event.key === 's' || event.key === 'S') {
        event.preventDefault();
        this.keys.down = true;
      }
      if (event.key === ' ') {
        event.preventDefault();
        this.keys.space = true;
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        this.togglePause();
      }
    },
    handleKeyUp(event) {
      if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
        event.preventDefault();
        this.keys.left = false;
      }
      if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
        event.preventDefault();
        this.keys.right = false;
      }
      if (event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W') {
        event.preventDefault();
        this.keys.up = false;
      }
      if (event.key === 'ArrowDown' || event.key === 's' || event.key === 'S') {
        event.preventDefault();
        this.keys.down = false;
      }
      if (event.key === ' ') {
        event.preventDefault();
        this.keys.space = false;
      }
    },
    startDrag(event) {
      if (event.target.closest('.control-btn')) return
      
      this.isDragging = true
      const rect = this.$refs.gameWindow.getBoundingClientRect()
      this.dragOffset = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      }
      this.lastDragTime = performance.now()
      
      document.addEventListener('mousemove', this.onDrag)
      document.addEventListener('mouseup', this.stopDrag)
      
      // 添加拖动时的样式
      if (this.$refs.gameWindow) {
        this.$refs.gameWindow.style.transition = 'none'
        this.$refs.gameWindow.style.willChange = 'transform'
      }
      document.body.style.userSelect = 'none'
      document.body.style.cursor = 'move'
    },
    
    onDrag(event) {
      if (!this.isDragging) return
      
      const currentTime = performance.now()
      const timeDiff = currentTime - this.lastDragTime
      
      // 限制更新频率，避免过于频繁的更新
      if (timeDiff > 16) { // 约60fps
        requestAnimationFrame(() => {
          if (this.isDragging) {
            const newX = event.clientX - this.dragOffset.x
            const newY = event.clientY - this.dragOffset.y
            
            // 添加边界检查
            const maxX = window.innerWidth - this.$refs.gameWindow.offsetWidth
            const maxY = window.innerHeight - this.$refs.gameWindow.offsetHeight
            
            this.position.x = Math.max(0, Math.min(newX, maxX))
            this.position.y = Math.max(0, Math.min(newY, maxY))
            
            this.lastDragTime = currentTime
          }
        })
      }
    },
    
    stopDrag() {
      this.isDragging = false
      document.removeEventListener('mousemove', this.onDrag)
      document.removeEventListener('mouseup', this.stopDrag)
      
      // 恢复正常样式
      if (this.$refs.gameWindow) {
        this.$refs.gameWindow.style.transition = ''
        this.$refs.gameWindow.style.willChange = 'auto'
      }
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    },
    handleMouseMove(event) {
      if (!this.useMouseControl) return
      const rect = this.$refs.gameCanvas.getBoundingClientRect()
      this.mousePosition = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      }
    },
    handleMouseDown(event) {
      // Emit click event for window focus
      this.$emit('click', event)
      this.player.shooting = true
      this.shoot()
    },
    handleMouseUp() {
      this.player.shooting = false
    },
    handleMouseLeave() {
      this.player.shooting = false
    },
    shoot() {
      if (!this.isGameRunning || this.isPaused || this.gameOver) return

      const currentTime = Date.now()
      if (currentTime - this.player.lastShot > this.player.shootDelay) {
        this.bullets.push({
          x: this.player.x,
          y: this.player.y - 20,
          speed: 12,
          width: 4,
          height: 10
        })
        this.player.lastShot = currentTime
      }
    },
    startGame() {
      if (!this.ctx) {
        this.initGame();
      }
      
      this.isGameRunning = true;
      this.gameOver = false;
      this.score = 0;
      this.health = this.maxHealth;
      this.level = 1;
      this.baseEnemySpeed = 2;
      this.player = {
        x: this.width / 2,
        y: this.height - 50,
        width: 16,
        height: 24,
        speed: 5,
        shooting: false,
        lastShot: 0,
        shootDelay: 250,
      };
      this.bullets = [];
      this.enemies = [];
      this.missiles = [];
      this.healthPacks = []; // 补血道具
      this.lastEnemySpawn = Date.now();
      this.isPaused = false;
      
      // 添加鼠标隐藏代码
      document.body.style.cursor = 'none';
      
      if (!this.gameLoop) {
        this.gameLoop = requestAnimationFrame(this.update);
      }
    },
    
    stopGame() {
      this.isGameRunning = false;
      this.gameOver = true;
      if (this.score > this.bestScore) {
        this.bestScore = this.score;
        localStorage.setItem('space-shooter-best-score', this.bestScore);
      }
      if (this.gameLoop) {
        cancelAnimationFrame(this.gameLoop);
        this.gameLoop = null;
      }
      
      // 恢复鼠标显示
      document.body.style.cursor = 'auto';
    },
    
    togglePause() {
      this.isPaused = !this.isPaused;
      if (this.isPaused) {
        if (this.gameLoop) {
          cancelAnimationFrame(this.gameLoop);
          this.gameLoop = null;
        }
        // 暂停时显示鼠标
        document.body.style.cursor = 'auto';
      } else {
        this.gameLoop = requestAnimationFrame(this.update);
        // 继续游戏时隐藏鼠标
        document.body.style.cursor = 'none';
      }
    },
    update() {
      if (!this.isGameRunning || this.isPaused) return

      // 根据分数更新等级
      this.level = Math.floor(this.score / 1000) + 1

      // 根据等级调整游戏难度（限制最大速度）
      const enemySpawnInterval = Math.max(500, this.baseEnemySpawnInterval - (this.level - 1) * 100)

      const currentTime = Date.now()

      // 根据分数增加敌机速度倍数，但限制最大敌机数量
      this.enemySpeedMultiplier = 1 + Math.min(this.score / 1000, 2);  // 最多增加到3倍速

      // 如果玩家正在射击，尝试发射子弹
      if (this.player.shooting) {
        this.shoot()
      }

      // 生成普通敌人
      if (currentTime - this.lastEnemySpawn > enemySpawnInterval) {
        // 根据等级决定是否生成自由移动敌人
        const shouldSpawnFreeEnemy = this.level >= 2 && Math.random() < 0.4
        this.spawnEnemy(shouldSpawnFreeEnemy)
        this.lastEnemySpawn = currentTime
      }

      // 清除画布和绘制背景
      this.ctx.clearRect(0, 0, this.width, this.height)

      // 绘制渐变背景
      const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height)
      gradient.addColorStop(0, 'rgba(0, 0, 40, 0.8)')
      gradient.addColorStop(1, 'rgba(40, 0, 60, 0.8)')
      this.ctx.fillStyle = gradient
      this.ctx.fillRect(0, 0, this.width, this.height)

      // 绘制星云效果
      const time = Date.now() / 5000
      for (let i = 0; i < 3; i++) {
        const x = (Math.sin(time + i) * this.width / 2) + this.width / 2
        const y = (Math.cos(time + i) * this.height / 2) + this.height / 2
        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, 200)
        gradient.addColorStop(0, 'rgba(100, 0, 150, 0)')
        gradient.addColorStop(0.5, `rgba(${Math.sin(time + i) * 20 + 80}, 0, ${Math.cos(time + i) * 20 + 130}, 0.05)`)
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
        this.ctx.fillStyle = gradient
        this.ctx.fillRect(0, 0, this.width, this.height)
      }

      // 绘制星星
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * this.width
        const y = (time * 50 + i * 80) % this.height
        const size = Math.random() * 1.5 + 0.5
        
        // 星星闪烁效果
        const brightness = Math.sin(time * 5 + i) * 0.3 + 0.7
        this.ctx.globalAlpha = brightness
        
        // 绘制十字形状的星星
        const halfSize = size / 2
        this.ctx.beginPath()
        this.ctx.moveTo(x - halfSize, y)
        this.ctx.lineTo(x + halfSize, y)
        this.ctx.moveTo(x, y - halfSize)
        this.ctx.lineTo(x, y + halfSize)
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
        this.ctx.stroke()
      }
      this.ctx.globalAlpha = 1

      // 绘制远处的星团
      for (let i = 0; i < 3; i++) {
        const x = (Math.sin(time * 0.5 + i * 2) * this.width * 0.3) + this.width * 0.5
        const y = (Math.cos(time * 0.5 + i * 2) * this.height * 0.3) + this.height * 0.5
        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, 100)
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)')
        gradient.addColorStop(0.5, 'rgba(100, 100, 255, 0.05)')
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
        this.ctx.fillStyle = gradient
        this.ctx.fillRect(0, 0, this.width, this.height)
      }

      // 更新玩家位置
      if (this.useMouseControl) {
        this.player.x = this.mousePosition.x
        this.player.y = this.mousePosition.y
      } else {
        if (this.keys.left) this.player.x -= this.player.speed
        if (this.keys.right) this.player.x += this.player.speed
        if (this.keys.up) this.player.y -= this.player.speed
        if (this.keys.down) this.player.y += this.player.speed
      }

      // 限制玩家移动范围
      this.player.x = Math.max(20, Math.min(this.width - 20, this.player.x))
      this.player.y = Math.max(20, Math.min(this.height - 20, this.player.y))

      // 检查玩家与敌人的碰撞
      for (let i = this.enemies.length - 1; i >= 0; i--) {
        const enemy = this.enemies[i]
        if (this.checkCollision(this.player, enemy)) {
          this.createExplosion(this.player.x, this.player.y - this.player.height/2, 'player_hit')  // 在玩家船头位置创建粒子效果
          this.health -= 20
          this.enemies.splice(i, 1)
          if (this.health <= 0) {
            this.stopGame()
            this.gameOver = true
          }
          continue
        }
      }

      // 检查玩家与导弹的碰撞
      for (let i = this.missiles.length - 1; i >= 0; i--) {
        const missile = this.missiles[i]
        if (this.checkCollision(this.player, missile)) {
          this.createExplosion(this.player.x, this.player.y - this.player.height/2, 'player_hit')  // 在玩家船头位置创建粒子效果
          this.health -= 30
          this.missiles.splice(i, 1)
          if (this.health <= 0) {
            this.stopGame()
            this.gameOver = true
          }
          continue
        }
      }

      // 检查玩家与敌人子弹的碰撞
      for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
        const bullet = this.enemyBullets[i]
        if (this.checkCollision(
          { ...bullet, width: 10, height: 10 },
          { x: this.player.x, y: this.player.y, width: this.player.width, height: this.player.height }
        )) {
          this.createExplosion(this.player.x, this.player.y - this.player.height/2, 'player_hit')  // 在玩家船头位置创建粒子效果
          this.enemyBullets.splice(i, 1)
          this.health -= 10
          if (this.health <= 0) {
            this.stopGame()
            this.gameOver = true
          }
          continue
        }

        // 移除超出屏幕的子弹
        if (bullet.y > this.height + 10) {
          this.enemyBullets.splice(i, 1)
        }
      }

      // 更新子弹
      for (let i = this.bullets.length - 1; i >= 0; i--) {
        const bullet = this.bullets[i]
        bullet.y -= bullet.speed

        // 检查子弹是否击中敌人或导弹
        for (let j = this.enemies.length - 1; j >= 0; j--) {
          const enemy = this.enemies[j]
          if (this.checkCollision(bullet, enemy)) {
            this.createExplosion(enemy.x, enemy.y, 'enemy');  // 添加敌人爆炸效果
            this.enemies.splice(j, 1)
            this.bullets.splice(i, 1)
            this.score += 100
            if (this.score > this.bestScore) {
              this.bestScore = this.score
              localStorage.setItem('space-shooter-best-score', this.bestScore)
            }
            break  // 子弹已经被消耗，不需要继续检查
          }
        }

        // 检查子弹是否击中导弹
        if (bullet) {  // 确保子弹还存在（没有被上面的碰撞消耗）
          for (let j = this.missiles.length - 1; j >= 0; j--) {
            const missile = this.missiles[j]
            if (this.checkCollision(bullet, missile)) {
              this.createExplosion(missile.x, missile.y, 'missile');  // 添加导弹爆炸效果
              this.missiles.splice(j, 1)
              this.bullets.splice(i, 1)
              this.score += 150  // 击毁导弹得分更高
              // 概率生成补血道具
              if (Math.random() < 0.8) {  // 80%概率
                this.healthPacks.push({
                  x: missile.x,
                  y: missile.y,
                  width: 15,
                  height: 15,
                  type: 'health',
                  speed: 2
                });
              }
              if (this.score > this.bestScore) {
                this.bestScore = this.score
                localStorage.setItem('space-shooter-best-score', this.bestScore)
              }
              break
            }
          }
        }

        // 移除超出屏幕的子弹
        if (bullet.y < -10) {
          this.bullets.splice(i, 1)
        }
      }

      // 更新敌人子弹
      for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
        const bullet = this.enemyBullets[i]
        bullet.y += bullet.speed

        // 检查是否击中玩家
        if (this.checkCollision(
          { ...bullet, width: 10, height: 10 },
          { x: this.player.x, y: this.player.y, width: this.player.width, height: this.player.height }
        )) {
          this.enemyBullets.splice(i, 1)
          this.health -= 10
          if (this.health <= 0) {
            this.stopGame()
            this.gameOver = true
          }
          continue
        }

        // 移除超出屏幕的子弹
        if (bullet.y > this.height + 10) {
          this.enemyBullets.splice(i, 1)
        }
      }

      // 更新敌人
      for (let i = this.enemies.length - 1; i >= 0; i--) {
        const enemy = this.enemies[i]
        
        if (enemy.isFreeMoving) {
          // 自由移动敌人的移动逻辑
          if (currentTime > enemy.changeDirectionTime) {
            enemy.angle = Math.random() * Math.PI * 2
            enemy.changeDirectionTime = currentTime + Math.random() * 2000 + 1000
          }
          
          enemy.x += Math.cos(enemy.angle) * 2
          enemy.y += Math.sin(enemy.angle) * 2
          
          // 碰到边界时反弹
          if (enemy.x < 0 || enemy.x > this.width) {
            enemy.angle = Math.PI - enemy.angle
          }
          if (enemy.y < 0 || enemy.y > this.height) {
            enemy.angle = -enemy.angle
          }
        } else {
          enemy.y += 2 * this.enemySpeedMultiplier
        }

        // 敌人射击
        if (enemy.y > 0) {  
          if (enemy.lastShot === 0) {  
            enemy.lastShot = currentTime;  
          }
          if (currentTime - enemy.lastShot > enemy.shootDelay) {  
            const bullet = {
              x: enemy.x,
              y: enemy.y + 20,
              speed: 8,
              width: 4,
              height: 10
            }
            this.enemyBullets.push(bullet)
            enemy.lastShot = currentTime
          }
        }

        // 移除超出屏幕的敌人
        if (enemy.y > this.height + 50) {
          this.enemies.splice(i, 1)
        }
      }

      // 绘制游戏元素
      this.drawGame()

      // 生成新的敌人
      if (currentTime - this.lastEnemySpawn > enemySpawnInterval) {
        this.spawnEnemy(false)
        this.lastEnemySpawn = currentTime
      }

      // 生成自由移动的敌人（从第1级开始）
      if (currentTime - this.lastFreeEnemySpawn > this.freeEnemySpawnInterval) {
        const freeEnemyCount = Math.max(1, Math.floor(this.level / 2))  // 每2级增加一个自由移动敌人
        for (let i = 0; i < freeEnemyCount; i++) {
          this.spawnEnemy(true)
        }
        this.lastFreeEnemySpawn = currentTime
      }

      // 生成导弹（从第3级开始）
      if (this.level >= 3 && currentTime - this.lastMissileSpawn > this.missileSpawnInterval) {
        const missileCount = Math.max(1, Math.floor((this.level - 2) / 2))  // 每2级增加一个导弹
        for (let i = 0; i < missileCount; i++) {
          const targetX = this.player.x  // 瞄准玩家当前位置
          const startX = Math.random() * (this.width - 20) + 10
          const angle = Math.atan2(this.player.y - (-20), targetX - startX)  // 计算初始角度
          
          this.missiles.push({
            x: startX,
            y: -20,
            width: 10,
            height: 20,
            speed: Math.min(5, 2 + this.level * 0.4),  // 降低导弹速度增长
            lastDirectionChange: currentTime,
            directionChangeInterval: 300,  // 更频繁地调整方向
            angle: angle,
            targetX: targetX,  // 记录目标位置
            turnSpeed: 0.03  // 转向速度
          })
        }
        this.lastMissileSpawn = currentTime
      }

      // 更新导弹
      for (let i = this.missiles.length - 1; i >= 0; i--) {
        const missile = this.missiles[i]
        
        if (currentTime - missile.lastDirectionChange > missile.directionChangeInterval) {
          // 计算新的目标角度
          const targetAngle = Math.atan2(this.player.y - missile.y, this.player.x - missile.x)
          
          // 平滑转向
          let angleDiff = targetAngle - missile.angle
          // 确保角度差在 -PI 到 PI 之间
          if (angleDiff > Math.PI) angleDiff -= Math.PI * 2
          if (angleDiff < -Math.PI) angleDiff += Math.PI * 2
          
          // 逐渐调整角度
          missile.angle += Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), missile.turnSpeed)
          missile.lastDirectionChange = currentTime
        }

        // 更新位置
        missile.x += Math.cos(missile.angle) * missile.speed
        missile.y += Math.sin(missile.angle) * missile.speed

        // 移除超出屏幕的导弹
        if (missile.y > this.height + 50 || missile.y < -50 || 
            missile.x > this.width + 50 || missile.x < -50) {
          this.missiles.splice(i, 1)
        }
      }

      // 更新粒子
      this.updateParticles()

      // 更新补血道具
      for (let i = this.healthPacks.length - 1; i >= 0; i--) {
        const powerUp = this.healthPacks[i];
        powerUp.y += powerUp.speed;

        // 检查玩家是否获得补血道具
        if (this.checkCollision(this.player, powerUp)) {
          this.health = Math.min(this.maxHealth, this.health + 30);  // 补充30点血，但不超过最大值
          this.createExplosion(powerUp.x, powerUp.y, 'bullet');  // 创建获得道具的效果
          this.healthPacks.splice(i, 1);
          continue;
        }

        // 移除超出屏幕的道具
        if (powerUp.y > this.height + 20) {
          this.healthPacks.splice(i, 1);
        }
      }

      requestAnimationFrame(this.update)
    },
    drawGame() {
      // 绘制玩家飞船
      this.ctx.save()
      this.ctx.translate(this.player.x, this.player.y)
      
      // 绘制尾焰（持续的小火苗）
      this.ctx.beginPath()
      this.ctx.moveTo(0, 12)  // 火焰起点
      this.ctx.lineTo(-4, 20)  // 左边
      this.ctx.quadraticCurveTo(0, 16, 4, 20)  // 右边，使用二次贝塞尔曲线使火焰更圆滑
      this.ctx.closePath()
      
      // 创建火焰渐变
      const gradient = this.ctx.createLinearGradient(0, 12, 0, 20)
      gradient.addColorStop(0, '#00ffff')  // 蓝色核心
      gradient.addColorStop(1, '#0066ff')  // 淡蓝色边缘
      this.ctx.fillStyle = gradient
      this.ctx.fill()
      
      // 绘制飞船主体（五边形）
      this.ctx.fillStyle = '#4ade80'
      this.ctx.beginPath()
      this.ctx.moveTo(0, -12)  // 顶点
      this.ctx.lineTo(-8, 0)   // 左上
      this.ctx.lineTo(-8, 8)   // 左下
      this.ctx.lineTo(8, 8)    // 右下
      this.ctx.lineTo(8, 0)    // 右上
      this.ctx.closePath()
      this.ctx.fill()
      
      this.ctx.restore()
      
      // 绘制敌人
      this.enemies.forEach(enemy => {
        this.ctx.save()
        this.ctx.translate(enemy.x, enemy.y)
        
        // 绘制敌人尾焰
        this.ctx.beginPath()
        this.ctx.moveTo(0, -12)
        this.ctx.lineTo(-4, -20)
        this.ctx.quadraticCurveTo(0, -16, 4, -20)
        this.ctx.closePath()
        
        const gradient = this.ctx.createLinearGradient(0, -12, 0, -20)
        gradient.addColorStop(0, enemy.isFreeMoving ? '#ffff00' : '#ff6600')  // 核心
        gradient.addColorStop(1, enemy.isFreeMoving ? '#ffeb3b' : '#ff0000')  // 边缘
        this.ctx.fillStyle = gradient
        this.ctx.fill()
        
        // 绘制敌人主体（倒置的五边形）
        this.ctx.fillStyle = enemy.isFreeMoving ? '#ffff00' : '#ff0000'
        this.ctx.beginPath()
        this.ctx.moveTo(0, 12)   // 底部尖点
        this.ctx.lineTo(-8, 0)   // 左下
        this.ctx.lineTo(-8, -8)  // 左上
        this.ctx.lineTo(8, -8)   // 右上
        this.ctx.lineTo(8, 0)    // 右下
        this.ctx.closePath()
        this.ctx.fill()
        
        this.ctx.restore()
      })

      // 绘制导弹
      this.missiles.forEach(missile => {
        this.ctx.save()
        this.ctx.translate(missile.x, missile.y)
        this.ctx.rotate(missile.angle)
        this.ctx.fillStyle = '#f97316'
        this.ctx.beginPath()
        this.ctx.moveTo(10, 0)
        this.ctx.lineTo(-10, -5)
        this.ctx.lineTo(-10, 5)
        this.ctx.closePath()
        this.ctx.fill()
        this.ctx.restore()
      })

      // 绘制补血道具
      this.healthPacks.forEach(pack => {
        this.ctx.save();
        this.ctx.fillStyle = '#ff4081';
        this.ctx.beginPath();
        // 绘制心形道具
        const size = 8;
        this.ctx.moveTo(pack.x, pack.y + size);
        this.ctx.bezierCurveTo(
          pack.x - size, pack.y, 
          pack.x - size, pack.y - size, 
          pack.x, pack.y - size
        );
        this.ctx.bezierCurveTo(
          pack.x + size, pack.y - size, 
          pack.x + size, pack.y, 
          pack.x, pack.y + size
        );
        this.ctx.fill();
        this.ctx.restore();
      });

      // 绘制玩家子弹
      this.ctx.fillStyle = '#50c5ff'
      for (const bullet of this.bullets) {
        // 子弹光效
        const bulletGradient = this.ctx.createRadialGradient(
          bullet.x, bullet.y,
          0, bullet.x, bullet.y,
          8
        )
        bulletGradient.addColorStop(0, 'rgba(80, 197, 255, 0.8)')
        bulletGradient.addColorStop(1, 'rgba(80, 197, 255, 0)')
        this.ctx.fillStyle = bulletGradient
        this.ctx.beginPath()
        this.ctx.arc(bullet.x, bullet.y, 4, 0, Math.PI * 2)
        this.ctx.fill()
      }

      // 绘制敌人子弹
      for (const bullet of this.enemyBullets) {
        // 敌人子弹光效
        const enemyBulletGradient = this.ctx.createRadialGradient(
          bullet.x, bullet.y,
          0, bullet.x, bullet.y,
          6
        )
        enemyBulletGradient.addColorStop(0, 'rgba(255, 255, 0, 0.8)')
        enemyBulletGradient.addColorStop(1, 'rgba(255, 255, 0, 0)')
        this.ctx.fillStyle = enemyBulletGradient
        this.ctx.beginPath()
        this.ctx.arc(bullet.x, bullet.y, 3, 0, Math.PI * 2)
        this.ctx.fill()
      }

      // 绘制粒子
      this.drawParticles()
    },
    checkCollision(obj1, obj2) {
      // 调整碰撞盒的位置，使其更接近实际形状
      const x1 = obj1.x - obj1.width / 3  // 将碰撞盒宽度缩小为原来的2/3
      const y1 = obj1.y - obj1.height / 2
      const x2 = obj2.x - obj2.width / 2
      const y2 = obj2.y - obj2.height / 2

      const w1 = obj1.width * 2/3  // 将碰撞盒宽度缩小为原来的2/3
      const h1 = obj1.height
      const w2 = obj2.width
      const h2 = obj2.height

      // 检查碰撞
      if (x1 + w1 > x2 && x1 < x2 + w2 && y1 + h1 > y2 && y1 < y2 + h2) {
        return true
      }
      return false
    },
    initGame() {
      this.canvas = this.$refs.gameCanvas
      this.ctx = this.canvas.getContext('2d')
      this.canvas.width = this.width
      this.canvas.height = this.height
      
      if (this.isGameRunning) {
        // 重新定位玩家
        this.player.x = this.width / 2 - 25
        this.player.y = this.height - 100
        // 继续游戏循环
        this.gameLoop = requestAnimationFrame(this.update)
      }
    },
    toggleMaximize() {
      this.maximized = !this.maximized
      if (this.maximized) {
        this.width = window.innerWidth
        this.height = window.innerHeight - 48
      } else {
        this.width = 800
        this.height = 600
      }
      this.$nextTick(() => {
        this.canvas.width = this.width
        this.canvas.height = this.height
      })
    },
    spawnEnemy(isFreeMoving = false) {
      const x = Math.random() * (this.width - 40) + 20;
      const y = -30;
      const speed = 2;

      const enemy = {
        x,
        y,
        speed,
        health: 100,
        lastShot: 0,  
        shootDelay: Math.max(500, this.baseEnemyShootDelay - (this.level - 1) * 200),
        width: 16,
        height: 24,
        isFreeMoving,
        angle: Math.random() * Math.PI * 2, 
        changeDirectionTime: Date.now() + Math.random() * 2000 + 1000 
      };

      this.enemies.push(enemy);
    },
    createExplosion(x, y, type) {
      const particleCount = type === 'missile' ? 25 : 
                          type === 'enemy' ? 20 :
                          type === 'bullet' ? 12 : 
                          type === 'player_hit' ? 35 : 15;
      
      const colors = type === 'missile' ? ['#ff0000', '#ff6b6b', '#ff4444', '#ffb199'] :  // 红色系
                    type === 'enemy' ? ['#ffff00', '#ffeb3b', '#fdd835', '#fff176'] :      // 黄色系
                    type === 'bullet' ? ['#00ff00', '#69f0ae', '#00e676', '#b2ff59'] :     // 绿色系
                    type === 'player_hit' ? ['#ff00ff', '#ea80fc', '#e040fb', '#ffffff', '#7c4dff', '#b388ff'] : // 紫色系
                    ['#ff9800', '#ffa726', '#fb8c00', '#ffcc80'];                          // 橙色系

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 / particleCount) * i + (Math.random() - 0.5) * 0.5;
        const speed = type === 'missile' ? 5 + Math.random() * 2 : 
                     type === 'enemy' ? 4 + Math.random() * 2 :
                     type === 'bullet' ? 3 + Math.random() * 1 :
                     type === 'player_hit' ? 6 + Math.random() * 3 : 4;
        
        const baseSize = type === 'missile' ? 3 : 
                        type === 'enemy' ? 2.5 :
                        type === 'bullet' ? 2 :
                        type === 'player_hit' ? 3 : 2;
        
        const particle = {
          x,
          y,
          radius: baseSize + Math.random() * baseSize * 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          velocity: {
            x: Math.cos(angle) * speed * (0.8 + Math.random() * 0.4),
            y: Math.sin(angle) * speed * (0.8 + Math.random() * 0.4)
          },
          alpha: 1,
          life: type === 'missile' ? 45 : 
                type === 'enemy' ? 35 :
                type === 'bullet' ? 25 :
                type === 'player_hit' ? 40 : 30,
          maxLife: type === 'missile' ? 45 : 
                   type === 'enemy' ? 35 :
                   type === 'bullet' ? 25 :
                   type === 'player_hit' ? 40 : 30,
          spin: (Math.random() - 0.5) * 0.3,
          size: 1,
          shape: Math.random() < 0.3 ? 'star' : 'circle',  // 30%概率是星形
          trail: [],  // 存储粒子轨迹
          maxTrailLength: 5,  // 轨迹最大长度
          oscillation: {  // 粒子震荡效果
            amplitude: Math.random() * 2,
            frequency: 0.1 + Math.random() * 0.2,
            offset: Math.random() * Math.PI * 2
          }
        };
        this.particles.push(particle);
      }
    },
    updateParticles() {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const particle = this.particles[i];
        
        // 保存当前位置到轨迹
        particle.trail.push({ x: particle.x, y: particle.y, alpha: particle.alpha });
        if (particle.trail.length > particle.maxTrailLength) {
          particle.trail.shift();
        }
        
        // 更新位置，加入震荡效果
        const oscillationX = Math.cos(particle.life * particle.oscillation.frequency + particle.oscillation.offset) 
                           * particle.oscillation.amplitude;
        const oscillationY = Math.sin(particle.life * particle.oscillation.frequency + particle.oscillation.offset) 
                           * particle.oscillation.amplitude;
        
        particle.x += particle.velocity.x + oscillationX;
        particle.y += particle.velocity.y + oscillationY;
        
        // 添加重力和空气阻力
        particle.velocity.y += 0.15;
        particle.velocity.x *= 0.99;
        particle.velocity.y *= 0.99;
        
        // 更新生命周期
        particle.life--;
        const lifeRatio = particle.life / particle.maxLife;
        particle.alpha = lifeRatio * (0.8 + Math.random() * 0.2);
        
        // 粒子大小随生命周期变化
        if (particle.life < particle.maxLife * 0.3) {
          particle.size = lifeRatio / 0.3;
        }
        
        // 移除死亡的粒子
        if (particle.life <= 0) {
          this.particles.splice(i, 1);
        }
      }
    },
    drawParticles() {
      for (const particle of this.particles) {
        this.ctx.save();
        
        // 绘制轨迹
        particle.trail.forEach((pos, index) => {
          const trailAlpha = (index / particle.trail.length) * pos.alpha * 0.5;
          this.ctx.globalAlpha = trailAlpha;
          
          const gradient = this.ctx.createRadialGradient(
            pos.x, pos.y, 0,
            pos.x, pos.y, particle.radius * particle.size
          );
          gradient.addColorStop(0, particle.color);
          gradient.addColorStop(1, 'rgba(0,0,0,0)');
          this.ctx.fillStyle = gradient;
          
          this.ctx.beginPath();
          this.ctx.arc(pos.x, pos.y, particle.radius * particle.size * 0.5, 0, Math.PI * 2);
          this.ctx.fill();
        });
        
        // 绘制粒子本体
        this.ctx.globalAlpha = particle.alpha;
        this.ctx.translate(particle.x, particle.y);
        this.ctx.rotate(particle.life * particle.spin);
        
        // 创建发光效果
        const gradient = this.ctx.createRadialGradient(
          0, 0, 0,
          0, 0, particle.radius * particle.size * 2
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(0.4, particle.color);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        this.ctx.fillStyle = gradient;
        
        if (particle.shape === 'star') {
          // 绘制星形
          this.ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
            const radius = particle.radius * particle.size;
            const innerRadius = radius * 0.4;
            
            if (i === 0) {
              this.ctx.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
            } else {
              this.ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
            }
            
            const innerAngle = angle + Math.PI / 5;
            this.ctx.lineTo(
              Math.cos(innerAngle) * innerRadius,
              Math.sin(innerAngle) * innerRadius
            );
          }
          this.ctx.closePath();
        } else {
          // 绘制圆形
          this.ctx.beginPath();
          this.ctx.arc(0, 0, particle.radius * particle.size, 0, Math.PI * 2);
        }
        this.ctx.fill();
        
        // 添加内部光晕
        this.ctx.globalAlpha = particle.alpha * 0.5;
        const innerGlow = this.ctx.createRadialGradient(
          0, 0, 0,
          0, 0, particle.radius * particle.size
        );
        innerGlow.addColorStop(0, '#ffffff');
        innerGlow.addColorStop(0.5, 'rgba(255,255,255,0)');
        this.ctx.fillStyle = innerGlow;
        this.ctx.fill();
        
        this.ctx.restore();
      }
    },
  },
  mounted() {
    this.initGame();
    this.$refs.gameContainer.focus();
  },
  
  beforeUnmount() {
    this.stopGame();
  }
}
</script>

<style scoped>
.game-window {
  position: absolute;
  background: rgba(15, 23, 42, 0.95);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(148, 163, 184, 0.1);
  width: 800px;
  user-select: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.game-window.maximized {
  width: 100vw !important;
  height: 100vh !important;
  left: 0 !important;
  top: 0 !important;
  border-radius: 0;
}

.maximized .game-content {
  height: calc(100vh - 48px);
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

.control-btn.maximize {
  background: #28c840;
  border: 1px solid #1aab29;
}

.control-btn.maximize::before {
  content: '+';
  color: #0b4003;
  font-size: 14px;
  line-height: 1;
}

.help-btn {
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

.game-content {
  position: relative;
  height: calc(100% - 32px);
  background: #000;
  overflow: hidden;
}

canvas {
  display: block;
  cursor: none !important; /* 隐藏游戏画布内的鼠标光标 */
}

/* 在标题栏和控制按钮上保持默认光标 */
.title-bar, .control-btn, .help-btn {
  cursor: default;
}

.title-bar {
  cursor: move; /* 在标题栏显示移动光标 */
}

.control-btn:hover, .help-btn:hover {
  cursor: pointer; /* 在按钮上显示指针光标 */
}

.game-overlay {
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

.game-menu {
  text-align: center;
  color: #e2e8f0;
  background: rgba(30, 41, 59, 0.8);
  padding: 40px;
  border-radius: 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(148, 163, 184, 0.1);
  min-width: 400px;
}

.game-menu h2 {
  font-size: 36px;
  margin-bottom: 32px;
  background: linear-gradient(135deg, #4a9eff, #50c5ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.menu-buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 32px;
  width: 100%;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
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

.game-btn.resume {
  background: rgba(168, 85, 247, 0.5);
  border: 1px solid rgba(168, 85, 247, 0.2);
}

.game-btn.resume:hover {
  background: rgba(168, 85, 247, 0.7);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(168, 85, 247, 0.15);
}

.game-btn.new-game {
  background: rgba(59, 130, 246, 0.5);
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.game-btn.new-game:hover {
  background: rgba(59, 130, 246, 0.7);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.game-btn:active {
  transform: translateY(0);
  box-shadow: none;
}

.btn-icon {
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scores {
  display: flex;
  gap: 4px;
  justify-content: center;
  margin-bottom: 16px;
}

.score-box {
  background: rgba(30, 41, 59, 0.5);
  padding: 6px 10px;
  border-radius: 6px;
  text-align: center;
  min-width: 70px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(148, 163, 184, 0.1);
}

.score-label {
  font-size: 11px;
  color: #94a3b8;
  margin-bottom: 2px;
  letter-spacing: 0.5px;
}

.score-value {
  font-size: 20px;
  font-weight: 600;
  color: #e2e8f0;
  line-height: 1.2;
}

.pause-hint {
  background: rgba(30, 41, 59, 0.5);
  padding: 8px 16px;
  border-radius: 8px;
  color: #94a3b8;
  font-size: 14px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(148, 163, 184, 0.1);
}

.health-bar {
  position: absolute;
  bottom: 24px;
  left: 24px;
  width: 180px;
}

.health-label {
  color: #94a3b8;
  font-size: 12px;
  margin-bottom: 4px;
  letter-spacing: 1px;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.health-value {
  color: #e2e8f0;
  font-size: 12px;
  margin-top: 4px;
  text-align: right;
}

.health-bar-container {
  width: 100%;
  height: 12px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid rgba(239, 68, 68, 0.2);
  backdrop-filter: blur(10px);
}

.health-bar-fill {
  height: 100%;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  background: linear-gradient(90deg, #22c55e, #4ade80);
}

.game-content {
  position: relative;
  overflow: hidden;
}

.game-running {
  cursor: none;
}

.game-stats {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 16px;
  z-index: 1;
  pointer-events: none;
}

.top-stats {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.game-overlay {
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

.game-menu {
  text-align: center;
  color: #e2e8f0;
  background: rgba(30, 41, 59, 0.8);
  padding: 40px;
  border-radius: 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(148, 163, 184, 0.1);
  min-width: 400px;
}

.game-menu h2 {
  font-size: 36px;
  margin-bottom: 32px;
  background: linear-gradient(135deg, #4a9eff, #50c5ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.menu-buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 32px;
  width: 100%;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
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

.game-btn.resume {
  background: rgba(168, 85, 247, 0.5);
  border: 1px solid rgba(168, 85, 247, 0.2);
}

.game-btn.resume:hover {
  background: rgba(168, 85, 247, 0.7);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(168, 85, 247, 0.15);
}

.game-btn.new-game {
  background: rgba(59, 130, 246, 0.5);
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.game-btn.new-game:hover {
  background: rgba(59, 130, 246, 0.7);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.game-btn:active {
  transform: translateY(0);
  box-shadow: none;
}

.btn-icon {
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.help-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(8px);
}

.help-content {
  background: rgba(30, 41, 59, 0.9);
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
  padding-left: 20px;
  margin-bottom: 24px;
  color: #94a3b8;
}

.help-content li {
  margin-bottom: 8px;
}

.close-help-btn {
  width: 100%;
  height: 44px;
  background: rgba(59, 130, 246, 0.5);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 8px;
  color: #e2e8f0;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.close-help-btn:hover {
  background: rgba(59, 130, 246, 0.7);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.blurred {
  filter: blur(5px);
}

.game-window.game-running {
  cursor: none !important;
}

.game-window.game-running * {
  cursor: none !important;
}
</style>
