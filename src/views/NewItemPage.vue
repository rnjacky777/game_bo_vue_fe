<template>
  <div class="p-6 space-y-4">
    <!-- Search & Filter -->
    <div class="flex flex-wrap items-center gap-4">
      <input v-model="searchQuery" type="text" placeholder="Search by ID" class="input input-bordered w-60"
        @input="fetchItems" />
      <select v-model="filter" class="select select-bordered" @change="fetchItems">
        <option value="">All</option>
        <option v-for="opt in filterOptions" :key="opt" :value="opt">{{ opt }}</option>
      </select>
      <button class="btn btn-primary" @click="openBulkAdd">Bulk Add (JSON)</button>
    </div>

    <!-- Object List -->
    <div class="space-y-2">
      <div v-for="item in items" :key="item.item_id"
        class="p-4 bg-white shadow rounded flex justify-between items-center">
        <div>
          <p class="font-bold">{{ item.name }}</p>
          <p class="text-sm text-gray-500">ID: {{ item.item_id }}</p>
        </div>
        <div class="flex gap-2">
          <p class="text-sm text-gray-500">{{ item.description }}</p>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-sm btn-outline" @click="viewDetails(item.item_id)">Details</button>
          <button class="btn btn-sm btn-info" @click="editItem(item.item_id)">Edit</button>
          <button class="btn btn-sm btn-error" @click="removeItem(item.item_id)">Delete</button>
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
    <button @click="isModalOpen = true" class="bg-green-500 text-white px-4 py-2 rounded">新增道具</button>

    <!-- Modal components 可自訂 -->
    <DetailModal :item="selectedItem" :visible="modalVisible" @close="modalVisible = false" />
    <AddItemModal :isOpen="isModalOpen" @close="isModalOpen = false" @submitted="handleSubmit" />
    <EditModal :visible="isEditOpen" :itemData="selectedItem" @save="submitEditedItem" @close="isEditOpen = false" />

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAllItems, searchItem, deleteItemApi, getItemDetail,editItemApi } from '@/api/item'
import AddItemModal from '@/components/AddItemModal.vue'
import DetailModal from '@/components/DetailModal.vue'
import EditModal from '@/components/EditModal.vue'

const items = ref([])
const searchQuery = ref('')
const filter = ref('')
const filterOptions = ['weapon', 'material', 'armor']
const currentPage = ref(1) //TO DO: page count 
const lastId = ref(null)
const prevId = ref(null)
const hasMore = ref(true)
const isPrev = ref(false)
const isModalOpen = ref(false)
const modalVisible = ref(false)
const selectedItem = ref(null)
const isEditOpen = ref(false)
const fetchItems = async () => {
  const isSearchMode = !!searchQuery.value

  if (isSearchMode) {
    // 進入搜尋模式
    const data = await searchItem(searchQuery.value)

    items.value = data ? [data] : []
    lastId.value = null
    prevId.value = null
    currentPage.value = 1
    hasMore.value = false
    return
  }

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

  const data = await getAllItems(params)
  items.value = data.item_data
  hasMore = data.last_id || null
  prevId.value = data.item_data?.[0]?.item_id ?? null
  hasMore.value = !!lastId.value
  isPrev.value = false
  console.log(prevId.value)
}


const nextPage = () => {
  if (hasMore.value) {
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
  await deleteItemApi(id)
  fetchItems()
}

const viewDetails = async (id) => {
  selectedItem.value = await getItemDetail(id)
  modalVisible.value = true
  // alert(JSON.stringify(detail, null, 2))
}

const editItem = async (id) => {
  selectedItem.value = await getItemDetail(id)
  isEditOpen.value = true

}
const submitEditedItem = async (updatedItem) => {
  try {
    console.log(updatedItem)
    // 呼叫 editItemApi 更新物品
    const response = await editItemApi(updatedItem.id, updatedItem)

    if (response.status === 200) {
      // 更新本地物品列表
      const index = items.value.findIndex(item => item.item_id === updatedItem.item_id)
      if (index !== -1) {
        items.value[index] = updatedItem
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
// const openAddModal = async () => {
//   const newItem = ref({
//     name: '',
//     description: '',
//     item_type: '',
//     price: 0,
//     rarity: 1,
//     slot: null,
//     atk_bonus: null,
//     def_bonus: null,
//     hp_restore: null,
//     mp_restore: null
//   })
//   const name = prompt('Enter name')
//   if (name) {
//     await addItemApi({ name })
//     fetchItems()
//   }
// }

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
