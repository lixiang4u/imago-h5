import request from "@/api/request.js";

export default {
    UserRegister: (data) => {
        return request.post('/user/register', data)
    },
    UserLogin: (data) => {
        return request.post('/user/login', data)
    },
    CreateProxy: (data) => {
        return request.post('/user/proxy', data)
    },
    UpdateProxy: (id, data) => {
        return request.put(`/user/proxy/${id}`, data)
    },
    DeleteProxy: (id) => {
        return request.delete(`/user/proxy/${id}`)
    },
    ListProxy: (params) => {
        // params
        return request.get('/user/proxies', {params})
    },
    RefreshToken: (token) => {
        // params
        return request.get('/user/refresh-token', {config: {headers: {Authorization: ''}}})
    },
}
