<template>
  <div class="profile-window" ref="profileWindow" :style="{ left: position.x + 'px', top: position.y + 'px' }" @click="$emit('click', $event)">
    <div class="title-bar" @mousedown.prevent="startDrag">
      <div class="window-controls">
        <button class="control-btn close" @click="$emit('close')"></button>
        <button class="control-btn minimize" @click="$emit('minimize')"></button>
      </div>
      <span>Profile</span>
      <div class="spacer"></div>
    </div>
    <div class="window-content">
      <details open @toggle="onToggle" ref="details">
        <summary>
          <div class="summary-icon">
            <font-awesome-icon :style="iconStyle" icon="chevron-up" />
          </div>
        </summary>
        <div class="avatar-container">
          <img class="avatar" src="https://avatars.githubusercontent.com/u/58540850?v=4" alt="avatar" />
        </div>
        <div class="profile-content">
          <h2>LI YAO</h2>
          <p class="welcome">Welcome to my space!</p>
          <div class="social-links">
            <a @click.prevent="$emit('open-blog')" href="#" class="social-link">
              <font-awesome-icon :icon="['fas', 'blog']" />
              Blog
            </a>
            <a href="https://github.com/bh3gei" target="_blank" class="social-link">
              <font-awesome-icon :icon="['fab', 'github']" />
              Github
            </a>
            <a href="mailto:scholar.liyao@gmail.com" class="social-link">
              <font-awesome-icon :icon="['fas', 'envelope']" />
              Email
            </a>
          </div>
        </div>
      </details>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'ProfileWindow',
  emits: ['close', 'minimize', 'click', 'open-blog'],
  setup() {
    const details = ref(null)
    const profileWindow = ref(null)
    const isOpen = ref(true)
    const isDragging = ref(false)
    const position = ref({
      x: window.innerWidth / 2 - 160, // 320/2 = 160，使窗口水平居中
      y: window.innerHeight / 2 - 225  // 约450/2 = 225，使窗口垂直居中
    })
    const dragOffset = ref({
      x: 0,
      y: 0
    })

    const iconStyle = computed(() => ({
      transform: isOpen.value ? 'rotate(90deg)' : 'rotate(0deg)',
      transition: 'transform 0.3s ease'
    }))

    const startDrag = (event) => {
      if (event.target.closest('.control-btn')) return
      
      isDragging.value = true
      const rect = profileWindow.value.getBoundingClientRect()
      dragOffset.value = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      }
      
      document.addEventListener('mousemove', onDrag)
      document.addEventListener('mouseup', stopDrag)
      
      // 添加拖动时的样式
      profileWindow.value.style.transition = 'none'
      document.body.style.userSelect = 'none'
      document.body.style.cursor = 'move'
    }
    
    const stopDrag = () => {
      isDragging.value = false
      document.removeEventListener('mousemove', onDrag)
      document.removeEventListener('mouseup', stopDrag)
      
      // 恢复正常样式
      profileWindow.value.style.transition = ''
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
    
    const onDrag = (event) => {
      if (!isDragging.value) return
      
      requestAnimationFrame(() => {
        position.value.x = event.clientX - dragOffset.value.x
        position.value.y = event.clientY - dragOffset.value.y
      })
    }

    const onToggle = () => {
      if (!details.value) return
      isOpen.value = details.value.open
    }

    return {
      details,
      profileWindow,
      isOpen,
      isDragging,
      position,
      dragOffset,
      iconStyle,
      startDrag,
      stopDrag,
      onDrag,
      onToggle
    }
  }
}
</script>

<style scoped>
.profile-window {
  position: fixed;
  background: rgba(15, 23, 42, 0.95);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(148, 163, 184, 0.1);
  width: 320px;
  user-select: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  transform: translate3d(0, 0, 0);
  will-change: transform;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
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

.spacer {
  width: 48px;
}

.title-bar span {
  color: #e2e8f0;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.window-content {
  padding: 20px;
}

details {
  width: 100%;
}

summary {
  list-style: none;
  cursor: pointer;
}

summary::-webkit-details-marker {
  display: none;
}

.summary-icon {
  display: flex;
  justify-content: center;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.avatar-container {
  display: block;
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
  border-radius: 60px;
  overflow: hidden;
  border: 3px solid var(--primary-color);
  transition: transform 0.3s ease;
}

.avatar-container:hover {
  transform: scale(1.05);
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-content {
  text-align: center;
}

h2 {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.welcome {
  font-size: 16px;
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.social-link:hover {
  color: var(--primary-color);
  background: var(--bg-primary);
}
</style>
