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
        <span style="flex: 1; text-align: center;">Web Proxy</span>
        <div class="controls"></div>
      </div>
      <div class="proxy-content" :class="{ maximized }">
        <iframe
          ref="proxyFrame"
          :src="proxyUrl"
          @load="handleIframeLoad"
          :style="{
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
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
  name: 'WebProxyWindow',
  props: {
    proxyUrl: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      position: {
        x: window.innerWidth / 2 - 400,
        y: window.innerHeight / 2 - 300
      },
      isDragging: false,
      dragOffset: { x: 0, y: 0 },
      scale: 1,
      maximized: false,
      baseWidth: 800,
      baseHeight: 600
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
      document.addEventListener('mousemove', this.onDrag)
      document.addEventListener('mouseup', this.stopDrag)
    },
    onDrag(event) {
      if (!this.isDragging) return
      
      const newX = event.clientX - this.dragOffset.x
      const newY = event.clientY - this.dragOffset.y
      
      // 限制窗口不会完全移出视口
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
    },
    handleMouseMove(event) {
      if (this.isDragging) {
        this.onDrag(event)
      }
    },
    handleMouseDown(event) {
      if (event.target === this.$refs.proxyWindow) {
        this.startDrag(event)
      }
    },
    handleMouseUp() {
      this.stopDrag()
    },
    handleMouseLeave() {
      this.stopDrag()
    },
    updateScale() {
      if (this.maximized) {
        const containerWidth = window.innerWidth
        const containerHeight = window.innerHeight - 48 // 减去标题栏高度
        this.scale = Math.min(
          containerWidth / 1024,
          containerHeight / 768
        )
      } else {
        const containerWidth = this.baseWidth
        const containerHeight = this.baseHeight
        this.scale = Math.min(
          containerWidth / 1024,
          containerHeight / 768
        )
      }
    },
    toggleMaximize() {
      this.maximized = !this.maximized
      this.$nextTick(() => {
        this.updateScale()
      })
    },
    handleIframeLoad() {
      try {
        const iframe = this.$refs.proxyFrame;
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && e.target.target === '_blank') {
              e.preventDefault();
              iframe.src = e.target.href;
            }
          }, true);

          // 重写window.open
          iframe.contentWindow.open = (url) => {
            iframe.src = url;
            return null;
          };
        }
      } catch (error) {
        console.warn('Failed to setup iframe handlers:', error);
      }
    }
  },
  mounted() {
    this.updateScale()
    window.addEventListener('resize', this.updateScale)
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.warn('AdSense initialization error:', error)
    }
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
}

.proxy-content iframe {
  width: 1024px;
  height: 768px;
  border: none;
}

.maximized .proxy-content {
  height: calc(100vh - 48px);
}
</style>
