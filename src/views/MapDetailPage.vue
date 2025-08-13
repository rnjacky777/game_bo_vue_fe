<template>
  <div class="p-4 space-y-4">
    <h2 class="text-2xl font-bold">地圖詳情</h2>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-10">
      <p class="text-gray-500">載入中...</p>
    </div>

    <!-- Content -->
    <div v-else-if="map" class="space-y-4">
      <p class="text-sm text-gray-500">ID: {{ map.map_id }}</p>

      <!-- 名稱與描述編輯 -->
      <MapInfoCard :map="map" @updated="fetchMapDetail" />

      <!-- 功能卡片 -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        <ModalCard title="編輯事件" desc="管理地圖事件" @click="openModal('events')" />
        <ModalCard title="編輯連線" desc="管理地圖連線" @click="openModal('connections')" />
        <ModalCard title="其他設定" desc="其他地圖相關設定" @click="openModal('settings')" />
      </div>
    </div>

    <!-- Error / Not Found State -->
    <div v-else class="text-center py-10">
      <p class="text-gray-500">找不到指定的地圖。</p>
    </div>

    <!-- Modals -->
    <MapEventsModal v-if="activeModal === 'events'" :mapId="selectedMapId" :currentEvents="map.events" :allEvents="allAvailableEvents"
       @close="activeModal = null" @saved="saveEvents" />

    <MapConnectionsModal v-if="activeModal === 'connections'" :mapId="map.id" :currentConnections="map.neighbors" @close="activeModal = null"
      @save="saveConnections" />
    <!-- <MapSettingsModal v-if="activeModal === 'settings'" :map="map" @close="activeModal = null" @save="saveSettings" /> -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// API Services
import {
  getMapById,
  updateMapEvents,
  updateMapConnections,
} from '@/api/map'

// Components
import ModalCard from '@/components/common/ModalCard.vue'
import MapInfoCard from '@/components/map_detail/MapInfoCard.vue'
import MapEventsModal from '@/components/map_detail/MapEventsModal.vue'
import MapConnectionsModal from '@/components/map_detail/MapConnectionsModal.vue'
// import MapSettingsModal from '@/components/map_detail/MapSettingsModal.vue'

// State
const route = useRoute()
const map = ref(null)
const isLoading = ref(true)
const activeModal = ref(null) // 'events', 'connections', 'settings', or null

// 取得地圖詳細資料
const fetchMapDetail = async () => {
  isLoading.value = true
  try {
    map.value = await getMapById(route.params.id)
  } catch (error) {
    console.error("Failed to fetch map details:", error)
    map.value = null
  } finally {
    isLoading.value = false
  }
  console.log(map.value)
}

// 開啟 modal
const openModal = (modalName) => {
  activeModal.value = modalName
}

// 泛用儲存函式，呼叫對應 API，更新後重新抓取資料並關閉 modal
const handleSave = async (updateFunction, payload) => {
  try {
    await updateFunction(route.params.id, payload)
    await fetchMapDetail()
    activeModal.value = null
  } catch (error) {
    console.error('更新失敗:', error)
  }
}

// 各 modal 的儲存函式，代理到 handleSave
const saveEvents = async (payload) => {
  try {
    await updateMapEvents(route.params.id, payload)
    // 儲存成功後要關閉 modal，並刷新資料等
    activeModal.value = null
    await fetchMapDetail() // 或其他刷新函數
  } catch (error) {
    console.error('更新地圖事件失敗:', error)
    // 顯示錯誤通知
  }
}

const saveConnections = async (payload) => {
  try {
    console.log('run saveConnections')
    await updateMapConnections(route.params.id, payload)
    activeModal.value = null
    await fetchMapDetail()
  } catch (error) {
    console.error('更新地圖連結失敗:', error)
  }
}
// 頁面載入時取得資料
onMounted(fetchMapDetail)
</script>

<style scoped lang="scss">
/* (此處可沿用你之前的樣式) */
</style>
