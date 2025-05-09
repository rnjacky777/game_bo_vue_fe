import api from './base'  // 你自定義的 axios 實例

export const getAllItems = () => api.get('/item/ListAllItem')
export const addItemApi = (item) => api.post('/item/AddItem', item);
export const deleteItemApi = (id) => api.delete(`/item/RemoveItem`, { params: { item_id: id } });