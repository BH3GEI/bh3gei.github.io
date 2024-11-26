import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faBlog, faEnvelope, faSun, faMoon, faUser, faPuzzlePiece, faRocket, faGlobe } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

library.add(faBlog, faEnvelope, faGithub, faSun, faMoon, faUser, faPuzzlePiece, faRocket, faGlobe)

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')

// 设置网页标题
document.title = "LI YAO's Space"
