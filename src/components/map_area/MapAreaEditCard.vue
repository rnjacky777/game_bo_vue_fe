<template>
  <div class="bg-gray-50 p-4 rounded shadow">
    <!-- Display Mode -->
    <div v-if="!isEditing" class="space-y-3">
      <p><strong>區域名稱:</strong> {{ area.name }}</p>
      <p><strong>描述:</strong> {{ area.description || '無' }}</p>
      <div>
        <p><strong>圖片:</strong></p>
        <img
          v-if="area.image_url"
          :src="area.image_url"
          alt="區域圖片"
          class="mt-1 max-w-full h-32 object-contain border rounded"
        />
        <span v-else class="text-gray-500">無</span>
      </div>
      <button @click="startEdit" class="btn-primary mt-2">編輯</button>
    </div>

    <!-- Editing Mode -->
    <div v-else class="space-y-3">
      <div>
        <label class="text-gray-600 text-sm">區域名稱:</label>
        <input
          v-model="editPayload.name"
          type="text"
          class="input w-full"
          placeholder="請輸入區域名稱"
        />
      </div>
      <div>
        <label class="text-gray-600 text-sm">描述:</label>
        <textarea
          v-model="editPayload.description"
          class="input w-full"
          placeholder="請輸入描述"
        ></textarea>
      </div>
      <div>
        <label class="text-gray-600 text-sm">圖片 URL:</label>
        <input
          v-model="editPayload.image_url"
          type="text"
          class="input w-full"
          placeholder="請輸入圖片 URL"
        />
      </div>
      <div class="flex justify-end gap-2 mt-2">
        <button
          @click="saveEdit"
          class="btn-green"
        >儲存</button>
        <button @click="cancelEdit" class="btn-gray">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  area: { type: Object, required: true }
})

const emit = defineEmits(['updated', 'cancel'])

const isEditing = ref(false)
const editPayload = ref({})

const resetEditPayload = () => {
  editPayload.value = {
    name: props.area.name || '',
    description: props.area.description || '',
    image_url: props.area.image_url || ''
  }
}

watch(() => props.area, resetEditPayload, { immediate: true, deep: true })

const startEdit = () => { isEditing.value = true }
const cancelEdit = () => {
  resetEditPayload()
  isEditing.value = false
  emit('cancel')
}
const saveEdit = () => {
  emit('updated', { ...editPayload.value })
  isEditing.value = false
}
</script>

<style lang="scss" scoped>
.btn-primary {
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: background-color 0.3s;
  cursor: pointer;

  &:hover { background-color: #2563eb; }
  &:disabled { background-color: #9ca3af; cursor: not-allowed; }
}

.btn-green {
  background-color: #22c55e;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: background-color 0.3s;
  cursor: pointer;

  &:hover { background-color: #16a34a; }
  &:disabled { opacity: 0.7; cursor: not-allowed; }
}

.btn-gray {
  background-color: #d1d5db;
  color: black;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: background-color 0.3s;
  cursor: pointer;

  &:hover { background-color: #9ca3af; }
}

.input,
textarea {
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  outline: none;
  transition: box-shadow 0.2s, border-color 0.2s;

  &:focus {
    border-color: #60a5fa;
    box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.4);
  }
}

p > strong {
  margin-right: 0.5rem;
}
</style>
