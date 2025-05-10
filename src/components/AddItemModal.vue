<!-- AddItemModal.vue -->
<template>
    <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div class="bg-white rounded-xl p-6 w-full max-w-md shadow-xl relative">
            <h2 class="text-xl font-bold mb-4">新增道具</h2>

            <div class="space-y-4">
                <div class="flex items-center space-x-2">
                    <label class="w-24 text-right">名稱：</label>
                    <input v-model="form.name" class="input flex-1" />
                </div>

                <div class="flex items-center space-x-2">
                    <label class="w-24 text-right">描述：</label>
                    <input v-model="form.description" placeholder="輸入簡單描述" class="input flex-1" />
                </div>

                <div class="flex items-center space-x-2">
                    <label class="w-24 text-right">類型：</label>
                    <input v-model="form.item_type" class="input flex-1" />
                </div>

                <div class="flex items-center space-x-2">
                    <label class="w-24 text-right">價格：</label>
                    <input v-model.number="form.price" type="number" class="input flex-1" />
                </div>

                <div class="flex items-center space-x-2">
                    <label class="w-24 text-right">稀有度：</label>
                    <input v-model.number="form.rarity" type="number" class="input flex-1" />
                </div>

                <div class="flex items-center space-x-2">
                    <label class="w-24 text-right">攻擊加成：</label>
                    <input v-model.number="form.atk_bonus" type="number" class="input flex-1" />
                </div>

                <div class="flex items-center space-x-2">
                    <label class="w-24 text-right">防禦加成：</label>
                    <input v-model.number="form.def_bonus" type="number" class="input flex-1" />
                </div>

                <div class="flex items-center space-x-2">
                    <label class="w-24 text-right">回復 HP：</label>
                    <input v-model.number="form.hp_restore" type="number" class="input flex-1" />
                </div>

                <div class="flex items-center space-x-2">
                    <label class="w-24 text-right">回復 MP：</label>
                    <input v-model.number="form.mp_restore" type="number" class="input flex-1" />
                </div>
            </div>

            <div class="flex justify-end space-x-2 mt-6">
                <button @click="close" class="bg-gray-300 px-4 py-2 rounded">取消</button>
                <button @click="submit" class="bg-blue-600 text-white px-4 py-2 rounded">送出</button>
            </div>

            <button @click="close" class="absolute top-2 right-3 text-gray-500 text-xl">&times;</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { addItemApi } from '@/api/item' // 根據你的實際 API 路徑修改

const props = defineProps({
    isOpen: Boolean,
})

const emit = defineEmits(['close', 'submitted'])

const form = ref({
    name: null,
    description: '',
    item_type: '',
    price: 1,
    rarity: 1,
    atk_bonus: null,
    def_bonus: null,
    hp_restore: null,
    mp_restore: null,
})

const close = () => emit('close')

const submit = async () => {
    if (!form.value.name || !form.value.item_type) {
        alert('請輸入必填欄位')
        return
    }

    try {
        await addItemApi([form.value])
        emit('submitted')
        close()
    } catch (err) {
        console.error('新增失敗', err)
        alert('新增失敗')
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
