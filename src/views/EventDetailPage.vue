<!-- src/views/EventDetail.vue -->
<template>
    <div class="space-y-6">
        <h2 class="text-2xl font-bold border-b pb-2">事件詳情</h2>

        <div v-if="event">
            <!-- 基本資訊 -->
            <div class="p-4 bg-white rounded-xl shadow-md space-y-4">
                <h3 class="text-lg font-semibold text-gray-800 border-b pb-2">基本資訊</h3>

                <div class="grid grid-cols-3 gap-4 items-center">
                    <!-- Event ID -->
                    <label class="text-gray-500 text-sm">事件 ID</label>
                    <div class="col-span-2 text-gray-800 font-medium">{{ event.event_id }}</div>

                    <!-- Type -->
                    <label class="text-gray-500 text-sm">類型 Type</label>
                    <div class="col-span-2 text-gray-800 font-medium">{{ event.type }}</div>

                    <!-- 名稱 -->
                    <label class="text-gray-500 text-sm">名稱 Name</label>
                    <div class="col-span-2">
                        <div v-if="!isEditingNameDesc" class="flex justify-between items-center">
                            <span class="text-gray-800 font-medium truncate">{{ editableName || '（尚未設定名稱）' }}</span>
                            <button @click="isEditingNameDesc = true" class="btn-outline text-sm">編輯</button>
                        </div>
                        <input v-else v-model="editableName" type="text"
                            class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400">
                    </div>

                    <!-- 描述 -->
                    <label class="text-gray-500 text-sm">描述 Description</label>
                    <div class="col-span-2">
                        <div v-if="!isEditingNameDesc" class="text-gray-800 bg-gray-50 p-3 rounded min-h-[60px]">
                            {{ editableDescription || '（尚未填寫描述）' }}
                        </div>
                        <textarea v-else v-model="editableDescription" rows="3"
                            class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"></textarea>
                    </div>
                </div>

                <!-- 按鈕 -->
                <div v-if="isEditingNameDesc" class="flex justify-end gap-2 mt-2">
                    <button @click="saveNameAndDescription" class="btn-green">儲存</button>
                    <button @click="cancelEdit" class="btn-gray">取消</button>
                </div>
            </div>

            <!-- 對話區 -->
            <div
                class="mt-6 p-4 bg-gray-50 rounded-xl shadow-inner flex justify-between items-center hover:shadow transition">
                <div>
                    <p class="text-gray-700 font-semibold mb-1">對話</p>
                    <p class="text-gray-500 text-sm">檢視與編輯此事件的對話內容。</p>
                </div>
                <button @click="openStoryModal"
                    class="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4 8-9 8s-9-3.582-9-8 4-8 9-8 9 3.582 9 8z" />
                    </svg>
                    查看對話
                </button>
            </div>

            <!-- 結果列表 -->
            <div class="mt-6">
                <h3 class="font-bold border-b pb-2">結果列表</h3>
                <ul v-if="event.result_list.length > 0" class="divide-y">
                    <li v-for="res in event.result_list" :key="res.result_id"
                        class="py-3 flex justify-between items-center hover:bg-gray-50 rounded px-2 transition">
                        <div class="flex items-center gap-2">
                            <span class="text-gray-700 font-medium">ID: {{ res.result_id }}</span>
                            <span class="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded">{{ res.name }}</span>
                        </div>
                        <div class="flex gap-2">
                            <RouterLink :to="`/result/${res.result_id}`" class="btn-outline">詳情</RouterLink>
                            <button @click="prepareRemove(res.result_id)" class="btn-red">刪除</button>
                        </div>
                    </li>
                </ul>
                <p v-else class="text-gray-500 text-sm mt-2">暫無結果，請新增。</p>
            </div>

            <!-- 新增 Event Result 按鈕 -->
            <div class="flex justify-end mt-4">
                <button class="btn-blue px-5 py-2" @click="showAddResultModal = true">+ 新增 Event Result</button>
            </div>
        </div>

        <div v-else>載入中...</div>

        <!-- Modal 區域 -->
        <AddResultModal v-if="showAddResultModal" :newResult="newResult" @confirm="confirmAdd" @cancel="cancelAdd" />
        <DeleteResultModal v-if="deleteTargetId" @confirm="confirmRemove" @cancel="cancelRemove" />
        <EditStoryTextModal :show="showStoryModal" v-model="editableStoryText" @close="closeStoryModal"
            @save="saveStoryText" />
    </div>
