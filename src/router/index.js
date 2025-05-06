import { createRouter, createWebHistory } from 'vue-router'
import MonsterPage from '@/views/MonsterPage.vue'
import MonsterRewardManage from '@/views/MonsterRewardManage.vue'

const routes = [
  {
    path: '/',
    name: 'MonsterPage',
    component: MonsterPage,
  },
  {
    path: '/monster-reward-manage/:monsterId',
    name: 'MonsterRewardManage',
    component: MonsterRewardManage,
    props: true, // 讓 route params 作為 props 傳遞給組件
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
