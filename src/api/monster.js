import api from './base'


export const getMonsters = () => api.get('/monster/ListAllMonsters')
export const getListMonsters = async (params = {}) => {
    const res = await api.get('/monster/list_monster', { params });
    return res.data;
};
export const getMonsterDetail = async (monster_id) => {
    const res = await api.get(`/monster/monster_detail/${monster_id}`);
    return res.data;
}
export const searchMonster = async (monster_id) => {
    const res = await api.get(`/monster/${monster_id}`)
    return res.data;
};
export const editMonsterApi = (monster_id, data) => {
    return api.put(`/monster/edit_monster/${monster_id}`, data)
}

export const addMonsterApi = (item) => api.post('/monster/AddMonster', item);
export const deleteMonsterApi = (id) => api.delete(`/monster/RemoveMonster/${id}`);
