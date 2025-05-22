import { createRouter, createWebHistory } from 'vue-router'
import Tasks from '@/views/TasksView.vue'
import TasksNew from '@/views/TasksViewNew.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Tasks
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: TasksNew
    },
    {
      path: '/laolun',
      name: 'laolun',
      // route level code-splitting
      // this generates a separate chunk (Laolun.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/LaolunView.vue')
    },
    {
      path: '/laolun/tones',
      name: 'laolun/tones',
      component: () => import('@/views/LaolunTonesView.vue')
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: Tasks }
  ]
})

export default router
