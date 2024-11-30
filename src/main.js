import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import 'highlight.js/styles/github-dark.css'
import '@mdi/font/css/materialdesignicons.css'

// FontAwesome configuration
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'

// Import icons
import { faBlog, faEnvelope, faSun, faMoon, faUser, faPuzzlePiece, faRocket, faGlobe, faHeadphones, faMusic, faPaperPlane, faShieldHalved, faRobot, faFilePdf, faBriefcase } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faTwitter, faTelegram, faWeixin } from '@fortawesome/free-brands-svg-icons'

// Prevent Font Awesome from adding its CSS since we did it manually above
config.autoAddCss = false

// Add icons to library
const solidIcons = [
  faBlog, faEnvelope, faSun, faMoon, faUser, faPuzzlePiece, 
  faRocket, faGlobe, faHeadphones, faMusic, faPaperPlane, 
  faShieldHalved, faRobot, faFilePdf, faBriefcase
]

const brandIcons = [faGithub, faTwitter, faTelegram, faWeixin]

// Add icons to library
solidIcons.forEach(icon => library.add(icon))
brandIcons.forEach(icon => library.add(icon))

// Create Vue app
const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')

// Set page title
document.title = "Yao's Space"
