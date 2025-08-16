import { createRouter, createWebHistory } from 'vue-router'
import GatewayList from '@/views/GatewayList.vue'
import Monitoring from '@/views/Monitoring.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/gateway-list',
    },
    {
      path: '/gateway-list',
      name: 'GatewayList',
      component: GatewayList,
    }
  ],
})

export default router
