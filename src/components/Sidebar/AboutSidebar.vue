<template>
  <div 
    class="about-sidebar"
    :class="{ 
      'expanded': isExpanded,
      'mobile': isMobile 
    }"
    @mouseenter="!isMobile && (isExpanded = true)"
    @mouseleave="!isMobile && (isExpanded = false)"
    @click="isMobile && toggleMobile()"
  >
    <div class="indicator" :class="{ 'expanded': isExpanded, 'mobile': isMobile }">
      <i :class="[
        'mdi',
        isMobile ? 'mdi-chevron-up' : 'mdi-chevron-right',
        { 'rotated': isExpanded && isMobile }
      ]"></i>
      <span class="indicator-text" :class="{ 'mobile': isMobile }">More</span>
    </div>
    <div class="sidebar-content">
      <div class="markdown-content" v-html="renderedContent"></div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { marked } from 'marked'

export default {
  name: 'AboutSidebar',
  setup() {
    const isExpanded = ref(false)
    const renderedContent = ref('')
    const isMobile = ref(false)

    const checkMobile = () => {
      isMobile.value = window.innerWidth <= 768
    }

    const toggleMobile = () => {
      if (isMobile.value) {
        isExpanded.value = !isExpanded.value
      }
    }

    const fetchAndRenderContent = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/BH3GEI/Resume/main/about.md')
        const markdown = await response.text()
        renderedContent.value = marked(markdown)
      } catch (error) {
        console.error('Failed to fetch about content:', error)
      }
    }

    onMounted(() => {
      fetchAndRenderContent()
      checkMobile()
      window.addEventListener('resize', checkMobile)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', checkMobile)
    })

    return {
      isExpanded,
      renderedContent,
      isMobile,
      toggleMobile
    }
  }
}
</script>

<style scoped>
.about-sidebar {
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 240px;
  background: rgba(15, 23, 42, 0.95);
  border-radius: 0 12px 12px 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(148, 163, 184, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
  z-index: 999;
}

.about-sidebar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(59, 130, 246, 0.1), transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.about-sidebar:not(.mobile):not(.expanded):hover {
  transform: none;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4),
              0 0 20px rgba(59, 130, 246, 0.1);
}

.about-sidebar:not(.mobile):not(.expanded):hover::after {
  opacity: 1;
}

.indicator {
  position: absolute;
  left: 0;
  top: 0;
  width: 36px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #e2e8f0;
  transition: all 0.3s ease;
  background: linear-gradient(to right, rgba(59, 130, 246, 0.1), transparent);
  cursor: pointer;
}

.indicator i {
  font-size: 24px;
  margin-bottom: 8px;
  transition: transform 0.3s ease, opacity 0.2s ease;
  opacity: 0.7;
}

.about-sidebar:not(.mobile):not(.expanded):hover .indicator i {
  transform: translateX(4px);
  opacity: 1;
}

.indicator-text {
  writing-mode: vertical-lr;
  transform: rotate(180deg);
  font-size: 14px;
  letter-spacing: 2px;
  opacity: 0.7;
  margin-bottom: 12px;
  text-transform: uppercase;
  transition: opacity 0.2s ease;
}

.about-sidebar:not(.mobile):not(.expanded):hover .indicator-text {
  opacity: 1;
}

/* Mobile Styles */
.about-sidebar.mobile {
  top: auto;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 48px;
  transform: none;
  border-radius: 12px 12px 0 0;
  border-bottom: none;
}

.about-sidebar.mobile.expanded {
  height: 80vh;
  border-radius: 20px 20px 0 0;
}

.indicator.mobile {
  flex-direction: row;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 48px;
  background: linear-gradient(to bottom, rgba(59, 130, 246, 0.1), transparent);
  z-index: 1;
}

.indicator.mobile .mdi {
  margin: 0;
  transition: transform 0.3s ease;
}

.indicator.mobile .mdi.rotated {
  transform: rotate(180deg);
}

.indicator-text.mobile {
  writing-mode: horizontal-tb;
  transform: none;
  margin: 0;
}

.about-sidebar:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

