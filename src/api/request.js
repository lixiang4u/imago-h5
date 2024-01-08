import axios from "axios";

const request = axios.create({
    baseURL: '',
    timeout: 50000,
})

request.interceptors.request.use(value => {
    if (!value.headers['x-token']) {
        value.headers['x-token'] = localStorage.getItem('x-token')
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