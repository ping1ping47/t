import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/components/Dashboard/Dashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Dashboard
    },
    {
      path: '/examination',
      component: () => import('../components/Exam/Exam.vue')
    },
    {
      path: '/about',
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