.about-sidebar.expanded:not(.mobile) {
  width: 400px;
  height: 80vh;
}

.indicator {
  position: absolute;
  left: 0;
  top: 0;
  width: 36px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #e2e8f0;
  transition: all 0.3s ease;
  background: linear-gradient(to right, rgba(59, 130, 246, 0.1), transparent);
  cursor: pointer;
}

.indicator i {
  font-size: 24px;
  margin-bottom: 8px;
  transition: transform 0.3s ease;
}

.indicator-text {
  writing-mode: vertical-lr;
  transform: rotate(180deg);
  font-size: 14px;
  letter-spacing: 2px;
  opacity: 0.8;
  margin-bottom: 12px;
  text-transform: uppercase;
}

.about-sidebar:not(.mobile):hover .indicator i {
  transform: translateX(4px);
}

.indicator.expanded:not(.mobile) {
  opacity: 0;
}

.sidebar-content {
  height: 100%;
  padding: 24px;
  padding-left: 48px;
  padding-right: 12px;
  overflow-y: auto;
  color: #e2e8f0;
  scrollbar-width: none;  /* Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
}

.sidebar-content::-webkit-scrollbar {
  display: none;  /* Chrome, Safari, Opera */
}

/* Mobile sidebar content */
.about-sidebar.mobile .sidebar-content {
  padding: 20px;
  padding-top: 60px;
  padding-right: 8px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.about-sidebar.mobile .sidebar-content::-webkit-scrollbar {
  display: none;
}

.markdown-content {
  opacity: 0;
  transform: translateX(-20px);
  transition: all 0.3s ease;
}

.expanded .markdown-content {
  opacity: 1;
  transform: translateX(0);
}

/* Mobile markdown content */
.about-sidebar.mobile .markdown-content {
  transform: translateY(20px);
}

.about-sidebar.mobile.expanded .markdown-content {
  transform: translateY(0);
}

/* Existing markdown styles... */
.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3) {
  color: #e2e8f0;
  margin-bottom: 1rem;
  font-weight: 600;
}

.markdown-content :deep(h1) {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.markdown-content :deep(h2) {
  font-size: 1.4rem;
  margin-top: 2rem;
}

.markdown-content :deep(h3) {
  font-size: 1.2rem;
  color: #94a3b8;
}

.markdown-content :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.6;
  color: #94a3b8;
}

.markdown-content :deep(a) {
  color: #3b82f6;
  text-decoration: none;
  transition: all 0.2s;
  border-bottom: 1px dashed rgba(59, 130, 246, 0.4);
  padding-bottom: 1px;
}

.markdown-content :deep(a:hover) {
  color: #60a5fa;
  border-bottom-color: #60a5fa;
}

.markdown-content :deep(code) {
  background: rgba(30, 41, 59, 0.5);
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.9em;
}

.markdown-content :deep(pre) {
  background: rgba(30, 41, 59, 0.5);
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1rem 0;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

.markdown-content :deep(li) {
  margin-bottom: 0.5rem;
  color: #94a3b8;
}

.markdown-content :deep(blockquote) {
  border-left: 4px solid #3b82f6;
  padding-left: 1rem;
  margin: 1rem 0;
  color: #94a3b8;
  background: rgba(59, 130, 246, 0.1);
  padding: 1rem;
  border-radius: 0 8px 8px 0;
}

/* 自定义滚动条 */
.sidebar-content {
  scrollbar-width: none;  /* Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
}

.sidebar-content::-webkit-scrollbar {
  display: none;  /* Chrome, Safari, Opera */
}

/* 移动端完全隐藏滚动条 */
.about-sidebar.mobile .sidebar-content {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.about-sidebar.mobile .sidebar-content::-webkit-scrollbar {
  display: none;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.about-sidebar:not(.mobile):not(.expanded):hover {
  animation: none;
}

/* Mobile pull indicator animation */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}

.about-sidebar.mobile:not(.expanded) .indicator i {
  animation: bounce 2s infinite;
}

/* Add background to indicator in mobile expanded state */
.about-sidebar.mobile.expanded .indicator {
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
}
</style> 