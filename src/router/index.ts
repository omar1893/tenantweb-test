import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import VideoIntro from '../views/VideoIntro/VideoIntro.vue'
import DeepLinkLanding from '../views/DeepLinkLanding.vue'
import AudioTesting from '../views/PropertyVideo/PropertyVideo.vue'
import PropertyLanding from '../views/PropertyLanding/PropertyLanding.vue'
import ChatbotView from '../views/Chatbot/ChatbotView.vue'
import AuthCallback from '../views/Auth/AuthCallback.vue'

import { ERouter, EPropertyRouter } from '../enums/router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: ERouter.VideoIntro,
    component: VideoIntro,
    meta: {
      isPublic: true
    }
  },
  {
    path: '/auth-callback',
    name: ERouter.AuthCallback,
    component: AuthCallback,
    meta: {
      isPublic: true
    }
  },
  {
    path: '/property-video',
    name: ERouter.PropertyVideo,
    component: AudioTesting
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
    path: '/property/:propertyId',
    name: EPropertyRouter.PropertyLanding,
    component: PropertyLanding,
    meta: {
      isPublic: true
    }
  },
/*   {
    path: '/chatbot',
    name: ERouter.Chatbot,
    component: ChatbotView
  }, */
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
