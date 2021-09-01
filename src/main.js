import Vue from 'vue'
import 'normalize.css/normalize.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import animate from 'animate.css'
import particlesJs from "particles.js" //引入粒子效果
import {
  getchtime2,
  getchtime
} from './utils/tools/format-time.js'; //时间格式化函数
import {timeCompare} from '@/utils/tools/gettime'
import {
  sortFunallrise,
  sortFunalldrop
} from "./utils/tools/sortdata";
import {
  Success,
  Infos,
  Warning
} from '@/utils/tools/message.js';
import {hidetextFun} from '@/utils/tools/hidetext';
import selectexeport from "@/components/selectexeport.vue"; //引入导出勾选组件
import selectexeportTree from "@/components/selectexeportTree.vue"; //引入导出勾选组件
import headertit from "@/components/headertit.vue"; //引入导出勾选组件
import '@/styles/index.scss'
import App from './App'
import store from './store'
import router from './router'
import '@/icons'
import '@/permission'
/*--------------------------------------------*/
Vue.use(ElementUI)
Vue.use(particlesJs)
Vue.use(animate)
Vue.config.productionTip = false
Vue.component("selectexeport", selectexeport) //全局注册 勾选导出组件
Vue.component("selectexeportTree", selectexeportTree) //全局注册 勾选导出组件
Vue.component("headertit", headertit) //全局注册 列表头部组件
/*----------------------------监听--------------------------------*/
Vue.prototype.changedata = getchtime2; //格式化时间 带秒数
Vue.prototype.changedatano = getchtime; //格式化时间 不带秒数
Vue.prototype.timeCompare = timeCompare; //前后时间比较 start,end
Vue.prototype.Success = Success; //成功消息提示
Vue.prototype.Warning = Warning; //警告消息提示
Vue.prototype.Infos = Infos; //普通消息提示
Vue.prototype.hidetextFun = hidetextFun; //超出显示省略号
Vue.prototype.sortFunallrise = sortFunallrise; //表格手动排序(升序)
Vue.prototype.sortFunalldrop = sortFunalldrop; //表格手动排序(降序)

Vue.prototype.$addStorageEvent = function (type, key, data) {
  if (type === 1) {
    // 创建一个StorageEvent事件
    var newStorageEvent = document.createEvent('StorageEvent');
    const storage = {
      setItem: function (k, val) {
        localStorage.setItem(k, val);
        newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null);
        window.dispatchEvent(newStorageEvent);
      }
    }
    return storage.setItem(key, data);
  } else {
    // 创建一个StorageEvent事件
    var newStorageEvent = document.createEvent('StorageEvent');
    const storage = {
      setItem: function (k, val) {
        sessionStorage.setItem(k, val);
        newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null);
        window.dispatchEvent(newStorageEvent);
      }
    }
    return storage.setItem(key, data);
  }
}
//防止用户手动修改sessionStorage
window.addEventListener("storage", (e) => {
  sessionStorage.setItem(e.key, e.oldValue)
  })
/*------------------------------------------------------------------*/
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
