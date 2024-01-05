import request from "@/api/request.js";

export default {
    getA: (query) => {
        return request.get('/api', query)
    }
}
