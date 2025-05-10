<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
      <h2 class="text-xl font-bold mb-4">物品詳細資訊</h2>

      <div class="space-y-2 text-sm">
        <div class="flex justify-between"><span class="font-medium">ID：</span><span>{{ item.item_id }}</span></div>
        <div class="flex justify-between"><span class="font-medium">名稱：</span><span>{{ item.name }}</span></div>
        <div class="flex justify-between"><span class="font-medium">描述：</span><span>{{ item.description }}</span></div>
        <div class="flex justify-between"><span class="font-medium">類型：</span><span>{{ item.item_type }}</span></div>
        <div class="flex justify-between"><span class="font-medium">價格：</span><span>{{ item.price }}</span></div>
        <div class="flex justify-between"><span class="font-medium">稀有度：</span><span>{{ item.rarity }}</span></div>
        <div class="flex justify-between"><span class="font-medium">攻擊加成：</span><span>{{ item.atk_bonus }}</span></div>
        <div class="flex justify-between"><span class="font-medium">防禦加成：</span><span>{{ item.def_bonus }}</span></div>
        <div class="flex justify-between"><span class="font-medium">回復 HP：</span><span>{{ item.hp_restore }}</span></div>
        <div class="flex justify-between"><span class="font-medium">回復 MP：</span><span>{{ item.mp_restore }}</span></div>
      </div>

      <div class="text-right mt-6">
        <button @click="$emit('close')" class="btn btn-sm btn-outline">關閉</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  item: Object,
  visible: Boolean
})

</script>