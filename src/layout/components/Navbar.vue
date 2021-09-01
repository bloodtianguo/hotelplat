<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <breadcrumb class="breadcrumb-container" />
    <div class="loginout" @click="logout">
    退出登录
    <!-- <i class="icon el-icon-s-custom"></i>
    <span class="name">{{name||"--"}}</span>
      <el-button
        size="mini"
        icon="el-icon-switch-button"
        circle
        @click="logout"
      ></el-button> -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/breadcrumb";
import Hamburger from "@/components/hamburger";
import { logout } from "@/api/user";
export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  created() {
    // this.info()
    if (localStorage.name) {
      this.name = localStorage.name;
    }
  },
  computed: {
    ...mapGetters(["sidebar"])
  },
  data() {
    return {
      name: ""
    };
  },
  methods: {
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
      this.$router.push("/login");
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  width: 100%;
  height: 40px;
  overflow: hidden;
  position: relative;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }
  .loginout {
    float: right;
    line-height: 40px;
    margin-right: 100px;
    cursor: pointer;
    color: #606266;
    transform: all 0.4s;
    font-size: 16px;
    .name{
      display: inline-block;
      margin-right: 20px;
    }
    .icon{
    font-size: 25px;
    margin-right: 10px;
    }
   &:hover {
    color: #478de4;
  }
  }
}
</style>
