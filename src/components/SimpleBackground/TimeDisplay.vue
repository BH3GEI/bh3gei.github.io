<template>
  <div class="time-display" :class="{ 'show-tooltip': showTooltip }">
    <div class="time-text">{{ timeString }}</div>
    <div class="date-text">{{ dateString }}</div>
    <div class="unix-time">Unix: {{ unixTime }}</div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'

export default {
  name: 'TimeDisplay',
  setup() {
    const timeString = ref('')
    const dateString = ref('')
    const unixTime = ref('')
    const showTooltip = ref(true)
    let timer = null

    const updateTime = () => {
      const now = new Date()
      timeString.value = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
      dateString.value = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      unixTime.value = Math.floor(now.getTime() / 1000)
    }

    onMounted(() => {
      updateTime()
      timer = setInterval(updateTime, 1000)
      setTimeout(() => {
        showTooltip.value = false
      }, 3000)
    })

    onBeforeUnmount(() => {
      if (timer) {
        clearInterval(timer)
      }
    })

    return {
      timeString,
      dateString,
      unixTime,
      showTooltip
    }
  }
}
</script>

<style scoped>
.time-display {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg-secondary);
  padding: 6px 16px;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
  text-align: center;
}

.time-text {
  color: var(--text-primary);
  font-family: 'JetBrains Mono', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace;
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 2px;
}

.date-text {
  color: var(--text-secondary);
  font-size: 14px;
  margin-top: 4px;
  opacity: 0.8;
}

.unix-time {
  color: var(--primary-color);
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  margin-top: 2px;
  opacity: 0.9;
  letter-spacing: 1px;
}
</style> 