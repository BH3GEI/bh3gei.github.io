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
            <div class="social-group">
              <a @click.prevent="handleBlogClick" href="#" class="social-link">
                <span class="icon">
                  <font-awesome-icon :icon="['fas', 'blog']" />
                </span>
                <span class="text">Blog</span>
              </a>
              <a href="https://github.com/bh3gei" target="_blank" class="social-link">
                <span class="icon">
                  <font-awesome-icon :icon="['fab', 'github']" />
                </span>
                <span class="text">Github</span>
              </a>
              <a href="mailto:scholar.liyao@gmail.com" 
                class="social-link" 
                @click.prevent="handleEmailClick" 
                ref="emailLink"
                :data-tooltip="tooltipText">
                <span class="icon">
                  <font-awesome-icon :icon="['fas', 'envelope']" />
                </span>
                <span class="text">Email</span>
              </a>
            </div>
            <div class="social-group">
              <a href="https://github.com/BH3GEI/Resume/blob/main/Resume.pdf" target="_blank" class="social-link">
                <span class="icon">
                  <font-awesome-icon :icon="['fas', 'file-pdf']" />
                </span>
                <span class="text">Resume</span>
              </a>
              <a href="https://b2.kuibu.net/file/imgdisk/2024/11/27/WechatIMG4.png" target="_blank" class="social-link">
                <span class="icon">
                  <font-awesome-icon :icon="['fab', 'weixin']" />
                </span>
                <span class="text">WeChat</span>
              </a>
              <a href="https://t.me/yao_luv_cs" target="_blank" class="social-link">
                <span class="icon">
                  <font-awesome-icon :icon="['fab', 'telegram']" />
                </span>
                <span class="text">Telegram</span>
              </a>
            </div>
            <div class="social-group">
              <a href="https://stratoproxy.stratosphericus.workers.dev" target="_blank" class="social-link">
                <span class="icon">
                  <font-awesome-icon :icon="['fas', 'shield-halved']" />
                </span>
                <span class="text">Web Proxy</span>
              </a>
              <a href="https://chat-gpt-next-web-ozpr.vercel.app/" target="_blank" class="social-link">
                <span class="icon">
                  <font-awesome-icon :icon="['fas', 'robot']" />
                </span>
                <span class="text">ChatGPT</span>
              </a>
              <a href="https://x.com/BH3GEI_CN" target="_blank" class="social-link">
                <span class="icon">
                  <font-awesome-icon :icon="['fab', 'twitter']" />
                </span>
                <span class="text">Twitter</span>
              </a>
            </div>
          </div>
        </div>
      </details>
    </div>
    <NavigationModal
      v-model="showBlogModal"
      @choice="handleBlogChoice"
    />
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import NavigationModal from '../Modal/NavigationModal.vue'

export default {
  name: 'ProfileWindow',
  components: {
    NavigationModal
  },
  emits: ['close', 'minimize', 'click', 'open-blog', 'navigate-blog'],
  setup(props, { emit }) {
    const details = ref(null)
    const profileWindow = ref(null)
    const emailLink = ref(null)
    const isOpen = ref(true)
    const isDragging = ref(false)
    const position = ref({
      x: window.innerWidth / 2 - 240, // 窗口宽度的一半 (480/2 = 240)
      y: window.innerHeight / 2 - 300
    })
    const dragOffset = ref({
      x: 0,
      y: 0
    })
    const tooltipText = ref('Click to copy')
    const showBlogModal = ref(false)

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

    const handleBlogClick = () => {
      showBlogModal.value = true
    }

    const handleBlogChoice = (choice) => {
      if (choice === 'new') {
        window.open('https://blog.stratosphericus.workers.dev', '_blank')
      } else {
        emit('open-blog')
      }
    }

    const handleEmailClick = () => {
      const email = 'scholar.liyao@gmail.com'
      navigator.clipboard.writeText(email).then(() => {
        tooltipText.value = 'Copied!'
        setTimeout(() => {
          tooltipText.value = 'Click to copy'
        }, 2000)
        
        // Open mailto link
        window.location.href = `mailto:${email}`
      })
    }

    return {
      details,
      profileWindow,
      emailLink,
      isOpen,
      iconStyle,
      startDrag,
      onDrag,
      stopDrag,
      onToggle,
      handleBlogClick,
      handleBlogChoice,
      showBlogModal,
      tooltipText,
      handleEmailClick,
      position
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
  width: 480px;
  min-height: 420px;
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
  padding: 24px;
  padding-bottom: 32px;
  height: calc(100% - 52px);
  display: flex;
  flex-direction: column;
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
  margin: 20px auto 24px;
  width: 120px;
  height: 120px;
  border-radius: 60px;
  overflow: hidden;
  border: 2px solid rgba(148, 163, 184, 0.2);
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-content {
  text-align: center;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.profile-content h2 {
  margin: 0 0 12px;
  font-size: 24px;
  color: var(--text-primary);
}

.welcome {
  margin: 0 0 auto;
  color: var(--text-secondary);
  font-size: 16px;
}

.social-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 32px;
  margin-bottom: 16px;
  padding: 0 8px;
}

.social-group {
  display: flex;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 0 4px;
}

.social-link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  border-radius: 10px;
  color: #e2e8f0;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(30, 41, 59, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(148, 163, 184, 0.15);
  min-width: 130px;
  justify-content: flex-start;
  height: 36px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex: 1;
  max-width: 140px;
}

.social-link .icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  font-size: 18px;
  color: #94a3b8;
}

.social-link .icon svg {
  width: 18px;
  height: 18px;
}

.social-link .text {
  font-size: 0.9em;
  white-space: nowrap;
  font-weight: 500;
  letter-spacing: 0.3px;
  color: #e2e8f0;
}

.social-link:hover {
  background: rgba(51, 65, 85, 0.6);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: rgba(148, 163, 184, 0.25);
}

.social-link:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.social-link[data-tooltip] {
  position: relative;
}

.social-link[data-tooltip]::before {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  background: rgba(15, 23, 42, 0.95);
  color: #e2e8f0;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
}

.social-link[data-tooltip]::after {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: rgba(15, 23, 42, 0.95);
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
}

.social-link[data-tooltip]:hover::before,
.social-link[data-tooltip]:hover::after {
  opacity: 1;
  visibility: visible;
}
</style>
