<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm transition-transform scale-100">
      <h3 class="text-lg font-semibold mb-3 text-red-600 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8.257 3.099c.366-.446.958-.695 1.56-.695s1.194.25 1.56.695l7.71 9.417c.721.88.106 2.234-1.01 2.234H1.557c-1.115 0-1.73-1.354-1.01-2.234l7.71-9.417zM10 13a1 1 0 100 2 1 1 0 000-2zm.707-6.293a1 1 0 00-1.414 0l-.293.293V11a1 1 0 002 0V7l-.293-.293z" clip-rule="evenodd" />
        </svg>
        確認刪除？
      </h3>
      <p class="text-gray-600 text-sm mb-6">你確定要刪除此項目嗎？此操作無法復原。</p>
      <div class="flex justify-end gap-3">
        <button
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
          @click="$emit('cancel')">
          取消
        </button>
        <button
          class="px-4 py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-600 transition"
          @click="$emit('confirm')">
          確定刪除
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['confirm', 'cancel']);
</script>
