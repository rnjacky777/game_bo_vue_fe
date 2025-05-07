import api from './base'  // 你自定義的 axios 實例

export const getAllItems = () => api.get('/items')
export const addItemApi = (item) => api.post('/items', item)
export const deleteItemApi = (id) => api.delete(`/items/${id}`)