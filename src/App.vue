<template>
  <div id="app" class="dark-mode">
    <StarryBackground v-if="isWarpMode" />
    <OrbitBackground v-else />
    <div class="app-container">
      <MouseTrailer ref="mouseTrailer" />
      <div class="theme-toggle" @click="toggleTheme">
        <font-awesome-icon :icon="['fas', isWarpMode ? 'rocket' : 'globe']" />
      </div>
      <div class="powered-by">
        Powered by <a href="https://vuejs.org" target="_blank">Vue</a> & <a href="https://workers.cloudflare.com" target="_blank">Cloudflare Workers</a>
      </div>
      <Profile v-if="showProfile" 
        :class="{ 'minimized': isProfileMinimized }" 
        :style="{ zIndex: getZIndex('Profile') }"
        @close="closeProfile" 
        @minimize="minimizeProfile"
        @click.self="bringToFront('Profile')"
        @open-blog="openApp('Blog')" />
      <Game2048 v-if="show2048" 
        :class="{ 'minimized': is2048Minimized }" 
        :style="{ zIndex: getZIndex('2048') }"
        @close="close2048" 
        @minimize="minimize2048"
        @click.self="bringToFront('2048')" />
      <SpaceShooter v-if="showSpaceShooter" 
        :class="{ 'minimized': isSpaceShooterMinimized }" 
        :style="{ zIndex: getZIndex('SpaceShooter') }"
        @close="closeSpaceShooter" 
        @minimize="minimizeSpaceShooter"
        @click.self="bringToFront('SpaceShooter')" />
      <BlogWindow v-if="showBlog"
        :class="{ 'minimized': isBlogMinimized }"
        :style="{ zIndex: getZIndex('Blog') }"
        @close="closeBlog"
        @minimize="minimizeBlog"
        @click.self="bringToFront('Blog')" />
      <Dock @open-app="openApp">
        <div class="dock-indicators">
          <div class="dock-item" :class="{ 'running': showProfile, 'minimized': isProfileMinimized }" @click="showProfile ? (isProfileMinimized ? restoreProfile() : bringToFront('Profile')) : openApp('Profile')">
            <font-awesome-icon :icon="['fas', 'user']" />
          </div>
          <div class="dock-item" :class="{ 'running': show2048, 'minimized': is2048Minimized }" @click="show2048 ? (is2048Minimized ? restore2048() : bringToFront('2048')) : openApp('2048')">
            <font-awesome-icon :icon="['fas', 'puzzle-piece']" />
          </div>
          <div class="dock-item" :class="{ 'running': showSpaceShooter, 'minimized': isSpaceShooterMinimized }" @click="showSpaceShooter ? (isSpaceShooterMinimized ? restoreSpaceShooter() : bringToFront('SpaceShooter')) : openApp('SpaceShooter')">
            <font-awesome-icon :icon="['fas', 'rocket']" />
          </div>
          <div class="dock-item" :class="{ 'running': showBlog, 'minimized': isBlogMinimized }" @click="showBlog ? (isBlogMinimized ? restoreBlog() : bringToFront('Blog')) : openApp('Blog')">
            <font-awesome-icon :icon="['fas', 'blog']" />
          </div>
        </div>
      </Dock>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faPuzzlePiece, faRocket, faGlobe, faBlog } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import StarryBackground from './components/StarryBackground/StarryBackground.vue'
import OrbitBackground from './components/OrbitBackground/OrbitBackground.vue'
import Profile from './components/Profile/Profile.vue'
import Game2048 from './components/Game2048/Game2048.vue'
import SpaceShooter from './components/SpaceShooter/SpaceShooter.vue'
import BlogWindow from './components/Blog/Blog.vue'
import MouseTrailer from './components/MouseTrailer/MouseTrailer.vue'
import Dock from './components/Dock/Dock.vue'

library.add(faUser, faPuzzlePiece, faRocket, faGlobe, faGithub, faBlog)

