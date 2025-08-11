<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white w-full max-w-xl p-4 rounded shadow-lg">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold">屬性成長 (Growth)</h3>
        <button class="text-gray-500" @click="$emit('close')">✖</button>
      </div>

      <div class="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
        <p class="text-sm text-gray-600">設定成長規則 (例如：每等成長、等級區間成長等)。下面提供簡單的成長條目列表。</p>

        <div v-for="(g, idx) in localGrowth" :key="idx" class="p-3 border rounded flex gap-2 items-center">
          <div class="flex-1">
            <div class="flex gap-2">
              <input v-model.number="g.level" type="number" class="input w-24" placeholder="等級"/>
              <input v-model.number="g.add_hp" type="number" class="input w-24" placeholder="HP+"/>
              <input v-model.number="g.add_atk" type="number" class="input w-24" placeholder="ATK+"/>
            </div>
            <div class="mt-2">
              <input v-model="g.note" class="input w-full" placeholder="備註 (選填)"/>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <button class="btn-sm btn-green" @click="saveGrowth(idx)">儲存</button>
            <button class="btn-sm btn-red" @click="removeGrowth(idx)">刪除</button>
          </div>
        </div>
      </div>

      <div class="mt-4 p-3 border rounded">
        <h4 class="font-medium mb-2">新增成長條目</h4>
        <div class="flex gap-2">
          <input v-model.number="newGrowth.level" type="number" class="input w-24" placeholder="等級" />
          <input v-model.number="newGrowth.add_hp" type="number" class="input w-24" placeholder="HP+" />
          <input v-model.number="newGrowth.add_atk" type="number" class="input w-24" placeholder="ATK+" />
          <button class="btn btn-green" @click="addNew">新增</button>
        </div>
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <button class="btn-gray" @click="$emit('close')">取消</button>
        <button class="btn-green" @click="emitSave">儲存全部</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
const props = defineProps({
  growth: { type: Array, default: () => [] }
})
const emit = defineEmits(['close','save'])

const localGrowth = reactive(props.growth.map(g => ({ ...g })))
const newGrowth = reactive({ level: 1, add_hp: 0, add_atk: 0, note: '' })

function addNew(){
  localGrowth.push({ ...newGrowth })
  newGrowth.level = 1; newGrowth.add_hp = 0; newGrowth.add_atk = 0; newGrowth.note = ''
}
function removeGrowth(idx){ localGrowth.splice(idx,1) }
function saveGrowth(idx){ /* optional */ }
function emitSave(){ emit('save', localGrowth.map(g => ({ ...g }))) }
</script>

<style scoped>
.input { @apply border px-2 py-1 rounded; }
.btn-green { @apply bg-green-500 text-white px-3 py-1 rounded; }
.btn-gray { @apply bg-gray-300 px-3 py-1 rounded; }
.btn-sm { @apply text-sm px-2 py-1; }
.btn-red { @apply bg-red-500 text-white px-2 py-1 rounded; }
</style>
