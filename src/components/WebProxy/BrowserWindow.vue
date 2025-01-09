<template>
  <div 
    class="web-proxy"
    ref="proxyContainer"
    @mousemove="handleMouseMove"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseLeave"
    @click="$emit('click', $event)"
  >
    <div 
      class="game-window" 
      ref="proxyWindow"
      :class="{ maximized }"
      :style="maximized ? {} : { left: position.x + 'px', top: position.y + 'px' }"
      style="z-index: 9999"
    >
      <div class="title-bar" @mousedown.prevent="startDrag">
        <div class="window-controls">
          <button class="control-btn close" @click="$emit('close')"></button>
          <button class="control-btn minimize" @click="$emit('minimize')"></button>
        </div>
        <div class="url-bar" @mousedown.stop>
          <input 
            type="text" 
            v-model="currentUrl" 
            @keyup.enter="navigateToUrl"
            placeholder="Enter URL..."
          >
          <button class="go-btn" @click="navigateToUrl">Go</button>
        </div>
        <div class="spacer"></div>
      </div>
      <div class="proxy-content" :class="{ maximized }">
        <iframe
          ref="proxyFrame"
          :src="currentUrl"
          @load="handleIframeLoad"
          style="width: 100%; height: 100%; border: none;"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BrowserWindow',
  props: {
    initialPosition: {
      type: Object,
      default: () => ({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      })
    },
    initialUrl: {
      type: String,
      default: 'https://www.google.com'
    }
  },
  data() {
    return {
      position: this.initialPosition,
      isDragging: false,
      dragOffset: { x: 0, y: 0 },
      maximized: false,
      currentUrl: this.initialUrl
    }
  },
  methods: {
    navigateToUrl() {
      let url = this.currentUrl
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url
      }
      this.currentUrl = url
    },
    startDrag(event) {
      if (this.maximized) return
      this.isDragging = true
      const rect = this.$refs.proxyWindow.getBoundingClientRect()
      this.dragOffset = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      }
      
      this.$refs.proxyWindow.style.transition = 'none'
      this.$refs.proxyWindow.style.willChange = 'transform'
      document.body.style.userSelect = 'none'
      document.body.style.cursor = 'move'
      
      document.addEventListener('mousemove', this.onDrag)
      document.addEventListener('mouseup', this.stopDrag)
    },
    onDrag(event) {
      if (!this.isDragging) return
      
      const newX = event.clientX - this.dragOffset.x
      const newY = event.clientY - this.dragOffset.y
      
      const maxX = window.innerWidth - this.$refs.proxyWindow.offsetWidth
      const maxY = window.innerHeight - this.$refs.proxyWindow.offsetHeight
      
      this.position = {
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      }
    },
    stopDrag() {
      this.isDragging = false
      document.removeEventListener('mousemove', this.onDrag)
      document.removeEventListener('mouseup', this.stopDrag)
      
      this.$refs.proxyWindow.style.transition = ''
      this.$refs.proxyWindow.style.willChange = ''
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    },
    handleMouseMove(event) {
      if (this.isDragging) {
        event.preventDefault()
      }
    },
    handleMouseDown(event) {
      if (this.isDragging) {
        event.preventDefault()
      }
    },
    handleMouseUp(event) {
      if (this.isDragging) {
        event.preventDefault()
      }
    },
    handleMouseLeave(event) {
      if (this.isDragging) {
        event.preventDefault()
      }
    },
    handleIframeLoad() {
      try {
        const iframe = this.$refs.proxyFrame
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.open = (url) => {
            this.currentUrl = url
            return null
          }
        }
      } catch (error) {
        console.warn('Failed to setup iframe handlers:', error)
      }
    }
  },
  mounted() {
    window.addEventListener('resize', this.updateScale)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateScale)
  }
}
</script>

<style scoped>
.web-proxy {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
}

.game-window {
  position: absolute;
  background: rgba(15, 23, 42, 0.95);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(148, 163, 184, 0.1);
  width: 960px;
  height: 600px;
  user-select: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  pointer-events: auto;
}

.game-window.maximized {
  width: 100vw !important;
  height: 100vh !important;
  left: 0 !important;
  top: 0 !important;
  border-radius: 0;
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
  height: 48px;
  box-sizing: border-box;
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

.url-bar {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 16px;
}

.url-bar input {
  flex: 1;
  height: 28px;
  padding: 0 12px;
  border-radius: 6px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(15, 23, 42, 0.6);
  color: #e2e8f0;
  font-size: 13px;
  outline: none;
  transition: all 0.2s;
}

.url-bar input:focus {
  border-color: rgba(148, 163, 184, 0.4);
  background: rgba(15, 23, 42, 0.8);
}

.go-btn {
  padding: 0 12px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(51, 65, 85, 0.6);
  color: #e2e8f0;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.go-btn:hover {
  background: rgba(51, 65, 85, 0.8);
  border-color: rgba(148, 163, 184, 0.4);
}

.proxy-content {
  width: 100%;
  height: calc(100% - 48px);
  overflow: hidden;
  background: #fff;
}

.proxy-content iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.maximized .proxy-content {
  height: calc(100vh - 48px);
}

.spacer {
  width: 48px;
  flex-shrink: 0;
}
</style> 