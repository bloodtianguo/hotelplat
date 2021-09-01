<template>
  <div class="app-container">
    <div class="header-box">
      <headertit :headertit="headertit" />
      <div id="search_box" class="mgbot20">
        <el-form :model="searchdata" ref="searchdata" size="normal">
          <el-form-item label="退款时间：">
            <el-radio-group v-model="time" size="mini" @change="timechange()">
              <el-radio
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
              @change="changeendtime()"
              type="date"
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
            <el-form-item style="margin-right:20px" label-width="95px">
              <el-input
                size="mini"
                placeholder="请输入订单编号"
                v-model="searchdata.refundOrderNo"
                @clear="clickSearch()"
                style="width:240px"
                clearable
              />
            </el-form-item>
            <el-form-item style="margin-right:20px">
              <el-input
                size="mini"
                placeholder="请输入酒店名称"
                v-model="searchdata.hotelName"
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
          max-height="500"
          height="500"
          :row-class-name="tableRowClassName"
          :header-cell-style="{ background: '#F3F5FA', color: '#000' }"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column
            prop="refundOrderNo"
            align="center"
            width="250"
            :resizable="false"
            label="退款编号"
            show-overflow-tooltip
          />
          <el-table-column
            prop="hotelName"
            align="center"
            width="130"
            :resizable="false"
            label="酒店名称"
            show-overflow-tooltip
          />
          <el-table-column
            prop="statu"
            align="center"
            width="130"
            :resizable="false"
            label="退款状态"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span class="col4b5" v-if="scope.row.statu == '待退款'">{{
                scope.row.statu
              }}</span>
              <span class="col333" v-if="scope.row.statu == '退款中'">{{
                scope.row.statu
              }}</span>
              <span class="col333" v-if="scope.row.statu == '已退款'">{{
                scope.row.statu
              }}</span>
               <span class="colf5" v-if="scope.row.statu == '拒绝退款'">{{
                scope.row.statu
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :prop="lable.pro"
            align="center"
            :label="lable.labels"
            :resizable="false"
            v-for="(lable, index) in tablist"
            :key="index"
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
import { orderRefund, refundList } from "@/api/finan/invoice";
import { switchtypeFin } from "@/utils/tools/switchfin";
export default {
  created() {
    this.fetchData();
  },
  data() {
    return {
      headertit: "退款列表",
      filename: "退款列表", //导出的文件名
      tHeader: [
        "订单编号",
        "酒店名称",
        "退款时间",
        "支付方式",
        "订单总额",
        "退款金额",
        "退款原因"
      ], //导出组件头部
      filterVal: [
        "orderNo",
        "hotelName",
        "createTimes",
        "payTypes",
        "orderMoney",
        "refundMoney",
        "remark"
      ], //导出组件头部对应值
      multipleSelection: [],
      loading: false,
      sear_PayDate: [], //时间选择器时间
      time: "", //快捷选择下单时间
      total: 0,
      searchdata: {
        page: 1,
        rows: 20,
        startTime: "", //退款开始时间
        endTime: "", //退款结束时间
        hotelName: "", //预定人
        refundOrderNo: "" //订单编号
      },
      searchinit: {
        page: 1,
        rows: 20,
        startTime: "", //下单开始时间?
        endTime: "", //下单结束时间?
        hotelName: "", //预定人
        refundOrderNo: "" //订单编号
      },
      refunddata: {
        id: ""
      },
      timelist: [
        { val: "", label: "全部" },
        { val: 1, label: "今天" },
        { val: 2, label: "本周" },
        { val: 3, label: "本月" },
        { val: 4, label: "本季度" }
      ],
      tablist: [
        // { pro: "statu", labels: "退款状态" },
        { pro: "createTime", labels: "退款时间" },
        { pro: "payTypes", labels: "支付方式" },
        { pro: "orderMoney", labels: "订单总额" },
        { pro: "refundMoney", labels: "退款金额" },
        { pro: "remark", labels: "退款原因" }
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
    changeSephone() {
      let value = this.searchdata.reservePhone;
      if (value.length == 1) {
        this.searchdata.reservePhone = value.replace(/[^0-9]/g, "");
      } else {
        this.searchdata.reservePhone = value.replace(/\D/g, "");
      }
    },
    fetchData() {
      this.loading = true;
      refundList(this.searchdata).then(response => {
        if (response.code == "0") {
          this.loading = false;
          this.total = response.data.total;
          this.tableData = response.data.records.map(item => {
            if (item.createTime) {
              item.createTimes = this.changedata(item.createTime);
            }
            if (item.payType == 1) {
              item.payTypes = "支付宝";
            } else if (item.payType == 2) {
              item.payTypes = "微信";
            } else {
              item.payTypes = "--";
            }
            switch (item.status) {
              case 1:
                item.statu = "待退款";
                break;
              case 2:
                item.statu = "退款中";
                break;
              case 3:
                item.statu = "已退款";
                break;
              case 4:
                item.statu = "拒绝退款";
                break;
              default:
                item.statu = "--";
                break;
            }
            return item;
          });
        }
      });
    },
    clickSearch() {
      if (!this.searchdata.startTime) {
        this.searchdata.endTime = "";
      }
      if (!this.searchdata.endTime) {
        this.searchdata.startTime = "";
      }
      this.searchdata.page = 1;
      this.fetchData();
    },
    clickReset() {
      this.searchdata = JSON.parse(JSON.stringify(this.searchinit));
      this.time = "";
    },
    // 点击退款
    clickrefund(row) {
      this.refunddata.id = row.id;
      orderRefund(this.refunddata).then(response => {
        if (response.code == "0") {
          this.Success("操作成功!");
          this.refunddata.id = "";
          row.shows = false;
        }
      });
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
      sessionStorage.orderid = row.id;
      this.$router.push("/finanmanage/refunddetails");
    },
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
::v-deep .el-radio__inner {
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
</style>
