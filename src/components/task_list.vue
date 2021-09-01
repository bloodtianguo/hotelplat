<template>
  <div class="task-list">
    <p v-if="err!==''">{{err}}</p> <!-- 用来显示报错 -->
    <table v-if="content!==''" class="vtable">
      <!-- 循环读取数据并显示 -->
      <tr v-for="row in content.slice(1,)" :key=row.id>
        <td v-for="item in row" :key=item.id>{{item}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import axios from 'axios'
import XLSX from 'xlsx'
import transformSheets from '../scripts/read_xlsx'  //导入转制函数
export default {
  created () {
    this.getxlsx()
  },
  data () {
    return {
      content: '',  //初始化数据
      err: ''
    }
  },
  methods: {
    // 获取本地的xlsx表格
    getxlsx () {
      axios.get("/Ratetable.xlsx", { responseType: 'arraybuffer' }).then((res) => {
        var data = new Uint8Array(res.data)
        console.log("转换后的data", data)
        var wb = XLSX.read(data, { type: "array" })
        var sheets = wb.Sheets
        this.content = transformSheets(sheets)
      }).catch(error => {
        console.log("获取失败");
        this.err = error
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.vtable{
 border-spacing: 0;
 border-collapse: collapse;
 font-size:14px;
 td{
    width: 250px;
    border:1px solid #ebeef5;
    line-height: 30px;
    text-align: center;
}
}
</style>