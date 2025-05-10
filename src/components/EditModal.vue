<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
      <h2 class="text-xl font-bold mb-4">編輯物品</h2>

      <div class="space-y-3">
        <div v-for="(value, key) in editableItem" :key="key">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ fieldLabels[key] || key }}
          </label>
          <input
            v-model="editableItem[key]"
            :type="getInputType(value)"
            class="input w-full"
            :placeholder="fieldLabels[key] || key"
          />
        </div>
      </div>

      <div class="flex justify-end space-x-2 mt-6">
        <button @click="$emit('close')" class="btn btn-sm btn-outline">取消</button>
        <button @click="submitChanges" class="btn btn-sm btn-primary">儲存</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, toRaw } from 'vue'

const props = defineProps({
  visible: Boolean,
  itemData: Object, // 傳入要編輯的物品資料
  itemId: Number,   // 物品 ID
})

const emits = defineEmits(['save', 'close'])

const editableItem = reactive({}) // 用來儲存編輯後的物品資料

// 當 itemData 改變時更新 editableItem（深拷貝）
watch(
  () => props.itemData,
  (newVal) => {
    if (newVal) {
      Object.assign(editableItem, JSON.parse(JSON.stringify(newVal))) // 深拷貝資料
    }
  },
  { immediate: true } // 確保在初始化時即時更新
)

// 儲存編輯後的物品資料
const submitChanges = () => {
  emits('save', toRaw(editableItem)) // 將編輯後的資料傳遞給父組件
  emits('close') // 關閉 Modal
}

// 可選：欄位名稱對照（更友善 UI）
const fieldLabels = {
  name: '名稱',
  description: '描述',
  item_type: '類型',
  price: '價格',
  rarity: '稀有度',
  slot: '裝備欄位',
  atk_bonus: '攻擊加成',
  def_bonus: '防禦加成',
  hp_restore: 'HP 回復',
  mp_restore: 'MP 回復',
}

// 根據值自動選擇 input 類型
const getInputType = (val) => {
  if (typeof val === 'number') return 'number'
  return 'text'
}
</script>

<style scoped>
.input {
  @apply border border-gray-300 rounded px-3 py-1 w-full focus:outline-none focus:ring focus:border-blue-500;
}
.btn {
  @apply px-3 py-1 rounded;
}
.btn-outline {
  @apply border border-gray-500 text-gray-700 hover:bg-gray-100;
}
.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}
</style>
