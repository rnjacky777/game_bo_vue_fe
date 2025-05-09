<template>
  <div class="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
    <h1 class="text-3xl font-bold mb-4 text-center">怪物掉落物管理</h1>

    <!-- 搜尋欄位，增加自訂的左邊距離 -->
    <div class="mb-6 flex flex-wrap items-center gap-2 justify-center">
      <input v-model="searchMonsterId" type="text" placeholder="輸入怪物 ID 搜尋"
        class="p-2 border border-gray-300 rounded w-60" />
      <button @click="searchMonster" class="bg-blue-500 text-white p-2 rounded w-24">
        搜尋
      </button>
    </div>

    <!-- 顯示怪物資訊 -->
    <div v-if="monster">
      <h1 class="text-3xl font-bold mb-4 text-center">怪物: {{ monster.name }}</h1>

      <div class="overflow-x-auto">
        <table class="w-full table-fixed border-separate border-spacing-0 border border-gray-300 rounded-lg shadow-lg">
          <thead class="bg-gray-200">
            <tr>
              <th class="px-6 py-3 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">掉落物品 ID
              </th>
              <th class="px-6 py-3 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">掉落物品名稱</th>
              <th class="px-6 py-3 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">掉落機率</th>
              <th class="px-6 py-3 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in dropItems" :key="item.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 border-b border-gray-300 text-sm text-gray-800">{{ item.id }}</td>
              <td class="px-6 py-4 border-b border-gray-300 text-sm text-gray-800">{{ item.name }}</td>
              <td class="px-6 py-4 border-b border-gray-300 text-sm text-gray-800">
                <div class="flex items-center gap-2">
                  <!-- 顯示已經乘以100的probability -->
                  <input v-model.number="item.probability" type="number" min="0" max="100"
                    class="p-2 border border-gray-300 rounded w-20" @input="item.edited = true" />
                  <span class="text-gray-600">%</span>

                  <!-- 更新與取消按鈕 -->
                  <button v-if="item.edited" @click="confirmUpdateProbability(item)"
                    class="bg-blue-500 text-white px-2 py-1 rounded text-sm">
                    更新
                  </button>
                  <button v-if="item.edited" @click="cancelUpdate(item)"
                    class="bg-gray-300 text-gray-800 px-2 py-1 rounded text-sm">
                    取消
                  </button>
                </div>
              </td>
              <td class="px-6 py-4 border-b border-gray-300 text-sm">
                <button @click="removeDropItem(item.drop_id)" class="text-red-500 hover:underline">
                  刪除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 新增掉落物品 -->
      <div class="mt-6">
        <h3 class="text-lg font-semibold mb-2 text-center">新增掉落物品</h3>
        <div class="flex flex-wrap gap-2 mx-auto max-w-fit">
          <input v-model="newItemId" type="number" placeholder="輸入物品 ID"
            class="p-2 border border-gray-300 rounded w-48" />
          <input v-model="newProbability" type="number" min="0" max="100" placeholder="掉落機率"
            class="p-2 border border-gray-300 rounded w-32" />
          <button @click="addDropItem" class="bg-green-500 text-white p-2 rounded w-24">
            新增
          </button>
        </div>
      </div>
    </div>

    <!-- 顯示搜尋不到怪物時的提示 -->
    <div v-else>
      <p class="text-center text-red-500">找不到此怪物，請重新搜尋。</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getMonsterById, addMonsterDropItem as apiAddDropItem, removeDropItem as apiRemoveDropItem, updateDropProbability } from '@/api/monster'

const searchMonsterId = ref('')
const monster = ref(null)
const dropItems = ref([])
const newItemId = ref(null)
const newProbability = ref(null)
const searchMargin = ref(30)  // 設定搜尋欄位左邊距離，可以根據需要更改
const cancelUpdate = (item) => {
  item.probability = item.originalProbability
  item.edited = false
}
const confirmUpdateProbability = async (item) => {
  if (item.probability < 0 || item.probability > 100) {
    alert("機率必須介於 0 和 100 之間")
    return
  }
  const normalizedProbability = item.probability / 100; // 轉換為 0 - 1 的數值傳給後端
  await updateDropProbability(monster.value.id, item.id, normalizedProbability)
  item.originalProbability = item.probability  // 更新原始值
  item.edited = false
}
const searchMonster = async () => {
  if (searchMonsterId.value) {
    const data = await getMonsterById(searchMonsterId.value)
    if (data) {
      monster.value = {
        name: data.monster_name,
        id: data.monster_id
      }
      // 更新掉落物品
      dropItems.value = data.drop_pool.map(item => ({
        drop_id: item.drop_id,
        id: item.item_id,
        name: item.item_name,
        probability: item.probability * 100,
        originalProbability: item.probability * 100,
        edited: false,
      }))
      console.log('Monster data:', monster.value)  // 輸出 monster 資料
      console.log('Drop items:', dropItems.value)   // 輸出掉落物品資料
    } else {
      monster.value = null
    }
  }
}

const addDropItem = async () => {
  if (newItemId.value && newProbability.value) {
    const data = await apiAddDropItem(
      monster.value.id,
      newItemId.value,
      newProbability.value / 100
    )
    console.log('Check data:', data)
    dropItems.value.push({
      drop_id: data.drop_id,
      id: data.item_id,
      name: data.item_name,
      probability: data.probability * 100,
      originalProbability: data.probability * 100,
      edited: false
    })

    // 清空欄位
    newItemId.value = null
    newProbability.value = null
  }
  console.log('Check dropItems:', dropItems.value)
  console.log('目前 dropItems:', dropItems.value.map(i => i.id))
}


const removeDropItem = async (dropId) => {
  try {
    await apiRemoveDropItem(dropId)

    // 從 dropItems.value 中移除該筆資料
    dropItems.value = dropItems.value.filter(item => item.drop_id !== dropId)
  } catch (error) {
    console.error('刪除失敗：', error)
  }
}


</script>

<style scoped>
input[type="number"],
input[type="text"] {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
}

button {
  transition: all 0.2s ease;
}

button:hover {
  opacity: 0.9;
}

table {
  width: 1200px;
  /* 表格寬度固定為 100% */
  table-layout: fixed;
  /* 固定列寬 */
}

th,
td {
  padding: 12px;
  /* 內邊距 */
  text-align: left;
  /* 左對齊 */
  border-bottom: 1px solid #e2e8f0;
  /* 下邊框 */
}

thead {
  background-color: #f7fafc;
  /* 表頭背景顏色 */
}

tbody tr:hover {
  background-color: #f4f4f4;
  /* 滑鼠懸停行的背景顏色 */
}


.w-full {
  max-width: 90%;
  /* 設定最大寬度為 90% */
  margin: 0 auto;
  /* 使表格在頁面中居中 */
}
</style>
