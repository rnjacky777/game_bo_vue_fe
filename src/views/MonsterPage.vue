<template>
  <div class="flex justify-center items-start min-h-screen">
    <div class="p-4 w-full max-w-4xl">
      <h1 class="text-3xl font-bold mb-4 text-center">怪物管理</h1>
      <div class="overflow-x-auto">
        <table class="w-full table-fixed border-separate border-spacing-0 border border-gray-300 rounded-lg shadow-lg">
          <thead class="bg-gray-200">
            <tr>
              <th class="px-6 py-3 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">怪物 ID</th>
              <th class="px-6 py-3 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">怪物名稱</th>
              <th class="px-6 py-3 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="monster in monsters" :key="monster.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 border-b border-gray-300 text-sm text-gray-800">{{ monster.id }}</td>
              <td class="px-6 py-4 border-b border-gray-300 text-sm text-gray-800">{{ monster.name }}</td>
              <td class="px-6 py-4 border-b border-gray-300 text-sm"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getMonsters } from '@/api/monster'  // 確保有對應的 API 函數

const monsters = ref([])

onMounted(async () => {
  const { data } = await getMonsters()  // 從 API 取得怪物資料
  monsters.value = data
})
</script>

<style>
/* 設置固定的表格尺寸，並美化 */
table {
  width: 100%; /* 表格寬度固定為 100% */
  table-layout: fixed; /* 固定列寬 */
}
th, td {
  padding: 12px; /* 內邊距 */
  text-align: left; /* 左對齊 */
  border-bottom: 1px solid #e2e8f0; /* 下邊框 */
}

thead {
  background-color: #f7fafc; /* 表頭背景顏色 */
}

tbody tr:hover {
  background-color: #f4f4f4; /* 滑鼠懸停行的背景顏色 */
}

/* 設置單元格最小寬度 */
th:nth-child(1), td:nth-child(1) {
  width: 20%; /* 設定第一列寬度 */
}

th:nth-child(2), td:nth-child(2) {
  width: 50%; /* 設定第二列寬度 */
}

th:nth-child(3), td:nth-child(3) {
  width: 30%; /* 設定第三列寬度 */
}

.w-full {
  max-width: 90%;  /* 設定最大寬度為 90% */
  margin: 0 auto;  /* 使表格在頁面中居中 */
}
</style>
