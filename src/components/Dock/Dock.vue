<template>
  <div class="dock-container">
    <div class="dock">
      <div v-for="(app, index) in apps" 
           :key="index" 
           class="dock-item"
           @click="openApp(app)"
           @mouseover="onMouseOver($event)"
           @mouseout="onMouseOut($event)">
        <div class="dock-icon">{{ app.icon }}</div>
        <div class="dock-tooltip">{{ app.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppDock',
  data() {
    return {
      apps: [
        { name: 'Profile', icon: '👤', component: 'Profile' },
        { name: '2048', icon: '🔢', component: '2048' },
        { name: 'Space Shooter', icon: '🚀', component: 'SpaceShooter' }
      ]
    }
  },
  methods: {
    openApp(app) {
      this.$emit('open-app', app.component)
    },
    onMouseOver(event) {
      const item = event.currentTarget
      item.style.transform = 'scale(1.2)'
      const siblings = [...item.parentElement.children]
      
      siblings.forEach((sibling, index) => {
        if (sibling !== item) {
          const distance = Math.abs(
            siblings.indexOf(item) - index
          )
          const scale = Math.max(1, 1.2 - (distance * 0.1))
          sibling.style.transform = `scale(${scale})`
        }
      })
    },
    onMouseOut(event) {
      const item = event.currentTarget
      const siblings = [...item.parentElement.children]
      
      siblings.forEach(sibling => {
        sibling.style.transform = 'scale(1)'
      })
    }
  }
}
</script>

<style scoped>
.dock-container {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
}

.dock {
  display: flex;
  gap: 10px;
  padding: 10px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dock-item {
  position: relative;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;
}

.dock-icon {
  font-size: 24px;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.dock-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dock-item:hover .dock-tooltip {
  opacity: 1;
}

.dock-item:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.15);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
}

.dark-mode .dock {
  background: rgba(255, 255, 255, 0.12);
}
</style>
