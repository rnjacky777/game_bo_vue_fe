import api from './base';

/**
 * 建立地圖區域
 * @param {number} mapId 地圖 ID
 * @param {Object} areaData 區域資料，格式：{ name, description?, image_url? }
 * @returns {Promise<Object>} 建立成功的地圖區域資訊
 */
export const createMapArea = async (mapId, areaData) => {
  const res = await api.post(`/maps/${mapId}/areas/`, areaData);
  return res.data;
};

/**
 * 刪除地圖區域
 * @param {number|string} mapId 地圖 ID
 * @param {number|string} areaId 區域 ID
 * @returns {Promise<Object>} 刪除成功的訊息
 */
export const deleteMapArea = async (mapId, areaId) => {
  const res = await api.delete(`/maps/${mapId}/areas/${areaId}`);
  return res.data;
};

/**
 * 更新地圖區域事件
 * @param {number} mapId 地圖 ID
 * @param {number} areaId 區域 ID
 * @param {Object} payload 更新資料
 * @param {Array<{ event_id: number, probability: number }>} [payload.upsert] 要新增或更新的事件
 * @param {Array<number>} [payload.remove] 要移除的事件 ID
 * @param {boolean} [payload.normalize] 是否正規化機率
 * @returns {Promise<Object>} 更新後的事件資料
 */
export const updateMapAreaEvents = async (mapId, areaId, payload) => {
  const res = await api.patch(`/maps/${mapId}/areas/${areaId}/events`, payload);
  return res.data;
};

/**
 * 取得指定地圖區域詳細資料
 * @param {number} mapId 地圖 ID
 * @param {number} areaId 區域 ID
 * @returns {Promise<Object>} 區域詳細資料
 */
export const getMapAreaDetail = async (mapId, areaId) => {
  const res = await api.get(`/maps/${mapId}/areas/${areaId}`);
  return res.data;
};

/**
 * 更新地圖區域資訊
 * @param {number} mapId 地圖 ID
 * @param {number} areaId 區域 ID
 * @param {Object} payload 更新資料
 * @param {string} [payload.name] 區域名稱
 * @param {string} [payload.description] 區域描述
 * @param {string} [payload.image_url] 區域圖片 URL
 * @returns {Promise<Object>} 更新後的區域資料
 */
export const updateMapArea = async (mapId, areaId, payload) => {
  const res = await api.patch(`/maps/${mapId}/areas/${areaId}`, payload);
  return res.data;
};
