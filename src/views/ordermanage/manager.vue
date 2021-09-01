<template>
  <div class="app-container">
    <div class="header-box">
      <headertit :headertit="headertit" />
      <div id="search_box mgbot20">
        <el-form :model="searchdata" ref="searchdata" size="normal">
          <el-form-item label="订单状态：">
            <el-radio-group v-model="searchdata.status" size="mini">
              <el-radio
                v-for="(item, index) in typelist"
                :key="index"
                :label="item.val"
                @change="clickSearch()"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item label="下单时间：">
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
              v-model="searchdata.orderStartTime"
              type="date"
              placeholder="开始时间"
              style="margin-left:25px"
            />
            <span class="dateline"></span>
            <el-date-picker
              size="mini"
              value-format="yyyy-MM-dd"
              v-model="searchdata.orderEndTime"
              @change="changeOrendtime()"
              type="date"
              placeholder="结束时间"
            />
          </el-form-item>
          <el-form-item label="预定时间段：">
            <el-date-picker
              size="mini"
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="searchdata.startTime"
              type="date"
              placeholder="开始时间"
            />
            <span class="dateline"></span>
            <el-date-picker
              size="mini"
              @change="changeendtime()"
              value-format="yyyy-MM-dd"
              v-model="searchdata.endTime"
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
            <el-form-item style="margin-right:20px">
              <el-input
                size="mini"
                placeholder="请输入预定人"
                v-model="searchdata.reserveName"
                @clear="clickSearch()"
                clearable
              />
            </el-form-item>
            <el-form-item style="margin-right:20px">
              <el-input
                size="mini"
                placeholder="请输入订单编号"
                style="width:230px"
                v-model="searchdata.orderNo"
                @clear="clickSearch()"
                clearable
              />
            </el-form-item>
            <el-form-item>
              <el-input
                size="mini"
                placeholder="请输入联系人"
                @input="changeSephone"
                v-model="searchdata.reservePhone"
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
            prop="orderNo"
            align="center"
            width="250"
            :resizable="false"
            label="订单编号"
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
            prop="roomType"
            align="center"
            width="90"
            :resizable="false"
            label="房型"
            show-overflow-tooltip
          />
          <el-table-column
            prop="scheduledTime"
            align="center"
            width="200"
            :resizable="false"
            label="预定时间段"
            show-overflow-tooltip
          />
          <el-table-column
            prop="reserveName"
            align="center"
            width="120"
            :resizable="false"
            label="预定人"
            show-overflow-tooltip
          />
          <el-table-column
            prop="reservePhone"
            align="center"
            width="120"
            :resizable="false"
            label="联系方式"
            show-overflow-tooltip
          />
          <el-table-column
            prop="payTypes"
            align="center"
            width="80"
            :resizable="false"
            label="支付方式"
            show-overflow-tooltip
          />
          <el-table-column
            prop="orderMoney"
            align="center"
            width="100"
            :resizable="false"
            label="订单总额"
            show-overflow-tooltip
          />
          <el-table-column
            prop="statu"
            align="center"
            width="80"
            :resizable="false"
            label="订单状态"
          >
            <template slot-scope="scope">
              <span class="col19e" v-show="scope.row.statu == '待支付'">{{
                scope.row.statu
              }}</span>
              <span
                class="col1ce"
                v-show="
                  scope.row.statu == '待确定' ||
                    scope.row.statu == '待入住' ||
                    scope.row.statu == '已入住'
                "
                >{{ scope.row.statu }}</span
              >
              <span
                class="col333"
                v-show="
                  scope.row.statu == '已完成' || scope.row.statu == '已退款'
                "
                >{{ scope.row.statu }}</span
              >
              <span
                class="colf5"
                v-show="
                  scope.row.statu == '待取消' ||
                    scope.row.statu == '取消中' ||
                    scope.row.statu == '退款中'
                "
                >{{ scope.row.statu }}</span
              >
              <span class="col999" v-show="scope.row.statu == '已取消'">{{
                scope.row.statu
              }}</span>
              <span class="col4b5" v-show="scope.row.statu == '待退款'">{{
                scope.row.statu
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="occupancyTime"
            align="center"
            width="180"
            :resizable="false"
            label="入住时间"
            show-overflow-tooltip
          />
          <el-table-column
            prop="finishTime"
            align="center"
            width="180"
            :resizable="false"
            label="离店时间"
            show-overflow-tooltip
          />
          <!-- 操作 -->
          <el-table-column
            label="操作"
            width="270"
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
                plain
                v-if="scope.row.statu == '待确定' && scope.row.shows == true"
                size="mini"
                @click="clickagree(scope.row)"
                >同意</el-button
              >
              <el-button
                size="mini"
                v-if="scope.row.statu == '待确定' && scope.row.shows == true"
                type="warning"
                @click="clickrefuse(scope.row)"
                >拒单</el-button
              >
              <el-button
                v-if="scope.row.statu == '待入住' && scope.row.shows == true"
                size="mini"
                type="success"
                @click="clickin(scope.row)"
                >确认入住</el-button
              >
              <el-button
                size="mini"
                v-if="scope.row.statu == '已入住' && scope.row.shows == true"
                type="danger"
                @click="clickout(scope.row)"
                >离店</el-button
              >
              <el-button
                size="mini"
                v-if="scope.row.statu == '待取消' && scope.row.shows == true"
                type="primary"
                @click="clickcancel(scope.row) && scope.row.shows == true"
                >确定取消</el-button
              >
              <el-button
                size="mini"
                v-if="scope.row.statu == '待退款' && scope.row.shows == true"
                type="success"
                plain
                @click="refundOk(scope.row) && scope.row.shows == true"
                >同意退款</el-button
              >
              <el-button
                size="mini"
                v-if="scope.row.statu == '待退款' && scope.row.shows == true"
                type="warning"
                @click="refundNo(scope.row) && scope.row.shows == true"
                >拒绝退款</el-button
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
import {
  orderList,
  orderconfirm,
  orderocc,
  refundOrderById,
  orderout,
  orderrefund
} from "@/api/order/ordermanage";
import { switchtypeFin } from "@/utils/tools/switchfin";
export default {
  created() {
    this.fetchData();
  },
  data() {
    return {
      headertit: "订单列表",
      filename: "订单管理", //导出的文件名
      tHeader: [
        "订单编号",
        "酒店名称",
        "房型",
        "预定时间段",
        "预定人",
        "联系方式",
        "支付方式",
        "订单总额",
        "订单状态",
        "入住时间",
        "离店时间"
      ], //导出组件头部
      filterVal: [
        "orderNo",
        "hotelName",
        "roomType",
        "scheduledTime",
        "reserveName",
        "reservePhone",
        "payTypes",
        "orderMoney",
        "statu",
        "occupancyTime",
        "finishTime"
      ], //导出组件头部对应值
      multipleSelection: [],
      loading: false,
      sear_PayDate: [], //时间选择器时间
      time: "", //快捷选择下单时间
      total: 0,
      searchdata: {
        page: 1,
        rows: 20,
        status: "", //订单状态
        orderStartTime: "", //下单开始时间
        orderEndTime: "", //下单结束时间
        startTime: "", //预定开始时间
        endTime: "", //预定结束时间
        reserveName: "", //预定人
        orderNo: "", //订单编号
        reservePhone: "" //联系人电话
      },
      searchinit: {
        page: 1,
        rows: 20,
        status: "", //订单状态
        orderStartTime: "", //下单开始时间?
        orderEndTime: "", //下单结束时间?
        startTime: "", //预定开始时间
        endTime: "", //预定结束时间
        reserveName: "", //预定人
        orderNo: "", //订单编号
        reservePhone: "" //联系人电话
      },
      confirmdata: {
        id: "",
        pass: "" //是否通过 boolean
      }, //订单审核数据
      outdata: {
        id: ""
      },
      occdata: {
        id: ""
      },
      typelist: [
        { val: "", label: "全部" },
        { val: 1, label: "待支付" },
        { val: 2, label: "待确定" },
        { val: 3, label: "待入住" },
        { val: 4, label: "已入住" },
        { val: 5, label: "已完成" },
        { val: 9, label: "待取消" },
        { val: 6, label: "取消中" },
        { val: 8, label: "已取消" },
        { val: 10, label: "待退款" },
        { val: 11, label: "退款中" },
        { val: 7, label: "已退款" }
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
      if (row.statu == "已取消" && rowIndex % 2 === 0) {
        return "warning-row999";
      } else if (row.statu == "已取消" && rowIndex % 2 !== 0) {
        return "success-row999";
      } else if (row.statu !== "已取消" && rowIndex % 2 === 0) {
        return "warning-row";
      } else if (row.statu !== "已取消" && rowIndex % 2 !== 0) {
        return "success-row";
      }
      return "";
    },
    timeok(Start, end) {
      if (Start && end) {
        if (!this.timeCompare(Start, end)) {
          end = "";
          this.Warning("结束时间不能早于开始时间!");
        }
      }
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
    changeOrendtime() {
      if (this.searchdata.orderEndTime) {
        this.searchdata.orderEndTime = `${this.searchdata.orderEndTime} 23:59:59`;
      }
      if (this.searchdata.orderStartTime && this.searchdata.orderEndTime) {
        if (
          !this.timeCompare(
            this.searchdata.orderStartTime,
            this.searchdata.orderEndTime
          )
        ) {
          this.searchdata.orderEndTime = "";
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
      orderList(this.searchdata).then(response => {
        if (response.code == "0") {
          this.loading = false;
          if (response.data) {
            this.total = response.data.total;
            this.tableData = response.data.records.map(item => {
              item.startTime = this.changedatano(item.startTime);
              item.endTime = this.changedatano(item.endTime);
              item.scheduledTime = `${item.startTime}到${item.endTime}`;
              item.statu = switchtypeFin(item.status);
              item.shows = true;
              if (item.payType == 1) {
                item.payTypes = "支付宝";
              } else if (item.payType == 2) {
                item.payTypes = "微信";
              } else {
                item.payTypes = "--";
              }
              return item;
            });
          } else {
            this.total = 0;
            this.tableData = [];
          }
        }
      });
    },
    //退款审核
    refundFun(row, text) {
      this.$confirm(text, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        type: "warning"
      })
        .then(() => {
          orderrefund(this.confirmdata).then(response => {
            if (response.code == "0") {
              this.Success("操作成功!");
              row.shows = false;
              this.confirmdata.id = "";
              this.confirmdata.pass = "";
              // this.fetchData();
            }
          });
        })
        .catch(() => {
          this.confirmdata.id = "";
          this.confirmdata.pass = "";
        });
    },
    refundOk(row) {
      this.confirmdata.id = row.id;
      this.confirmdata.pass = true;
      this.refundFun(row, "是否同意该退款请求！！");
    },
    refundNo(row) {
      this.confirmdata.id = row.id;
      this.confirmdata.pass = false;
      this.refundFun(row, "是否拒绝该退款请求！！");
    },
    // 订单审核封装
    confirmFun(row, text) {
      this.$confirm(text, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        type: "warning"
      })
        .then(() => {
          orderconfirm(this.confirmdata).then(response => {
            if (response.code == "0") {
              this.Success("操作成功!");
              row.shows = false;
              this.confirmdata.id = "";
              this.confirmdata.pass = "";
              // this.fetchData();
            }
          });
        })
        .catch(() => {
          this.confirmdata.id = "";
          this.confirmdata.pass = "";
        });
    },
    clickagree(row) {
      this.confirmdata.id = row.id;
      this.confirmdata.pass = true;
      this.confirmFun(row, "是否同意该订单请求！！");
    },
    clickrefuse(row) {
      this.confirmdata.id = row.id;
      this.confirmdata.pass = false;
      this.confirmFun(row, "是否拒绝该订单请求！！");
    },
    // 确认取消
    clickcancel(row) {
      this.occdata.id = row.id;
      refundOrderById(this.occdata).then(response => {
        if (response.code == "0") {
          this.Success("操作成功!");
          this.occdata.id = "";
          row.shows = false;
        }
      });
    },
    clickout(row) {
      this.outdata.id = row.id;
      this.$confirm("是否确定该客户已离店！！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        type: "warning"
      })
        .then(() => {
          orderout(this.outdata).then(response => {
            if (response.code == "0") {
              this.Success("操作成功!");
              this.outdata.id = "";
              row.shows = false;
              // this.fetchData();
            }
          });
        })
        .catch(() => {
          this.outdata.id = "";
        });
    },
    clickin(row) {
      this.occdata.id = row.id;
      this.$confirm("是否确定该客户已入住 ！！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        type: "warning"
      })
        .then(() => {
          orderocc(this.occdata).then(response => {
            if (response.code == "0") {
              this.Success("操作成功!");
              this.occdata.id = "";
              row.shows = false;
              // this.fetchData();
            }
          });
        })
        .catch(() => {
          this.outdata.id = "";
        });
    },
    clickSearch() {
      if (!this.searchdata.startTime) {
        this.searchdata.endTime = "";
      }
      if (!this.searchdata.endTime) {
        this.searchdata.startTime = "";
      }
      if (!this.searchdata.orderStartTime) {
        this.searchdata.orderEndTime = "";
      }
      if (!this.searchdata.orderEndTime) {
        this.searchdata.orderStartTime = "";
      }
      this.searchdata.page = 1;
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
          this.searchdata.orderStartTime = "";
          this.searchdata.orderEndTime = "";
          break;
        case 1: //今日
          this.searchdata.orderStartTime = todaytime().start;
          this.searchdata.orderEndTime = todaytime().end;
          break;
        case 2: //本周
          this.searchdata.orderStartTime = getRecentlyWeek().start;
          this.searchdata.orderEndTime = getRecentlyWeek().end;
          break;
        case 3: //本月
          this.searchdata.orderStartTime = getLastMonth().start;
          this.searchdata.orderEndTime = getLastMonth().end;
          break;
        case 4: //本季度
          this.searchdata.orderStartTime = quartertime().start;
          this.searchdata.orderEndTime = quartertime().end;
          break;
        default:
          break;
      }
    },
    // 点击详情
    clickDetails(row) {
      sessionStorage.orderid = row.id;
      this.$router.push("/ordermanage/details");
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
