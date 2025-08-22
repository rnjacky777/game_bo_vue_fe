<template>
  <div class="modal-overlay">
    <div class="modal">
      <h3 class="modal-title">新增 / 管理事件</h3>

      <!-- 搜尋區 -->
      <div class="search-bar">
        <input
          v-model.number="searchEventId"
          type="number"
          placeholder="輸入事件 ID"
          class="input"
        />
        <button @click="searchAndAddEvent" class="btn primary">搜尋並加入</button>
      </div>

      <!-- 事件列表 -->
      <div class="event-list">
        <ul>
          <li v-for="ev in mapEvents" :key="ev.event_id" class="event-item">
            <div class="event-info">
              <span class="event-name"><strong>ID:</strong> {{ ev.event_id }} — {{ ev.event_name }}</span>
              <label>
                機率：
                <input type="number" v-model.number="ev.probability" step="0.01" min="0" max="1" class="input small" />
              </label>
            </div>
            <button class="btn danger small" @click="removeEvent(ev.event_id)">移除</button>
          </li>
        </ul>
      </div>

      <!-- 底部控制 -->
      <div class="modal-footer">
        <label class="normalize">
          <input type="checkbox" v-model="normalize" />
          正規化機率
        </label>
        <div class="footer-buttons">
          <button @click="$emit('close')" class="btn secondary">取消</button>
          <button @click="save" class="btn success">儲存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { searchEvent } from '@/api/event'

/** Props & Emits */
const props = defineProps({
  currentEvents: { type: Array, default: () => [] }
})
const emit = defineEmits(['close', 'saved'])

/** State */
const mapEvents = ref([])
const normalize = ref(false)
const searchEventId = ref(null)
const removedEventIds = ref([])

/** 初始化事件列表 */
watch(
  () => props.currentEvents,
  (val) => {
    mapEvents.value = val.map(e => ({
      ...e,
      event_name: e.event_name,
      probability: e.probability
    }))
  },
  { immediate: true }
)

/** 計算屬性 */
const canSearch = computed(() => searchEventId.value && searchEventId.value > 0)

/** 新增事件 */
const searchAndAddEvent = async () => {
  if (!canSearch.value) return

  if (mapEvents.value.find(e => e.event_id === searchEventId.value)) {
    alert('事件已存在')
    return
  }

  try {
    const data = await searchEvent(searchEventId.value)
    mapEvents.value.push({
      event_id: data.event_id,
      event_name: data.name,
      probability: 0.1
    })
    searchEventId.value = null
  } catch (err) {
    console.error(err)
    alert('找不到該事件')
  }
}

/** 移除事件 */
const removeEvent = (eventId) => {
  mapEvents.value = mapEvents.value.filter(e => e.event_id !== eventId)
  if (props.currentEvents.find(e => e.event_id === eventId)) {
    removedEventIds.value.push(eventId)
  }
}

/** 儲存變更 */
const save = () => {
  emit('saved', {
    upsert: mapEvents.value.map(e => ({
      event_id: e.event_id,
      probability: e.probability
    })),
    remove: removedEventIds.value,
    normalize: normalize.value
  })
}
</script>


<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0,0,0,0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}

.modal {
  background-color: #fff;
  border-radius: 1rem;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 12px 25px rgba(0,0,0,0.15);
  animation: fadeIn 0.2s ease-in-out;
}

.modal-title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #1f2937;
}

.search-bar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.event-list {
  max-height: 280px;
  overflow-y: auto;
  margin-bottom: 1.5rem;

  ul {
    padding: 0;
    margin: 0;
    list-style: none;
  }
}

.event-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.75rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  transition: background 0.2s;

  &:hover {
    background-color: #f3f4f6;
  }

  .event-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    .event-name {
      font-size: 0.95rem;
      color: #374151;
    }

    input.input.small {
      width: 60px;
      padding: 0.2rem 0.4rem;
    }
  }
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .normalize {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.85rem;
  }

  .footer-buttons {
    display: flex;
    gap: 0.5rem;
  }
}

.input {
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.4rem 0.6rem;
  font-size: 0.9rem;
  outline: none;
  transition: 0.2s;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59,130,246,0.2);
  }
}

.btn {
  border-radius: 0.375rem;
  padding: 0.45rem 0.8rem;
  font-size: 0.85rem;
  font-weight: 500;
  transition: 0.2s;

  &.primary {
    background-color: #3b82f6;
    color: #fff;
    &:hover { background-color: #2563eb; }
  }

  &.success {
    background-color: #22c55e;
    color: #fff;
    &:hover { background-color: #16a34a; }
  }

  &.secondary {
    background-color: #d1d5db;
    color: #111827;
    &:hover { background-color: #9ca3af; }
  }

  &.danger {
    background-color: #ef4444;
    color: #fff;
    &:hover { background-color: #dc2626; }
  }

  &.small {
    font-size: 0.75rem;
    padding: 0.3rem 0.6rem;
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 滾動條美化 */
.event-list::-webkit-scrollbar {
  width: 6px;
}

.event-list::-webkit-scrollbar-thumb {
  background-color: rgba(0,0,0,0.2);
  border-radius: 3px;
}

.event-list::-webkit-scrollbar-track {
  background: transparent;
}
</style>
