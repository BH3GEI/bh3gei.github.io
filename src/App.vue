<template>
    <div id="app" :style="{ 'cursor': `url(${cursorImage}), auto`, backgroundImage: 'url(' + imgUrl + ')' }">
    <div class="center-box">
      <details open>
        <summary></summary>
        <a href="https://liyao.blog" target="_blank">
        <img class="avatar" src="https://avatars.githubusercontent.com/u/58540850?v=4" alt="avatar" />
        </a>
        <h2>Liyao's Site</h2>
        <div class="link-list">
          <a href="https://liyao.blog" target="_blank">
            <button>Blog</button>
          </a>
          <a href="mailto:scholar.liyao@gmail.com">
            <button>Email</button>
          </a>
          <a href="https://github.com/BH3GEI" target="_blank">
            <button>Github</button>
          </a>
        </div>
      </details>
    </div>
    <div class="powered-by">Powered by Vue & Cloudflare Workers</div>
    <img :src="cursorImage" class="cursor-icon" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      cursorImage: 'https://user-images.githubusercontent.com/58540850/280524668-30b7dcfb-dcf6-4803-a372-1cc91bb53434.png'
    }
  },
  mounted() {
    document.title = 'Liyao\'s Site';
  }
}
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

.avatar {
  width: 50px;
  height: 50px;
  transition: all 0.3s ease-in-out;
  border-radius: 50%; /* 使图片变为圆形 */
}

.avatar:hover {
  transform: scale(1.2);
}

button {
  background-color: rgba(64, 64, 64, 0.5); /* semi-transparent */
  border: none; 
  border-radius: 15px;
  color: white;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  transition: background-color 0.4s ease-in-out;
  transition-duration: all 0.4s ease-in-out;
  padding: 10px 24px;
  width: 300px;  /* 设置固定宽度 */
}

summary {
  position: absolute;
  top: 0;
  right: 0;
  list-style: none;
}

button:hover {
  background-color: rgba(0, 0, 0, 0.7);  
  color: white; 
  border: none;
}

#app {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  /* height: calc(100vh - 2 * (20px)); */
  height: 100vh;
  /*margin: 20px 0;*/
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(100px);
}

#app::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(https://api.vvhan.com/api/view);
  background-size: cover;
  background-position: center;
  filter: blur(3px);
  z-index: -1;
}

.center-box {
  border-radius: 15px;
  text-align: center;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.5); 
  backdrop-filter: blur(10px); 
  color: white; 
  transition: all 0.5s ease-in-out;  
}

.cursor-icon {
  width: 20px;
  position: fixed;
  right: 20px;
  bottom: 9px;
}

.link-list a {
  display: block;
  margin: 10px 0;
  color: white; 
}

@media screen and (max-width: 600px) {
  .center-box {
    padding: 10px;
  }
}
details {
  position: relative;
  transition: all 0.5s ease-in-out;
  width: 300px;  
}

.powered-by {
  position: fixed;
  right: 45px;
  bottom: 10px;
  font-size: 12px;
  color: white;
}


</style>