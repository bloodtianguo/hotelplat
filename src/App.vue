<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { getToken, removeToken } from "@/utils/auth";
export default {
  name: "App",
  //在用户关闭页面时清空数据资料
  mounted() {
    window.addEventListener("beforeunload", e => this.beforeunloadHandler(e));
    window.addEventListener("unload", e => this.unloadHandler(e));
  },
  destroyed() {
    window.removeEventListener("beforeunload", e =>
      this.beforeunloadHandler(e)
    );
    window.removeEventListener("unload", e => this.unloadHandler(e));
  },
  methods: {
    beforeunloadHandler() {
      this._beforeUnload_time = new Date().getTime();
    },
    unloadHandler(e) {
      this._gap_time = new Date().getTime() - this._beforeUnload_time;
      //判断是窗口关闭还是刷新
      if (this._gap_time <= 5) {
        //如果是登录状态，关闭窗口前，移除用户
        // if (getToken()) {
        //   removeToken();
        // }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#app {
  background-color: #fbfcfe;
  // background: #EAECF1
}
body .el-table th.gutter {
  display: table-cell !important;
}
</style>
