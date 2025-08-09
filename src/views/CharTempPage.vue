<template>
  <div class="p-6 space-y-4">
    <!-- Title -->
    <h2 class="text-2xl font-bold">角色模板管理</h2>
    <!-- Search & Filter -->
    <div class="flex flex-wrap items-center gap-4">
      <input
        v-model="searchQuery"
        @keyup.enter="performSearch"
        type="text"
        placeholder="Search by ID or Name"
        class="input input-bordered w-60"
      />
      <button @click="performSearch" class="btn btn-sm btn-primary">搜尋</button>
      <button @click="clearSearch" v-if="searchQuery" class="btn btn-sm">清除搜尋</button>
      <!-- 篩選：可改成依照角色稀有度或其他欄位 -->
      <select v-model="filter" class="select select-bordered" @change="fetchChars">
        <option value="">全部稀有度</option>
        <option v-for="opt in filterOptions" :key="opt" :value="opt">{{ opt }}</option>
      </select>
      <button class="btn btn-primary" @click="openBulkAdd">批次新增 (JSON)</button>
    </div>

    <!-- 角色列表 -->
    <div class="space-y-2">
      <div
        v-for="char in chars"
        :key="char.id"
        class="p-4 bg-white shadow rounded flex justify-between items-center"
      >
        <div>
          <p class="font-bold">{{ char.name }}</p>
          <p class="text-sm text-gray-500">ID: {{ char.id }}</p>
          <p class="text-sm text-gray-600">稀有度: {{ char.rarity }}</p>
        </div>
        <div class="flex gap-2">
          <RouterLink :to="`/char-temp/${char.id}`" class="btn btn-sm btn-outline"
            >詳細</RouterLink
          >
          <button class="btn btn-sm btn-info" @click="openDescription(char)">說明</button>
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

    <!-- 說明 Modal -->
    <div
      v-if="selectedChar"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
        <h2 class="text-xl font-bold mb-2">編輯 {{ selectedChar.name }} 的說明</h2>

        <textarea
          v-model="editedDescription"
          rows="5"
          class="w-full p-2 border rounded resize-none text-sm text-gray-700 mb-4"
        ></textarea>

        <div class="flex justify-end gap-2">
          <button class="btn btn-sm btn-outline" @click="selectedChar = null">取消</button>
          <button class="btn btn-sm btn-success" @click="saveDescription">確認修改</button>
        </div>

        <button
          class="absolute top-2 right-2 text-gray-500 hover:text-black"
          @click="selectedChar = null"
        >
          ✖
        </button>
      </div>
    </div>

    <!-- 新增角色模板 Modal -->
    <AddCharModal
      :visible="addCharOpen"
      @close="addCharOpen = false"
      @submitted="handleSubmit"
    />

    <!-- 確認刪除 Modal -->
    <div
      v-if="showConfirmModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
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
  searchCharTemplate,
  deleteCharTemplate,
  updateCharDescription,
} from '@/api/char_temp'
import AddCharModal from '@/components/AddCharModal.vue'

const selectedChar = ref(null)
const editedDescription = ref('')
const openDescription = (char) => {
  selectedChar.value = char
  editedDescription.value = char.description
}

const saveDescription = async () => {
  if (!selectedChar.value) return

  try {
    await updateCharDescription({
      id: selectedChar.value.id,
      description: editedDescription.value,
    })

    // 更新本地資料（UI 同步）
    selectedChar.value.description = editedDescription.value

    const index = chars.value.findIndex((c) => c.id === selectedChar.value.id)
    if (index !== -1) {
      chars.value[index].description = editedDescription.value
    }

    selectedChar.value = null
  } catch (error) {
    console.error('更新失敗', error)
  }
}

// Search
const searchQuery = ref('')
const filter = ref('')
const filterOptions = [1, 2, 3, 4, 5] // 假設稀有度1~5

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
  if (!searchQuery.value) return

  const data = await searchCharTemplate(searchQuery.value)
  chars.value = data ? [data] : []
  lastId.value = null
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

const clearSearch = () => {
  searchQuery.value = ''
  fetchChars()
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
