<template>
  <div :class="['profile-window', { 'mobile-view': isMobile }]" ref="profileWindow" :style="mobileStyle">
    <div v-if="!isMobile" class="title-bar" @mousedown.prevent="startDrag">
      <div class="window-controls">
        <button class="control-btn close" @click="$emit('close')"></button>
        <button class="control-btn minimize" @click="$emit('minimize')"></button>
      </div>
      <span>Profile</span>
      <div class="spacer"></div>
    </div>
    <div v-if="isMobile" class="mobile-notice">
      Recommended: Visit on PC for full experience
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
          <h2>YAO LI</h2>
          <div class="readme-content" v-html="readmeContent"></div>
          <!-- <p class="welcome">Welcome to my space!</p> -->
          <div class="social-links">
            <div class="social-group">

              <a href="https://bh3gei.github.io/liyao" target="_blank" class="social-link">
                <span class="icon">
                  <font-awesome-icon :icon="['fas', 'user']" />
                </span>
                <span class="text">CV</span>
              </a>



              <a href="https://github.com/bh3gei" target="_blank" class="social-link">
                <span class="icon">
                  <font-awesome-icon :icon="['fab', 'github']" />
                </span>
                <span class="text">Github</span>
              </a>

              <a @click.prevent="handleBlogClick" href="#" class="social-link">
                <span class="icon">
                  <font-awesome-icon :icon="['fas', 'blog']" />
                </span>
                <span class="text">Blog</span>
              </a>

            </div>
            <div class="social-group">




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

              <a href="https://linkedin.com/in/yao-li2026" target="_blank" class="social-link">
                <span class="icon">
                  <font-awesome-icon :icon="['fas', 'briefcase']" />
                </span>
                <span class="text">LinkedIn</span>
              </a>

              <a @click.prevent="handleWechatClick" href="#" class="social-link">
                <span class="icon">
                  <font-awesome-icon :icon="['fab', 'weixin']" />
                </span>
                <span class="text">WeChat</span>
              </a>





            </div>
            <div class="social-group">








              <a @click.prevent="handleResumeClick" href="#" class="social-link" ref="resumeLink" :data-tooltip="resumeTooltip">
                <span class="icon">
                  <font-awesome-icon :icon="['fas', 'file-pdf']" />
                </span>
                <span class="text">Resume</span>
              </a>

              <a @click.prevent="handlePortfolioClick" href="#" class="social-link">
                <span class="icon">
                  <font-awesome-icon :icon="['fas', 'folder-open']" />
                </span>
                <span class="text">Portfolio</span>
              </a>

              <a @click.prevent="handleAllLinksClick" href="#" class="social-link">
                <span class="icon">
                  <font-awesome-icon :icon="['fas', 'link']" />
                </span>
                <span class="text">All Links</span>
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
    <NavigationModal
      v-model="showPortfolioModal"
      @choice="handlePortfolioChoice"
    />
    <NavigationModal
      v-model="showAllLinksModal"
      @choice="handleAllLinksChoice"
    />
    <ResumeChoiceModal v-if="showResumeModal" @close="showResumeModal = false" @choice="handleResumeChoice" />
    <WechatModal v-if="showWechatModal" @close="showWechatModal = false" />
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { marked } from 'marked'
import NavigationModal from '../Modal/NavigationModal.vue'
import ResumeChoiceModal from '../Modal/ResumeChoiceModal.vue'
import WechatModal from '../Modal/WechatModal.vue'

