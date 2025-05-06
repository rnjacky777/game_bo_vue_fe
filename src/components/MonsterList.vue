<template>
  <div class="flex justify-center items-start mt-10">
    <div class="w-full max-w-lg">
      <h2 class="text-xl font-bold mb-4 text-center">怪物清單</h2>
      <ul class="space-y-2">
        <li v-for="monster in monsters" :key="monster.id">
          <button @click="$emit('select', monster)" class="text-blue-500 hover:underline">
            {{ monster.name }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getMonsters } from '@/api/monster'

const monsters = ref([])

onMounted(async () => {
  const { data } = await getMonsters()
  monsters.value = data
})
</script>
