<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white w-full max-w-2xl p-4 rounded shadow-lg">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold">技能 (Skill)</h3>
        <button class="text-gray-500" @click="$emit('close')">✖</button>
      </div>

      <div class="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
        <div v-for="(s, idx) in localSkills" :key="s.skill_id || idx" class="p-3 border rounded flex items-start justify-between">
          <div class="flex-1 pr-3">
            <input v-model="s.name" class="input w-full mb-1" placeholder="技能名稱" />
            <div class="flex gap-2">
              <input v-model.number="s.level" type="number" min="1" class="input w-24" placeholder="等級" />
              <input v-model="s.cooldown" type="text" class="input flex-1" placeholder="冷卻 (選填)" />
            </div>
            <textarea v-model="s.desc" class="input w-full mt-1 resize-none" rows="2" placeholder="技能描述 (選填)"></textarea>
          </div>
          <div class="flex flex-col gap-2">
            <button class="btn-sm btn-green" @click="saveSkill(idx)">儲存</button>
            <button class="btn-sm btn-red" @click="removeSkill(idx)">刪除</button>
          </div>
        </div>
      </div>

      <!-- 新增區 -->
      <div class="mt-4 p-3 border rounded">
        <h4 class="font-medium mb-2">新增技能</h4>
        <div class="flex gap-2">
          <input v-model="newSkill.name" class="input flex-1" placeholder="技能名稱" />
          <input v-model.number="newSkill.level" type="number" min="1" class="input w-24" />
          <button class="btn btn-green" @click="addNew">新增</button>
        </div>
        <textarea v-model="newSkill.desc" class="input w-full mt-2 resize-none" rows="2" placeholder="技能描述"></textarea>
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <button class="btn-gray" @click="$emit('close')">取消</button>
        <button class="btn-green" @click="emitSave">儲存全部</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, toRefs } from 'vue'

const props = defineProps({
  skills: { type: Array, default: () => [] }
})
const emit = defineEmits(['close','save'])

// local copy to edit freely
const localSkills = reactive(props.skills.map(s => ({ ...s })))
const newSkill = reactive({ skill_id: null, name: '', level: 1, desc: '', cooldown: '' })

function addNew() {
  if (!newSkill.name) return alert('請輸入技能名稱')
  localSkills.push({ ...newSkill, skill_id: null })
  newSkill.name = ''
  newSkill.level = 1
  newSkill.desc = ''
  newSkill.cooldown = ''
}

function removeSkill(idx){
  localSkills.splice(idx,1)
}

function saveSkill(idx){
  // optionally validate single skill before save
}

function emitSave(){
  // emit array (caller decides to call API)
  emit('save', localSkills.map(s => ({ ...s })))
}
</script>

<style scoped>
.input { @apply border px-2 py-1 rounded; }
.btn-green { @apply bg-green-500 text-white px-3 py-1 rounded; }
.btn-gray { @apply bg-gray-300 px-3 py-1 rounded; }
.btn-sm { @apply text-sm px-2 py-1; }
.btn-red { @apply bg-red-500 text-white px-2 py-1 rounded; }
</style>
