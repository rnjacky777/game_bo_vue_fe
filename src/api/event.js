import api from './base';

// ==================== Event APIs ==================== //

/**
 * 取得事件列表
 * @param {Object} params - 篩選參數
 */
export const getListEvent = async (params = {}) => {
    const res = await api.get('/event/list-event', { params });
    return res.data;
};

/**
 * 取得單一事件細節
 * @param {number|string} event_id
 */
export const getEventDetail = async (event_id) => {
    const res = await api.get(`/event/detail/${event_id}`);
    return res.data;
};

/**
 * 搜尋事件
 * @param {number|string} event_id
 */
export const searchEvent = async (event_id) => {
    const res = await api.get(`/event/${event_id}`);
    return res.data;
};

/**
 * 新增事件
 * @param {Object} item - 事件資料
 */
export const addEventApi = async (item) => {
    const res = await api.post('/event/CreateEvent', item);
    return res.data;
};

/**
 * 更新事件描述
 * @param {Object} params - 包含 event_id 與其餘更新資料
 */
export const updateEventDescription = async ({ event_id, ...rest }) => {
    const res = await api.put(`/event/${event_id}`, rest);
    return res.data;
};

/**
 * 刪除事件
 * @param {number|string} id
 */
export const deleteEventApi = async (id) => {
    const res = await api.delete(`/event/${id}`);
    return res.data;
};

// ==================== Event Result APIs ==================== //

/**
 * 取得事件結果細節
 * @param {number|string} result_id
 */
export const getResultDetail = async (result_id) => {
    const res = await api.get(`/event/result/${result_id}`);
    return res.data;
};

/**
 * 新增事件結果
 * @param {Object} item
 */
export const createEventResult = async (item) => {
    const res = await api.post('/event/AddEventResult', item);
    return res.data;
};

/**
 * 編輯事件結果
 * @param {number|string} result_id
 * @param {Object} payload
 */
export const editEventResult = async (result_id, payload) => {
    const res = await api.put(`/event/result/${result_id}`, payload);
    return res.data;
};

/**
 * 刪除事件結果
 * @param {number|string} event_result_id
 */
export const deleteEventResult = async (event_result_id) => {
    const res = await api.delete(`/event/result/${event_result_id}`);
    return res.data;
};

// ==================== Result Item APIs ==================== //

/**
 * 為事件結果新增物品
 * @param {Object} item
 */
export const AddItemToResult = async (item) => {
    const res = await api.post('/event/add-event-result-item', item);
    return res.data;
};

/**
 * 刪除事件結果中的物品
 * @param {number|string} result_id
 * @param {number|string} item_id
 */
export const deleteItemFromResult = async (result_id, item_id) => {
    const res = await api.delete(`/event/result/${result_id}/items/${item_id}`);
    return res.data;
};

/**
 * 編輯事件結果物品的機率
 * @param {number|string} resultId
 * @param {number|string} itemId
 * @param {number} probability
 */
export const editItemProbability = async (resultId, itemId, probability) => {
    const res = await api.put(`/event/result/${resultId}/items/${itemId}`, { probability });
    return res.data;
};

