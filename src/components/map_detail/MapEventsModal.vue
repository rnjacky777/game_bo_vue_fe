<template>
    <div class="map-events-modal">
        <div class="modal-content">
            <h3 class="modal-title">管理地圖事件</h3>

            <!-- 事件ID搜尋 -->
            <div class="search-section">
                <input type="number" v-model.number="searchEventId" class="input" placeholder="輸入事件ID搜尋" min="1" />
                <button @click="searchAndAddEvent" class="btn btn-green" :disabled="!canSearch">
                    搜尋並新增
                </button>
            </div>

            <!-- 預留 allEvents 下拉 -->
            <div class="all-events-placeholder">
                <select v-model="newEventId" class="input" disabled>
                    <option value="">選擇事件（功能尚未開放）</option>
                </select>
                <input type="number" class="input probability-input" v-model.number="newProbability" min="0" max="1"
                    step="0.01" placeholder="機率 (0~1)" disabled />
                <button class="btn btn-green" disabled>新增</button>
            </div>

            <!-- 事件列表 -->
            <div v-if="mapEvents.length === 0" class="empty-message">
                尚無事件，請新增事件。
            </div>
            <table v-else class="event-table">
                <thead>
                    <tr>
                        <th>事件ID</th>
                        <th>事件名稱</th>
                        <th>機率</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(event, idx) in mapEvents" :key="event.event_id">
                        <td>{{ event.event_id }}</td>
                        <td>{{ event.event_name }}</td>
                        <td>
                            <input type="number" class="input" v-model.number="mapEvents[idx].probability" min="0"
                                max="1" step="0.01" />
                        </td>
                        <td class="action-cell">
                            <button @click="removeEvent(event.event_id)" class="btn btn-red" title="刪除事件">
                                &times;
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- 正規化 -->
            <div class="normalize-option">
                <input type="checkbox" id="normalizeCheckbox" v-model="normalize" />
                <label for="normalizeCheckbox">正規化機率總和為 1</label>
            </div>

            <!-- 按鈕 -->
            <div class="modal-actions">
                <button @click="$emit('close')" class="btn btn-gray">取消</button>
                <button @click="save" class="btn btn-green" :disabled="saving">
                    {{ saving ? '儲存中...' : '儲存' }}
                </button>
            </div>

            <!-- 關閉 -->
            <button @click="$emit('close')" class="modal-close" aria-label="關閉視窗">
                &times;
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { searchEvent } from '@/api/event'

const props = defineProps({
    mapId: { type: Number, required: true },
    currentEvents: { type: Array, default: () => [] },
    allEvents: { type: Array, default: () => [] },
})

const emit = defineEmits(['close', 'saved'])

const mapEvents = ref([])
const normalize = ref(false)
const saving = ref(false)

const searchEventId = ref(null)
const newEventId = ref('')
const newProbability = ref(0.1)

watch(
    () => props.currentEvents,
    (val) => { mapEvents.value = val.map(e => ({ ...e })) },
    { immediate: true }
)

const canSearch = computed(() =>
    searchEventId.value &&
    searchEventId.value > 0
)

const removedEventIds = ref([])
const removeEvent = (eventId) => {
    mapEvents.value = mapEvents.value.filter(e => e.event_id !== eventId)
    if (props.currentEvents.find(e => e.event_id === eventId)) {
        removedEventIds.value.push(eventId)
    }
}

const searchAndAddEvent = async () => {
    if (!canSearch.value) return
    try {
        const data = await searchEvent(searchEventId.value)
        if (mapEvents.value.find(e => e.event_id === data.event_id)) {
            alert('此事件已存在')
            return
        }
        mapEvents.value.push({
            event_id: data.event_id,
            probability: 0.1,
            event_name: data.name,
        })
        searchEventId.value = null
    } catch (error) {
        console.error('搜尋事件失敗:', error)
        alert('找不到該事件')
    }
}

const save = () => {
    emit('saved', {
        upsert: mapEvents.value.map(({ event_id, probability }) => ({ event_id, probability })),
        remove: removedEventIds.value,
        normalize: normalize.value,
    })
}
</script>

<style lang="scss" scoped>
.map-events-modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 50;
    overflow: auto;

    .modal-content {
        background: #fff;
        border-radius: 8px;
        padding: 1.5rem;
        max-width: 48rem;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    }

    .modal-title {
        font-size: 1.25rem;
        font-weight: bold;
        margin-bottom: 1rem;
    }

    .search-section {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
        align-items: center;

        input[type="number"] {
            width: 8rem; // 限制搜尋 ID 欄位寬度
        }
    }

    .all-events-placeholder {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
        align-items: center;
    }

    .all-events-placeholder {
        opacity: 0.5;
        pointer-events: none;
    }

    .probability-input {
        width: 6rem;
    }

    .empty-message {
        color: #6b7280;
        text-align: center;
        padding: 2.5rem 0;
    }

    .event-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.875rem;

        th,
        td {
            border: 1px solid #d1d5db;
            padding: 0.25rem 0.5rem;
            text-align: left;
        }

        th {
            background: #f3f4f6;
        }

        .action-cell {
            text-align: center;
        }

        tr:hover {
            background: #f9fafb;
        }
    }

    .normalize-option {
        margin-top: 1rem;
        display: flex;
        gap: 0.5rem;
        align-items: center;
        font-size: 0.875rem;
    }

    .modal-actions {
        margin-top: 1.5rem;
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
    }

    .modal-close {
        position: absolute;
        top: 0.5rem;
        right: 0.75rem;
        font-size: 1.5rem;
        color: #6b7280;
        font-weight: bold;
        background: none;
        border: none;
        cursor: pointer;
    }

    .btn {
        padding: 0.25rem 0.75rem;
        border-radius: 4px;
        font-size: 0.875rem;
        cursor: pointer;
        border: none;

        &.btn-green {
            background: #10b981;
            color: white;

            &:disabled {
                background: #a7f3d0;
                cursor: not-allowed;
            }
        }

        &.btn-red {
            background: #ef4444;
            color: white;
        }

        &.btn-gray {
            background: #9ca3af;
            color: white;
        }
    }

    .input {
        border: 1px solid #d1d5db;
        border-radius: 4px;
        padding: 0.25rem 0.5rem;
        font-size: 0.875rem;
        width: 100%;
    }
}
</style>
