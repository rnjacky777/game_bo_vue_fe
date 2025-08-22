<template>
  <div class="map-area-detail p-4 space-y-6">
    <h2 class="section-title">地圖區域詳情</h2>

    <div v-if="area">
      <!-- 區域編輯卡片 -->
      <MapAreaEditCard :area="area" @updated="handleSave" />

      <!-- 事件列表卡片 -->
      <div class="card events-section">
        <h3 class="card-title">事件列表</h3>
        <ul class="event-list">
          <li v-for="ev in area.event_associations" :key="ev.event_id" class="event-item">
            <span>ID: {{ ev.event_id }} | 名稱: {{ ev.event_name }} | 機率: {{ ev.probability }}</span>
          </li>
        </ul>
        <button class="btn-blue w-full mt-3" @click="showAddEventModal = true">新增 / 管理事件</button>
      </div>
    </div>

    <!-- Loading -->
    <div v-else class="loading">
      <div class="spinner"></div>
    </div>

    <!-- Modal -->
    <AddEventsModal
      v-if="showAddEventModal"
      :currentEvents="area.event_associations"
      @close="showAddEventModal = false"
      @saved="saveEvents"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getMapAreaDetail, updateMapAreaEvents, updateMapArea } from '@/api/map_area'
import AddEventsModal from '@/components/map_area/AddEventsModal.vue'
import MapAreaEditCard from '@/components/map_area/MapAreaEditCard.vue'

const route = useRoute()
const mapId = Number(route.params.mapId)
const area = ref(null)
const showAddEventModal = ref(false)
const loading = ref(false)

onMounted(fetchAreaDetail)

async function fetchAreaDetail() {
  loading.value = true
  try {
    area.value = await getMapAreaDetail(mapId, Number(route.params.id))
  } catch (err) {
    console.error('取得區域資料失敗', err)
    alert('載入區域資料失敗')
  } finally {
    loading.value = false
  }
}

const handleSave = async (payload) => {
  try {
    await updateMapArea(mapId, area.value.id, payload)
    await fetchAreaDetail()
  } catch (err) {
    console.error('更新失敗', err)
    alert('儲存失敗')
  }
}

const saveEvents = async (payload) => {
  try {
    await updateMapAreaEvents(mapId, area.value.id, payload)
    await fetchAreaDetail()
    showAddEventModal.value = false
  } catch (err) {
    console.error('事件更新失敗', err)
    alert('事件儲存失敗')
  }
}
</script>

<style lang="scss" scoped>
.map-area-detail {
  padding: 1rem;

  .section-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #1f2937;
  }

  .card {
    background: #fff;
    border-radius: 1rem;
    padding: 1rem;
    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    margin-bottom: 1rem;

    &-title {
      font-weight: 600;
      font-size: 1.125rem;
      margin-bottom: 0.75rem;
      color: #111827;
    }
  }

  .event-list {
    list-style: none;
    padding: 0;
    margin: 0;

    .event-item {
      background: #f9fafb;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      margin-bottom: 0.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.875rem;
      color: #374151;
    }
  }

  .btn-blue {
    display: inline-block;
    width: auto;
    background-color: #3b82f6;
    color: #fff;
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    border: none;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: background 0.2s;

    &:hover {
      background-color: #2563eb;
    }
  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 12rem;

    .spinner {
      width: 2.5rem;
      height: 2.5rem;
      border: 4px solid #ccc;
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
