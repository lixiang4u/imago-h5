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
    // 网络错误问题
    if (!error.response) {
        const d = {message: error.message || '网络错误', debug: error}
        return Promise.reject(d)
    }
    if (error.response.status === 401) {
        const d = {message: '登录已过期，请重新登录', debug: error}
        return Promise.reject(d)
    } else {
        return Promise.reject(error)
    }
})

export default request