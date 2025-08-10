<template>
  <div class="p-6 space-y-4">
    <!-- Title -->
    <h1 class="text-2xl font-bold">角色模板管理</h1>
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
        <button class="btn btn-primary" @click="addCharOpen = true">
          新增角色模板
        </button>
      </div>
    </div>

    <!-- 角色列表 -->
    <div v-if="chars.length > 0" class="space-y-2">
      <div v-for="char in chars" :key="char.id" class="p-4 bg-white shadow rounded flex justify-between items-center">
        <div class="flex-grow">
          <p class="font-bold">{{ char.name }}</p>
          <div class="flex items-center gap-4 text-sm text-gray-500 mt-1">
            <span>ID: {{ char.id }}</span>
            <span>稀有度: {{ char.rarity }}</span>
          </div>
        </div>
        <div class="flex gap-2">
          <RouterLink :to="`/char-temp/${char.id}`" class="btn btn-sm btn-outline">詳細</RouterLink>
          <button class="btn btn-sm btn-error" @click="removeChar(char)">刪除</button>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-16 bg-gray-50 rounded-lg">
      <p class="text-gray-500">找不到符合條件的角色模板。</p>
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

    <!-- 新增角色模板 Modal -->
    <AddCharModal :visible="addCharOpen" @close="addCharOpen = false" @submitted="handleSubmit" />

    <!-- 確認刪除 Modal -->
    <div v-if="charToDelete" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white p-6 rounded shadow w-80">
        <h3 class="text-lg font-bold mb-4">確認刪除 "{{ charToDelete.name }}"？</h3>
        <div class="flex justify-end space-x-2">
          <button class="btn btn-sm" @click="charToDelete = null">取消</button>
          <button class="btn btn-sm btn-error" @click="confirmDelete">確認刪除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  getCharTemplates,
  deleteCharTemplate,
} from '@/api/char_temp'
import AddCharModal from '@/components/AddCharModal.vue'

const PAGE_SIZE = 10

// Search State
const searchQuery = ref('')
const searchBy = ref('id')

// Data State
const chars = ref([])
const isLoading = ref(false)

// Pagination State
const currentPage = ref(1)
const pageCursors = ref([null]) // Cursors for fetching pages. `pageCursors[i]` is the cursor for page `i+1`.
const hasMore = ref(false)

// Modal State
const addCharOpen = ref(false)
const charToDelete = ref(null)

/**
 * Loads characters for the current page using cursor-based pagination.
 */
const loadChars = async () => {
  if (isLoading.value) return
  isLoading.value = true
  try {
    const cursor = pageCursors.value[currentPage.value - 1]
    const params = {
      limit: PAGE_SIZE,
      next_id: cursor,
    }
    const data = await getCharTemplates(params)
    chars.value = data.char_temp_list || []
    hasMore.value = !!data.last_id

    // Store the cursor for the *next* page if it exists
    if (hasMore.value) {
      pageCursors.value[currentPage.value] = data.last_id
    }
  } catch (error) {
    console.error('Failed to load characters:', error)
    chars.value = []
    hasMore.value = false
    // You can add user-facing error notifications here
  } finally {
    isLoading.value = false
  }
}

/**
 * Performs a search by ID or name and resets pagination for the results.
 */
const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    await clearSearch()
    return
  }

  const params = {}
  if (searchBy.value === 'id') {
    if (!/^\d+$/.test(searchQuery.value.trim())) {
      alert('請輸入有效的數字ID')
      return
    }
    params.id = Number(searchQuery.value.trim())
  } else {
    params.name = searchQuery.value.trim()
  }

  isLoading.value = true
  try {
    const data = await getCharTemplates(params)
    chars.value = data.char_temp_list || []

    // Reset pagination for the new search result set
    currentPage.value = 1
    pageCursors.value = [null, data.last_id]
    hasMore.value = !!data.last_id
  } catch (error) {
    console.error('Search failed:', error)
    chars.value = []
    hasMore.value = false
  } finally {
    isLoading.value = false
  }
}

/**
 * Clears the search query and reloads the first page of all characters.
 */
const clearSearch = async () => {
  searchQuery.value = ''
  currentPage.value = 1
  pageCursors.value = [null]
  await loadChars()
}

const nextPage = () => {
  if (hasMore.value) {
    currentPage.value++
    loadChars()
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadChars()
  }
}

/**
 * Sets the character to be deleted and opens the confirmation modal.
 * @param {object} char - The character object to delete.
 */
const removeChar = (char) => {
  charToDelete.value = char
}

/**
 * Confirms and executes the deletion of a character, then reloads the data.
 */
const confirmDelete = async () => {
  if (!charToDelete.value) return

  try {
    await deleteCharTemplate(charToDelete.value.id)

    // If the last item on a page is deleted, go to the previous page.
    if (chars.value.length === 1 && currentPage.value > 1) {
      currentPage.value--
    }

    await loadChars()
  } catch (error) {
    console.error('Failed to delete character:', error)
  } finally {
    charToDelete.value = null
  }
}

/**
 * Handles submission from the AddCharModal by reloading the list from page 1.
 */
const handleSubmit = async () => {
  addCharOpen.value = false
  currentPage.value = 1
  pageCursors.value = [null]
  await loadChars()
}

const openBulkAdd = () => {
  // TODO: Implement bulk add functionality
  alert('批次新增功能尚未實作')
}

// Initial data load
onMounted(loadChars)
</script>
