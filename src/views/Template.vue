<template>
  <div class="p-6 space-y-4">
    <!-- Search & Filter -->
    <div class="flex flex-wrap items-center gap-4">
      <input v-model="searchQuery" type="text" placeholder="Search by ID"
             class="input input-bordered w-60" @input="fetchItems" />
      <select v-model="filter" class="select select-bordered" @change="fetchItems">
        <option value="">All</option>
        <option v-for="opt in filterOptions" :key="opt" :value="opt">{{ opt }}</option>
      </select>
      <button class="btn btn-primary" @click="openBulkAdd">Bulk Add (JSON)</button>
    </div>

    <!-- Object List -->
    <div class="space-y-2">
      <div v-for="item in items" :key="item.id"
           class="p-4 bg-white shadow rounded flex justify-between items-center">
        <div>
          <p class="font-bold">ID: {{ item.id }}</p>
          <p class="text-sm text-gray-500">{{ item.name }}</p>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-sm btn-outline" @click="viewDetails(item.id)">Details</button>
          <button class="btn btn-sm btn-info" @click="editItem(item)">Edit</button>
          <button class="btn btn-sm btn-error" @click="removeItem(item.id)">Delete</button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between mt-4">
      <p>Page {{ currentPage }}</p>
      <div class="space-x-2">
        <button class="btn btn-sm" @click="prevPage" :disabled="currentPage === 1">Prev</button>
        <button class="btn btn-sm" @click="nextPage" :disabled="!hasMore">Next</button>
      </div>
    </div>

    <!-- Add New -->
    <button class="btn btn-success mt-4" @click="openAddModal">Add New Object</button>

    <!-- Modal components 可自訂 -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getFilteredItems, deleteItem, getItemDetail, updateItem, addItem, bulkAddItems } from '@/api/item'

const items = ref([])
const searchQuery = ref('')
const filter = ref('')
const filterOptions = ['Type A', 'Type B']
const currentPage = ref(1)
const lastId = ref(null)
const hasMore = ref(true)

const fetchItems = async () => {
  const params = {
    search: searchQuery.value,
    filter: filter.value,
    lastId: lastId.value
  }
  const { data, nextLastId } = await getFilteredItems(params)
  items.value = data
  lastId.value = nextLastId
  hasMore.value = !!nextLastId
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    lastId.value = null // 重設 ID 掃描
    fetchItems()
  }
}

const nextPage = () => {
  if (hasMore.value) {
    currentPage.value++
    fetchItems()
  }
}

const removeItem = async (id) => {
  await deleteItem(id)
  fetchItems()
}

const viewDetails = async (id) => {
  const detail = await getItemDetail(id)
  alert(JSON.stringify(detail, null, 2))
}

const editItem = async (item) => {
  const newName = prompt('Enter new name', item.name)
  if (newName) {
    await updateItem(item.id, { ...item, name: newName })
    fetchItems()
  }
}

const openAddModal = async () => {
  const name = prompt('Enter name')
  if (name) {
    await addItem({ name })
    fetchItems()
  }
}

const openBulkAdd = async () => {
  const input = prompt('Paste JSON array of objects')
  try {
    const json = JSON.parse(input)
    await bulkAddItems(json)
    fetchItems()
  } catch (e) {
    alert('Invalid JSON')
  }
}

onMounted(() => {
  fetchItems()
})
</script>

<style scoped>
.input, .select, .btn {
  @apply border rounded px-3 py-2;
}
</style>
