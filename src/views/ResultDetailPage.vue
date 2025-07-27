<template>
  <div class="p-4 space-y-4">
    <h2 class="text-2xl font-bold mb-4">事件詳情</h2>

    <div v-if="event" class="space-y-4">
      <p><strong>ID:</strong> {{ event.event_result_id }}</p>

      <!-- 名稱與優先度編輯 -->
      <div class="bg-gray-50 p-4 rounded shadow">
        <div v-if="!isEditing">
          <p><strong>名稱:</strong> {{ event.name }}</p>
          <p><strong>優先度:</strong> {{ event.prior }}</p>
          <button @click="prepareUpdateResult" class="btn-primary mt-2">編輯</button>
        </div>
        <div v-else class="space-y-3">
          <div>
            <label class="text-gray-600 text-sm">名稱:</label>
            <input v-model="editEventResultPayload.name" type="text" class="input w-full" placeholder="請輸入事件名稱"/>
          </div>
          <div>
            <label class="text-gray-600 text-sm">優先度:</label>
            <input v-model="editEventResultPayload.prior" type="number" class="input w-full" placeholder="請輸入優先度"/>
          </div>
          <div class="flex justify-end gap-2 mt-2">
            <button @click="confirmUpdateResult" class="btn-green">儲存</button>
            <button @click="cancelUpdateResult" class="btn-gray">取消</button>
          </div>
        </div>
      </div>

      <!-- 功能卡片 -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ModalCard title="對話" desc="檢視與編輯此事件的對話內容" @click="openStoryModal" />
        <ModalCard title="條件" desc="檢視與編輯事件條件" @click="openConditionModal" />
        <ModalCard title="狀態影響" desc="檢視與編輯狀態效果" @click="openStatusEffectModal" />
      </div>

      <!-- 掉落物 -->
      <div class="mt-6">
        <h3 class="font-bold text-lg mb-2">掉落物列表:</h3>
        <ul class="space-y-2">
          <li v-for="res in event.reward_pool" :key="res.item_id" class="flex justify-between items-center p-2 bg-gray-50 rounded shadow">
            <span>ID: {{ res.item_id }}，名稱: {{ res.name }}</span>
            <div class="flex items-center gap-2">
              <input v-model.number="res.probability" type="number" step="0.01" min="0" max="1" class="input w-20" />
              <button class="btn-sm btn-green" @click="saveProbability(res.item_id, res.probability)">儲存</button>
              <button class="btn-sm btn-red" @click="prepareRemove(res.item_id)">移除</button>
            </div>
          </li>
        </ul>
        <button class="mt-4 btn-blue w-full" @click="showAddItemModal = true">新增掉落物</button>
      </div>
    </div>

    <!-- Loading 狀態 -->
    <div v-else class="flex justify-center items-center h-40">
      <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
    </div>

    <!-- Modals -->
    <EditStoryTextModal :show="showStoryModal" v-model="editableStoryText" @close="closeStoryModal" @save="saveStoryText" />
    <EditConditionModal :show="showConditionModal" v-model="editableCondition" @close="closeConditionModal" @save="saveCondition" />
    <EditStatusEffectModal :show="showStatusEffectModal" v-model="editableStatusEffect" @close="closeStatusEffectModal" @save="saveStatusEffect" />
    <AddItemModal v-if="showAddItemModal" :newItem="newItem" @confirm="confirmAdd" @cancel="cancelAdd" />
    <DeleteItemModal v-if="deleteItemId" @confirm="confirmRemove" @cancel="cancelRemove" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { AddItemToResult, editEventResult, editItemProbability, deleteItemFromResult, getResultDetail } from '@/api/event'
import DeleteItemModal from '@/components/result_detail_modal/DeleteItemModal.vue'
import AddItemModal from '@/components/result_detail_modal/AddItemModal.vue'
import ModalCard from '@/components/common/ModalCard.vue'
import EditStoryTextModal from '@/components/event_detail_page_modal/EditStoryTextModal.vue'
import EditConditionModal from '@/components/result_detail_modal/EditConditionModal.vue'
import EditStatusEffectModal from '@/components/result_detail_modal/EditStatusEffectModal.vue'

const route = useRoute()
const event = ref(null)
const isEditing = ref(false)
const editEventResultPayload = ref({})

const showAddItemModal = ref(false)
const newItem = ref({ item_id: null, result_id: route.params.id, probability: 100.0 })
const deleteItemId = ref(null)
const showStoryModal = ref(false)
const showConditionModal = ref(false)
const showStatusEffectModal = ref(false)
const editableCondition = ref([])
const editableStoryText = ref([])
const editableStatusEffect = ref([])

onMounted(fetchEventDetail)

async function fetchEventDetail() {
  event.value = await getResultDetail(route.params.id)
}

function prepareUpdateResult() {
  editEventResultPayload.value = { name: event.value.name, prior: event.value.prior }
  isEditing.value = true
}

function cancelUpdateResult() {
  editEventResultPayload.value = {}
  isEditing.value = false
}

async function confirmUpdateResult() {
  await editEventResult(route.params.id, editEventResultPayload.value)
  await fetchEventDetail()
  cancelUpdateResult()
}

function openStoryModal() {
  editableStoryText.value = [...event.value.story_text]
  showStoryModal.value = true
}

function closeStoryModal() { showStoryModal.value = false }
async function saveStoryText() {
  await editEventResult(route.params.id, { story_text: editableStoryText.value })
  await fetchEventDetail()
  closeStoryModal()
}

function openConditionModal() {
  editableCondition.value = [...event.value.condition]
  showConditionModal.value = true
}

function closeConditionModal() { showConditionModal.value = false }
async function saveCondition() {
  await editEventResult(route.params.id, { condition_list: editableCondition.value })
  await fetchEventDetail()
  closeConditionModal()
}

function openStatusEffectModal() {
  editableStatusEffect.value = [...event.value.status_effects]
  showStatusEffectModal.value = true
}

function closeStatusEffectModal() { showStatusEffectModal.value = false }
async function saveStatusEffect() {
  await editEventResult(route.params.id, { status_effects_json: editableStatusEffect.value })
  await fetchEventDetail()
  closeStatusEffectModal()
}

async function saveProbability(itemId, probability) {
  await editItemProbability(route.params.id, itemId, probability)
}

function cancelAdd() {
  showAddItemModal.value = false
  newItem.value = { item_id: null, result_id: route.params.id, probability: 100.0 }
}

async function confirmAdd() {
  await AddItemToResult(newItem.value)
  await fetchEventDetail()
  cancelAdd()
}

function prepareRemove(itemId) { deleteItemId.value = itemId }
function cancelRemove() { deleteItemId.value = null }
async function confirmRemove() {
  await deleteItemFromResult(route.params.id, deleteItemId.value)
  await fetchEventDetail()
  deleteItemId.value = null
}
</script>

<style scoped>
.input { @apply w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400; }
.btn-blue { @apply bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600; }
.btn-green { @apply bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600; }
/* style.css 或 Tailwind 全域 */
.btn-primary { @apply bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600; }
.btn-gray { @apply bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400; }
.btn-red { @apply bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600; }
.btn-sm { @apply text-sm px-2 py-1; }
.input { @apply border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400; }

</style>
