<template>
  <div class="proxy-window" ref="proxyWindow" :style="{ left: position.x + 'px', top: position.y + 'px' }" @click="$emit('click', $event)">
    <div class="title-bar" @mousedown.prevent="startDrag">
      <div class="window-controls">
        <button class="control-btn close" @click="$emit('close')"></button>
        <button class="control-btn minimize" @click="$emit('minimize')"></button>
      </div>
      <span>Web Proxy</span>
      <div class="spacer"></div>
    </div>
    <div class="window-content">
      <iframe
        :src="proxyUrl"
        frameborder="0"
        class="proxy-frame"
      ></iframe>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'ProxyWindow',
  emits: ['close', 'minimize', 'click'],
  setup(props, { emit }) {
    const proxyWindow = ref(null)
    const isDragging = ref(false)
    const position = ref({
      x: window.innerWidth / 2 - 400,
      y: window.innerHeight / 2 - 300
    })
    const dragOffset = ref({ x: 0, y: 0 })
    const proxyUrl = 'https://stratoproxy.stratosphericus.workers.dev'

    const startDrag = (event) => {
      isDragging.value = true
      dragOffset.value = {
        x: event.clientX - position.value.x,
        y: event.clientY - position.value.y
      }
      window.addEventListener('mousemove', handleDrag)
      window.addEventListener('mouseup', stopDrag)
    }

    const handleDrag = (event) => {
      if (isDragging.value) {
        position.value = {
          x: event.clientX - dragOffset.value.x,
          y: event.clientY - dragOffset.value.y
        }
      }
    }

    const stopDrag = () => {
      isDragging.value = false
      window.removeEventListener('mousemove', handleDrag)
      window.removeEventListener('mouseup', stopDrag)
    }

    onUnmounted(() => {
      window.removeEventListener('mousemove', handleDrag)
      window.removeEventListener('mouseup', stopDrag)
    })

    return {
      proxyWindow,
      startDrag,
      position,
      proxyUrl
    }
  }
}
</script>

<style scoped>
.proxy-window {
  position: fixed;
  background: rgba(15, 23, 42, 0.95);
  border-radius: 12px;
  width: 800px;
  height: 600px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(148, 163, 184, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.title-bar {
  background: rgba(30, 41, 59, 0.5);
  padding: 12px;
  display: flex;
  align-items: center;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
  user-select: none;
}

.title-bar span {
  color: #e2e8f0;
  font-size: 16px;
  font-weight: 500;
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
  cursor: pointer;
  position: relative;
}

.control-btn::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.1s;
}

.close::before {
  content: '×';
}

.minimize::before {
  content: '-';
}

.control-btn:hover::before {
  opacity: 1;
}

.control-btn.close {
  background: #ff5f56;
}

.control-btn.minimize {
  background: #ffbd2e;
}

.control-btn:hover {
  filter: brightness(0.9);
}

.spacer {
  flex-grow: 1;
}

.window-content {
  flex-grow: 1;
  position: relative;
  overflow: hidden;
}

.proxy-frame {
  width: 100%;
  height: 100%;
  border: none;
  background: white;
}
</style>
