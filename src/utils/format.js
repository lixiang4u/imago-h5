import moment from "moment";

const formatDateTime = (dateTime) => {
    return moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
}

const formatToUnixTime = (dateTime) => {
    return moment(dateTime).unix();
}

export default {
    formatDateTime,
    formatToUnixTime
}