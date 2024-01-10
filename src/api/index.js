import request from "@/api/request.js";

export default {
    UserRegister: (data) => {
        return request.post('/user/register', data)
    },
    UserStatus: () => {
        return request.get('/user/status')
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
        return request.get('/user/proxies', {params})
    },
    ListProxyLog: (proxyId, params) => {
        return request.get(`/user/proxy/${proxyId}/logs`, {params})
    },
    ProxyStat: () => {
        return request.get(`/user/proxy/stat`)
    },
    ProxyRequestStat: (proxyId, params) => {
        return request.get(`/proxy/${proxyId}/request/stat`, {params})
    },
    RefreshToken: (token) => {
        // params
        return request.get('/user/refresh-token', {config: {headers: {Authorization: ''}}})
    },
}
