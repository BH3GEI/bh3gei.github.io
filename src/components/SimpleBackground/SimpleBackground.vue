<template>
  <div class="simple-background">
    <canvas ref="canvas" class="simple-canvas"></canvas>
    <TimeDisplay v-if="backgroundMode === 'simple'" />
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import TimeDisplay from './TimeDisplay.vue'

export default {
  name: 'SimpleBackground',
  components: {
    TimeDisplay
  },
  props: {
    backgroundMode: {
      type: String,
      required: true
    }
  },
  setup() {
    const canvas = ref(null)
    let ctx = null
    let animationFrameId = null
    let particles = []

    class Particle {
      constructor() {
        this.reset()
      }

      reset() {
        this.x = Math.random() * window.innerWidth
        this.y = Math.random() * window.innerHeight
        this.size = Math.random() * 2 + 1
        this.speedX = Math.random() * 0.2 - 0.1
        this.speedY = Math.random() * 0.2 - 0.1
        this.opacity = Math.random() * 0.5 + 0.2
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x < 0 || this.x > window.innerWidth) this.speedX *= -1
        if (this.y < 0 || this.y > window.innerHeight) this.speedY *= -1

        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`
        ctx.fill()
      }
    }

    const initParticles = () => {
      particles = Array(30).fill().map(() => new Particle())
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(17, 24, 39, 0.1)'
      ctx.fillRect(0, 0, canvas.value.width, canvas.value.height)
      
      particles.forEach(particle => particle.update())
      
      animationFrameId = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      if (!canvas.value) return
      canvas.value.width = window.innerWidth
      canvas.value.height = window.innerHeight
      
      // 重新创建渐变背景
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.value.height)
      gradient.addColorStop(0, '#111827')
      gradient.addColorStop(1, '#1f2937')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.value.width, canvas.value.height)
      
      initParticles()
    }

    onMounted(() => {
      ctx = canvas.value.getContext('2d')
      handleResize()
      window.addEventListener('resize', handleResize)
      animate()
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize)
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    })

    return {
      canvas
    }
  }
}
</script>

<style scoped>
.simple-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
}

.simple-canvas {
  width: 100%;
  height: 100%;
}
</style> 