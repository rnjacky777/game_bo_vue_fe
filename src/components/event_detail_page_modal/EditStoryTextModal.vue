<template>
  <div v-if="show" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-6 relative border border-gray-200">

      <!-- 標題 -->
      <h3 class="text-xl font-semibold text-gray-800 text-center">編輯對話</h3>

      <!-- 對話列表 -->
      <div class="max-h-[60vh] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        <div v-for="(story, index) in localModelValue" :key="index"
          class="border border-gray-200 rounded-xl p-4 bg-gray-50 relative shadow-sm hover:shadow-md transition">

          <!-- 刪除按鈕 -->
          <button @click="removeStory(index)" type="button"
            class="absolute top-2 right-2 w-7 h-7 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 hover:text-red-700 transition">
            ×
          </button>

          <!-- 名稱輸入 -->
          <div>
            <label class="block text-sm text-gray-500 mb-1">名稱</label>
            <input v-model="story.name" type="text"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder-gray-400"
              placeholder="請輸入名稱" />
          </div>

          <!-- 內容輸入 -->
          <div>
            <label class="block text-sm text-gray-500 mb-1">對話內容</label>
            <textarea v-model="story.text" rows="3"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder-gray-400"
              placeholder="請輸入對話內容"></textarea>
          </div>
        </div>
      </div>

      <!-- 新增對話按鈕 -->
      <div class="flex justify-center">
        <button @click="addStory" type="button"
          class="px-4 py-2 bg-blue-500 text-white rounded-xl shadow hover:bg-blue-600 transition">
          + 新增對話
        </button>
      </div>

      <!-- 操作按鈕 -->
      <div class="flex justify-end gap-4 pt-4 border-t border-gray-200">
        <button @click="$emit('close')" type="button"
          class="px-5 py-2 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition">
          取消
        </button>
        <button @click="handleSave" type="button"
          class="px-5 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition shadow">
          儲存
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  show: Boolean,
  modelValue: Array
});
const emit = defineEmits(['update:modelValue', 'close', 'save']);

const localModelValue = ref([]);

watch(
  () => props.modelValue,
  (val) => {
    localModelValue.value = JSON.parse(JSON.stringify(val));
  },
  { immediate: true }
);

const addStory = () => {
  localModelValue.value.push({ name: '', text: '' });
};

const removeStory = (index) => {
  localModelValue.value.splice(index, 1);
};

const handleSave = () => {
  emit('update:modelValue', localModelValue.value);
  emit('save');
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.6);
  /* 灰色 thumb */
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(107, 114, 128, 0.8);
  /* hover 時更深灰 */
}
</style>
