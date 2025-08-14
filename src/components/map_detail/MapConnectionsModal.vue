<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h3 class="modal-title">管理地圖連結</h3>

      <!-- 新增連結（搜尋下拉） -->
      <div class="search-section">
        <input type="text" v-model="searchTerm" class="input" placeholder="輸入地圖名稱或 ID"
          @focus="showDropdown = !!mapOptions.length" />
        <ul v-if="showDropdown && mapOptions.length" class="dropdown">
          <li v-for="map in mapOptions" :key="map.map_id" @click="addConnection(map)">
            {{ map.name }} (ID: {{ map.map_id }})
          </li>
        </ul>
      </div>

      <!-- 目前連結列表 -->
      <div v-if="connections.length === 0" class="empty-connections">
        尚無連結，請新增連結。
      </div>
      <ul v-else class="connections-list">
        <li v-for="conn in connections" :key="conn.neighbor_id" class="connection-item">
          <span>{{ conn.name || '[未知地圖]' }} (ID: {{ conn.neighbor_id }})</span>
          <button @click="removeConnection(conn.id || conn.neighbor_id)" class="btn-remove" title="移除連結">
            &times;
          </button>
        </li>
      </ul>

      <!-- 按鈕區 -->
      <div class="modal-buttons">
        <button @click="$emit('close')" class="btn-cancel">取消</button>
        <button @click="save" class="btn-save" :disabled="saving">
          {{ saving ? '儲存中...' : '儲存' }}
        </button>
      </div>

      <!-- 關閉按鈕 -->
      <button @click="$emit('close')" class="btn-close" aria-label="關閉視窗">&times;</button>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { getMaps } from '@/api/map'

const props = defineProps({
  mapId: Number,
  currentConnections: Array,
})

const emit = defineEmits(['close', 'save'])
const removedIds = ref([])
const connections = ref([])
const searchTerm = ref('')
const mapOptions = ref([])
const saving = ref(false)
const showDropdown = ref(false)

onMounted(async () => {
  connections.value = props.currentConnections.map(c => ({
    id: c.id,
    neighbor_id: c.neighbor_id,
    name: c.name
  }))
  await fetchMaps()
  document.addEventListener('click', handleOutsideClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideClick)
})
// 簡單 debounce 函式
function debounce(fn, delay = 300) {
  let timer
  return function(...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}
// debounce 避免快速打字大量 API
const debouncedFetch = debounce(async (val) => {
  if (val.trim()) {
    await fetchMaps(val)
    showDropdown.value = mapOptions.value.length > 0
  } else {
    showDropdown.value = false
  }
}, 300)

watch(searchTerm, debouncedFetch)

const fetchMaps = async (query = '') => {
  try {
    let params = { limit: 5 }
    if (query) {
      if (/^\d+$/.test(query)) {
        params.id = Number(query)
      } else {
        params.name = query
      }
    }
    const res = await getMaps(params)
    mapOptions.value = res.map_list.filter(
      m => m.map_id !== props.mapId &&
        !connections.value.some(c => c.neighbor_id === m.map_id)
    )
  } catch (e) {
    console.error('取得地圖列表失敗:', e)
  }
}

const addConnection = (map) => {
  connections.value.push({
    neighbor_id: map.map_id,
    name: map.name
  })
  searchTerm.value = ''
  mapOptions.value = []
  showDropdown.value = false
}

const removeConnection = (id) => {
  const target = connections.value.find(c => c.id === id || (!c.id && c.neighbor_id === id))
  connections.value = connections.value.filter(c => c !== target)
  if (target?.id && !removedIds.value.includes(target.id)) removedIds.value.push(target.id)
}

const save = () => {
  if (saving.value) return
  saving.value = true
  try {
    const newConnections = connections.value.filter(
      c => !props.currentConnections.some(pc => pc.neighbor_id === c.neighbor_id)
    ).map(c => ({
      neighbor_id: c.neighbor_id,
      is_locked: c.is_locked ?? false,
      required_item: c.required_item || '',
      required_level: c.required_level || 0,
    }))
    emit('save', { connections: newConnections, remove_connections: removedIds.value })
  } finally {
    saving.value = false
  }
}

const handleOutsideClick = (e) => {
  const searchEl = document.querySelector('.search-section')
  if (searchEl && !searchEl.contains(e.target)) showDropdown.value = false
}
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
  overflow: auto;
}

.modal-content {
  background: #fff;
  border-radius: 0.5rem;
  padding: 1.5rem;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.search-section {
  position: relative;
  margin-bottom: 1rem;

  .input {
    width: 100%;
    padding: 0.4rem 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    outline: none;
    transition: box-shadow 0.2s, border-color 0.2s;

    &:focus {
      border-color: #60a5fa;
      box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.4);
    }
  }

  .dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 0.375rem;
    max-height: 10rem;
    overflow-y: auto;
    z-index: 50;
    margin-top: 0.25rem;

    li {
      padding: 0.25rem 0.5rem;
      cursor: pointer;

      &:hover {
        background: #f0f0f0;
      }
    }
  }
}

.empty-connections {
  color: #6b7280;
  text-align: center;
  padding: 2.5rem 0;
}

.connections-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .connection-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    padding: 0.5rem 0.75rem;

    .btn-remove {
      background: #ef4444;
      color: #fff;
      border: none;
      border-radius: 0.25rem;
      padding: 0.25rem 0.5rem;
      cursor: pointer;
      font-size: 1rem;
      line-height: 1;

      &:hover {
        background: #dc2626;
      }
    }
  }
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.5rem;

  .btn-cancel {
    background: #9ca3af;
    color: #fff;
    border: none;
    border-radius: 0.25rem;
    padding: 0.5rem 1rem;
    cursor: pointer;

    &:hover {
      background: #6b7280;
    }
  }

  .btn-save {
    background: #22c55e;
    color: #fff;
    border: none;
    border-radius: 0.25rem;
    padding: 0.5rem 1rem;
    cursor: pointer;

    &:disabled {
      background: #a7f3d0;
      cursor: not-allowed;
    }

    &:hover:enabled {
      background: #16a34a;
    }
  }
}

.btn-close {
  position: absolute;
  top: 0.5rem;
  right: 0.75rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    color: #111827;
  }
}
</style>