<template>
    <div v-if="visible"
        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto">
        <div class="bg-white rounded-xl p-6 w-full max-w-md shadow-xl relative">
            <h2 class="text-xl font-bold mb-4">新增怪物</h2>

            <div class="max-h-[60vh] overflow-y-auto space-y-3 pr-1">
                <div class="flex items-center space-x-2">
                    <label class="w-24 text-right">名稱：</label>
                    <input v-model="form.name" class="input flex-1" />
                </div>

                <div class="flex items-center space-x-2">
                    <label class="w-24 text-right">HP：</label>
                    <input v-model.number="form.hp" type="number" class="input flex-1" />
                </div>

                <div class="flex items-center space-x-2">
                    <label class="w-24 text-right">MP：</label>
                    <input v-model.number="form.mp" type="number" class="input flex-1" />
                </div>

                <div class="flex items-center space-x-2">
                    <label class="w-24 text-right">攻擊：</label>
                    <input v-model.number="form.atk" type="number" class="input flex-1" />
                </div>

                <div class="flex items-center space-x-2">
                    <label class="w-24 text-right">防禦：</label>
                    <input v-model.number="form.def_" type="number" class="input flex-1" />
                </div>

                <div class="flex items-center space-x-2">
                    <label class="w-24 text-right">速度：</label>
                    <input v-model.number="form.spd" type="number" class="input flex-1" />
                </div>

                <div class="flex items-center space-x-2">
                    <label class="w-24 text-right">掉落池 ID：</label>
                    <input v-model="form.drop_pool_id" placeholder="可選" class="input flex-1" />
                </div>
                <div class="flex items-center space-x-2">
                    <label class="w-24 text-right">自動建立掉落池：</label>
                    <input v-model="autoAddRewardPool" type="checkbox" class="w-5 h-5" />
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
import { addMonsterApi } from '@/api/monster' // 請根據實際 API 檔案修改

const props = defineProps({
    visible: Boolean,
})
const autoAddRewardPool = ref(true)
const emit = defineEmits(['close', 'submitted'])

const form = ref({
    name: '',
    hp: 100,
    mp: 50,
    atk: 10,
    def_: 5,
    spd: 10,
    drop_pool_id: null,
})

const close = () => emit('close')

const submit = async () => {
    if (!form.value.name) {
        alert('請輸入名稱')
        return
    }

    try {
        const requestPayload = {
            auto_add_reward_pool:autoAddRewardPool.value,
            monster_data: [form.value]
        }

        const response = await addMonsterApi(requestPayload)
        emit('submitted', response) // 可回傳新增後的資料（包含 monster_id）
        close()
    } catch (err) {
        console.error('新增怪物失敗', err)
        alert('新增怪物失敗')
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
