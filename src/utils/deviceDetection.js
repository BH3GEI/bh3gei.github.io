export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
         (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
};

export const hasTouchScreen = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}; 