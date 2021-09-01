<template>
  <div class="app-container">
  <div class="header-box">
    <headertit :headertit="headertit" />
    <div id="search_box mgbot20">
      <el-form :model="searchdata" ref="searchdata" size="normal">
        <el-form-item label="发票类型：">
          <el-radio-group v-model="searchdata.invoiceType" size="mini">
            <el-radio
              v-for="(item, index) in typelist"
              :key="index"
              :label="item.val"
              @change="clickSearch()"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发票状态：">
          <el-radio-group v-model="searchdata.status" size="mini">
            <el-radio
              v-for="(item, index) in statulist"
              :key="index"
              :label="item.val"
              @change="clickSearch()"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="申请时间：">
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
          <el-form-item
            label-width="95px"
            style="margin-right:20px"
          >
            <el-input
              size="mini"
              placeholder="请输入申请账号"
              v-model="searchdata.memberId"
              @clear="clickSearch()"
              clearable
            />
          </el-form-item>
          <el-form-item style="margin-right:20px">
            <el-input
              size="mini"
              placeholder="请输入订单编号"
              style="width:240px"
              v-model="searchdata.invoiceNo"
              @clear="clickSearch()"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button size="mini" @click="clickSearch()"
              >搜索</el-button
            >
            <el-button type="primary"  size="mini" @click="clickReset()">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="export">
          <selectexeportTree
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
        row-key="id"
        :cell-class-name="cellcb"
        default-expand-all
         :row-class-name="tableRowClassName"
        :header-cell-style="{ background: '#F3F5FA', color: '#000' }"
        :tree-props="{ children: 'orders', hasChildren: 'hasChildren' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column
          prop="invoiceNo"
          align="center"
          label="申请编号"
          width="260"
          show-overflow-tooltip
          :resizable="false"
        />
        <el-table-column
          prop="memberId"
          align="center"
          label="申请账号"
          width="80"
          show-overflow-tooltip
          :resizable="false"
        />
        <el-table-column
          prop="createTimes"
          align="center"
          label="申请时间"
          width="100"
          show-overflow-tooltip
          :resizable="false"
        />
        <el-table-column
          prop="orderNumber"
          align="center"
          label="订单数"
          width="80"
          show-overflow-tooltip
          :resizable="false"
        />
        <el-table-column
          :prop="lable.pro"
          align="center"
          :label="lable.labels"
          :resizable="false"
          v-for="lable in tablist"
          :key="lable.labels"
          width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="orderNo"
          align="center"
          label="订单编号"
          width="240"
          :resizable="false"
          show-overflow-tooltip
        />
        <el-table-column
          prop="orderMoney"
          align="center"
          label="订单金额(元)"
          width="120"
          :resizable="false"
          show-overflow-tooltip
        />
        <el-table-column
          width="100"
          :prop="lable.pro"
          align="center"
          :label="lable.labels"
          :resizable="false"
          v-for="(lable, index) in tablesecond"
          :key="index"
          show-overflow-tooltip
        />
         <el-table-column
          prop="statu"
          align="center"
          label="状态"
          :resizable="false"
          show-overflow-tooltip
        >
        <template slot-scope="scope">
          <span class="col1ce" v-if="scope.row.statu=='待开票'">{{scope.row.statu}}</span>
          <span class="col19e" v-if="scope.row.statu=='已开票'">{{scope.row.statu}}</span>
          <span class="colf5" v-if="scope.row.statu=='已拒绝'">{{scope.row.statu}}</span>
        </template>
        </el-table-column>
         <el-table-column
          prop="remark"
          align="center"
          label="备注"
          :resizable="false"
          show-overflow-tooltip
        />
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
              v-if="scope.row.showstate"
              @click="clickDetails(scope.row)"
              >详情</el-button
            >
            <el-button
              type="success" plain
              size="mini"
              v-if="
                scope.row.statu == '待开票' &&
                  !scope.row.showdetail &&
                  scope.row.showstate
              "
              @click="clickUpload(scope.row)"
              >上传</el-button
            >
            <el-button
              size="mini"
              type="warning"
              v-if="
                scope.row.statu == '待开票' &&
                  !scope.row.showdetail &&
                  scope.row.showstate
              "
              @click="clickrefuse(scope.row)"
              >拒绝</el-button
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

    <!-- 弹窗类盒子 -->
    <div class="dialog-box">
      <!-- 上传发票 -->
      <el-dialog
        title="发票上传"
        :visible.sync="uploaddialog"
        width="20%"
        @close="uploaddialog = false"
        @closed="uploadinit"
        :close-on-click-modal="false"
      >
        <div>
          <upload ref="childupload" @getimgUrl="getimgUrl" />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="uploaddialog = false">取 消</el-button>
          <el-button type="primary" @click="uploadOK()">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 拒绝开票 -->
      <el-dialog
        title="提示"
        :visible.sync="refusedialog"
        width="20%"
        @close="refusedialog = false"
        @closed="refuseinit"
        :close-on-click-modal="false"
      >
        <div>
          <p class="tc">是否拒绝此开票申请！！</p>
          <el-form
            :model="searchdata"
            ref="searchdata"
            size="normal"
            label-position="left"
          >
            <el-form-item
              label="备注："
              label-width="60px"
              style="margin-right:20px"
            >
              <el-input
                type="textarea"
                placeholder="请输入备注"
                v-model="refuseData.remark"
                show-word-limit
                maxlength="200"
                clearable
                resize="none"
                :autosize="{ minRows: 4, maxRows: 4 }"
              >
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="refusedialog = false">取 消</el-button>
          <el-button type="primary" @click="refuseOK()">确 定</el-button>
        </span>
      </el-dialog>
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
import { invoiceList, invoiceAudit } from "@/api/finan/invoice";
import { switchtypeFin } from "@/utils/tools/switchfin";
import upload from "@/components/upload";
export default {
  components: {
    upload
  },
  created() {
    this.fetchData();
  },
  data() {
    return {
      uploaddialog: false,
      refusedialog: false,
      headertit: "发票申请",
      filename: "发票申请", //导出的文件名
      tHeader: [
        "申请编号",
        "申请账号",
        "申请时间",
        "订单数",
        "开票总金额(元)",
        "订单编号",
        "订单金额(元)",
        "开票时间",
        "发票类型",
        "状态",
        "备注"
      ], //导出组件头部
      filterVal: [
        "invoiceNo",
        "memberId",
        "createTimes",
        "orderNumber",
        "invoiceAmount",
        "orderNo",
        "orderMoney",
        "makeInvoiceTimes",
        "invoiceTypes",
        "statu",
        "remark",
        "orders"
      ], //导出组件头部对应值
      tablist: [{ pro: "invoiceAmount", labels: "开票总金额(元)" }],
      tablesecond: [
        { pro: "makeInvoiceTimes", labels: "开票时间" },
        { pro: "invoiceTypes", labels: "发票类型" },
      ],
      inuploadData: {
        id: "",
        pass: true,
        url: ""
      }, //上传并同意
      refuseData: {
        id: "",
        pass: false,
        remark: "",
        url: "https://meizhao.oss-cn-shanghai.aliyuncs.com/202107/5ac2177b765c4cc783d45d5b926a88b3.png"
      }, //拒绝
      multipleSelection: [],
      loading: false,
      sear_PayDate: [], //时间选择器时间
      time: "", //快捷选择下单时间
      total: 0,
      searchdata: {
        page: 1,
        rows: 20,
        invoiceType: "",
        status: "",
        startTime: "",
        endTime: "",
        memberId: "",
        invoiceNo: ""
      },
      searchinit: {
        page: 1,
        rows: 20
      },
      typelist: [
        { val: "", label: "全部" },
        { val: 1, label: "公司" },
        { val: 2, label: "个人/非企业单位" }
      ],
      statulist: [
        { val: "", label: "全部" },
        { val: 1, label: "待开票" },
        { val: 2, label: "已开票" },
        { val: 3, label: "已拒绝" }
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
       tableRowClassName({row, rowIndex}) {
       if(rowIndex%2 === 0){
          return 'warning-row'
        }else if(rowIndex%2 !== 0){
          return 'success-row'
        }
        return '';
      },
    cellcb(row) {
      if (row.row.showstate == false && row.columnIndex === 0) {
        return "myCell";
      }
    },
    //取得上传组件传过来的url地址
    getimgUrl(val) {
      this.inuploadData.url = JSON.parse(JSON.stringify(val));
    },
    changeendtime() {
      if (this.searchdata.endTime) {
        this.searchdata.endTime = `${this.searchdata.endTime} 23:59:59`;
      }
             if (this.searchdata.startTime && this.searchdata.endTime) {
        if (
          !this.timeCompare(
            this.searchdata.startTime,
            this.searchdata.endTime
          )
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
      this.tableData = [];
      // this.loading = true;
      invoiceList(this.searchdata).then(response => {
        if (response.code == "0") {
          response.data.records.map(item => {
            if (item) {
              this.tableData.push(item);
            }
            this.tableData = this.tableData.map(items => {
              items.showstate = true;
              if(item.makeInvoiceTimes){
                  item.makeInvoiceTimes = this.changedatano(item.makeInvoiceTime);
              }else{
                  item.makeInvoiceTimes = "--";
              }
              // items.children =
              item.orders.map(childitem => {
                childitem.showstate = false;
                childitem.remark="--"
                if (childitem.makeInvoiceTime) {
                  childitem.makeInvoiceTimes = this.changedatano(childitem.makeInvoiceTime);
                } else {
                  childitem.makeInvoiceTimes = "--";
                }
                switch (childitem.invoiceType) {
                  case 1:
                    childitem.invoiceTypes = "企业";
                    break;
                  case 2:
                    childitem.invoiceTypes = "个人";
                    break;
                  default:
                    childitem.invoiceTypes = "--";
                    break;
                }
                return childitem;
              });
              if (items.makeInvoiceTime) {
                items.makeInvoiceTimes = this.changedatano(
                  items.makeInvoiceTime
                );
              } else {
                items.makeInvoiceTimes = "";
              }
              items.createTimes = this.changedatano(items.createTime);
              switch (items.invoiceType) {
                case 1:
                  items.invoiceTypes = "企业";
                  break;
                case 2:
                  items.invoiceTypes = "个人";
                  break;
                default:
                  items.invoiceTypes = "--";
                  break;
              }
              switch (items.status) {
                case 1:
                  items.statu = "待开票";
                  break;
                case 2:
                  items.statu = "已开票";
                  break;
                case 3:
                  items.statu = "已拒绝";
                  break;
                default:
                  items.statu = "--";
                  break;
              }
              return items;
            });
          });
          this.total = response.data.total;
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
      this.searchdata.page=1
      this.fetchData();
    },
    clickReset() {
      this.searchdata = JSON.parse(JSON.stringify(this.searchinit));
      this.time = "";
    },
    handleSelectionChange(val) {
      this.multipleSelection = val.map(item=>{
        item.orderNo="--"
        item.orderMoney="--"
        if(!item.remark){item.remark="--"}
        item.orders.map(items=>{
          items.invoiceNo="--"
          items.memberId="--"
          items.createTimes="--"
          items.orderNumber="--"
          items.invoiceAmount="--"
          items.statu="--"
          items.remark="--"
          return items
        })
        return item
      });
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
      sessionStorage.invoiceid = row.id;
      this.$router.push("/finanmanage/invoicedetails");
    },
    // 点击上传
    clickUpload(row) {
      this.inuploadData.id = row.id;
      this.uploaddialog = true;
    },
    // 发票审核接口
    invoiceAuditFun(data) {
      invoiceAudit(data).then(response => {
        if (response.code == "0") {
          if (data == this.inuploadData) {
            this.Success("上传成功!");
            this.fetchData();
            this.uploaddialog = false;
          } else {
            this.Success("操作成功!");
            this.fetchData();
            this.refusedialog = false;
          }
        }
      });
    },
    // 确认上传
    uploadOK() {
      if (this.inuploadData.url) {
        this.invoiceAuditFun(this.inuploadData);
      } else {
        this.Warning("请上传!");
      }
    },
    // 关闭上传窗口
    uploadclose() {
      this.uploaddialog = false;
    },
    // 初始化上传数据
    uploadinit() {
      this.$refs.childupload.clear();
      this.inuploadData.id = "";
      this.inuploadData.url = "";
    },
    /*---------------------------------------------*/
    // 拒绝开票
    clickrefuse(row) {
      this.refuseData.id=row.id;
      this.refusedialog = true;
    },
    refuseOK() {
      this.invoiceAuditFun(this.refuseData);
    },
    // 初始化拒绝数据
    refuseinit() {
      this.refuseData.id = "";
      this.refuseData.remark = "";
    },
    //翻页
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
.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: space-around;
}
::v-deep .myCell .el-checkbox__input {
  display: none !important;
}
</style>
