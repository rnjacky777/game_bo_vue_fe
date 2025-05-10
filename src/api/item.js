import api from './base'  // 你自定義的 axios 實例

export const getAllItems = async (params = {}) => {
    const res = await api.get('/item/list_items', { params });
    return res.data;
};
export const getItemDetail = async (item_id) => {
    const res = await api.get(`/item/item_detail/${item_id}`);
    return res.data;
}
export const searchItem = (item_id) => api.get(`/item/${item_id}`);

export const addItemApi = (item) => api.post('/item/AddItem', item);
export const deleteItemApi = (id) => api.delete(`/item/RemoveItem`, { params: { item_id: id } });
export const editItemApi = (itemId, data) => {
  return api.put(`/item/edit_item/${itemId}`, data)
}