</template>


<script setup>
import AddResultModal from '@/components/event_detail_page_modal/AddResultModal.vue'
import DeleteResultModal from '@/components/event_detail_page_modal/DeleteResultModal.vue'
import EditStoryTextModal from '@/components/event_detail_page_modal/EditStoryTextModal.vue'

import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import {
    getEventDetail,
    createEventResult,
    updateEventDescription,
    deleteEventResult
} from '@/api/event';

// #region var
const route = useRoute();
const event = ref(null);                 // Put event data
const editableStoryText = ref([]);       // StoryText
const editableName = ref('');
const editableDescription = ref('');
const isEditingNameDesc = ref(false);

const deleteTargetId = ref(null);        // Use to delete Result ID
const newResult = ref({                  // Use to add Result 
    name: '',
    event_id: route.params.id
});

const showAddResultModal = ref(false);            // Result Modal control
const showStoryModal = ref(false);       // Modal control
// #endregion

// #region fetch event
onMounted(async () => {
    await fetchEvent();
});

const fetchEvent = async () => {
    event.value = await getEventDetail(route.params.id);
    editableName.value = event.value.name;
    editableDescription.value = event.value.description;
};
// #endregion

// #region Story Modal
const openStoryModal = () => {
    editableStoryText.value = event.value.story_text.map(item => ({ ...item }));
    showStoryModal.value = true;
};

const closeStoryModal = () => {
    showStoryModal.value = false;
};

const saveStoryText = async () => {
    try {
        await updateEventDescription({
            event_id: event.value.event_id,
            story_text: editableStoryText.value
        });
        alert('儲存成功');
        showStoryModal.value = false;
        await fetchEvent();
    } catch (error) {
        console.error('儲存失敗', error);
        alert('儲存失敗');
    }
};
// #endregion

// #region Event event detail
const saveNameAndDescription = async () => {
    try {
        await updateEventDescription({
            event_id: event.value.event_id,
            name: editableName.value,
            description: editableDescription.value
        });
        // 同步本地資料
        event.value.name = editableName.value;
        event.value.description = editableDescription.value;
        alert('更新成功');
        isEditingNameDesc.value = false;
    } catch (error) {
        console.error('更新失敗', error);
        alert('更新失敗');
    }
};

const cancelEdit = () => {
    editableName.value = event.value.name;
    editableDescription.value = event.value.description;
    isEditingNameDesc.value = false;
};
// #endregion

// #region Event Result add or remove
const cancelAdd = () => {
    showAddResultModal.value = false;
    newResult.value = {
        name: '',
        event_id: route.params.id
    };
};

const confirmAdd = async (resultFromModal) => {
    await createEventResult(resultFromModal);
    await fetchEvent();
    cancelAdd();
};

const prepareRemove = (resultId) => {
    deleteTargetId.value = resultId;
};

const cancelRemove = () => {
    deleteTargetId.value = null;
};

const confirmRemove = async () => {
    await deleteEventResult(deleteTargetId.value);
    deleteTargetId.value = null;
    await fetchEvent();
};
// #endregion
</script>

<style scoped>
.btn-blue {
    @apply bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition;
}

.btn-green {
    @apply bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition;
}

.btn-gray {
    @apply bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500 transition;
}

.btn-red {
    @apply bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm;
}

.btn-outline {
    @apply border border-gray-400 text-gray-700 px-3 py-1 rounded hover:bg-gray-100 text-sm;
}
</style>