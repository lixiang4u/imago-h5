export default {
    setAccessToken(token) {
        localStorage.setItem('access-token', token)
    },
    getAccessToken(token) {
        return localStorage.getItem('access-token')
    },

    setRefreshToken(token) {
        localStorage.setItem('refresh-token', token)
    },
    getRefreshToken(token) {
        return localStorage.getItem('refresh-token')
    },

    setNickname(token) {
        localStorage.setItem('user-nickname', token)
    },
    getNickname(token) {
        return localStorage.getItem('user-nickname')
    },
}
