<template>
  <div>
    <el-button
      size="mini"
      style="height:28px;"
      :loading="downloadLoading"
      @click="handleDownload"
      >导出订单</el-button
    >
  </div>
</template>
<script>
export default {
  name: "excel",
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
      downloadLoading: false,
      excelData: []
    };
  },
  methods: {
    //导出
    handleDownload() {
      if (this.multipleSelection.length) {
        this.excelData = [];
        import("@/utils/ExporttreeExcel").then(excel => {
          const filterVal = this.filterVal; //这边是excel头部信息对应的字段
          const list = this.multipleSelection;
          this.formatJson(filterVal, list);
          excel.export_json_to_excel({
            header: this.tHeader,
            data: this.excelData,
            filename: this.filename,
            autoWidth: true
          });
          this.$parent.clearmultiple();
          this.downloadLoading = false;
        });
      } else {
        this.$message({
          message: "请至少选择一项",
          type: "warning"
        });
      }
    },
    formatJson(filterVal, jsonData) {
      jsonData.map((v, index) => {
        let tempArr = [];
        filterVal.map(j => {
          if (v[j]) {
            if (j != "orders") {
                tempArr.push(v[j]);
            } else {//如果有orders进行递归
              this.formatJson(filterVal, v.orders);
            }
          }
        });
        this.excelData.push(tempArr);
      });
    }
  }
};
</script>
