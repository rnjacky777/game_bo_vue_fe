import api from './base'  // 你自定義的 axios 實例

export const getAllItems = async (params = {}) => {
    const res = await api.get('/items/list_items', { params });
    return res.data;
};
export const getItemDetail = async (item_id) => {
    const res = await api.get(`/items/item_detail/${item_id}`);
    return res.data;
}
export const searchItem = async (item_id) => {
    const res = await api.get(`/items/${item_id}`)
    return res.data;
};

export const addItemApi = (item) => api.post('/items/AddItem', item);
export const deleteItemApi = (id) => api.delete(`/items/RemoveItem`, { params: { item_id: id } });
export const editItemApi = (itemId, data) => {
    return api.put(`/items/edit_item/${itemId}`, data)
}