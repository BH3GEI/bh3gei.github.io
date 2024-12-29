<template>
  <div class="blog-window" :class="{ 'minimized': isMinimized, 'maximized': isMaximized }" :style="windowStyle">
    <div class="window-header" @mousedown="startDrag">
      <div class="traffic-lights">
        <button class="close" @click.stop="$emit('close')"></button>
        <button class="minimize" @click.stop="$emit('minimize')"></button>
        <button class="maximize" @click.stop="toggleMaximize"></button>
      </div>
      <div class="title">Blog</div>
    </div>
    <div class="window-content">
      <div class="iframe-overlay" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave"></div>
      <BlogContent />
    </div>
  </div>
</template>

<script>
import BlogContent from './BlogContent.vue'

export default {
  name: 'BlogWindow',
  components: {
    BlogContent
  },
  props: {
    isMinimized: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const windowWidth = 800; // 设置窗口宽度
    const windowHeight = window.innerHeight * 0.75; // 设置窗口高度为屏幕高度的 3/4
    return {
      isDragging: false,
      initialX: 0,
      initialY: 0,
      currentX: window.innerWidth / 2 - windowWidth / 2,  
      currentY: window.innerHeight / 2 - windowHeight / 2,  
      isMaximized: false,
      preMaximizeState: null,
      windowWidth,
      windowHeight
    }
  },
  computed: {
    windowStyle() {
      if (this.isMaximized) {
        return {
          transform: 'none',
          top: '0',
          left: '0',
          width: '100vw',
          height: '100vh'
        }
      }
      return {
        left: `${this.currentX}px`,
        top: `${this.currentY}px`,
        width: `${this.windowWidth}px`,
        height: `${this.windowHeight}px`
      }
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
        
        requestAnimationFrame(() => {
          this.currentX = event.clientX - this.initialX
          this.currentY = event.clientY - this.initialY
        })
      }
    },
    stopDrag() {
      this.isDragging = false
      document.removeEventListener('mousemove', this.drag)
      document.removeEventListener('mouseup', this.stopDrag)
    },
    toggleMaximize() {
      if (!this.isMaximized) {
        this.preMaximizeState = {
          x: this.currentX,
          y: this.currentY
        }
      } else {
        this.currentX = this.preMaximizeState.x
        this.currentY = this.preMaximizeState.y
      }
      this.isMaximized = !this.isMaximized
    }
  }
}
</script>

<style scoped>
.blog-window {
  position: fixed;
  width: 800px;
  height: 600px;
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease;
  z-index: 1000;
  transform: translate3d(0, 0, 0);
  will-change: transform;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.blog-window.maximized {
  border-radius: 0;
  transform: none !important;
}

.window-header {
  display: flex;
  align-items: center;
  padding: 12px;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  -webkit-app-region: drag;
  user-select: none;
  position: relative;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.traffic-lights {
  display: flex;
  gap: 8px;
  margin-right: 16px;
  -webkit-app-region: no-drag;
}

.traffic-lights button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  padding: 0;
  margin: 0;
  position: relative;
  cursor: pointer;
}

.traffic-lights button::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.1s;
}

.traffic-lights .close::before { content: '×'; }
.traffic-lights .minimize::before { content: '−'; }
.traffic-lights .maximize::before { content: '+'; }

.traffic-lights button:hover::before {
  opacity: 1;
}

.close {
  background: #ff5f57;
}

.minimize {
  background: #ffbd2e;
}

.maximize {
  background: #28c940;
}

.title {
  flex: 1;
  text-align: center;
  color: #e2e8f0;
  font-size: 14px;
  margin-right: 70px;
}

.spacer {
  width: 70px;
}

.window-content {
  flex: 1;
  overflow: auto;
  position: relative;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

.iframe-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
}

.window-content:hover .iframe-overlay {
  pointer-events: none;
}

.blog-window.minimized {
  transform: translate(0, 150%);
  opacity: 0;
  pointer-events: none;
}
</style>
