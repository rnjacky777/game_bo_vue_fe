<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <div class="w-64 bg-gray-800 text-white p-4">
      <h1 class="text-2xl font-bold mb-6">Dashboard</h1>
      <ul class="space-y-2">
        <li>
          <button class="w-full text-left p-2 rounded"
            :class="[isActive('monsterRewardManage') ? 'bg-gray-700 text-yellow-300' : 'hover:bg-gray-700']"
            @click="currentPage = 'monsterRewardManage'">
            掉落物管理
          </button>
        </li>
        <li>
          <button class="w-full text-left p-2 rounded"
            :class="[isActive('ItemPage') ? 'bg-gray-700 text-yellow-300' : 'hover:bg-gray-700']"
            @click="currentPage = 'ItemPage'">
            物品管理
          </button>
        </li>
        <li>
          <button class="w-full text-left p-2 rounded"
            :class="[isActive('MonsterPage') ? 'bg-gray-700 text-yellow-300' : 'hover:bg-gray-700']"
            @click="currentPage = 'MonsterPage'">
            怪物管理
          </button>
        </li>
        <li>
          <button class="w-full text-left p-2 rounded"
            :class="[isActive('Template') ? 'bg-gray-700 text-yellow-300' : 'hover:bg-gray-700']"
            @click="currentPage = 'Template'">
            模板頁面
          </button>
        </li>
      </ul>

    </div>

    <!-- Main Content -->
    <div class="flex-1 p-6 overflow-y-auto">
      <component :is="currentPageComponent" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import MonsterRewardManage from './views/MonsterRewardManage.vue'
import MonsterPage from './views/MonsterPage.vue'
// import Template from './views/Template.vue'
import ItemPage from './views/ItemPage.vue'

const currentPage = ref('monsterPage')
const isActive = (page) => currentPage.value === page
const currentPageComponent = computed(() => {
  if (currentPage.value === 'monsterRewardManage') return MonsterRewardManage
  if (currentPage.value === 'Template') return Template
  if (currentPage.value === 'ItemPage') return ItemPage
  if (currentPage.value === 'MonsterPage') return MonsterPage
  return null
})
</script>
