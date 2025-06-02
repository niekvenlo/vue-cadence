import { createRouter, createWebHistory } from 'vue-router'
import TasksView from '@/views/TasksView.vue'
import FlashCardsView from '@/views/FlashCardsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/tasks',
      name: 'tasks',
      component: TasksView
    },
    {
      path: '/flash',
      name: 'flash',
      component: FlashCardsView
    },
    {
      path: '/laolun',
      name: 'laolun',
      // route level code-splitting
      // this generates a separate chunk (LaolunView.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/LaolunView.vue')
    },
    {
      path: '/laolun/tones',
      name: 'laolun/tones',
      component: () => import('@/views/LaolunTonesView.vue')
    },
    {
      path: '/connections',
      name: 'connections',
      component: () => import('@/views/ConnectionsView.vue')
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/views/TasksView.vue') }
  ]
})

export default router
