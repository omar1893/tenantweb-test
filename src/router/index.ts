import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import VideoIntro from '../views/VideoIntro/VideoIntro.vue'
import DeepLinkLanding from '../views/DeepLinkLanding.vue'
import AudioTesting from '../views/PropertyVideo/PropertyVideo.vue'
import PropertyLanding from '../views/PropertyLanding/PropertyLanding.vue'
import ChatbotView from '../views/Chatbot/ChatbotView.vue'

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
  },
  {
    path: '/audio-testing',
    name: 'AudioTesting',
    component: AudioTesting
  },
  {
    path: '/property/:propertyId',
    name: 'PropertyLanding',
    component: PropertyLanding
  },
  {
    path: '/chatbot',
    name: 'ChatBot',
    component: ChatbotView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
