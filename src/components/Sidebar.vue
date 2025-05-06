<template>
    <div class="w-64 h-full bg-gray-800 text-white">
      <div class="flex justify-center items-center h-16 bg-gray-900 text-xl font-bold">
        Dashboard
      </div>
      <ul class="mt-6 space-y-2">
        <li>
          <router-link to="/" class="block px-4 py-2 hover:bg-gray-700 rounded">怪物管理</router-link>
        </li>
        <li>
          <router-link :to="`/monster-reward-manage/${selectedMonsterId}`" class="block px-4 py-2 hover:bg-gray-700 rounded">怪物掉落物品管理</router-link>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const selectedMonsterId = ref(1)  // 這裡可以根據你的需求，從選擇的怪物動態更新
  </script>
  
  <style scoped>
  /* 這裡可以自定義更多側邊欄的樣式 */
  </style>
  