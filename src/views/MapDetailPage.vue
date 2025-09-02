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
    <MapEventsModal v-if="activeModal === 'events'" :currentEvents="map.events" @close="activeModal = null"
      @saved="saveEvents" />

    <MapConnectionsModal v-if="activeModal === 'connections'" :mapId="map.id" :currentConnections="map.neighbors"
      @close="activeModal = null" @save="saveConnections" />
    <AddMapAreaModal v-if="showAddAreaModal" :newArea="newArea" @confirm="confirmAddArea" @cancel="cancelAddArea" />
    <!-- <MapSettingsModal v-if="activeModal === 'settings'" :map="map" @close="activeModal = null" @save="saveSettings" /> -->
    <!-- Map Area 列表 -->
    <div class="mt-6">
      <h3 class="section-title">地圖區域列表</h3>

      <ul v-if="map?.map_areas?.length > 0" class="area-list">
        <li v-for="area in map.map_areas" :key="area.id" class="area-item">
          <div class="area-info">
            <span class="area-id">ID: {{ area.id }}</span>
            <span class="area-name">{{ area.name }}</span>
          </div>
          <div class="area-actions">
            <RouterLink :to="`/maps/${map.id}/map-area/${area.id}`" class="btn-outline">詳情</RouterLink>
            <button @click="prepareRemove(area.id)" class="btn-red">刪除</button>
          </div>
        </li>
      </ul>

      <p v-else class="empty-text">暫無地圖區域，請新增。</p>
    </div>
    <div class="flex justify-end mt-4">
      <button class="btn-blue px-5 py-2" @click="showAddAreaModal = true">+ 新增 Map Area</button>
    </div>

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
import { createMapArea, deleteMapArea } from '@/api/map_area'
// Components
import AddMapAreaModal from '@/components/map_detail/AddMapAreaModal.vue'
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
const showAddAreaModal = ref(false);
const newArea = ref({ name: '', map_id: map.id });
const areaToDelete = ref(null);

const prepareRemove = (areaId) => {
  if (!areaId) return;
  areaToDelete.value = areaId;

  // 這裡可以改成 modal
  if (confirm('確定要刪除這個地圖區域嗎？')) {
    handleRemove();
  } else {
    areaToDelete.value = null;
  }
};

const handleRemove = async () => {
  try {
    await deleteMapArea(map.value.id, areaToDelete.value);
    await fetchMapDetail(); // 刪除後重新載入地圖資訊
    areaToDelete.value = null;
  } catch (error) {
    console.error('刪除地圖區域失敗', error);
  }
};
const cancelAddArea = () => {
  showAddAreaModal.value = false;
  newArea.value = { name: '', map_id: map.value.id };
};

const confirmAddArea = async (areaFromModal) => {
  // 呼叫 API 新增 Map Area
  console.log(map.value.id)
  console.log(areaFromModal)
  await createMapArea(map.value.id, areaFromModal);
  await fetchMapDetail(); // 重新載入地圖資訊
  cancelAddArea();
};
const fetchMapDetail = async () => {
  isLoading.value = true
  try {
    map.value = await getMapById(route.params.mapId)
  } catch (error) {
    console.error("Failed to fetch map details:", error)
    map.value = null
  } finally {
    isLoading.value = false
  }
}

// 開啟 modal
const openModal = (modalName) => {
  activeModal.value = modalName
}

// 泛用儲存函式，呼叫對應 API，更新後重新抓取資料並關閉 modal
const handleSave = async (updateFunction, payload) => {
  try {
    await updateFunction(route.params.mapId, payload)
    await fetchMapDetail()
    activeModal.value = null
  } catch (error) {
    console.error('更新失敗:', error)
  }
}

// 各 modal 的儲存函式，代理到 handleSave
const saveEvents = async (payload) => {
  try {
    await updateMapEvents(route.params.mapId, payload)
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
    await updateMapConnections(route.params.mapId, payload)
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
.section-title {
  font-weight: bold;
  border-bottom: 1px solid #d1d5db;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.area-list {
  list-style: none;
  padding: 0;
  margin: 0;

  .area-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0.75rem;
    border-radius: 0.375rem;
    transition: background 0.2s;

    &:hover {
      background: #f9fafb;
    }

    .area-info {
      display: flex;
      gap: 0.5rem;

      .area-id {
        font-weight: 500;
        color: #374151;
      }

      .area-name {
        background: #e5e7eb;
        color: #6b7280;
        font-size: 0.75rem;
        padding: 0.125rem 0.5rem;
        border-radius: 0.25rem;
      }
    }

    .area-actions {
      display: flex;
      gap: 0.5rem;

      .btn-outline {
        border: 1px solid #3b82f6;
        color: #3b82f6;
        background: transparent;
        padding: 0.25rem 0.75rem;
        border-radius: 0.25rem;
        font-size: 0.875rem;
        cursor: pointer;
        text-decoration: none;

        &:hover {
          background: #3b82f6;
          color: #fff;
        }
      }

      .btn-red {
        background: #ef4444;
        color: #fff;
        border: none;
        border-radius: 0.25rem;
        padding: 0.25rem 0.75rem;
        cursor: pointer;
        font-size: 0.875rem;

        &:hover {
          background: #dc2626;
        }
      }
    }
  }
}

.empty-text {
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.btn-blue {
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.875rem;

  &:hover {
    background: #2563eb;
  }
}
</style>
