import api from './base'


export const getMonsterById = async (monsterId) => {
  try {
    const response = await api.get(`/monster_reward/rewards/${monsterId}`);
    console.log('API response:', response);
    return response.data;  // 返回來自 API 的數據
  } catch (error) {
    console.error('Error fetching monster data:', error);
    throw error;  // 當請求出現錯誤時，拋出錯誤
  }
};
export const addMonsterDropItem = async (monsterId, itemId, probability) => {
  const response = await api.post('/monster_reward/addRewardItem', {
    monster_id: monsterId,
    item_id: itemId,
    probability: probability
  });
  return response.data;
};


export const updateDropProbability = (monsterId, itemId, probability) =>
  api.put(`/monster_reward/probability`, {
    monster_id: monsterId,
    item_id: itemId,
    probability,
  });
export const addDropItem = (monsterId, itemId, probability) => api.post(`/monster_reward/${monsterId}/drops`, { itemId, probability })
export const removeDropItem = (dropId) => {
  return api.delete('/monster_reward/removeRewardItem', {
    data: {
      drop_id: dropId
    }
  });
};
