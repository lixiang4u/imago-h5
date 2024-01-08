import request from "@/api/request.js";

export default {
    getA: (query) => {
        return request.get('/api', query)
    },

    UserRegister: (data) => {
        return request.post('/user/register', data)
    }

}
