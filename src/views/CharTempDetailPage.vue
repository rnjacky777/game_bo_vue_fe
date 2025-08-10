<template>
  <div class="p-4 space-y-4">
    <h2 class="text-2xl font-bold">角色模板詳情</h2>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-10">
      <p class="text-gray-500">載入中...</p>
    </div>

    <!-- Content -->
    <div v-else-if="charTemp" class="space-y-4">
      <p class="text-sm text-gray-500">ID: {{ charTemp.id }}</p>

      <!-- 名稱與稀有度編輯 -->
      <CharTempInfoCard :char-temp="charTemp" @updated="fetchCharTempDetail" />

      <!-- 功能卡片 -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        <ModalCard title="編輯基礎屬性" desc="修改角色模板的基礎數值" @click="openModal('baseAttr')" />
        <ModalCard title="技能" desc="檢視與編輯技能" @click="openModal('skill')" />
        <ModalCard title="屬性成長" desc="檢視與編輯屬性成長" @click="openModal('growth')" />
      </div>
    </div>

    <!-- Error / Not Found State -->
    <div v-else class="text-center py-10">
      <p class="text-gray-500">找不到指定的角色模板。</p>
    </div>

    <!-- Modals -->
    <BaseAttrModal v-if="activeModal === 'baseAttr'" :char-temp="charTemp" @close="activeModal = null"
      @save="saveBaseAttr" />
    <SkillModal v-if="activeModal === 'skill'" :skills="charTemp.skills" @close="activeModal = null" @save="saveSkill" />
    <GrowthModal v-if="activeModal === 'growth'" :char-temp="charTemp" @close="activeModal = null" @save="saveGrowth" />

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// API Services
import {
  getCharTempDetail,
  updateCharTempBaseAttr,
  updateCharTempSkills,
  updateCharTempGrowth,
} from '@/api/char_temp'

// Components
import ModalCard from '@/components/common/ModalCard.vue'
import CharTempInfoCard from '@/components/chartemp/CharTempInfoCard.vue'
import BaseAttrModal from '@/components/chartemp_modals/BaseAttrModal.vue'
import SkillModal from '@/components/chartemp_modals/SkillModal.vue'
import GrowthModal from '@/components/chartemp_modals/GrowthModal.vue'

// Component State
const route = useRoute()
const charTemp = ref(null)
const isLoading = ref(true)
const activeModal = ref(null) // 'baseAttr', 'skill', 'growth', or null
/**
 * Fetches the character template details from the API.
 */
const fetchCharTempDetail = async () => {
  isLoading.value = true
  try {
    charTemp.value = await getCharTempDetail(route.params.id)
  } catch (error) {
    console.error("Failed to fetch character details:", error)
    charTemp.value = null
    // Optionally show a toast notification for the error
  } finally {
    isLoading.value = false
  }
}

/**
 * Opens a modal by its name.
 * @param {'baseAttr' | 'skill' | 'growth' | null} modalName
 */
const openModal = (modalName) => {
  activeModal.value = modalName
}
/**
 * A generic handler for saving data from modals.
 * It calls the provided update function, refetches data, and closes the modal.
 * @param {Function} updateFunction The API function to call for the update.
 * @param {any} payload The data to be saved.
 */
const handleSave = async (updateFunction, payload) => {
  try {
    await updateFunction(route.params.id, payload)
    await fetchCharTempDetail() // Reload data to reflect changes
    activeModal.value = null // Close the active modal
    // You can add a success notification here, e.g., message.success('更新成功')
  } catch (error) {
    console.error('Update failed:', error)
    // You can add an error notification here, e.g., message.error('更新失敗')
  }
}

// Specific save handlers for each modal, delegating to the generic handler.
const saveBaseAttr = (payload) => handleSave(updateCharTempBaseAttr, payload)
const saveSkill = (payload) => handleSave(updateCharTempSkills, payload)
const saveGrowth = (payload) => handleSave(updateCharTempGrowth, payload)

// Lifecycle Hooks
onMounted(fetchCharTempDetail)
</script>



<style scoped lang="scss">
/* ============================================= */
/*                 Button Styles                 */
/* ============================================= */

.btn-primary {
  background-color: #3b82f6; /* bg-blue-500 */
  color: white;
  padding: 0.5rem 1rem; /* py-2 px-4 */
  border-radius: 0.375rem; /* rounded */
  transition: background-color 0.3s;
  cursor: pointer;

  &:hover {
    background-color: #2563eb; /* hover:bg-blue-600 */
  }
}

.btn-green {
  background-color: #22c55e; /* bg-green-500 */
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: background-color 0.3s;
  cursor: pointer;

  &:hover {
    background-color: #16a34a; /* hover:bg-green-600 */
  }
}

.btn-gray {
  background-color: #d1d5db; /* bg-gray-300 */
  color: black;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: background-color 0.3s;
  cursor: pointer;

  &:hover {
    background-color: #9ca3af; /* hover:bg-gray-400 */
  }
}

.btn-red {
  background-color: #ef4444; /* bg-red-500 */
  color: white;
  padding: 0.25rem 0.5rem; /* py-1 px-2 */
  border-radius: 0.375rem;
  transition: background-color 0.3s;
  cursor: pointer;

  &:hover {
    background-color: #dc2626; /* hover:bg-red-600 */
  }
}

.btn-sm {
  font-size: 0.875rem; /* text-sm */
  padding-left: 0.5rem; /* px-2 */
  padding-right: 0.5rem;
  padding-top: 0.25rem; /* py-1 */
  padding-bottom: 0.25rem;
}

/* ============================================= */
/*                  Form Styles                  */
/* ============================================= */

.input {
  border: 1px solid #d1d5db; /* border-gray-300 */
  border-radius: 0.375rem;
  padding-left: 0.5rem; /* px-2 */
  padding-right: 0.5rem;
  padding-top: 0.25rem; /* py-1 */
  padding-bottom: 0.25rem;
  outline: none;
  transition: box-shadow 0.2s;

  &:focus {
    box-shadow: 0 0 0 2px #60a5fa; /* ring-2 ring-blue-400 */
  }
}

</style>
