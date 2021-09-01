<template>
  <div class="header">{{headertit}}</div>
</template>
<script>
export default {
  props: {
    headertit: {
      type: String,
      default: ""
    },
  },
  data() {
    return {

    };
  },
};
</script>

<style lang="scss" scoped>
.header{
  line-height: 30px;
  font-weight: 900;
}
</style>
