import axios from 'axios'

// 創建一個 axios 實例
const api = axios.create({
  baseURL: 'https://amon777.ddns.net/bo_api',
  // baseURL: 'http://localhost:8000/bo_api', // 你的後端 API 地址
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api