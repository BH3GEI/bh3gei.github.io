<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-window" @click.stop>
      <div class="title-bar">
        <div class="window-controls">
          <button class="control-btn close" @click="$emit('close')"></button>
        </div>
        <span>Choose Resume Language</span>
        <div class="spacer"></div>
      </div>
      <div class="modal-content">
        <p>Which language version would you like to view?</p>
        <div class="button-group">
          <button class="modal-btn" @click="$emit('choice', 'en')">
            <font-awesome-icon icon="file-pdf" />
            English
          </button>
          <button class="modal-btn" @click="$emit('choice', 'jp')">
            <font-awesome-icon icon="file-pdf" />
            日本語
          </button>
          <button class="modal-btn" @click="$emit('choice', 'cn')">
            <font-awesome-icon icon="file-pdf" />
            中文
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResumeChoiceModal',
  emits: ['close', 'choice']
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
  flex-direction: column;
  gap: 16px;
  align-items: stretch;
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

.modal-btn:hover {
  background: rgba(51, 65, 85, 0.5);
  transform: translateY(-1px);
}

.modal-btn svg {
  font-size: 16px;
}
</style>
