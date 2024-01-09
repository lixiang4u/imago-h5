import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import naive from "naive-ui";
import moment from "moment";

const app = createApp(App)

app.use(router)
app.use(naive)

moment.locale('zh-cn')
app.config.globalProperties.$moment = moment

app.mount('#app')
