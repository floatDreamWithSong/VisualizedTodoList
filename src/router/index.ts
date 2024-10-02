import { createRouter, createWebHistory } from 'vue-router'
import WorkPanel from '@/views/dashboard/WorkPanel.vue'
import DashBoard from '@/views/DashBoard.vue'
import App from '@/App.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/',
      name:'root',
      component: App,
      redirect:'/',
    
      children:[{
        path: '',
        name: 'dashboard',
        component: DashBoard,
        redirect:'/dashboard/work',
        children:[{
          path: '/dashboard/settings',
          name:'settings',
          component:()=>import('../views/dashboard/TheSettings.vue')
        },{
          path:'',
          name:'work',
          component:WorkPanel
        },{
          path:'/dashboard/profile',
          name:'profile',
          component:()=>import('../views/dashboard/TheProfile.vue')
        }]
      },
      {
        path: '/login',
        name: 'login',
        // route level code-splitting
        // this generates a separate chunk (About.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../views/LogReg.vue')
      }]
    },
  ]
})

export default router
