<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
      <h3 class="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3-9H7v2h6V9z" clip-rule="evenodd" />
        </svg>
        新增 Item
      </h3>

      <div class="space-y-4">
        <label class="block text-sm text-gray-600">
          Item ID
          <input
            v-model="newItem.item_id"
            type="number"
            class="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-400 outline-none"
            placeholder="請輸入 Item ID"
          />
        </label>

        <label class="block text-sm text-gray-600">
          機率 (%)
          <input
            v-model="newItem.probability"
            type="number"
            min="0" max="100"
            class="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-400 outline-none"
            placeholder="請輸入掉落機率"
          />
        </label>
      </div>

      <div class="flex justify-end mt-6 gap-3">
        <button
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
          @click="$emit('cancel')"
        >
          取消
        </button>
        <button
          class="px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600 transition"
          @click="$emit('confirm')"
        >
          確認新增
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  newItem: Object
});
const emit = defineEmits(['confirm', 'cancel']);
</script>
