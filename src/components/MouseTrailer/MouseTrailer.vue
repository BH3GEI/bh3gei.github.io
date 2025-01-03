<template>
  <div 
    v-if="isVisible"
    class="mouse-trailer-container"
    :style="{
      transform: `translate(${trailX}px, ${trailY}px)`,
      opacity: isOverIframe ? 0 : 1
    }"
  >
    <div class="cursor-wrapper">
      <div class="click-dot"></div>
      <div class="click-ring"></div>
    </div>
    <div class="spaceship-wrapper">
      <div class="spaceship" :class="{ 'in-gravity': gravityForce.inRange }">🛸</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineExpose } from 'vue'
import { isMobileDevice } from '@/utils/deviceDetection'

const isVisible = ref(false)
const mouseX = ref(0)
const mouseY = ref(0)
const trailX = ref(0)
const trailY = ref(0)
const gravityForce = ref({ x: 0, y: 0, inRange: false })
const isOverIframe = ref(false)
const isMobile = ref(false)

let animationFrameId = null
const speed = 0.35
const gravityResistance = 0.92 // 

const updatePosition = () => {
  const dx = mouseX.value - trailX.value
  const dy = mouseY.value - trailY.value
  
  // 
  if (gravityForce.value.inRange) {
    trailX.value += (dx * speed + gravityForce.value.x) * gravityResistance
    trailY.value += (dy * speed + gravityForce.value.y) * gravityResistance
  } else {
    trailX.value += dx * speed
    trailY.value += dy * speed
  }
  
  animationFrameId = requestAnimationFrame(updatePosition)
}

const handleMouseMove = (e) => {
  if (!isVisible.value) {
    isVisible.value = true
    trailX.value = e.clientX
    trailY.value = e.clientY
  }
  mouseX.value = e.clientX
  mouseY.value = e.clientY
}

const handleMouseLeave = () => {
  isVisible.value = false
}

const handleGravity = (force) => {
  gravityForce.value = force
}

const checkIfOverIframe = (e) => {
  const element = document.elementFromPoint(e.clientX, e.clientY);
  isOverIframe.value = element && element.tagName === 'IFRAME';
};

defineExpose({
  handleGravity
})

onMounted(() => {
  isMobile.value = isMobileDevice()
  if (!isMobile.value) {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousemove', checkIfOverIframe)
    window.addEventListener('mouseleave', handleMouseLeave)
    updatePosition()
  }
})

onUnmounted(() => {
  if (!isMobile.value) {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mousemove', checkIfOverIframe)
    window.removeEventListener('mouseleave', handleMouseLeave)
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
  }
})
</script>

<style scoped>
.mouse-trailer-container {
  position: fixed;
  top: -12px;
  left: -12px;
  z-index: 10000;
  pointer-events: none !important;
  will-change: transform;
  mix-blend-mode: difference;
}

.cursor-wrapper {
  position: relative;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.click-dot {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: none;
}

.click-ring {
  position: absolute;
  width: 16px;
  height: 16px;
  border: 1.5px solid #ffffff;
  border-radius: 50%;
  animation: breathe 2s ease-in-out infinite;
}

.spaceship-wrapper {
  mix-blend-mode: normal;
  position: absolute;
  bottom: -20px;
  right: -20px;
}

.spaceship {
  font-size: 20px;
  filter: drop-shadow(0 0 10px rgba(96, 165, 250, 0.5));
  animation: float 3s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% {
    transform: scale(1);
    opacity: 0.4;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}

@keyframes float {
  0%, 100% {
    filter: drop-shadow(0 0 10px rgba(96, 165, 250, 0.5));
    transform: translateY(0);
  }
  50% {
    filter: drop-shadow(0 0 15px rgba(147, 197, 253, 0.7));
    transform: translateY(-2px);
  }
}

.spaceship.in-gravity {
  filter: drop-shadow(0 0 15px rgba(147, 197, 253, 0.8));
  animation: none;
}

:deep(.dark-mode) .spaceship {
  filter: drop-shadow(0 0 10px rgba(30, 58, 138, 0.5));
  animation: floatDark 3s ease-in-out infinite;
}

:deep(.dark-mode) .spaceship.in-gravity {
  filter: drop-shadow(0 0 15px rgba(59, 130, 246, 0.8));
  animation: none;
}

@keyframes floatDark {
  0%, 100% {
    filter: drop-shadow(0 0 10px rgba(30, 58, 138, 0.5));
    transform: translateY(0);
  }
  50% {
    filter: drop-shadow(0 0 15px rgba(59, 130, 246, 0.7));
    transform: translateY(-2px);
  }
}
</style>
