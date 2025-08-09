<template>
  <div class="p-4 space-y-4">
    <h2 class="text-2xl font-bold mb-4">角色模板詳情</h2>

    <div v-if="charTemp" class="space-y-4">
      <p><strong>ID:</strong> {{ charTemp.id }}</p>

      <!-- 名稱與稀有度編輯 -->
      <div class="bg-gray-50 p-4 rounded shadow">
        <div v-if="!isEditing">
          <p><strong>名稱:</strong> {{ charTemp.name }}</p>
          <p><strong>稀有度:</strong> {{ charTemp.rarity }}</p>
          <p><strong>描述:</strong> {{ charTemp.description || '無' }}</p>
          <p><strong>小圖:</strong></p>
          <div v-if="charTemp.image_sm_url">
            <img :src="charTemp.image_sm_url" alt="小圖" class="max-w-xs max-h-40 object-contain" />
          </div>
          <div v-else>無</div>

          <p><strong>大圖:</strong></p>
          <div v-if="charTemp.image_lg_url">
            <img :src="charTemp.image_lg_url" alt="大圖" class="max-w-xs max-h-40 object-contain" />
          </div>
          <div v-else>無</div>
          <button @click="startEdit" class="btn-primary mt-2">編輯</button>
        </div>
        <div v-else class="space-y-3">
          <div>
            <label class="text-gray-600 text-sm">名稱:</label>
            <input v-model="editPayload.name" type="text" class="input w-full" placeholder="請輸入名稱" />
          </div>
          <div>
            <label class="text-gray-600 text-sm">稀有度:</label>
            <input v-model.number="editPayload.rarity" type="number" class="input w-full" placeholder="請輸入稀有度" />
          </div>
          <div>
            <label class="text-gray-600 text-sm">描述:</label>
            <textarea v-model="editPayload.description" class="input w-full" placeholder="請輸入描述"></textarea>
          </div>
          <div>
            <label class="text-gray-600 text-sm">小圖 URL:</label>
            <input v-model="editPayload.image_sm_url" type="text" class="input w-full" placeholder="請輸入小圖 URL" />
          </div>
          <div>
            <label class="text-gray-600 text-sm">大圖 URL:</label>
            <input v-model="editPayload.image_lg_url" type="text" class="input w-full" placeholder="請輸入大圖 URL" />
          </div>
          <div class="flex justify-end gap-2 mt-2">
            <button @click="saveEdit" class="btn-green">儲存</button>
            <button @click="cancelEdit" class="btn-gray">取消</button>
          </div>
        </div>
      </div>

      <!-- 功能卡片 -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        <ModalCard title="編輯基礎屬性" desc="修改角色模板的基礎數值" @click="openBaseAttrModal" />
        <ModalCard title="技能" desc="檢視與編輯技能" @click="openSkillModal" />
        <ModalCard title="屬性成長" desc="檢視與編輯屬性成長" @click="openGrowthModal" />
      </div>
    </div>
    <BaseAttrModal v-if="showBaseAttrModal" :char-temp="charTemp" @close="showBaseAttrModal = false"
      @save="saveBaseAttr" />
    <SkillModal v-if="showSkillModal" :char-temp="charTemp" @close="showSkillModal = false" @save="saveSkill" />
    <GrowthModal v-if="showGrowthModal" :char-temp="charTemp" @close="showGrowthModal = false" @save="saveGrowth" />

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getCharTempDetail, updateCharTempField } from '@/api/char_temp'
import ModalCard from '@/components/common/ModalCard.vue'
import BaseAttrModal from '@/components/chartemp_modals/BaseAttrModal.vue'
import SkillModal from '@/components/chartemp_modals/SkillModal.vue'
import GrowthModal from '@/components/chartemp_modals/GrowthModal.vue'

const route = useRoute()
const charTemp = ref(null)
const isEditing = ref(false)
const editPayload = ref({
  name: '',
  rarity: 1,
  description: '',
  image_sm_url: '',
  image_lg_url: '',
})

const showBaseAttrModal = ref(false)
const showSkillModal = ref(false)
const showGrowthModal = ref(false)

onMounted(fetchCharTempDetail)

async function fetchCharTempDetail() {
  charTemp.value = await getCharTempDetail(route.params.id)
  resetEditPayload()
}

function resetEditPayload() {
  editPayload.value = {
    name: charTemp.value.name,
    rarity: charTemp.value.rarity,
    description: charTemp.value.description || '',
    image_sm_url: charTemp.value.image_sm_url || '',
    image_lg_url: charTemp.value.image_lg_url || '',
  }
}

function startEdit() {
  isEditing.value = true
}

async function saveEdit() {
  // call api to update
  await updateCharTempField(route.params.id, { ...editPayload.value })
  await fetchCharTempDetail()
  isEditing.value = false
}

function cancelEdit() {
  resetEditPayload()
  isEditing.value = false
}

function openBaseAttrModal() {
  showBaseAttrModal.value = true
}

function openSkillModal() {
  showSkillModal.value = true
}

function openGrowthModal() {
  showGrowthModal.value = true
}
</script>


<style scoped>
.btn-blue {
  @apply bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600;
}

.btn-primary {
  @apply bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600;
}

.btn-green {
  @apply bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600;
}

.btn-gray {
  @apply bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400;
}

.btn-red {
  @apply bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600;
}

.btn-sm {
  @apply text-sm px-2 py-1;
}

.input {
  @apply border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400;
}
</style>
