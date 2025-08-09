import api from './base'


export const getMonsters = () => api.get('/monsters/ListAllMonsters')
export const getListMonsters = async (params = {}) => {
    const res = await api.get('/monsters/list_monster', { params });
    return res.data;
};
export const getMonsterDetail = async (monster_id) => {
    const res = await api.get(`/monsters/monster_detail/${monster_id}`);
    return res.data;
}
export const searchMonster = async (monster_id) => {
    const res = await api.get(`/monsters/${monster_id}`)
    return res.data;
};
export const editMonsterApi = (monster_id, data) => {
    return api.put(`/monsters/edit_monster/${monster_id}`, data)
}

export const addMonsterApi = (item) => api.post('/monsters/AddMonster', item);
export const deleteMonsterApi = (id, delete_pool = false) =>
    api.delete(`/monsters/RemoveMonster/${id}`, {
        params: { delete_pool }
    });