export default {
  name: 'App',
  components: {
    MouseTrailer,
    Profile,
    Dock,
    StarryBackground,
    OrbitBackground,
    Game2048,
    SpaceShooter,
    BlogWindow,
    FontAwesomeIcon
  },
  setup() {
    const showProfile = ref(true)
    const show2048 = ref(false)
    const showSpaceShooter = ref(false)
    const showBlog = ref(false)
    const isWarpMode = ref(true)
    const mouseTrailer = ref(null)
    const isProfileMinimized = ref(false)
    const is2048Minimized = ref(false)
    const isSpaceShooterMinimized = ref(false)
    const isBlogMinimized = ref(false)
    const activeWindow = ref('Profile')
    const windowOrder = ref(['Profile', '2048', 'SpaceShooter', 'Blog'])

    const toggleTheme = () => {
      import('vue').then(({ nextTick }) => {
        isWarpMode.value = !isWarpMode.value
        nextTick(() => {
          if (isWarpMode.value) {
            const starryBg = document.querySelector('.starry-background')
            if (starryBg) starryBg.getContext('2d').canvas.height = window.innerHeight
          } else {
            const orbitBg = document.querySelector('.orbit-background')
            if (orbitBg) orbitBg.getContext('2d').canvas.height = window.innerHeight
          }
        })
      })
    }

    const openApp = (appName) => {
      switch (appName) {
        case 'Profile':
          showProfile.value = true
          isProfileMinimized.value = false
          bringToFront('Profile')
          break
        case 'Blog':
          showBlog.value = true
          isBlogMinimized.value = false
          bringToFront('Blog')
          break
        case '2048':
          show2048.value = true
          is2048Minimized.value = false
          bringToFront('2048')
          break
        case 'SpaceShooter':
          showSpaceShooter.value = true
          isSpaceShooterMinimized.value = false
          bringToFront('SpaceShooter')
          break
      }
    }

    const closeProfile = () => {
      showProfile.value = false
      isProfileMinimized.value = false
    }

    const close2048 = () => {
      show2048.value = false
      is2048Minimized.value = false
    }

    const closeSpaceShooter = () => {
      showSpaceShooter.value = false
      isSpaceShooterMinimized.value = false
    }

    const closeBlog = () => {
      showBlog.value = false
    }

    const minimizeProfile = () => {
      isProfileMinimized.value = true
    }

    const minimize2048 = () => {
      is2048Minimized.value = true
    }

    const minimizeSpaceShooter = () => {
      isSpaceShooterMinimized.value = true
    }

    const minimizeBlog = () => {
      isBlogMinimized.value = true
    }

    const restoreProfile = () => {
      isProfileMinimized.value = false
    }

    const restore2048 = () => {
      is2048Minimized.value = false
    }

    const restoreSpaceShooter = () => {
      isSpaceShooterMinimized.value = false
    }

    const restoreBlog = () => {
      isBlogMinimized.value = false
      bringToFront('Blog')
    }

    const bringToFront = (window) => {
      if (activeWindow.value !== window) {
        const index = windowOrder.value.indexOf(window)
        if (index !== -1) {
          windowOrder.value.splice(index, 1)
          windowOrder.value.push(window)
          activeWindow.value = window
        }
      }
    }

    const getZIndex = (window) => {
      return windowOrder.value.indexOf(window) + 10
    }

    onMounted(() => {
      document.documentElement.classList.add('dark-mode')
    })

    return {
      showProfile,
      show2048,
      showSpaceShooter,
      showBlog,
      isWarpMode,
      mouseTrailer,
      isProfileMinimized,
      is2048Minimized,
      isSpaceShooterMinimized,
      isBlogMinimized,
      openApp,
      toggleTheme,
      closeProfile,
      minimizeProfile,
      restoreProfile,
      close2048,
      minimize2048,
      restore2048,
      closeSpaceShooter,
      minimizeSpaceShooter,
      restoreSpaceShooter,
      closeBlog,
      minimizeBlog,
      restoreBlog,
      bringToFront,
      getZIndex
    }
  }
}
</script>

<style>
:root {
  --primary-color: #3b82f6;
  --primary-hover: #60a5fa;
  --text-primary: #2c3e50;
  --text-secondary: #64748b;
  --bg-primary: #ffffff;
  --bg-secondary: rgba(255, 255, 255, 0.8);
  --border-color: rgba(0, 0, 0, 0.1);
  --shadow-color: rgba(0, 0, 0, 0.1);
}

.dark-mode {
  --primary-color: #7c3aed;  /* 更柔和的紫色 */
  --primary-hover: #9f67ff;
  --text-primary: #e2e8f0;
  --text-secondary: #94a3b8;
  --bg-primary: rgba(17, 24, 39, 0.95);  /* 更深的背景色 */
  --bg-secondary: rgba(31, 41, 55, 0.85);
  --border-color: rgba(255, 255, 255, 0.1);
  --shadow-color: rgba(0, 0, 0, 0.4);
  
  /* 新增的变量 */
  --window-bg: rgba(17, 24, 39, 0.98);
  --hover-bg: rgba(55, 65, 81, 0.5);
  --code-bg: rgba(0, 0, 0, 0.3);
  --button-bg: rgba(55, 65, 81, 0.7);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s ease;
}

#app {
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
}

.theme-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10; /* 降低z-index */
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  transform: scale(1.1);
  background: var(--bg-primary);
}

.powered-by {
  position: fixed;
  top: 1rem;
  left: 1rem;
  font-size: 0.8rem;
  opacity: 0.7;
  z-index: 1;
}

.powered-by a {
  color: inherit;
  text-decoration: none;
}

.powered-by a:hover {
  text-decoration: underline;
}

.dark-mode body {
  background: transparent;
}

.minimized {
  opacity: 0 !important;
  pointer-events: none !important;
  visibility: hidden !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.dock-indicators {
  display: flex;
  gap: 16px;
  margin: 0 12px;
  height: 100%;
  align-items: center;
}

.dock-item {
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #ffffff;
  font-size: 18px;
}

.dock-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.dock-item.running::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 5px;
  height: 5px;
  background: #ffffff;
  border-radius: 50%;
  opacity: 0.8;
}

.dock-item.running:hover::after {
  transform: translateX(-50%) scale(1.2);
  opacity: 1;
}

.dock-item.minimized {
  opacity: 0.6;
}

.dock-item.minimized::after {
  opacity: 0.4;
}

.running-dot {
  position: absolute;
  bottom: -4px;
  width: 4px;
  height: 4px;
  background: #ffffff;
  border-radius: 50%;
}

.profile-container,
.game-2048-container,
.space-shooter-container,
.blog-container {
  position: relative;
  cursor: default;
}

.maximized {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 20 !important; /* 确保最大化的窗口在最上层 */
}
</style>