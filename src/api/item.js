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

export const addItemApi = async (item) => {
    const res = await api.post('/items/AddItem', item);
    return res.data;
};
export const deleteItemApi = async (id) => {
    const res = await api.delete(`/items/RemoveItem`, { params: { item_id: id } });
    return res.data;
};
export const editItemApi = async (itemId, data) => {
    const res = await api.put(`/items/edit_item/${itemId}`, data);
    return res.data;
}