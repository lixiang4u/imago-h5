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

}
