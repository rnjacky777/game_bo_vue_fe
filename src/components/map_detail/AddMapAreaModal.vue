<template>
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6">
            <h3 class="text-xl font-semibold text-gray-800 text-center">新增地圖區域</h3>

            <!-- 名稱 -->
            <!-- 名稱 -->
            <div>
                <label class="block mb-2 text-gray-600 font-medium">名稱 <span class="text-red-500">*</span></label>
                <input v-model="localArea.name" type="text"
                    class="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 transition" :class="{
                        'border-gray-300 focus:ring-green-400': !nameError,
                        'border-red-400 focus:ring-red-400': nameError
                    }" placeholder="請輸入區域名稱" />
                <p v-if="nameError" class="text-red-500 text-sm mt-1">名稱為必填欄位</p>
            </div>

            <!-- 描述 -->
            <div>
                <label class="block mb-2 text-gray-600 font-medium">描述：</label>
                <textarea v-model="localArea.description"
                    class="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition resize-none"
                    placeholder="請輸入描述" rows="3"></textarea>
            </div>

            <!-- 圖片網址 -->
            <div>
                <label class="block mb-2 text-gray-600 font-medium">圖片網址：</label>
                <input v-model="localArea.image_url" type="text"
                    class="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                    placeholder="請輸入圖片 URL" />
            </div>

            <!-- 按鈕 -->
            <div class="flex justify-center gap-4">
                <button @click="$emit('cancel')"
                    class="px-5 py-2 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300 transition">
                    取消
                </button>
                <button @click="handleConfirm"
                    class="px-5 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition">
                    確認新增
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, watch, ref } from 'vue';

const props = defineProps({
    newArea: Object
});
const emit = defineEmits(['confirm', 'cancel']);

const localArea = reactive({
    name: '',
    description: '',
    image_url: ''
});

const nameError = ref(false);

// 同步 props -> local
watch(() => props.newArea, (val) => {
    if (!val) return;
    localArea.name = val.name || '';
    localArea.description = val.description || '';
    localArea.image_url = val.image_url || '';
}, { immediate: true });

const handleConfirm = () => {
    if (!localArea.name.trim()) {
        nameError.value = true;
        return;
    }
    nameError.value = false;
    emit('confirm', { ...localArea });
};
</script>
