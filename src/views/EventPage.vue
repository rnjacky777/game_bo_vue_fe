<template>
  <div class="p-6 space-y-4">
    <!-- Title -->
    <h2 class="text-2xl font-bold">事件管理</h2>
    <!-- Search & Filter -->
    <div class="flex flex-wrap items-center gap-4">
      <input v-model="searchQuery" @keyup.enter="performSearch" type="text" placeholder="Search by ID"
        class="input input-bordered w-60" />
      <button @click="performSearch">搜尋</button>
      <button @click="clearSearch" v-if="searchQuery">清除搜尋</button>
      <select v-model="filter" class="select select-bordered" @change="fetchEvents">
        <option value="">All</option>
        <option v-for="opt in filterOptions" :key="opt" :value="opt">{{ opt }}</option>
      </select>
      <button class="btn btn-primary" @click="openBulkAdd">Bulk Add (JSON)</button>
    </div>

    <!-- Object List -->
    <div class="space-y-2">
      <div v-for="event in events" :key="event.event_id"
        class="p-4 bg-white shadow rounded flex justify-between items-center">
        <div>
          <p class="font-bold">{{ event.name }}</p>
          <p class="text-sm text-gray-500">ID: {{ event.event_id }}</p>
        </div>
        <div class="flex gap-2">
          <RouterLink :to="`/event/${event.event_id}`" class="btn btn-sm btn-outline">Details</RouterLink>
          <button class="btn btn-sm btn-info" @click="openDescription(event)">說明</button>
          <button class="btn btn-sm btn-error" @click="removeEvent(event.event_id)">Delete</button>
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
    <button @click="addEventOpen = true" class="bg-green-500 text-white px-4 py-2 rounded">新增怪物</button>

    <!-- Modal components 可自訂 -->
    <!-- Description Modal -->
    <div v-if="selectedEvent" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
        <h2 class="text-xl font-bold mb-2">編輯 {{ selectedEvent.name }} 的說明</h2>

        <textarea v-model="editedDescription" rows="5"
          class="w-full p-2 border rounded resize-none text-sm text-gray-700 mb-4"></textarea>

        <div class="flex justify-end gap-2">
          <button class="btn btn-sm btn-outline" @click="selectedEvent = null">取消</button>
          <button class="btn btn-sm btn-success" @click="saveDescription">確認修改</button>
        </div>

        <button class="absolute top-2 right-2 text-gray-500 hover:text-black" @click="selectedEvent = null">✖</button>
      </div>
    </div>
    <AddEventModal :visible="addEventOpen" @close="addEventOpen = false" @submitted="handleSubmit" />
    <!-- 確認刪除 Modal -->
    <div v-if="showConfirmModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white p-6 rounded shadow w-80">
        <h3 class="text-lg font-bold mb-4">確認刪除怪物？</h3>
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
import { getListEvent,searchEvent, deleteEventApi, updateEventDescription } from '@/api/event'
import AddEventModal from '@/components/AddEventModal.vue'

const selectedEvent = ref(null)
const editedDescription = ref('')
const openDescription = (event) => {
  selectedEvent.value = event
  editedDescription.value = event.description
}

const saveDescription = async () => {
  if (!selectedEvent.value) return

  try {
    await updateEventDescription({
      event_id: selectedEvent.value.event_id,
      description: editedDescription.value,
    })

    // 更新本地資料（UI 同步）
    selectedEvent.value.description = editedDescription.value

    // 可以選擇重新 fetch 一次 events，也可以直接更新本地列表
    const index = events.value.findIndex(e => e.event_id === selectedEvent.value.event_id)
    if (index !== -1) {
      events.value[index].description = editedDescription.value
    }

    selectedEvent.value = null
  } catch (error) {
    console.error('更新失敗', error)
  }
}
//Search
const searchQuery = ref('')

// Filter
const filter = ref('')
const filterOptions = ['weapon', 'material', 'armor']


//Get item info
const events = ref([])
const currentPage = ref(1) //TO DO: page count 
const lastId = ref(null)
const prevId = ref(null)
const isPrev = ref(false)

//Modal control
const addEventOpen = ref(false)


//Delete
const showConfirmModal = ref(false)
const deleteTargetId = ref(null)

const performSearch = async () => {
  if (!searchQuery.value) return

  const data = await searchEvent(searchQuery.value)
  events.value = data ? [data] : []
  lastId.value = null
  prevId.value = null
  currentPage.value = 1
}

const fetchEvents = async () => {
  // 分頁模式
  const params = {
    item_type: filter.value || undefined,
    limit: 10,
  }

  if (isPrev.value && prevId.value) {
    params.prev_id = prevId.value
  } else if (lastId.value) {
    params.next_id = lastId.value
  }

  const data = await getListEvent(params)
  events.value = data.event_list
  lastId.value = data.last_id || null
  const firstEventId = data.event_list?.[0]?.event_id ?? null
  prevId.value = firstEventId !== null ? Math.max(firstEventId, 11) : null
  isPrev.value = false
  console.log(prevId.value)
}


const nextPage = () => {
  if (lastId.value) {
    currentPage.value++
    isPrev.value = false
    fetchEvents()
  }
}

const prevPage = () => {
  if (currentPage.value > 1 && prevId.value) {
    currentPage.value--
    isPrev.value = true
    fetchEvents()
  }
}

const removeEvent = (id) => {
  deleteTargetId.value = id
  showConfirmModal.value = true
}
const clearSearch = () => {
  searchQuery.value = ''
  fetchEvents()
}
const confirmDelete = async () => {
  if (deleteTargetId.value !== null) {
    await deleteEventApi(deleteTargetId.value)
    lastId.value = null
    prevId.value = null
    fetchEvents()
  }
  showConfirmModal.value = false
  deleteTargetId.value = null
}

const handleSubmit = async () => {
  await fetchEvents()
}

const openBulkAdd = async () => {
  // const input = prompt('Paste JSON array of objects')
  // try {
  //   const json = JSON.parse(input)
  //   await bulkAddItems(json)
  //   fetchEvents()
  // } catch (e) {
  //   alert('Invalid JSON')
  // }
}

onMounted(() => {
  fetchEvents()
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
