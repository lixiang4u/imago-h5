import axios from "axios";
import localStorage from '@/utils/localstorage.js'

const request = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 50000,
})

request.interceptors.request.use(value => {
    if (!value.headers['Authorization']) {
        value.headers['Authorization'] = 'Bearer ' + localStorage.getAccessToken()
    }
    return value
}, error => {
    return Promise.reject(error)
})


request.interceptors.response.use(resp => {
    if (resp.data.code === 200) {
        return resp
    }
    // 兼容默认错误
    const d = {message: resp.data.msg ?? null, debug: resp}
    return Promise.reject(d)
}, error => {
    return Promise.reject(error)
})

export default request