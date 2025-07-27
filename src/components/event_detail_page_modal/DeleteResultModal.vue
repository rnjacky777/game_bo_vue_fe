<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-6">
      <h3 class="text-xl font-semibold text-red-600 text-center">確認刪除？</h3>
      <p class="text-center text-gray-700">你確定要刪除此 Event Result 嗎？此操作無法還原。</p>
      <div class="flex justify-center gap-4">
        <button class="px-5 py-2 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
          @click="$emit('cancel')">
          取消
        </button>
        <button class="px-5 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition"
          @click="$emit('confirm')">
          刪除
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['confirm', 'cancel']);
</script>
