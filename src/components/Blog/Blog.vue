<template>
  <div class="blog-window" :class="{ 'minimized': isMinimized }">
    <div class="window-header" @mousedown="startDrag">
      <div class="title">Blog</div>
      <div class="controls">
        <button class="minimize" @click="$emit('minimize')">-</button>
        <button class="close" @click="$emit('close')">×</button>
      </div>
    </div>
    <div class="window-content">
      <div class="iframe-overlay" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave"></div>
      <iframe src="https://blog.stratosphericus.workers.dev/" frameborder="0"></iframe>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BlogWindow',
  props: {
    isMinimized: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isDragging: false,
      initialX: 0,
      initialY: 0,
      currentX: 100,
      currentY: 100
    }
  },
  methods: {
    handleMouseMove(event) {
      const newEvent = new MouseEvent('mousemove', {
        clientX: event.clientX,
        clientY: event.clientY,
        bubbles: true
      });
      window.dispatchEvent(newEvent);
    },
    handleMouseLeave() {
      const newEvent = new MouseEvent('mouseleave', {
        bubbles: true
      });
      window.dispatchEvent(newEvent);
    },
    startDrag(event) {
      if (event.target.closest('.controls')) return
      
      this.isDragging = true
      this.initialX = event.clientX - this.currentX
      this.initialY = event.clientY - this.currentY
      
      document.addEventListener('mousemove', this.drag)
      document.addEventListener('mouseup', this.stopDrag)
    },
    drag(event) {
      if (this.isDragging) {
        event.preventDefault()
        this.currentX = event.clientX - this.initialX
        this.currentY = event.clientY - this.initialY
        
        const element = event.target.closest('.blog-window')
        if (element) {
          element.style.transform = `translate(${this.currentX}px, ${this.currentY}px)`
        }
      }
    },
    stopDrag() {
      this.isDragging = false
      document.removeEventListener('mousemove', this.drag)
      document.removeEventListener('mouseup', this.stopDrag)
    }
  }
}
</script>

<style scoped>
.blog-window {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80vw;
  height: 80vh;
  background: var(--window-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease;
}

.window-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: var(--header-bg);
  cursor: move;
  user-select: none;
}

.title {
  font-weight: 500;
  color: var(--text-color);
}

.controls {
  display: flex;
  gap: 8px;
}

.controls button {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
}

.minimize {
  background: #ffbd2e;
}

.close {
  background: #ff5f57;
}

.window-content {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.iframe-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
}

iframe {
  width: 100%;
  height: 100%;
  border: none;
  position: relative;
  z-index: 1;
  pointer-events: auto;
}

.window-content:hover .iframe-overlay {
  pointer-events: none;
}

.blog-window.minimized {
  transform: translate(-50%, 150%);
  opacity: 0;
  pointer-events: none;
}
</style>
