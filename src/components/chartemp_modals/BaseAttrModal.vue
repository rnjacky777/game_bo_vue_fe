<!-- components/chartemp_modals/BaseAttrModal.vue -->
<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div class="bg-white p-6 rounded shadow w-96 space-y-4">
      <h3 class="text-lg font-bold">編輯基礎屬性</h3>
      <div v-for="field in fields" :key="field.key">
        <label class="text-sm text-gray-600">{{ field.label }}:</label>
        <input
          v-model="form[field.key]"
          :type="field.type"
          class="input w-full"
        />
      </div>
      <div class="flex justify-end gap-2">
        <button class="btn-gray" @click="$emit('close')">取消</button>
        <button class="btn-green" @click="save">儲存</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const props = defineProps({
  charTemp: { type: Object, required: true }
})
const emit = defineEmits(['close', 'save'])

const fields = [
  { key: 'base_hp', label: 'HP', type: 'number' },
  { key: 'base_mp', label: 'MP', type: 'number' },
  { key: 'base_atk', label: '攻擊', type: 'number' },
  { key: 'base_spd', label: '速度', type: 'number' },
  { key: 'base_def', label: '防禦', type: 'number' }
]

const form = reactive({ ...props.charTemp })

function save() {
  emit('save', { ...form })
}
</script>
