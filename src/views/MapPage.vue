<template>
  <div class="p-6 space-y-4">
    <!-- Title -->
    <h1 class="text-2xl font-bold">地圖管理</h1>

    <!-- Search & Filter -->
    <div class="flex flex-wrap items-center gap-3 p-4 bg-gray-50 rounded-lg">
      <select v-model="searchBy" class="select select-bordered w-32 flex-shrink-0">
        <option value="id">ID 搜尋</option>
        <option value="name">名稱搜尋</option>
      </select>

      <input v-model="searchQuery" @keyup.enter="performSearch" type="text"
        :placeholder="searchBy === 'id' ? '依據 ID 搜尋...' : '依據名稱搜尋...'"
        class="input input-bordered w-48 max-w-full" />

      <button @click="performSearch" :disabled="!searchQuery.trim()"
        class="btn btn-sm btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
        搜尋
      </button>

      <button @click="clearSearch" v-if="searchQuery.trim()" class="btn btn-sm btn-ghost">
        清除搜尋
      </button>

      <div class="ml-auto flex gap-2">
        <button class="btn btn-outline" @click="openBulkAdd">
          批次新增 (JSON)
        </button>
        <button class="btn btn-primary" @click="addMapOpen = true">
          新增地圖
        </button>
      </div>
    </div>

    <!-- 地圖列表 -->
    <div v-if="maps.length > 0" class="space-y-2">
      <div v-for="map in maps" :key="map.map_id" class="p-4 bg-white shadow rounded flex justify-between items-center">
        <div class="flex-grow">
          <p class="font-bold">{{ map.name }}</p>
          <div class="flex items-center gap-4 text-sm text-gray-500 mt-1">
            <span>ID: {{ map.map_id }}</span>
            <span v-if="map.description">描述: {{ map.description }}</span>
          </div>
        </div>
        <div class="flex gap-2">
          <RouterLink :to="`/maps/${map.map_id}`" class="btn btn-sm btn-outline">詳細</RouterLink>
          <button class="btn btn-sm btn-error" @click="removeMap(map)">刪除</button>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-16 bg-gray-50 rounded-lg">
      <p class="text-gray-500">找不到符合條件的地圖。</p>
    </div>

    <!-- 分頁 -->
    <div class="flex items-center justify-between pt-4">
      <p>第 {{ currentPage }} 頁</p>
      <div class="space-x-2">
        <button class="btn btn-sm" @click="prevPage" :disabled="currentPage === 1">
          上一頁
        </button>
        <button class="btn btn-sm" @click="nextPage" :disabled="!hasMore">下一頁</button>
      </div>
    </div>

    <!-- 新增地圖 Modal -->
    <AddMapModal :visible="addMapOpen" @close="addMapOpen = false" @submitted="handleSubmit" />

    <!-- 確認刪除 Modal -->
    <div v-if="mapToDelete" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white p-6 rounded shadow w-80">
        <h3 class="text-lg font-bold mb-4">確認刪除 "{{ mapToDelete.name }}"？</h3>
        <div class="flex justify-end space-x-2">
          <button class="btn btn-sm" @click="mapToDelete = null">取消</button>
          <button class="btn btn-sm btn-error" @click="confirmDelete">確認刪除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  getMaps,
  deleteMap,
} from '@/api/map'  // 改成你的地圖 api 路徑
import AddMapModal from '@/components/AddMapModal.vue'

const PAGE_SIZE = 10

// Search State
const searchQuery = ref('')
const searchBy = ref('id')

// Data State
const maps = ref([])
const isLoading = ref(false)

// Pagination State
const currentPage = ref(1)
const pageCursors = ref([null])
const hasMore = ref(false)

// Modal State
const addMapOpen = ref(false)
const mapToDelete = ref(null)

const loadMaps = async () => {
  if (isLoading.value) return
  isLoading.value = true
  try {
    const cursor = pageCursors.value[currentPage.value - 1]
    const params = {
      limit: PAGE_SIZE,
      next_id: cursor,
    }
    if (searchBy.value === 'id' && searchQuery.value.trim()) {
      if (!/^\d+$/.test(searchQuery.value.trim())) {
        alert('請輸入有效的數字ID')
        isLoading.value = false
        return
      }
      params.id = Number(searchQuery.value.trim())
    }
    if (searchBy.value === 'name' && searchQuery.value.trim()) {
      params.name = searchQuery.value.trim()
    }

    const data = await getMaps(params)
    maps.value = data.map_list || []
    hasMore.value = !!data.next_cursor

    if (hasMore.value) {
      pageCursors.value[currentPage.value] = data.next_cursor
    }
  } catch (error) {
    console.error('Failed to load maps:', error)
    maps.value = []
    hasMore.value = false
  } finally {
    isLoading.value = false
  }
}

const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    await clearSearch()
    return
  }
  currentPage.value = 1
  pageCursors.value = [null]
  await loadMaps()
}

const clearSearch = async () => {
  searchQuery.value = ''
  currentPage.value = 1
  pageCursors.value = [null]
  await loadMaps()
}

const nextPage = () => {
  if (hasMore.value) {
    currentPage.value++
    loadMaps()
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadMaps()
  }
}

const removeMap = (map) => {
  mapToDelete.value = map
}

const confirmDelete = async () => {
  if (!mapToDelete.value) return
  try {
    await deleteMap(mapToDelete.value.map_id)

    if (maps.value.length === 1 && currentPage.value > 1) {
      currentPage.value--
    }

    await loadMaps()
  } catch (error) {
    console.error('Failed to delete map:', error)
  } finally {
    mapToDelete.value = null
  }
}

const handleSubmit = async () => {
  addMapOpen.value = false
  currentPage.value = 1
  pageCursors.value = [null]
  await loadMaps()
}

const openBulkAdd = () => {
  alert('批次新增功能尚未實作')
}

onMounted(loadMaps)
</script>
