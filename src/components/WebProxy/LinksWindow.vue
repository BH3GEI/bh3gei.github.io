<template>
  <div 
    class="links-window"
    ref="windowContainer"
    :style="maximized ? {} : { left: position.x + 'px', top: position.y + 'px' }"
  >
    <div class="title-bar" @mousedown.prevent="startDrag">
      <div class="window-controls">
        <button class="control-btn close" @click="$emit('close')"></button>
        <button class="control-btn minimize" @click="$emit('minimize')"></button>
      </div>
      <div class="title">All Links</div>
      <div class="spacer"></div>
    </div>
    <div class="links-content" :class="{ maximized }">
      <div v-if="loading" class="loading">
        Loading links...
      </div>
      <div v-else-if="error" class="error">
        {{ error }}
      </div>
      <div v-else class="links-grid">
        <a 
          v-for="(link, index) in links" 
          :key="index"
          :href="link.url"
          target="_blank"
          class="link-item"
        >
          <span class="link-emoji">{{ link.emoji }}</span>
          <span class="link-text">{{ link.text }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LinksWindow',
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
      maximized: false,
      links: [],
      loading: true,
      error: null
    }
  },
  methods: {
    async fetchLinks() {
      try {
        const response = await fetch('https://raw.githubusercontent.com/BH3GEI/Resume/main/all_links.md')
        const text = await response.text()
        console.log('Raw markdown:', text)
        this.links = this.parseMarkdownLinks(text)
        console.log('Parsed links:', this.links)
        this.loading = false
      } catch (error) {
        this.error = 'Failed to load links. Please try again later.'
        this.loading = false
        console.error('Error loading links:', error)
      }
    },
    parseMarkdownLinks(markdown) {
      const links = []
      const lines = markdown.split('\n')
      
      for (const line of lines) {
        if (!line.trim()) continue
        
        const match = line.match(/\[(.*?)\]\[(.*?)\]\s*\[(.*?)\]/)
        if (match) {
          links.push({
            text: match[1].trim(),
            url: match[2].trim(),
            emoji: match[3].trim()
          })
        }
      }

      return links
    },
    startDrag(event) {
      if (this.maximized) return
      this.isDragging = true
      const rect = this.$refs.windowContainer.getBoundingClientRect()
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
      
      const maxX = window.innerWidth - this.$refs.windowContainer.offsetWidth
      const maxY = window.innerHeight - this.$refs.windowContainer.offsetHeight
      
      this.position = {
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      }
    },
    stopDrag() {
      this.isDragging = false
      document.removeEventListener('mousemove', this.onDrag)
      document.removeEventListener('mouseup', this.stopDrag)
    }
  },
  mounted() {
    this.fetchLinks()
  }
}
</script>

<style scoped>
.links-window {
  position: fixed;
  background: rgba(15, 23, 42, 0.98);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(148, 163, 184, 0.1);
  width: 360px;
  height: 480px;
  user-select: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  z-index: 9999;
}

.title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(30, 41, 59, 0.95);
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
  cursor: move;
  height: 44px;
}

.window-controls {
  display: flex;
  gap: 8px;
  margin-right: 8px;
  flex: 0 0 48px;
}

.control-btn {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
}

.control-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgba(0, 0, 0, 0.6);
  font-size: 10px;
  opacity: 0;
  transition: opacity 0.2s;
}

.control-btn.close::before {
  content: '×';
}

.control-btn.minimize::before {
  content: '−';
}

.control-btn:hover::before {
  opacity: 1;
}

.control-btn:hover {
  transform: scale(1.1);
}

.control-btn.close {
  background: #ff5f57;
  border: 1px solid #e0443e;
}

.control-btn.minimize {
  background: #febc2e;
  border: 1px solid #d89e24;
}

.title {
  color: #e2e8f0;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-align: center;
  flex: 1;
  margin: 0 auto;
}

.spacer {
  flex: 0 0 48px;
}

.links-content {
  height: calc(100% - 44px);
  padding: 16px 12px;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.3) transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.links-content::-webkit-scrollbar {
  width: 4px;
}

.links-content::-webkit-scrollbar-track {
  background: transparent;
}

.links-content::-webkit-scrollbar-thumb {
  background-color: rgba(148, 163, 184, 0.2);
  border-radius: 2px;
}

.links-content::-webkit-scrollbar-thumb:hover {
  background-color: rgba(148, 163, 184, 0.4);
}

.links-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: calc(100% - 8px);
  margin: 0 auto;
  padding: 0 4px 0 8px;
}

.link-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: rgba(30, 41, 59, 0.4);
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.08);
  color: #e2e8f0;
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  margin: 0 auto;
}

.link-item:hover {
  background: rgba(51, 65, 85, 0.6);
  transform: translateX(4px);
  border-color: rgba(148, 163, 184, 0.15);
}

.link-emoji {
  font-size: 18px;
  min-width: 24px;
  text-align: center;
  opacity: 0.9;
}

.link-text {
  font-size: 13px;
  font-weight: 500;
  flex-grow: 1;
  color: rgba(226, 232, 240, 0.9);
}

.loading, .error {
  text-align: center;
  padding: 20px;
  color: rgba(226, 232, 240, 0.8);
  font-size: 14px;
}

.error {
  color: #ef4444;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.loading {
  background: linear-gradient(90deg, 
    rgba(30, 41, 59, 0.4) 25%, 
    rgba(51, 65, 85, 0.4) 50%, 
    rgba(30, 41, 59, 0.4) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: 8px;
  padding: 16px;
  width: 80%;
  margin: 0 auto;
}
</style> 