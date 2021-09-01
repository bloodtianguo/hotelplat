<template>
  <div class="app-container">
    <div class="header-box">
      <headertit :headertit="headertit" />
      <div id="search_box" class="mgbot20">
        <el-form :model="searchdata" ref="searchdata" size="normal">
          <el-form-item label="时间：">
            <el-radio-group v-model="time" size="mini" @change="timechange()">
              <el-radio class="radios"
                v-for="(item, index) in timelist"
                :key="index"
                :label="item.val"
                @change="clickSearch()"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
            <!-- 时间选择 -->
            <el-date-picker
              size="mini"
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="searchdata.startTime"
              type="date"
              placeholder="开始时间"
              style="margin-left:25px"
            />
            <span class="dateline"></span>
            <el-date-picker
              size="mini"
              value-format="yyyy-MM-dd"
              v-model="searchdata.endTime"
              type="date"
              @change="changeendtime()"
              placeholder="结束时间"
            />
          </el-form-item>
        </el-form>
        <div class="form_second">
          <el-form
            :model="searchdata"
            ref="searchdata"
            size="normal"
            :inline="true"
            label-position="left"
          >
            <el-form-item label="联系人：">
              <el-input
                size="mini"
                placeholder="请输入联系人"
                v-model="searchdata.name"
                @clear="clickSearch()"
                clearable
              />
            </el-form-item>
            <el-form-item>
              <el-button size="mini" @click="clickSearch()">搜索</el-button>
              <el-button type="primary" size="mini" @click="clickReset()"
                >重置</el-button
              >
            </el-form-item>
          </el-form>
          <div class="export">
            <selectexeport
              :filename="filename"
              :multipleSelection="multipleSelection"
              :tHeader="tHeader"
              :filterVal="filterVal"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="main-box">
      <div class="tab_box">
        <el-table
          :data="tableData"
          ref="tableData"
          v-loading="loading"
          element-loading-text="数据加载中"
          border
          max-height="600"
          height="600"
          :row-class-name="tableRowClassName"
          :header-cell-style="{ background: '#F3F5FA', color: '#000' }"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column
            :prop="lable.pro"
            align="center"
            :label="lable.labels"
            :resizable="false"
            v-for="lable in tablist"
            :key="lable.labels"
            show-overflow-tooltip
          />
          <!-- 操作 -->
          <el-table-column
            label="操作"
            width="230"
            :resizable="false"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                type="info"
                size="mini"
                @click="clickDetails(scope.row)"
                >详情</el-button
              >
              <el-button
                type="success"
                size="mini"
                v-if="scope.row.statu == '未处理'"
                @click="clickhandle(scope.row)"
                >处理</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div id="paging" style="margin-top: 30px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchdata.page"
          :page-sizes="[10, 20, 50, 100, 1000]"
          :page-size="searchdata.rows"
          background
          layout="prev,pager,next,total,sizes"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <!--处理弹窗-->
    <el-dialog
      title="处理"
      close-on-click-modal
      :visible.sync="handledialog"
      width="30%"
      :before-close="handleClose"
      @closed="dialogClosed"
    >
      <div>
        <el-form :model="handleforme" ref="handleforme" label-width="120px">
          <el-form-item label="处理备注">
            <el-input
              type="textarea"
              show-word-limit
              maxlength="200"
              resize="none"
              style="width:60%"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="请输入处理备注"
              v-model="handleforme.remark"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handledialog = false">取 消</el-button>
        <el-button type="primary" @click="handleOK">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  todaytime,
  getRecentlyWeek,
  getLastMonth,
  quartertime,
  timeChange
} from "@/utils/tools/gettime";
import { enterList, enterHandle } from "@/api/enter/enter";
import { switchtypeFin } from "@/utils/tools/switchfin";
export default {
  created() {
    this.fetchData();
  },
  data() {
    return {
      handledialog: false,
      headertit: "入驻消息",
      filename: "入驻消息", //导出的文件名
      tHeader: ["酒店名称", "联系人", "联系方式", "提交时间", "备注"], //导出组件头部
      filterVal: ["hotelName", "name", "phone", "createTime", "remark"], //导出组件头部对应值
      multipleSelection: [],
      loading: false,
      sear_PayDate: [], //时间选择器时间
      time: "", //快捷选择下单时间
      total: 0,
      searchdata: {
        page: 1,
        rows: 20,
        startTime: "", //下单开始时间
        endTime: "", //下单结束时间
        name: "" //联系人电话
      },
      searchinit: {
        page: 1,
        rows: 20,
        startTime: "", //下单开始时间?
        endTime: "", //下单结束时间?
        name: "" //联系人电话
      },
      outdata: {
        id: ""
      },
      occdata: {
        id: ""
      },
      handleforme: {
        id: "",
        pass: true,
        remark: ""
      }, //处理
      tablist: [
        { pro: "hotelName", labels: "酒店名称" },
        { pro: "name", labels: "联系人" },
        { pro: "phone", labels: "联系方式" },
        { pro: "statu", labels: "处理状态" },
        { pro: "createTime", labels: "提交时间" },
        { pro: "updateTime", labels: "处理时间" },
        { pro: "remark", labels: "备注" }
      ],
      timelist: [
        { val: "", label: "全部" },
        { val: 1, label: "今天" },
        { val: 2, label: "本周" },
        { val: 3, label: "本月" },
        { val: 4, label: "本季度" }
      ],
      tableData: []
    };
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "warning-row";
      } else if (rowIndex % 2 !== 0) {
        return "success-row";
      }
      return "";
    },
    changeendtime() {
      if (this.searchdata.endTime) {
        this.searchdata.endTime = `${this.searchdata.endTime} 23:59:59`;
      }
      if (this.searchdata.startTime && this.searchdata.endTime) {
        if (
          !this.timeCompare(this.searchdata.startTime, this.searchdata.endTime)
        ) {
          this.searchdata.endTime = "";
          this.Warning("结束时间不能早于开始时间!");
        }
      }
    },
    fetchData() {
      this.loading = true;
      enterList(this.searchdata).then(response => {
        if (response.code == "0") {
          this.loading = false;
          this.total = response.data.total;
          this.tableData = response.data.records.map(item => {
            if (item.status == 1) {
              item.statu = "已处理";
            } else if (item.status == 0) {
              item.statu = "未处理";
            }
            return item;
          });
        }
      });
    },
    // 订单审核封装
    clickSearch() {
      if (!this.searchdata.startTime) {
        this.searchdata.endTime = "";
      }
      if (!this.searchdata.endTime) {
        this.searchdata.startTime = "";
      }
      this.searchdata.page=1
      this.fetchData();
    },
    clickReset() {
      this.searchdata = JSON.parse(JSON.stringify(this.searchinit));
      this.time = "";
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    clearmultiple() {
      this.$refs.tableData.clearSelection();
    }, //重置勾选状态
    timechange() {
      switch (this.time) {
        case "":
          this.searchdata.startTime = "";
          this.searchdata.endTime = "";
          break;
        case 1: //今日
          this.searchdata.startTime = todaytime().start;
          this.searchdata.endTime = todaytime().end;
          break;
        case 2: //本周
          this.searchdata.startTime = getRecentlyWeek().start;
          this.searchdata.endTime = getRecentlyWeek().end;
          break;
        case 3: //本月
          this.searchdata.startTime = getLastMonth().start;
          this.searchdata.endTime = getLastMonth().end;
          break;
        case 4: //本季度
          this.searchdata.startTime = quartertime().start;
          this.searchdata.endTime = quartertime().end;
          break;
        default:
          break;
      }
    },
    // 点击详情
    clickDetails(row) {
      sessionStorage.enterid = row.id;
      this.$router.push("/entermanage/details");
    },
    clickhandle(row) {
      this.handledialog = true;
      this.handleforme.id = row.id;
    }, //点击处理
    handleClose() {
      this.handledialog = false;
    }, //关闭
    handleOK() {
      this.$refs.handleforme.validate(valid => {
        if (valid) {
          enterHandle(this.handleforme).then(response => {
            if (response.code == "0") {
              this.handledialog = false;
              this.fetchData()
              this.Success("处理成功");
            }
          });
        } else {
          return false;
        }
      });
    }, //确认处理
    dialogClosed() {
      this.$refs.handleforme.resetFields();
      this.handleforme.remark=""
    }, //处理弹窗关闭完成
    handleSizeChange(pageSize) {
      this.searchdata.rows = pageSize;
      this.fetchData();
    },
    handleCurrentChange(curPage) {
      this.searchdata.page = curPage;
      this.fetchData();
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  height: auto;
}
 .radios ::v-deep .el-radio__inner {
  display: none !important;
}
.dateline {
  display: inline-block;
  width: 30px;
  height: 2px;
  background-color: #dcdfe6;
  margin: 0 5px;
}
.el-form-item {
  margin-bottom: 10px;
}
::v-deep .el-table td,
.el-table th {
  padding: 5px 0;
}
.form_second {
  display: flex;
  justify-content: start;
}
.export {
  padding-top: 5px;
}
.el-textarea{
  width:90% !important;
}
</style>
