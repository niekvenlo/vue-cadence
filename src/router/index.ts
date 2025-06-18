import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: () => import('@/views/TasksView.vue')
    },
    {
      path: '/flash',
      name: 'flash',
      component: () => import('@/views/FlashCardsView.vue')
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
      path: '/demo',
      name: 'demo',
      component: () => import('@/views/DemoView.vue')
    },
    {
      path: '/ex',
      name: 'ex',
      component: () => import('@/views/ExView.vue')
    },
    {
      path: '/aud',
      name: 'audio',
      component: () => import('@/views/AudioView.vue')
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
