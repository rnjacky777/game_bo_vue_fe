<!-- App.vue -->
<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <div class="w-64 bg-gray-800 text-white p-4">
      <h1 class="text-2xl font-bold mb-6">Dashboard</h1>
      <ul class="space-y-2">
        <li><RouterLink to="/monster-reward" class="block p-2 rounded hover:bg-gray-700" active-class="bg-gray-700 text-yellow-300">掉落物管理</RouterLink></li>
        <li><RouterLink to="/item" class="block p-2 rounded hover:bg-gray-700" active-class="bg-gray-700 text-yellow-300">物品管理</RouterLink></li>
        <li><RouterLink to="/monster" class="block p-2 rounded hover:bg-gray-700" active-class="bg-gray-700 text-yellow-300">怪物管理</RouterLink></li>
        <li><RouterLink to="/event" class="block p-2 rounded hover:bg-gray-700" active-class="bg-gray-700 text-yellow-300">事件管理</RouterLink></li>
        <li><RouterLink to="/char-temp" class="block p-2 rounded hover:bg-gray-700" active-class="bg-gray-700 text-yellow-300">角色模板管理</RouterLink></li>
        <!-- <li><RouterLink to="/template" class="block p-2 rounded hover:bg-gray-700" active-class="bg-gray-700 text-yellow-300">模板頁面</RouterLink></li> -->
      </ul>
    </div>

    <!-- Main Content -->
    <div class="flex-1 p-6 overflow-y-auto">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { RouterView, RouterLink } from 'vue-router'
</script>