<template>
  <div class="p-6 space-y-4">
    <!-- Title -->
    <h2 class="text-2xl font-bold">角色模板管理</h2>
    <!-- Search & Filter -->
    <div class="flex flex-wrap items-center gap-3 mb-4">
      <select v-model="searchBy" class="select select-bordered w-32 flex-shrink-0">
        <option value="id">ID 搜尋</option>
        <option value="name">名稱搜尋</option>
      </select>

      <input v-model="searchQuery" @keyup.enter="performSearch" type="text"
        :placeholder="searchBy === 'id' ? '請輸入 ID' : '請輸入名稱'"
          class="input input-bordered w-48 max-w-full" />

      <button @click="performSearch" :disabled="!searchQuery.trim()"
        class="btn btn-sm btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
        搜尋
      </button>

      <button @click="clearSearch" v-if="searchQuery.trim()" class="btn btn-sm btn-outline">
        清除搜尋
      </button>

      <button class="btn btn-primary ml-auto" @click="openBulkAdd">
        批次新增 (JSON)
      </button>
    </div>

    <!-- 角色列表 -->
    <div class="space-y-2">
      <div v-for="char in chars" :key="char.id" class="p-4 bg-white shadow rounded flex justify-between items-center">
        <div>
          <p class="font-bold">{{ char.name }}</p>
          <p class="text-sm text-gray-500">ID: {{ char.id }}</p>
          <p class="text-sm text-gray-600">稀有度: {{ char.rarity }}</p>
        </div>
        <div class="flex gap-2">
          <RouterLink :to="`/char-temp/${char.id}`" class="btn btn-sm btn-outline">詳細</RouterLink>
          <button class="btn btn-sm btn-error" @click="removeChar(char.id)">刪除</button>
        </div>
      </div>
    </div>

    <!-- 分頁 -->
    <div class="flex items-center justify-between mt-4">
      <p>第 {{ currentPage }} 頁</p>
      <div class="space-x-2">
        <button class="btn btn-sm" @click="prevPage" :disabled="currentPage === 1">
          上一頁
        </button>
        <button class="btn btn-sm" @click="nextPage" :disabled="!lastId">下一頁</button>
      </div>
    </div>

    <!-- 新增角色模板按鈕 -->
    <button @click="addCharOpen = true" class="bg-green-500 text-white px-4 py-2 rounded">
      新增角色模板
    </button>


    <!-- 新增角色模板 Modal -->
    <AddCharModal :visible="addCharOpen" @close="addCharOpen = false" @submitted="handleSubmit" />

    <!-- 確認刪除 Modal -->
    <div v-if="showConfirmModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white p-6 rounded shadow w-80">
        <h3 class="text-lg font-bold mb-4">確認刪除角色模板？</h3>
        <div class="flex justify-end space-x-2">
          <button class="btn btn-sm" @click="showConfirmModal = false">取消</button>
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



// Search
const searchQuery = ref('')
const filter = ref('')
const filterOptions = [1, 2, 3, 4, 5] // 假設稀有度1~5
const searchBy = ref('id')  // 預設為 id 搜尋
// 角色資料
const chars = ref([])
const currentPage = ref(1)
const lastId = ref(null)
const prevId = ref(null)
const isPrev = ref(false)

// Modal 控制
const addCharOpen = ref(false)

// 刪除
const showConfirmModal = ref(false)
const deleteTargetId = ref(null)

const performSearch = async () => {
  if (!searchQuery.value) {
    // 搜尋欄為空，改用原本方式載入全部或依條件篩選
    await fetchChars()
    return
  }

  const params = {}

  if (searchBy.value === 'id') {
    // 只允許數字 ID，非數字則不搜尋或提示
    if (!/^\d+$/.test(searchQuery.value.trim())) {
      alert('請輸入有效的數字ID')
      return
    }
    params.id = Number(searchQuery.value.trim())
  } else {
    params.name = searchQuery.value.trim()
  }

  // 如果有其他篩選條件也加進 params，像 rarity
  if (filter.value) {
    params.rarity = filter.value
  }

  const data = await getCharTemplates(params)
  chars.value = data.char_temp_list || []
  lastId.value = data.last_id || null
  prevId.value = null
  currentPage.value = 1
}

const fetchChars = async () => {
  const params = {
    rarity: filter.value || undefined,
    limit: 10,
  }

  if (isPrev.value && prevId.value) {
    params.prev_id = prevId.value
  } else if (lastId.value) {
    params.next_id = lastId.value
  }
  console.log('fetchChars called')
  const data = await getCharTemplates(params)
  chars.value = data.char_temp_list
  lastId.value = data.last_id || null
  const firstCharId = data.char_temp_list?.[0]?.id ?? null
  prevId.value = firstCharId !== null ? Math.max(firstCharId, 11) : null
  isPrev.value = false
}

const nextPage = () => {
  if (lastId.value) {
    currentPage.value++
    isPrev.value = false
    fetchChars()
  }
}

const prevPage = () => {
  if (currentPage.value > 1 && prevId.value) {
    currentPage.value--
    isPrev.value = true
    fetchChars()
  }
}

const removeChar = (id) => {
  deleteTargetId.value = id
  showConfirmModal.value = true
}

const clearSearch = async () => {
  searchQuery.value = ''
  await fetchChars()
}

const confirmDelete = async () => {
  if (deleteTargetId.value !== null) {
    await deleteCharTemplate(deleteTargetId.value)
    lastId.value = null
    prevId.value = null
    fetchChars()
  }
  showConfirmModal.value = false
  deleteTargetId.value = null
}

const handleSubmit = async () => {
  await fetchChars()
}

const openBulkAdd = async () => {
  // TODO: 實作批次新增
  // const input = prompt('Paste JSON array of objects')
  // try {
  //   const json = JSON.parse(input)
  //   await bulkAddChars(json)
  //   fetchChars()
  // } catch (e) {
  //   alert('Invalid JSON')
  // }
}

onMounted(() => {
  fetchChars()
})
</script>

<style scoped>
.input,
.select,
.btn {
  @apply border rounded px-3 py-2;
}

.btn-info {
  @apply bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200;
}

.btn-error {
  @apply bg-red-100 text-red-800 border-red-300 hover:bg-red-200;
}

.btn-outline {
  @apply border-gray-300 text-gray-700 hover:bg-gray-100;
}
</style>
