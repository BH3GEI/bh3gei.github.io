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
        <div class="title" ref="titleElement">Web Proxy</div>
        <div class="spacer"></div>
      </div>
      <div class="proxy-content" :class="{ maximized }">
        <iframe
          ref="proxyFrame"
          src="https://https://stratoproxy.stratosphericus.workers.dev/"
          @load="handleIframeLoad"
          :style="{
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            width: '100%',
            height: '100%',
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) scale(${scale})`
          }"
          style="pointer-events: auto !important;"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StratoProxyWindow',
  props: {
    initialPosition: {
      type: Object,
      default: () => ({
        x: window.innerWidth / 2 - 300,
        y: window.innerHeight / 2 - 300
      })
    }
  },
  data() {
    return {
      position: this.initialPosition,
      isDragging: false,
      dragOffset: { x: 0, y: 0 },
      scale: 0.7,
      maximized: false,
      baseWidth: 360,
      baseHeight: 480
    }
  },
  methods: {
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
      this.$refs.proxyWindow.style.transition = ''
      this.$refs.proxyWindow.style.willChange = ''
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
      
      document.removeEventListener('mousemove', this.onDrag)
      document.removeEventListener('mouseup', this.stopDrag)
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
    handleMouseLeave() {
      if (this.isDragging) {
        this.stopDrag()
      }
    },
    updateScale() {
      if (this.maximized) {
        const scaleX = window.innerWidth / this.baseWidth
        const scaleY = (window.innerHeight - 48) / this.baseHeight
        this.scale = Math.min(scaleX, scaleY) * 0.7
      } else {
        const scaleX = this.$refs.proxyWindow.offsetWidth / this.baseWidth
        const scaleY = (this.$refs.proxyWindow.offsetHeight - 48) / this.baseHeight
        this.scale = Math.min(scaleX, scaleY) * 0.7
      }
    },
    handleIframeLoad() {
      try {
        const iframe = this.$refs.proxyFrame
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.open = (url) => {
            iframe.src = url
            return null
          }
        }
      } catch (error) {
        console.warn('Failed to setup iframe handlers:', error)
      }
    },
    updateTitlePosition() {
      this.$nextTick(() => {
        const titleElement = this.$refs.titleElement
        const windowElement = this.$refs.proxyWindow
        if (titleElement && windowElement) {
          const controlsWidth = 70
          titleElement.style.marginRight = `${controlsWidth}px`
        }
      })
    }
  },
  mounted() {
    this.updateScale()
    this.updateTitlePosition()
    window.addEventListener('resize', () => {
      this.updateScale()
      this.updateTitlePosition()
    })
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateScale)
  },
  watch: {
    maximized() {
      this.$nextTick(() => {
        this.updateTitlePosition()
      })
    }
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
  width: 800px;
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

.proxy-content {
  width: 100%;
  height: calc(100% - 48px);
  overflow: hidden;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.proxy-content iframe {
  width: 100%;
  height: 100%;
  border: none;
  position: absolute;
  transform-origin: center center;
}

.maximized .proxy-content {
  height: calc(100vh - 48px);
}

.title {
  flex: 1;
  text-align: center;
  color: #e2e8f0;
  font-size: 14px;
  margin-right: 70px;
  transform: translateX(35px);
}

.spacer {
  width: 70px;
  flex-shrink: 0;
}
</style> 