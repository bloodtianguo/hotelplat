<template>
  <div class="app-container">
    <p>form表单例子</p>
    <el-from ref="form" :model="form" label-width="120px">
      <el-form-item v-for="(item,index) in formList" :key="index" :label="item.label" >
        <el-input v-model="form.name"></el-input >
      </el-form-item>
    </el-from>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formList:[
        {label:"input示例1"},
        {label:"input示例2"},
        {label:"input示例3"},
      ],
      form: {
        name: '',
      }
    }
  },
  methods: {
    // onSubmit () {
    //   this.$message('submit!')
    // },
    // onCancel () {
    //   this.$message({
    //     message: 'cancel!',
    //     type: 'warning'
    //   })
    // }
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}
</style>

