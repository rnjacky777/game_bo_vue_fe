<template>
  <div class="bg-gray-50 p-4 rounded shadow">
    <!-- Display Mode -->
    <div v-if="!isEditing" class="space-y-3">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>名稱:</strong> {{ charTemp.name }}</p>
          <p><strong>稀有度:</strong> {{ charTemp.rarity }}</p>
          <p><strong>描述:</strong> {{ charTemp.description || '無' }}</p>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p><strong>小圖:</strong></p>
            <img v-if="charTemp.image_sm_url" :src="charTemp.image_sm_url" alt="小圖" class="mt-1 max-w-full h-32 object-contain border rounded" />
            <span v-else class="text-gray-500">無</span>
          </div>
          <div>
            <p><strong>大圖:</strong></p>
            <img v-if="charTemp.image_lg_url" :src="charTemp.image_lg_url" alt="大圖" class="mt-1 max-w-full h-32 object-contain border rounded" />
            <span v-else class="text-gray-500">無</span>
          </div>
        </div>
      </div>
      <button @click="startEdit" class="btn-primary mt-2">編輯</button>
    </div>

    <!-- Editing Mode -->
    <div v-else class="space-y-3">
      <div>
        <label class="text-gray-600 text-sm">名稱:</label>
        <input v-model="editPayload.name" type="text" class="input w-full" placeholder="請輸入名稱" />
      </div>
      <div>
        <label class="text-gray-600 text-sm">稀有度:</label>
        <input v-model.number="editPayload.rarity" type="number" class="input w-full" placeholder="請輸入稀有度" />
      </div>
      <div>
        <label class="text-gray-600 text-sm">描述:</label>
        <textarea v-model="editPayload.description" class="input w-full" placeholder="請輸入描述"></textarea>
      </div>
      <div>
        <label class="text-gray-600 text-sm">小圖 URL:</label>
        <input v-model="editPayload.image_sm_url" type="text" class="input w-full" placeholder="請輸入小圖 URL" />
      </div>
      <div>
        <label class="text-gray-600 text-sm">大圖 URL:</label>
        <input v-model="editPayload.image_lg_url" type="text" class="input w-full" placeholder="請輸入大圖 URL" />
      </div>
      <div class="flex justify-end gap-2 mt-2">
        <button @click="saveEdit" class="btn-green" :disabled="isSaving">{{ isSaving ? '儲存中...' : '儲存' }}</button>
        <button @click="cancelEdit" class="btn-gray">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { updateCharTempField } from '@/api/char_temp'

const props = defineProps({
  charTemp: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['updated'])

const isEditing = ref(false)
const isSaving = ref(false)
const editPayload = ref({})

const resetEditPayload = () => {
  if (!props.charTemp) return
  editPayload.value = {
    name: props.charTemp.name || '',
    rarity: props.charTemp.rarity || 1,
    description: props.charTemp.description || '',
    image_sm_url: props.charTemp.image_sm_url || '',
    image_lg_url: props.charTemp.image_lg_url || '',
  }
}

watch(() => props.charTemp, resetEditPayload, { immediate: true, deep: true })

const startEdit = () => {
  isEditing.value = true
}

const cancelEdit = () => {
  resetEditPayload()
  isEditing.value = false
}

const saveEdit = async () => {
  if (isSaving.value) return
  isSaving.value = true
  try {
    await updateCharTempField(props.charTemp.id, { ...editPayload.value })
    emit('updated') // 通知父元件更新
    isEditing.value = false
  } catch (error) {
    console.error('Failed to save character info:', error)
    // 可以加入錯誤提示
  } finally {
    isSaving.value = false
  }
}
</script>

<style lang="scss" scoped>
/* 保持與父頁面一致的樣式 */
.btn-primary {
  background-color: #3b82f6; /* bg-blue-500 */
  color: white;
  padding: 0.5rem 1rem; /* py-2 px-4 */
  border-radius: 0.375rem; /* rounded */
  transition: background-color 0.3s;
  cursor: pointer;

  &:hover {
    background-color: #2563eb; /* hover:bg-blue-600 */
  }

  &:disabled {
    background-color: #9ca3af; /* bg-gray-400 */
    cursor: not-allowed;
  }
}

.btn-green {
  background-color: #22c55e; /* bg-green-500 */
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: background-color 0.3s;
  cursor: pointer;

  &:hover {
    background-color: #16a34a; /* hover:bg-green-600 */
  }

  &:disabled {
    background-color: #16a34a;
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.btn-gray {
  background-color: #d1d5db; /* bg-gray-300 */
  color: black;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: background-color 0.3s;
  cursor: pointer;

  &:hover {
    background-color: #9ca3af; /* hover:bg-gray-400 */
  }
}

.input, textarea {
  border: 1px solid #d1d5db; /* border-gray-300 */
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  outline: none;
  transition: box-shadow 0.2s, border-color 0.2s;

  &:focus {
    border-color: #60a5fa;
    box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.4); /* ring-2 ring-blue-400 with opacity */
  }
}

p > strong {
  margin-right: 0.5rem;
}
</style>
