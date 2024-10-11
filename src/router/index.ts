import { createRouter, createWebHistory } from 'vue-router'
import WorkSheet from '@/views/dashboard/WorkSheet.vue'
import DashBoard from '@/views/DashBoard.vue'
import App from '@/App.vue'
import WorkS from '@/views/dashboard/WorkSheet.vue';
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
          component:WorkSheet
        },{
          path:'/dashboard/workbench',
          name:'workbench',
          component:()=>import('../views/dashboard/WorkBench.vue')
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
