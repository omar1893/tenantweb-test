import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { IonicVue } from '@ionic/vue'
import PrimeVue from 'primevue/config'
import { deepLinkService } from './services/deepLinkService'

// Import PrimeVue styles
import 'primeicons/primeicons.css'
import primeVueTheme from './prime-vue-theme'

// Import Ionic styles
import '@ionic/vue/css/core.css'
import '@ionic/vue/css/normalize.css'
import '@ionic/vue/css/structure.css'
import '@ionic/vue/css/typography.css'
import '@ionic/vue/css/padding.css'
import '@ionic/vue/css/float-elements.css'
import '@ionic/vue/css/text-alignment.css'
import '@ionic/vue/css/text-transformation.css'
import '@ionic/vue/css/flex-utils.css'
import '@ionic/vue/css/display.css'
import '@ionic/vue/css/palettes/dark.system.css'

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* @import '@ionic/vue/css/palettes/dark.always.css'; */
/* @import '@ionic/vue/css/palettes/dark.class.css'; */
/* @import '@ionic/vue/css/palettes/dark.system.css'; */

/* Theme variables */
import './theme/variables.css'
import './styles/main.css'

// Initialize deep link service
console.log('Initializing app with deep link service');
deepLinkService; // This will trigger the singleton initialization

const app = createApp(App)
  .use(IonicVue)
  .use(PrimeVue, {
    theme: primeVueTheme,
  })
  .use(router)

router.isReady().then(() => {
  app.mount('#app')
})
