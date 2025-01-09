<template>
  <div class="starry-container" @wheel.prevent="handleWheel">
    <canvas ref="canvas" class="starry-background"></canvas>
    <div class="warp-display" :class="{ 'show-tooltip': showTooltip }">
      <div class="warp-text">WARP {{ warpLevel }}</div>
      <div class="tooltip">Use mouse wheel to adjust warp speed</div>
    </div>
    <div class="stardate-display">
      <div class="stardate-text">STARDATE {{ stardate }}</div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue'

export default {
  name: 'StarryBackground',
  setup() {
    const canvas = ref(null)
    let ctx = null
    let stars = []
    let animationFrameId = null
    const warpLevel = ref(2)
    const baseSpeed = 1
    const currentSpeed = computed(() => baseSpeed * warpLevel.value)
    const showTooltip = ref(true)
    const stardate = ref('')

    class Star {
      constructor() {
        this.reset()
      }

      reset() {
        this.x = Math.random() * window.innerWidth
        this.y = Math.random() * window.innerHeight
        this.z = Math.random() * 2000 + 500
        this.originX = this.x
        this.originY = this.y
        this.radius = Math.random() * 1.5 + 0.5
        const r = 255
        const g = Math.floor(Math.random() * 50 + 205)
        const b = Math.floor(Math.random() * 50 + 205)
        const a = (Math.random() * 0.6 + 0.4).toFixed(2)
        this.color = `rgba(${r}, ${g}, ${b}, ${a})`
        this.speed = (Math.random() * 2 + 1) * currentSpeed.value
        this.trail = []
        this.trailLength = Math.floor(Math.random() * 3) + 2
        this.orbitRadius = Math.random() * 100 + 50
        this.orbitAngle = Math.random() * Math.PI * 2
        this.orbitSpeed = (Math.random() * 0.02 + 0.01) * currentSpeed.value
      }

      update() {
        this.updateWarpMode()
      }

      updateWarpMode() {
        // 保存之前的位置用于绘制星迹
        if (this.trail.length >= this.trailLength) {
          this.trail.shift()
        }
        this.trail.push({ x: this.x, y: this.y, z: this.z })

        // 星星向中心移动的效果
        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight / 2
        const angle = Math.atan2(this.y - centerY, this.x - centerX)
        const distance = Math.sqrt(Math.pow(this.x - centerX, 2) + Math.pow(this.y - centerY, 2))
        
        this.z -= this.speed * 3
        this.x += Math.cos(angle) * (distance * 0.001) * this.speed
        this.y += Math.sin(angle) * (distance * 0.001) * this.speed

        if (this.z <= 0) {
          this.reset()
        }

        const scale = 2000 / (2000 + this.z)
        const twinkle = Math.random() * 0.3 + 0.7
        
        // 绘制星迹
        if (this.trail.length > 1) {
          ctx.beginPath()
          ctx.moveTo(this.trail[0].x, this.trail[0].y)
          for (let i = 1; i < this.trail.length; i++) {
            ctx.lineTo(this.trail[i].x, this.trail[i].y)
          }
          const trailColor = this.color.replace(/[\d.]+\)$/, '0.15)')
          ctx.strokeStyle = trailColor
          ctx.lineWidth = this.radius * scale * 0.5
          ctx.stroke()
        }

        // 绘制星星
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius * scale * twinkle, 0, 2 * Math.PI)
        ctx.fillStyle = this.color
        ctx.fill()

        // 增强的光晕效果
        const glow = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius * scale * 4
        )
        const glowColor1 = this.color.replace(/[\d.]+\)$/, '0.4)')
        const glowColor2 = this.color.replace(/[\d.]+\)$/, '0.1)')
        glow.addColorStop(0, glowColor1)
        glow.addColorStop(0.5, glowColor2)
        glow.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.fillStyle = glow
        ctx.fill()
      }
    }

    const initStars = () => {
      stars = Array(400).fill().map(() => new Star())
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 5, 16, 0.3)'
      ctx.fillRect(0, 0, canvas.value.width, canvas.value.height)
      
      stars.forEach(star => star.update())
      
      animationFrameId = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      canvas.value.width = window.innerWidth
      canvas.value.height = window.innerHeight
      initStars()
    }

    const handleWheel = (e) => {
      e.preventDefault()
      const delta = e.deltaY > 0 ? -0.1 : 0.1
      warpLevel.value = Number((Math.max(0.1, Math.min(9.9, warpLevel.value + delta))).toFixed(2))
      setTimeout(() => {
        showTooltip.value = false
      }, 3000)
    }

    const calculateStardate = () => {
      const now = new Date()
      const year = now.getFullYear()
      const yearStart = new Date(year, 0, 1)
      const secondsInYear = (now - yearStart) / 1000
      const totalSecondsInYear = 365.25 * 24 * 60 * 60
      const yearFraction = secondsInYear / totalSecondsInYear
      const baseYear = 2318
      const stardateBase = (year - baseYear) * 1000
      const stardateDecimal = yearFraction * 1000
      stardate.value = (stardateBase + stardateDecimal).toFixed(4)
    }

    onMounted(() => {
      ctx = canvas.value.getContext('2d')
      handleResize()
      window.addEventListener('resize', handleResize)

      // 设置背景渐变
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.value.height)
      gradient.addColorStop(0, '#000510')
      gradient.addColorStop(1, '#001030')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.value.width, canvas.value.height)
      animate()
      calculateStardate()
      setInterval(calculateStardate, 1000)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    })

    return {
      canvas,
      warpLevel,
      showTooltip,
      handleWheel,
      stardate
    }
  }
}
</script>

<style scoped>
.starry-container {
  position: relative;
  width: 100vw;
  height: 100vh;
}

.starry-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  pointer-events: none;
}

canvas {
  width: 100%;
  height: 100%;
  background: var(--bg-primary);
}

.warp-display {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg-secondary);
  padding: 6px 16px;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
}

.warp-text {
  color: var(--text-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 2px;
}

.tooltip {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -30px;
  white-space: nowrap;
  color: var(--text-secondary);
  font-size: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.show-tooltip .tooltip {
  opacity: 1;
}

.stardate-display {
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: var(--bg-secondary);
  padding: 6px 16px;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
}

.stardate-text {
  color: var(--text-primary);
  font-family: 'JetBrains Mono', monospace;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 1px;
  text-transform: uppercase;
}
</style>