export default {
  name: 'ProfileWindow',
  components: {
    NavigationModal,
    ResumeChoiceModal,
    WechatModal
  },
  emits: ['close', 'minimize', 'click', 'open-blog', 'navigate-blog'],
  setup(props, { emit }) {
    const details = ref(null)
    const profileWindow = ref(null)
    const emailLink = ref(null)
    const resumeLink = ref(null)
    const isOpen = ref(true)
    const isDragging = ref(false)
    const position = ref({
      x: window.innerWidth / 2 - 300, // 窗口宽度的一半 (480/2 = 240)
      y: window.innerHeight / 2 - 300
    })
    const dragOffset = ref({
      x: 0,
      y: 0
    })
    const tooltipText = ref('Click to copy')
    const resumeTooltip = ref('Click to choose language')
    const showBlogModal = ref(false)
    const showResumeModal = ref(false)
    const showWechatModal = ref(false)
    const showPortfolioModal = ref(false)
    const showAllLinksModal = ref(false)
    const isMobile = ref(false);
    const mobileStyle = computed(() => {
      if (isMobile.value) {
        return {
          position: 'fixed',
          left: '0',
          top: '0',
          width: '100%',
          height: '100%',
          transform: 'none'
        };
      }
      return {
        left: position.value.x + 'px',
        top: position.value.y + 'px'
      };
    });

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
      
      // 检查 clipboard API 是否可用
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email)
          .then(() => {
            tooltipText.value = 'Copied!'
            setTimeout(() => {
              tooltipText.value = 'Click to copy'
            }, 2000)
          })
          .catch(err => {
            console.warn('Failed to copy:', err)
            // 降级方案：直接打开邮件客户端
            window.location.href = `mailto:${email}`
          })
      } else {
        // 如果 clipboard API 不可用，直接打开邮件客户端
        window.location.href = `mailto:${email}`
      }
    }

    const handleResumeClick = () => {
      showResumeModal.value = true
    }

    const handleResumeChoice = (choice) => {
      let url = ''
      switch(choice) {
        case 'en':
          url = 'https://raw.githubusercontent.com/BH3GEI/Resume/main/Resume.pdf'
          break
        case 'jp':
          url = 'https://raw.githubusercontent.com/BH3GEI/Resume/main/Resume_JP.pdf'
          break
        case 'cn':
          url = 'https://raw.githubusercontent.com/BH3GEI/Resume/main/Resume_CN.pdf'
          break
      }
      if (url) {
        window.open(url, '_blank')
      }
      showResumeModal.value = false
    }

    const handleWechatClick = () => {
      showWechatModal.value = true
    }

    const handlePortfolioClick = () => {
      showPortfolioModal.value = true
    }

    const handlePortfolioChoice = (choice) => {
      if (choice === 'new') {
        window.open('https://bh3gei.github.io/ProjectPage', '_blank')
      } else {
        emit('open-project-proxy')
      }
    }

    const handleAllLinksClick = () => {
      showAllLinksModal.value = true
    }

    const handleAllLinksChoice = (choice) => {
      if (choice === 'new') {
        window.open('https://bh3gei.github.io/AllLinks', '_blank')
      } else {
        emit('open-web-proxy')
      }
    }

    const readmeContent = ref('Loading...')

    const checkMobile = () => {
      isMobile.value = window.innerWidth <= 768;
    };

    onMounted(async () => {
      checkMobile();
      window.addEventListener('resize', checkMobile);
      try {
        const response = await fetch('https://raw.githubusercontent.com/BH3GEI/Resume/main/README.md')
        const text = await response.text()
        readmeContent.value = marked(text)
      } catch (error) {
        readmeContent.value = 'Failed to load content. Please try again later.'
        console.error('Error loading README:', error)
      }
      
      // Center the window
      const profileWindow = document.querySelector('.profile-window')
      if (profileWindow) {
        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight
        position.value = {
          x: (windowWidth - profileWindow.offsetWidth) / 2,
          y: (windowHeight - profileWindow.offsetHeight) / 2 - 10
        }
      }
    })

    onUnmounted(() => {
      window.removeEventListener('resize', checkMobile);
    })

    return {
      details,
      profileWindow,
      emailLink,
      resumeLink,
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
      resumeTooltip,
      handleEmailClick,
      handleResumeClick,
      handleResumeChoice,
      showResumeModal,
      handleWechatClick,
      showWechatModal,
      position,
      readmeContent,
      isMobile,
      mobileStyle,
      showPortfolioModal,
      handlePortfolioChoice,
      showAllLinksModal,
      handleAllLinksChoice,
      handlePortfolioClick,
      handleAllLinksClick
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
  width: 600px;
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

.readme-content {
  padding: 15px;
  line-height: 1.6;
  color: #4a5568;
}

.readme-content :deep(h1),
.readme-content :deep(h2),
.readme-content :deep(h3) {
  margin-top: 1em;
  margin-bottom: 0.5em;
}

.readme-content :deep(p) {
  margin-bottom: 1em;
}

.readme-content :deep(ul),
.readme-content :deep(ol) {
  padding-left: 2em;
  margin-bottom: 1em;
}

.readme-content :deep(code) {
  background-color: #f5f5f5;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: monospace;
}

.readme-content :deep(pre) {
  background-color: #f5f5f5;
  padding: 1em;
  border-radius: 5px;
  overflow-x: auto;
  margin-bottom: 1em;
}

.social-link[data-tooltip]:hover::before,
.social-link[data-tooltip]:hover::after {
  opacity: 1;
  visibility: visible;
}

.mobile-view {
  position: fixed !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  background: rgba(15, 23, 42, 0.95) !important;
  animation: none !important;
  transform: none !important;
  transition: none !important;
  max-width: 100% !important;
  max-height: 100% !important;
  width: 100% !important;
  height: 100% !important;
  overflow-y: auto !important;
  backdrop-filter: blur(20px) !important;
}

.mobile-view .window-content {
  padding: 20px;
  height: auto;
  overflow: visible;
  color: #e2e8f0;
  max-width: 100%;
  margin: 0 auto;
}

.mobile-view .profile-content {
  padding: 0 15px;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.mobile-view .readme-content {
  color: #e2e8f0;
  width: 100%;
  max-width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
}

.mobile-view .social-links {
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.mobile-view .social-group {
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
}

.mobile-view .social-link {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.1);
  flex: 1;
  min-width: 120px;
  max-width: 160px;
}

@media (max-width: 768px) {
  .profile-window {
    width: 100%;
    height: 100%;
  }
  
  .social-link {
    padding: 12px 15px;
  }

  .mobile-view .readme-content :deep(pre),
  .mobile-view .readme-content :deep(code) {
    max-width: 100%;
    overflow-x: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}

@media (max-width: 480px) {
  .mobile-view .window-content {
    padding: 15px 10px;
  }

  .mobile-view .social-link {
    min-width: 100px;
    max-width: 140px;
    padding: 10px;
  }

  .mobile-view .profile-content h2 {
    font-size: 20px;
  }
}
</style>