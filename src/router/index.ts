import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue'
import VideoIntro from '../views/Login/VideoIntro.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
