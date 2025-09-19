import { createRouter, createWebHistory } from 'vue-router'
import GatewayList from '@/views/GatewayList.vue'
import Monitoring from '@/views/Monitoring.vue'
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
        title: 'Gateway Management'
      },
    },
    {
      path: '/monitoring',
      name: 'Monitoring', 
      component: Monitoring,
      meta: {
        keepAlive: true,
        title: 'Multi-Gateway Monitoring'
      },
    },
    {
      path: '/gateway/:id',
      name: 'GatewayDetails',
      component: () => import('@/views/GatewayDetails.vue'),
      meta: {
        title: 'Gateway Details'
      }
    },
    {
      path: '/gateway/:id/monitoring',
      name: 'SingleGatewayMonitoring',
      component: () => import('@/views/SingleGatewayMonitoring.vue'),
      meta: {
        title: 'Gateway Monitoring'
      }
    },
    // {
    //   path: '/gateway/:id/edit',
    //   name: 'EditGateway',
    //   component: () => import('@/views/EditGateway.vue'),
    //   meta: {
    //     title: 'Edit Gateway'
    //   }
    // },
    // {
    //   path: '/gateway/create',
    //   name: 'CreateGateway',
    //   component: CreateGatewayForm,
    //   meta: {
    //     title: 'Create Gateway'
    //   }
    // },
    // Catch all 404 - redirect to gateway list
    {
      path: '/:pathMatch(.*)*',
      redirect: '/gateway-list'
    }
  ],
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} | Gateway Hub`
  } else {
    document.title = 'Gateway Hub'
  }
  
  next()
})

export default router