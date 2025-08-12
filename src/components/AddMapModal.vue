<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto"
  >
    <div class="bg-white rounded-xl p-6 w-full max-w-md shadow-xl relative">
      <h2 class="text-xl font-bold mb-4">新增地圖</h2>

      <div class="max-h-[60vh] overflow-y-auto space-y-3 pr-1">
        <div class="flex items-center space-x-2">
          <label class="w-24 text-right">名稱：</label>
          <input v-model="form.name" class="input flex-1" />
        </div>

        <div class="flex items-center space-x-2">
          <label class="w-24 text-right">描述：</label>
          <textarea v-model="form.description" class="input flex-1 resize-none"></textarea>
        </div>

        <div class="flex items-center space-x-2">
          <label class="w-24 text-right">圖片 URL：</label>
          <input v-model="form.image_url" class="input flex-1" />
        </div>
      </div>

      <div class="flex justify-end space-x-2 mt-6">
        <button @click="close" class="bg-gray-300 px-4 py-2 rounded">取消</button>
        <button @click="submit" class="bg-blue-600 text-white px-4 py-2 rounded">
          送出
        </button>
      </div>

      <button
        @click="close"
        class="absolute top-2 right-3 text-gray-500 text-xl"
        aria-label="Close modal"
      >
        &times;
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { createMaps } from '@/api/map' // 改成你地圖 API 的路徑

const props = defineProps({
  visible: Boolean,
})
const emit = defineEmits(['close', 'submitted'])

const form = ref({
  name: '',
  description: '',
  image_url: '',
})

const close = () => emit('close')

const submit = async () => {
  if (!form.value.name) {
    alert('請輸入地圖名稱')
    return
  }

  try {
    // API 要求批次建立，所以包成陣列
    const response = await createMaps([form.value])
    emit('submitted', response) // 回傳新增後資料
    close()
  } catch (err) {
    console.error('新增地圖失敗', err)
    alert('新增地圖失敗')
  }
}
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
}
</style>
