<!-- src/components/common/ModalCard.vue -->
<template>
  <div class="border rounded p-4 mb-4 bg-gray-100 cursor-pointer hover:bg-gray-200" @click="$emit('open')">
    <h4 class="font-bold">{{ title }}</h4>
    <p class="text-sm text-gray-600">{{ desc }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  desc: String
})
defineEmits(['open'])
</script>
