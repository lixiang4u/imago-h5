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
    ListProxy: (query) => {
        // params
        return request.get('/user/proxies', query)
    },
    RefreshToken: (token) => {
        // params
        return request.get('/user/refresh-token', {config: {headers: {Authorization: ''}}})
    },
}
