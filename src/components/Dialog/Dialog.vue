<template>
  <div class="dialog-overlay" @click.self="$emit('close')">
    <div class="dialog-window">
      <div class="dialog-content">
        <h3>{{ title }}</h3>
        <p>{{ message }}</p>
        <div class="dialog-actions">
          <button class="btn btn-primary" @click="$emit('cancel')" ref="defaultButton">{{ cancelText }}</button>
          <button class="btn btn-secondary" @click="$emit('confirm')">{{ confirmText }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'

export default {
  name: 'CustomDialog',
  props: {
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    confirmText: {
      type: String,
      default: 'New Window'
    },
    cancelText: {
      type: String,
      default: 'View here'
    }
  },
  emits: ['close', 'confirm', 'cancel'],
  setup(props, { emit }) {
    const defaultButton = ref(null)

    const handleKeydown = (e) => {
      if (e.key === 'Enter') {
        emit('cancel')
      }
    }

    onMounted(() => {
      // Focus the default button when dialog opens
      defaultButton.value?.focus()
      
      // Add keyboard event listener for Enter key
      window.addEventListener('keydown', handleKeydown)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('keydown', handleKeydown)
    })

    return {
      defaultButton
    }
  }
}
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.dialog-window {
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-color);
  width: 400px;
  max-width: 90vw;
  animation: dialog-appear 0.2s ease-out;
}

.dialog-content {
  padding: 24px;
}

.dialog-content h3 {
  margin: 0 0 16px;
  color: var(--text-primary);
  font-size: 1.25rem;
}

.dialog-content p {
  margin: 0 0 24px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  min-width: 100px;
}

.btn:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.btn-secondary:hover {
  background: var(--hover-bg);
  transform: translateY(-1px);
}

@keyframes dialog-appear {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
