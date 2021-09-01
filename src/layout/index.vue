<template>
  <div :class="classObj" class="app-wrapper">
   <!--<SwMenu />-->
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <div class="main-container">
      <sidebar class="sidebar-container" />
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar style="margintop: 15px" />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
// SwMenu
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    // SwMenu,
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return
      // return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
@import '~@/styles/variables.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
  // .sidebar-container {
  //   margin-top: 60px;
  // }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 20px;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth}-15px);
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
::v-deep .name-tit {
  line-height: 50px !important;
  height: 50px !important;
  margin-top: 0 !important;
  width: $sideBarWidth;
  background-color: $swmenuBg !important;
  position: fixed !important;
  top: 70px !important;
  left: 0 !important;
}
</style>
