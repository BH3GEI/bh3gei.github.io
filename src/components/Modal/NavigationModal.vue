<template>
  <div v-if="modelValue" class="modal-overlay" @click="$emit('update:modelValue', false)">
    <div class="modal-window" @click.stop>
      <div class="title-bar">
        <div class="window-controls">
          <button class="control-btn close" @click="$emit('update:modelValue', false)"></button>
        </div>
        <span>Open Page</span>
        <div class="spacer"></div>
      </div>
      <div class="modal-content">
        <p>How would you like to view the Page?</p>
        <div class="button-group">
          <button class="modal-btn" @click="handleChoice('new')">
            <font-awesome-icon icon="external-link-alt" />
            Open in New Window
          </button>
          <button class="modal-btn primary" @click="handleChoice('current')">
            <font-awesome-icon icon="window-maximize" />
            View Here
            <span class="recommended">Recommended</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavigationModal',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    }
  },
  emits: ['update:modelValue', 'choice'],
  setup(props, { emit }) {
    const handleChoice = (choice) => {
      emit('choice', choice)
      emit('update:modelValue', false)
    }

    return {
      handleChoice
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-window {
  background: rgba(15, 23, 42, 0.95);
  border-radius: 12px;
  width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(148, 163, 184, 0.1);
  overflow: hidden;
}

.title-bar {
  background: rgba(30, 41, 59, 0.5);
  padding: 12px;
  display: flex;
  align-items: center;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
}

.title-bar span {
  color: #e2e8f0;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.5px;
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
  cursor: pointer;
  position: relative;
}

.control-btn::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.1s;
}

.close::before {
  content: '×';
}

.control-btn:hover::before {
  opacity: 1;
}

.control-btn.close {
  background: #ff5f56;
}

.control-btn:hover {
  filter: brightness(0.9);
}

.spacer {
  flex-grow: 1;
}

.modal-content {
  padding: 24px;
}

.modal-content p {
  margin: 0 0 24px;
  text-align: center;
  color: #e2e8f0;
  font-size: 16px;
}

.button-group {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.modal-btn {
  padding: 12px 24px;
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 8px;
  background: rgba(30, 41, 59, 0.5);
  color: #e2e8f0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  transition: all 0.2s;
  backdrop-filter: blur(10px);
  position: relative;
}

.modal-btn.primary {
  background: rgba(56, 189, 248, 0.2);
  border: 1px solid rgba(56, 189, 248, 0.3);
}

.modal-btn.primary:hover {
  background: rgba(56, 189, 248, 0.3);
  transform: translateY(-1px);
}

.modal-btn:hover {
  background: rgba(51, 65, 85, 0.5);
  transform: translateY(-1px);
}

.modal-btn svg {
  font-size: 16px;
}

.recommended {
  position: absolute;
  top: -8px;
  right: -8px;
  background: rgba(56, 189, 248, 0.9);
  color: #fff;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
  letter-spacing: 0.5px;
}
</style>
