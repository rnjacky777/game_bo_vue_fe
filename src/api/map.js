import api from './base';

/**
 * 取得地圖列表（支援 limit、cursor、id、name 等查詢參數）
 * @param {Object} params - 查詢參數，例如 { limit: 20, next_id: 5, id: 1, name: '森林' }
 * @returns {Promise<Object>} 回傳包含 map_list 與分頁 cursor 的物件
 */
export const getMaps = async (params = { limit: 20 }) => {
  const res = await api.get('/maps/', { params });
  return res.data;
};


/**
 * 取得單一地圖詳細資料
 * @param {number} id 地圖 ID
 * @returns {Promise<Object>} 地圖詳細資料
 */
export const getMapById = async (id) => {
  const res = await api.get(`/maps/${id}`);
  return res.data;
};

/**
 * 建立地圖（批量）
 * @param {Array<Object>} mapDatas 地圖資料列表，格式：{ name, description?, image_url? }
 * @returns {Promise<Object>} 建立成功訊息及地圖資訊
 */
export const createMaps = async (mapDatas) => {
  const res = await api.post('/maps/', { map_datas: mapDatas });
  return res.data;
};

/**
 * 更新地圖（局部 PATCH）
 * @param {number} id 地圖 ID
 * @param {Object} payload 更新資料 (name, description, image_url)
 * @returns {Promise<Object>} 更新後的地圖資料
 */
export const updateMap = async (id, payload) => {
  const res = await api.patch(`/maps/${id}`, payload);
  return res.data;
};

/**
 * 刪除地圖
 * @param {number} id 地圖 ID
 * @returns {Promise<Object>} 刪除結果訊息
 */
export const deleteMap = async (id) => {
  const res = await api.delete(`/maps/${id}`);
  return res.data;
};

/**
 * 更新地圖事件關聯（PATCH /maps/:id/events）
 * @param {number} id 地圖 ID
 * @param {Object} param0
 * @param {Array<Object>} param0.upsert 新增或更新的事件，格式：{ event_id, probability }
 * @param {Array<number>} param0.remove 要移除的事件 ID 列表
 * @param {boolean} param0.normalize 是否正規化剩餘事件機率總和為 1
 * @returns {Promise<Object>} 更新結果訊息
 */
export const updateMapEvents = async (id, { upsert = [], remove = [], normalize = false }) => {
  const res = await api.patch(`/maps/${id}/events`, { upsert, remove, normalize });
  return res.data;
};

/**
 * 更新地圖連線（PATCH /maps/:id/connections）
 * @param {number} id 地圖 ID
 * @param {Object} param0
 * @param {Array<Object>} param0.connections 新增或更新的連線，格式：{ neighbor_id, is_locked, required_item, required_level }
 * @param {Array<number>} param0.remove_connections 要移除的鄰居地圖 ID
 * @returns {Promise<Object>} 更新結果訊息
 */
export const updateMapConnections = async (id, { connections = [], remove_connections = [] }) => {
  const res = await api.patch(`/maps/${id}/connections`, { connections, remove_connections });
  return res.data;
};
