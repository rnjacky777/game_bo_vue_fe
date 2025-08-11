<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto"
  >
    <div class="bg-white rounded-xl p-6 w-full max-w-md shadow-xl relative">
      <h2 class="text-xl font-bold mb-4">新增角色模板</h2>

      <div class="max-h-[60vh] overflow-y-auto space-y-3 pr-1">
        <div class="flex items-center space-x-2">
          <label class="w-24 text-right">名稱：</label>
          <input v-model="form.name" class="input flex-1" />
        </div>

        <div class="flex items-center space-x-2">
          <label class="w-24 text-right">稀有度：</label>
          <input
            v-model.number="form.rarity"
            type="number"
            min="1"
            max="5"
            class="input flex-1"
          />
        </div>

        <div class="flex items-center space-x-2">
          <label class="w-24 text-right">描述：</label>
          <textarea v-model="form.description" class="input flex-1 resize-none"></textarea>
        </div>

        <div class="flex items-center space-x-2">
          <label class="w-24 text-right">小圖URL：</label>
          <input v-model="form.image_sm_url" class="input flex-1" />
        </div>

        <div class="flex items-center space-x-2">
          <label class="w-24 text-right">大圖URL：</label>
          <input v-model="form.image_lg_url" class="input flex-1" />
        </div>

        <div class="flex items-center space-x-2">
          <label class="w-24 text-right">基礎HP：</label>
          <input
            v-model.number="form.base_hp"
            type="number"
            min="0"
            class="input flex-1"
          />
        </div>

        <div class="flex items-center space-x-2">
          <label class="w-24 text-right">基礎MP：</label>
          <input
            v-model.number="form.base_mp"
            type="number"
            min="0"
            class="input flex-1"
          />
        </div>

        <div class="flex items-center space-x-2">
          <label class="w-24 text-right">基礎攻擊：</label>
          <input
            v-model.number="form.base_atk"
            type="number"
            min="0"
            class="input flex-1"
          />
        </div>

        <div class="flex items-center space-x-2">
          <label class="w-24 text-right">基礎速度：</label>
          <input
            v-model.number="form.base_spd"
            type="number"
            min="0"
            class="input flex-1"
          />
        </div>

        <div class="flex items-center space-x-2">
          <label class="w-24 text-right">基礎防禦：</label>
          <input
            v-model.number="form.base_def"
            type="number"
            min="0"
            class="input flex-1"
          />
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
import { addCharTemplate } from '@/api/char_temp' // 請根據實際路徑修改

const props = defineProps({
  visible: Boolean,
})
const emit = defineEmits(['close', 'submitted'])

const form = ref({
  name: '',
  rarity: 1,
  description: '',
  image_sm_url: '',
  image_lg_url: '',
  base_hp: 0,
  base_mp: 0,
  base_atk: 0,
  base_spd: 0,
  base_def: 0,
})

const close = () => emit('close')

const submit = async () => {
  if (!form.value.name) {
    alert('請輸入名稱')
    return
  }

  try {
    const response = await addCharTemplate(form.value)
    emit('submitted', response) // 回傳新增後資料
    close()
  } catch (err) {
    console.error('新增角色模板失敗', err)
    alert('新增角色模板失敗')
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
