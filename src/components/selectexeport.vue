<template>
   <el-button
      size="mini"
      style="height:28px;"
      :loading="downloadLoading"
      @click="handleDownload()"
    >导出</el-button>
</template>
<script>
/*
导出勾选
组件使用:
(1)放置组件   <selectexeport :filename="filename"
                       :multipleSelection="multipleSelection"
                       :tHeader="tHeader"
                       :filterVal="filterVal" />

(2)组件参数设置
filename: "公会主播列表",//导出的文件名
multipleSelection: [],//勾选的
tHeader: [],//导出组件头部
filterVal:[],//导出组件头部对应值

(3)重置勾选状态
    clearmultiple () {
      this.$refs.tableData.clearSelection()
    },
*/
export default {
  props: {
    filename: {
      type: String,
      default: ""
    }, //导出文件的名字
    multipleSelection: {
      type: Array,
      default: []
    }, //父级勾选的数组
    tHeader: {
      type: Array,
      default: []
    }, //父级传递头部名字
    filterVal: {
      type: Array,
      default: []
    } //父级传递的头部对应的值
  },
  data() {
    return {
      downloadLoading: false
    };
  },
  methods: {
    updateValue(val) {
      this.multipleSelection = val;
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    handleDownload() {
      if (this.multipleSelection.length) {
        this.downloadLoading = true;
        import("@/utils/Export2Excel").then(excel => {
          const filterVal = this.filterVal; //需要导出的
          const list = this.multipleSelection;
          const data = this.formatJson(filterVal, list);
          excel.export_json_to_excel({
            header: this.tHeader,
            data,
            filename: this.filename
          });
          this.$parent.clearmultiple(); //传递指令使勾选框清空 clearmultiple()为父级的方法
          this.downloadLoading = false;
        });
      } else {
        this.$message({
          message: "请至少选择一项",
          type: "warning"
        });
      }
    }
  },
  watch: {
    multipleSelection: {
      handler(newValue) {
        this.multipleSelection = newValue;
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped></style>
