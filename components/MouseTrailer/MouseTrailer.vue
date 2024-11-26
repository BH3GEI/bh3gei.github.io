<template>
  <div 
    v-if="isVisible"
    class="mouse-trailer"
    :class="{ 'in-gravity': gravityForce.inRange }"
    :style="{
      transform: `translate(${trailX}px, ${trailY}px)`,
    }"
  >
    🛸
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineExpose } from 'vue'

const isVisible = ref(false)
const mouseX = ref(0)
const mouseY = ref(0)
const trailX = ref(0)
const trailY = ref(0)
const gravityForce = ref({ x: 0, y: 0, inRange: false })

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

defineExpose({
  handleGravity
})

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseleave', handleMouseLeave)
  updatePosition()
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseleave', handleMouseLeave)
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<style scoped>
.mouse-trailer {
  position: fixed;
  top: -12px;
  left: -12px;
  z-index: 10000;
  font-size: 24px;
  pointer-events: none;
  will-change: transform;
  filter: drop-shadow(0 0 10px rgba(96, 165, 250, 0.5));
  animation: float 3s ease-in-out infinite;
  transition: filter 0.3s ease;
}

.mouse-trailer.in-gravity {
  filter: drop-shadow(0 0 15px rgba(147, 197, 253, 0.8));
  animation: none;
}

@keyframes float {
  0% {
    filter: drop-shadow(0 0 10px rgba(96, 165, 250, 0.5));
  }
  50% {
    filter: drop-shadow(0 0 15px rgba(147, 197, 253, 0.7));
  }
  100% {
    filter: drop-shadow(0 0 10px rgba(96, 165, 250, 0.5));
  }
}

:deep(.dark-mode) .mouse-trailer {
  filter: drop-shadow(0 0 10px rgba(30, 58, 138, 0.5));
  animation: floatDark 3s ease-in-out infinite;
}

:deep(.dark-mode) .mouse-trailer.in-gravity {
  filter: drop-shadow(0 0 15px rgba(59, 130, 246, 0.8));
  animation: none;
}

@keyframes floatDark {
  0% {
    filter: drop-shadow(0 0 10px rgba(30, 58, 138, 0.5));
  }
  50% {
    filter: drop-shadow(0 0 15px rgba(59, 130, 246, 0.7));
  }
  100% {
    filter: drop-shadow(0 0 10px rgba(30, 58, 138, 0.5));
  }
}
</style>
