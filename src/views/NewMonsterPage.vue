<template>
  <div class="p-6 space-y-4">
    <!-- Title -->
    <h2 class="text-2xl font-bold">怪物管理</h2>
    <!-- Search & Filter -->
    <div class="flex flex-wrap items-center gap-4">
      <input v-model="searchQuery" @keyup.enter="performSearch" type="text" placeholder="Search by ID" class="input input-bordered w-60"/>
      <button @click="performSearch">搜尋</button>
      <button @click="fetchItems" v-if="searchQuery">清除搜尋</button>
      <select v-model="filter" class="select select-bordered" @change="fetchItems">
        <option value="">All</option>
        <option v-for="opt in filterOptions" :key="opt" :value="opt">{{ opt }}</option>
      </select>
      <button class="btn btn-primary" @click="openBulkAdd">Bulk Add (JSON)</button>
    </div>

    <!-- Object List -->
    <div class="space-y-2">
      <div v-for="monster in monsters" :key="monster.monster_id"
        class="p-4 bg-white shadow rounded flex justify-between items-center">
        <div>
          <p class="font-bold">{{ monster.name }}</p>
          <p class="text-sm text-gray-500">ID: {{ monster.monster_id }}</p>
        </div>
        <div class="flex gap-2">
          <p class="text-sm text-gray-500">{{ monster.drop_pool_ids }}</p>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-sm btn-outline" @click="viewDetails(monster.monster_id)">Details</button>
          <button class="btn btn-sm btn-info" @click="editItem(monster.monster_id)">Edit</button>
          <button class="btn btn-sm btn-error" @click="removeItem(monster.monster_id)">Delete</button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between mt-4">
      <p>Page {{ currentPage }}</p>
      <div class="space-x-2">
        <button class="btn btn-sm" @click="prevPage" :disabled="currentPage === 1">Prev</button>
        <button class="btn btn-sm" @click="nextPage" :disabled="!lastId">Next</button>
      </div>
    </div>

    <!-- Add New -->
    <button @click="addMonsterOpen = true" class="bg-green-500 text-white px-4 py-2 rounded">新增怪物</button>

    <!-- Modal components 可自訂 -->
    <MonsterDetail :monster="selectedMonster" :visible="MonsterDetailOpen" @close="MonsterDetailOpen = false" />
    <AddMonsterModal :visible="addMonsterOpen" @close="addMonsterOpen = false" @submitted="handleSubmit" />
    <MonsterEdit :visible="isEditOpen" :itemData="selectedMonster" @save="submitEditedItem" @close="isEditOpen = false" />

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {getListMonsters,getMonsterDetail,searchMonster,editMonsterApi,deleteMonsterApi } from '@/api/monster'
import AddMonsterModal from '@/components/AddMonsterModal.vue'
import MonsterDetail from '@/components/MonsterDetail.vue'
import MonsterEdit from '@/components/MonsterEdit.vue'

//Search
const searchQuery = ref('')

// Filter
const filter = ref('')
const filterOptions = ['weapon', 'material', 'armor']


//Get item info
const monsters = ref([])
const currentPage = ref(1) //TO DO: page count 
const lastId = ref(null)
const prevId = ref(null)
const isPrev = ref(false)

//Modal control
const addMonsterOpen = ref(false)
const MonsterDetailOpen = ref(false)
const isEditOpen = ref(false)

//Detail
const selectedMonster = ref(null)

const performSearch = async () => {
  if (!searchQuery.value) return

  const data = await searchMonster(searchQuery.value)
  monsters.value = data ? [data] : []
  lastId.value = null
  prevId.value = null
  currentPage.value = 1
}

const fetchItems = async () => {
  // 分頁模式
  const params = {
    item_type: filter.value || undefined,
    limit: 20,
  }

  if (isPrev.value && prevId.value) {
    params.prev_id = prevId.value
  } else if (lastId.value) {
    params.next_id = lastId.value
  }

  const data = await getListMonsters(params)
  monsters.value = data.monster_data
  lastId.value = data.last_id || null
  const firstItemId = data.item_data?.[0]?.item_id ?? null
  prevId.value = firstItemId !== null ? Math.max(firstItemId, 21) : null
  isPrev.value = false
  console.log(prevId.value)
}


const nextPage = () => {
  if (lastId.value) {
    currentPage.value++
    isPrev.value = false
    fetchItems()
  }
}

const prevPage = () => {
  if (currentPage.value > 1 && prevId.value) {
    currentPage.value--
    isPrev.value = true
    fetchItems()
  }
}

const removeItem = async (id) => {
  await deleteMonsterApi(id)
  fetchItems()
}

const viewDetails = async (id) => {
  selectedMonster.value = await getMonsterDetail(id)
  MonsterDetailOpen.value = true
}

const editItem = async (id) => {
  selectedMonster.value = await getMonsterDetail(id)
  isEditOpen.value = true

}
const submitEditedItem = async (updatedMonster) => {
  try {
    console.log(updatedMonster)
    const response = await editMonsterApi(updatedMonster.id, updatedMonster)

    if (response.status === 200) {
      // 更新本地物品列表
      const index = monsters.value.findIndex(monster => monster.monster_id === updatedMonster.monster_id)
      if (index !== -1) {
        monsters.value[index] = updatedMonster
      }

      alert('物品更新成功')
      isEditOpen.value = false // 關閉 Modal
      fetchItems()
    }
  } catch (error) {
    console.error(error)
    alert('物品更新失敗')
  }
}
const handleSubmit = async () => {
  await fetchItems()
}

const openBulkAdd = async () => {
  // const input = prompt('Paste JSON array of objects')
  // try {
  //   const json = JSON.parse(input)
  //   await bulkAddItems(json)
  //   fetchItems()
  // } catch (e) {
  //   alert('Invalid JSON')
  // }
}

onMounted(() => {
  fetchItems()
})
</script>

<style scoped>
.input,
.select,
.btn {
  @apply border rounded px-3 py-2;
}
</style>
