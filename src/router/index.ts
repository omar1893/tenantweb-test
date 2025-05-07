import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue'
import VideoIntro from '../views/Login/VideoIntro.vue'
import DeepLinkLanding from '../views/DeepLinkLanding.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'VideoIntro',
    component: VideoIntro
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/deeplink-landing',
    name: 'DeepLinkLanding',
    component: DeepLinkLanding
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
