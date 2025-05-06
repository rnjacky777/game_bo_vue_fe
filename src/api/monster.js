import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/bo_api', // 你的後端 API 地址
})

export const getMonsters = () => api.get('/monster/ListAllMonsters')
export const getMonsterById = async (monsterId) => {
  try {
    const response = await api.get(`/monster/rewards/${monsterId}`);
    console.log('API response:', response);
    return response.data;  // 返回來自 API 的數據
  } catch (error) {
    console.error('Error fetching monster data:', error);
    throw error;  // 當請求出現錯誤時，拋出錯誤
  }
};
export const getMonsterDrops = (monsterId) => api.get(`/monsters/${monsterId}/drops`)
export const updateDropProbability = (monsterId, itemId, probability) =>
  api.put(`/monster/probability`, {
    monster_id: monsterId,
    item_id: itemId,
    probability,
  });
export const addDropItem = (monsterId, itemId, probability) => api.post(`/monsters/${monsterId}/drops`, { itemId, probability })
export const removeDropItem = (monsterId, itemId) => api.delete(`/monsters/${monsterId}/drops/${itemId}`)
