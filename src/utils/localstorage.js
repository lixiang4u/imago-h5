export default {
    setAccessToken(token) {
        localStorage.setItem('access-token', token)
    },
    getAccessToken() {
        return localStorage.getItem('access-token')
    },

    setRefreshToken(token) {
        localStorage.setItem('refresh-token', token)
    },
    getRefreshToken() {
        return localStorage.getItem('refresh-token')
    },

    setNickname(token) {
        localStorage.setItem('user-nickname', token)
    },
    getNickname() {
        return localStorage.getItem('user-nickname')
    },
    clear() {
        return localStorage.clear()
    },
}
