<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <div class="w-64 bg-gray-800 text-white p-4">
      <h1 class="text-2xl font-bold mb-6">Dashboard</h1>
      <ul class="space-y-2">
        <li>
          <button class="w-full text-left hover:bg-gray-700 p-2 rounded" @click="currentPage = 'monsterPage'">
            怪物清單
          </button>
        </li>
        <li>
          <button class="w-full text-left hover:bg-gray-700 p-2 rounded" @click="currentPage = 'monsterRewardManage'">
            掉落物管理
          </button>
        </li>
        <li>
          <button class="w-full text-left hover:bg-gray-700 p-2 rounded" @click="currentPage = 'ItemManage'">
            物品管理
          </button>
        </li>
        <li>
          <button class="w-full text-left hover:bg-gray-700 p-2 rounded" @click="currentPage = 'NewItemPage'">
            新物品管理
          </button>
        </li>
        <li>
          <button class="w-full text-left hover:bg-gray-700 p-2 rounded" @click="currentPage = 'Template'">
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
import MonsterPage from './views/MonsterPage.vue'
import MonsterRewardManage from './views/MonsterRewardManage.vue'
import ItemManage from './views/ItemManage.vue'
// import Template from './views/Template.vue'
import NewItemPage from './views/NewItemPage.vue'

const currentPage = ref('monsterPage')

const currentPageComponent = computed(() => {
  if (currentPage.value === 'monsterPage') return MonsterPage
  if (currentPage.value === 'monsterRewardManage') return MonsterRewardManage
  if (currentPage.value === 'ItemManage') return ItemManage
  if (currentPage.value === 'Template') return Template
  if (currentPage.value === 'NewItemPage') return NewItemPage
  return null
})
  </script>
  
