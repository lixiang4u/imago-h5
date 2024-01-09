import moment from "moment";

const formatDateTime=(dateTime)=>{
    return moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
}
const AA=()=>{
    console.log('[AA]')
}

export default {
    formatDateTime,
    AA
}