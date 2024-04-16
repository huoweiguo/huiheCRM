import { createApp } from 'vue'
import store from './store'
import router from './router'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import App from './App.vue'
import hasPermi from './plugins/hasPermi.ts'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app
  .use(store)
  .use(router)
  .use(hasPermi)
  .use(ElementPlus, {
    locale: zhCn
  })
  .mount('#app')
