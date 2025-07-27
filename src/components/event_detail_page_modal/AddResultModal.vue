<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6">
      <h3 class="text-xl font-semibold text-gray-800 text-center">新增 Event Result</h3>

      <div>
        <label class="block mb-2 text-gray-600 font-medium">名稱：</label>
        <input 
          v-model="localNewResult.name"
          type="text"
          class="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
          placeholder="請輸入名稱"
        />
      </div>

      <div class="flex justify-center gap-4">
        <button 
          @click="$emit('cancel')"
          class="px-5 py-2 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300 transition">
          取消
        </button>
        <button 
          @click="handleConfirm"
          class="px-5 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition">
          確認新增
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
  newResult: Object
});
const emit = defineEmits(['confirm', 'cancel']);

const localNewResult = reactive({ name: '' });

// 同步 props -> local
watch(() => props.newResult, (val) => {
  localNewResult.name = val.name;
  localNewResult.event_id = val.event_id;
}, { immediate: true });

const handleConfirm = () => {
  emit('confirm', localNewResult);
};
</script>
