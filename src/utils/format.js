import moment from "moment";

const formatDateTime = (dateTime) => {
    return moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
}

const formatToUnixTime = (dateTime) => {
    return moment(dateTime).unix();
}

const formatBytes = (bytes) => {
    if (bytes < 1024) {
        return bytes + ' bytes';
    } else if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(2) + ' KB';
    } else if (bytes < 1024 * 1024 * 1024) {
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    } else {
        return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    }
}

export default {
    formatDateTime,
    formatToUnixTime,
    formatBytes,
}