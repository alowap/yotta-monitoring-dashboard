import DashboardMapView from '@/views/DashboardMapView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: DashboardMapView
    }
  ],
})

export default router
