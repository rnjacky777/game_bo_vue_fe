<template>
  <div class="flex min-h-screen bg-gray-100">
    <div class="flex-1 p-8">
      <h1 class="text-4xl font-bold mb-10 text-center text-gray-800">📦 道具管理系統</h1>

      <!-- 新增道具表單 -->
      <div class="bg-white p-8 rounded-xl shadow-lg mb-12">
        <h2 class="text-2xl font-semibold mb-6 text-gray-700">➕ 新增道具</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ItemInput label="名稱" v-model="newItem.name" placeholder="輸入名稱" />
          <ItemInput label="描述" v-model="newItem.description" placeholder="輸入描述" />
          <ItemInput label="價格" type="number" v-model="newItem.price" placeholder="0" />
          <ItemInput label="稀有度 (1~5)" type="number" v-model="newItem.rarity" placeholder="1~5" />
          <div class="form-group">
            <label class="form-label">道具類型</label>
            <select v-model="newItem.item_type" class="input">
              <option disabled value="">請選擇</option>
              <option value="weapon">武器</option>
              <option value="armor">防具</option>
              <option value="material">素材</option>
              <option value="consumable">消耗品</option>
            </select>
          </div>
          <ItemInput label="裝備槽位 (選填)" v-model="newItem.slot" placeholder="如：主手、副手" />
          <ItemInput label="攻擊加成 (選填)" type="number" v-model="newItem.atk_bonus" />
          <ItemInput label="防禦加成 (選填)" type="number" v-model="newItem.def_bonus" />
          <ItemInput label="恢復 HP (選填)" type="number" v-model="newItem.hp_restore" />
          <ItemInput label="恢復 MP (選填)" type="number" v-model="newItem.mp_restore" />
        </div>
        <button @click="addItem" class="mt-6 w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg">
          新增道具
        </button>
      </div>

      <!-- 道具列表 -->
      <div class="bg-white p-8 rounded-xl shadow-lg">
        <h2 class="text-2xl font-semibold mb-6 text-gray-700">📃 道具列表</h2>
        <div class="overflow-x-auto">
          <table class="w-full table-auto border-separate border-spacing-0 rounded-lg">
            <thead class="bg-gray-200">
              <tr>
                <th class="px-4 py-3 text-sm font-semibold text-left text-gray-700">ID</th>
                <th class="px-4 py-3 text-sm font-semibold text-left text-gray-700">名稱</th>
                <th class="px-4 py-3 text-sm font-semibold text-left text-gray-700">描述</th>
                <th class="px-4 py-3 text-sm font-semibold text-left text-gray-700">類型</th>
                <th class="px-4 py-3 text-sm font-semibold text-left text-gray-700">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items" :key="item.item_id" class="hover:bg-gray-50 border-t">
                <td class="px-4 py-3 text-sm text-gray-800">{{ item.item_id }}</td>
                <td class="px-4 py-3 text-sm text-gray-800">{{ item.name }}</td>
                <td class="px-4 py-3 text-sm text-gray-600 truncate max-w-[250px]">{{ item.description }}</td>
                <td class="px-4 py-3 text-sm text-gray-800">{{ item.item_type }}</td>
                <td class="px-4 py-3 text-sm">
                  <button @click="confirmDelete(item.item_id)" class="text-red-500 hover:text-red-700">
                    刪除
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAllItems, addItemApi, deleteItemApi } from '@/api/item'

// 表單資料
const newItem = ref({
  name: '',
  description: '',
  item_type: '',
  price: 0,
  rarity: 1,
  slot: null,
  atk_bonus: null,
  def_bonus: null,
  hp_restore: null,
  mp_restore: null
})

const items = ref([])

const fetchItems = async () => {
  const { data } = await getAllItems()
  items.value = data
}

const addItem = async () => {
  await addItemApi([newItem.value])
  await fetchItems()
  alert('新增成功！')
  Object.assign(newItem.value, {
    name: '',
    description: '',
    item_type: '',
    price: 0,
    rarity: 1,
    slot: null,
    atk_bonus: null,
    def_bonus: null,
    hp_restore: null,
    mp_restore: null
  })
}

const confirmDelete = async (id) => {
  if (confirm('確定要刪除這個道具嗎？')) {
    await deleteItemApi(id)
    items.value = items.value.filter(item => item.item_id !== id)
  }
}

onMounted(fetchItems)
</script>

<script>
// 可選：如想支援重用的 input 元件
export default {
  components: {
    ItemInput: {
      props: {
        label: String,
        type: {
          type: String,
          default: 'text'
        },
        modelValue: [String, Number],
        placeholder: String
      },
      emits: ['update:modelValue'],
      template: `
        <div class="form-group">
          <label class="form-label">{{ label }}</label>
          <input :type="type" :placeholder="placeholder"
                 class="input"
                 :value="modelValue"
                 @input="$emit('update:modelValue', $event.target.value)" />
        </div>
      `
    }
  }
}
</script>

<style scoped>
.input {
  @apply border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400;
}
.form-group {
  margin-bottom: 1.5rem;
}
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}
</style>
