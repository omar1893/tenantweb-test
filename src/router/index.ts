import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import AppRoot from '@/views/AppRoot.vue'
import VideoIntro from '@/views/VideoIntro/VideoIntro.vue'
import PropertyVideo from '@/views/PropertyVideo/PropertyVideo.vue'
import HomePage from '@/views/HomePage.vue'
import DeepLinkLanding from '@/views/DeepLinkLanding.vue'
import PropertyLanding from '@/views/PropertyLanding/PropertyLanding.vue'
import ChatbotView from '@/views/Chatbot/ChatbotView.vue'
import AuthCallback from '@/views/Auth/AuthCallback.vue'
import AuthVerify from '@/views/Auth/AuthVerify.vue'
import { ERouter, EPropertyRouter } from '@/enums/router.enum'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: AppRoot,
    children: [
      {
        path: '',
        redirect: '/video-intro'
      },
      {
        path: '/video-intro',
        name: ERouter.VideoIntro,
        component: VideoIntro,
        meta: { isPublic: true }
      },
      {
        path: '/property-video',
        name: ERouter.PropertyVideo,
        component: PropertyVideo,
        meta: { isPublic: true }
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
        path: '/auth-verify',
        name: ERouter.AuthVerify,
        component: AuthVerify,
        meta: {
          isPublic: true
        }
      },
      {
        path: '/redirect-login',
        name: ERouter.RedirectLogin,
        component: () => import('@/views/RedirectLogin/RedirectLogin.vue'),
        meta: {
          isPublic: true
        }
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
      {
        path: '/chatbot',
        name: ERouter.Chatbot,
        component: ChatbotView
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
