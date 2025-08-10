import api from './base';

// ==================== CharTemp APIs ==================== //

/**
 * 取得角色模板列表（含分頁資訊）
 * @param {Object} params - 篩選參數，例如 id, name, limit, next_id, prev_id
 * @returns {Promise<{ last_id: number|null, char_temp_list: Array<{id: number, name: string, rarity?: number}> }>} 分頁資料和角色模板陣列
 */
export const getCharTemplates = async (params = {}) => {
  const res = await api.get('/char-templates/', { params });
  return res.data;
};

/**
 * 取得單一角色模板詳細
 * @param {number|string} id
 */
export const getCharTempDetail = async (id) => {
  const res = await api.get(`/char-templates/${id}`);
  return res.data;
};

/**
 * 新增角色模板
 * @param {Object} payload - 角色模板資料
 */
export const addCharTemplate = async (payload) => {
  const res = await api.post('/char-templates/', payload);
  return res.data;
};

/**
 * 刪除角色模板
 * @param {number|string} id
 */
export const deleteCharTemplate = async (id) => {
  const res = await api.delete(`/char-templates/${id}`);
  return res.data;
};

/**
 * 編輯角色模板（一般資訊 - 局部更新）
 * @param {number|string} id
 * @param {Object} payload - 要更新的欄位（可部分）
 */
export const updateCharTempField = async (id, payload) => {
  const res = await api.patch(`/char-templates/info/${id}`, payload);
  return res.data;
};

/**
 * 編輯角色模板（基礎數值 - 局部更新）
 * @param {number|string} id
 * @param {Object} payload - 要更新的欄位（可部分）
 */
export const updateCharTempBaseAttr = async (id, payload) => {
  const res = await api.patch(`/char-templates/stats/${id}`, payload);
  return res.data;
};

/**
 * 編輯角色模板（技能 - 替換）
 * @param {number|string} id
 * @param {Array<Object>} payload - 完整的技能陣列
 */
export const updateCharTempSkills = async (id, payload) => {
  // 使用 PUT，因為通常技能列表是整體替換
  const res = await api.put(`/char-templates/skills/${id}`, payload);
  return res.data;
};

/**
 * 編輯角色模板（屬性成長 - 局部更新）
 * @param {number|string} id
 * @param {Object} payload - 要更新的成長屬性
 */
export const updateCharTempGrowth = async (id, payload) => {
  const res = await api.patch(`/char-templates/growth/${id}`, payload);
  return res.data;
};
