import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import VideoIntro from '../views/VideoIntro/VideoIntro.vue'
import DeepLinkLanding from '../views/DeepLinkLanding.vue'
import AudioTesting from '../views/PropertyVideo/PropertyVideo.vue'
import PropertyLanding from '../views/PropertyLanding/PropertyLanding.vue'
import ChatbotView from '../views/Chatbot/ChatbotView.vue'

import { ERouter, EPropertyRouter } from '../enums/router'


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: ERouter.VideoIntro,
    component: VideoIntro
  },
  {
    path: '/home',
    name: ERouter.Home,
    component: HomePage
  },
  {
    path: '/deeplink-landing',
    name: ERouter.DeepLinkLanding,
    component: DeepLinkLanding
  },
  {
    path: '/audio-testing',
    name: ERouter.AudioTesting,
    component: AudioTesting
  },
  {
    path: '/property/:propertyId',
    name: EPropertyRouter.PropertyLanding,
    component: PropertyLanding
  },
  {
    path: '/chatbot',
    name: ERouter.Chatbot,
    component: ChatbotView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
