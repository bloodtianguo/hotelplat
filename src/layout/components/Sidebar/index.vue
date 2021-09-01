<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";
import {
  getMenu
} from '@/utils/auth'
export default {
  created() {
    this.menuArray=JSON.parse(getMenu())
  },
  data() {
    return {
      //假数据
      //相当于权限接口中的response.data.menu.children数组
      menuArray: [],
      newrouter: []//导出的权限列表
    };
  },
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(["sidebar"]),
    routes() {
      this.$router.options.routes.filter(item => {
        if (item.hidden) {
          return false;
        } else {
          this.menuArray.map(arritem => {
            if (arritem.url.includes(item.path)) {
              this.newrouter.push(item);
            }
          });
          return true;
        }
      });
      return this.newrouter;
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  }
};
</script>
<style lang="scss" scoped></style>
