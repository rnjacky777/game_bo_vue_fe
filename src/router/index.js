// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import MonsterRewardManage from '../views/MonsterRewardManage.vue'
import MonsterPage from '../views/MonsterPage.vue'
import ItemPage from '../views/ItemPage.vue'
import EventPage from '../views/EventPage.vue'
// import Template from '../views/Template.vue'
import EventDetail from '../views/EventDetailPage.vue' // 可加上 event 詳情頁
import ResultDetail from '../views/ResultDetailPage.vue'
import CharTempPage from '../views/CharTempPage.vue'
import CharTempDetailPage from '../views/CharTempDetailPage.vue'



const routes = [
  { path: '/', redirect: '/monster' },
  { path: '/monster-reward', component: MonsterRewardManage },
  { path: '/monster', component: MonsterPage },
  { path: '/item', component: ItemPage },
  { path: '/event', component: EventPage },
  { path: '/result/:id', component: ResultDetail, props: true },
  { path: '/event/:id', component: EventDetail, props: true }, // 新增事件詳情頁面
  { path: '/char-temp', component: CharTempPage },
  { path: '/char-temp/:id', component: CharTempDetailPage, props: true },
  
]

const router = createRouter({
  history: createWebHistory('/bo/'),
  routes,
})

export default router