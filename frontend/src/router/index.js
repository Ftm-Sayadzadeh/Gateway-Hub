import { createRouter, createWebHistory } from 'vue-router'
import GatewayList from '@/views/GatewayList.vue'
// import Monitoring from '@/views/Monitoring.vue'
// import CreateGatewayForm from '@/views/CreateGatewayForm.vue'

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
      meta: {
        keepAlive: true,
      },
    },
    // {
    //   path: '/monitoring',
    //   name: 'Monitoring',
    //   component: Monitoring,
    //   meta: {
    //     keepAlive: true,
    //   },
    // },
    {
      path: '/gateway/:id',
      name: 'GatewayDetails',
      component: () => import('@/views/GatewayDetails.vue'),
    },
    // {
    //   path: '/gateway/:id/edit',
    //   name: 'EditGateway',
    //   component: () => import('@/views/EditGateway.vue'),
    // },
  //   {
  //     path: '/gateway/create',
  //     name: 'CreateGateway',
  //     component: CreateGatewayForm,
  //   },
  // ],
})

export default router
