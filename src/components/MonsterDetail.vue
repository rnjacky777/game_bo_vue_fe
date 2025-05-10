<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
      <h2 class="text-xl font-bold mb-4">物品詳細資訊</h2>

      <!-- 動態顯示物品屬性 -->
      <div class="space-y-2 text-sm">
        <div class="flex justify-between"><span class="font-medium">ID：</span><span>{{ monster.id }}</span></div>
        <div class="flex justify-between"><span class="font-medium">名稱：</span><span>{{ monster.name }}</span></div>
        <div v-if="monster.drop_pool_id" class="flex justify-between"><span class="font-medium">掉落池 ID：</span><span>{{
          monster.drop_pool_id }}</span></div>
        <div class="flex justify-between"><span class="font-medium">HP：</span><span>{{ monster.hp }}</span></div>
        <div class="flex justify-between"><span class="font-medium">MP：</span><span>{{ monster.mp }}</span></div>
        <div class="flex justify-between"><span class="font-medium">攻擊：</span><span>{{ monster.atk }}</span></div>
        <div class="flex justify-between"><span class="font-medium">速度：</span><span>{{ monster.spd }}</span></div>
        <div class="flex justify-between"><span class="font-medium">防禦：</span><span>{{ monster.def_ }}</span></div>
      </div>

      <!-- 關閉按鈕 -->
      <div class="text-right mt-6">
        <button @click="$emit('close')" class="btn btn-sm btn-outline">關閉</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  monster: Object,   // 傳入的物品詳細資料
  visible: Boolean // 控制顯示或隱藏 Modal
})

</script>

<style scoped>
/* 可以根據需要調整樣式 */
</style>
