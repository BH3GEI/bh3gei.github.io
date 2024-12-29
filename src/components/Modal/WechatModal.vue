<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-window" @click.stop>
      <div class="title-bar">
        <div class="window-controls">
          <button class="control-btn close" @click="$emit('close')"></button>
        </div>
        <span>WeChat Contact</span>
        <div class="spacer"></div>
      </div>
      <div class="modal-content">
        <div class="qr-container">
          <img :src="qrCodeUrl" alt="WeChat QR Code" class="qr-code" />
        </div>
        <p class="wechat-id">WeChat ID: LY-BH3GEI</p>
        <div class="note">
          Scan QR code or search ID to add me on WeChat
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WechatModal',
  emits: ['close'],
  setup() {
    const qrCodeUrl = 'https://raw.githubusercontent.com/BH3GEI/Resume/main/WechatQR.png'
    return {
      qrCodeUrl
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
  color: #e2e8f0;
  text-align: center;
}

.qr-container {
  width: 200px;
  height: 200px;
  margin: 0 auto 20px;
  background: white;
  padding: 10px;
  border-radius: 8px;
}

.qr-code {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.wechat-id {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 12px;
}

.note {
  font-size: 14px;
  color: #94a3b8;
}
</style>
