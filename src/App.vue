<template>
  <div id="app" :style="{ backgroundImage: 'url(' + imgUrl + ')' }">
    <div class="center-box">
      <details open>
        <summary></summary>
        <a href="https://liyao.blog" target="_blank">
        <img class="avatar" src="https://avatars.githubusercontent.com/u/58540850?v=4" alt="avatar" />
        </a>
        <h2>Liyao's site</h2>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgUrl: 'https://api.vvhan.com/api/view' 
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
  background-color: #4CAF50;
  border: 2px solid transparent; 
  color: white;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  transition-duration: 0.4s;
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
  background-color: white; 
  color: black; 
  border: 2px solid #4CAF50;
}

#app {
  height: calc(100vh - 2 * (20px));
  /*margin: 20px 0;*/
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.center-box {
  text-align: center;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.5); 
  backdrop-filter: blur(10px); 
  color: white; 
  transition: all 0.5s ease-in-out;  
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
  right: 30px;
  bottom: 40px;
  font-size: 12px;
  color: white;
}

/* 鼠标样式
body {
  cursor: url('earth.gif'), auto;
} */

</style>