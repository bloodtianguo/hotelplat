<template>
  <div class="app-container">
    <!-- 订单详情 -->
    <div class="mains">
      <div class="cardtype-box">
        <div class="box-card-type">
          <span>开票详情:</span>
          <span class="fon14 mgle10 colred"> {{ invoicedata.statu }}</span>
        </div>
        <div class="box-card-btn" @click="clickreturn()">返回</div>
      </div>
      <div class="line"></div>
      <p class="fon12">申请时间：{{ invoicedata.createTimes }}</p>
    </div>

    <div class="detailmain">
      <div class="detailmain-header">
        <div>
          <span>申请编号:</span
          ><span class="num">{{ invoicedata.invoiceNo }}</span>
          <span class="mgle30">申请账号:</span
          ><span class="num">{{ invoicedata.memberId }}</span>
        </div>
        <div class="detailmain-btn-box">
          <el-button
             type="success" plain
            size="mini"
            v-if="invoicedata.statu == '待开票'"
            @click="clickUpload()"
            >上传</el-button
          >
          <el-button
            size="mini"
             type="warning"
            v-if="invoicedata.statu == '待开票'"
            @click="clickrefuse()"
            >拒绝</el-button
          >
        </div>
      </div>
      <div class="detail-info">
        <div class="title">开票信息:</div>
        <table class="vtable" cellpadding="0" cellspacing="0">
          <tr>
            <td>发票类型</td>
            <td>订单数量</td>
            <td>开票总金额(元)</td>
            <td>开票时间</td>
          </tr>
          <tr>
            <td class="fon12">{{ invoicedata.invoiceTypes }}</td>
            <td class="fon12">{{ invoicedata.orderNumber }}</td>
            <td class="fon12">{{ invoicedata.invoiceAmount }}</td>
            <td class="fon12">{{ invoicedata.makeInvoiceTimes||"--"}}</td>
          </tr>
          <!------------------------------------------------------------>
          <tr v-if="invoicedata.invoiceTypes == '企业'">
            <td>公司名称</td>
            <td>纳税识别号</td>
            <td>开户银行</td>
            <td>银行卡号</td>
          </tr>
          <tr v-else>
            <td>纳税人名称</td>
            <td>纳税识别号</td>
            <td>电子邮箱</td>
            <td>备注</td>
          </tr>
          <tr v-if="invoicedata.invoiceTypes == '企业'">
            <td class="fon12">{{ invoicedata.name }}</td>
            <td class="fon12">{{ invoicedata.taxNumber }}</td>
            <td class="fon12">{{ invoicedata.bankOfDeposit }}</td>
            <td class="fon12">{{ invoicedata.remark }}</td>
          </tr>
          <tr v-else>
            <td class="fon12">{{ invoicedata.name }}</td>
            <td class="fon12">{{ invoicedata.taxNumber }}</td>
            <td class="fon12">{{ invoicedata.reveiverEmail }}</td>
            <td class="fon12">{{ invoicedata.remark }}</td>
          </tr>
          <tr v-if="invoicedata.invoiceTypes == '企业'">
            <td>电子邮箱</td>
            <td>备注</td>
            <td></td>
            <td></td>
          </tr>
          <tr v-if="invoicedata.invoiceTypes == '企业'">
            <td class="fon12">{{ invoicedata.reveiverEmail }}</td>
            <td class="fon12">{{ invoicedata.remark }}</td>
            <td></td>
            <td></td>
          </tr>
          <!------------------------------------------------------------>
        </table>
      </div>
      <div class="detail-info">
        <div class="title">订单信息:</div>
        <el-table
          :data="Operation"
          ref="Operation"
          v-loading="infoloading"
          element-loading-text="数据加载中"
          border
        >
          <el-table-column
            :prop="lable.pro"
            align="center"
            :resizable="false"
            :label="lable.labels"
            v-for="lable in tablistoper"
            :key="lable.pro"
          />
          <el-table-column align="center" :resizable="false" label="操作">
            <template slot-scope="scope">
              <el-link
                type="primary"
                :underline="false"
                class="fon12"
                @click="clickorder(scope.row)"
                >详情</el-link
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 弹出盒子 -->
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
import { invoiceDetail, invoiceAudit } from "@/api/finan/invoice";
import upload from "@/components/upload";
export default {
  components: {
    upload
  },
  created() {
    if (sessionStorage.invoiceid) {
      this.searchdata.id = sessionStorage.invoiceid;
    }
    this.fetchData();
  },
  data() {
    return {
      uploaddialog: false,
      refusedialog: false,
      infoloading: false,
      tablistoper: [
        { pro: "orderNo", labels: "订单编号" },
        { pro: "orderMoney", labels: "订单金额" },
        { pro: "roomType", labels: "房型" }
      ],
      searchdata: {
        id: "",
        pass: ""
      },
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
      invoicedata: {
        statu: "待开票",
        invoiceNo: "124552542422", //申请编号
        memberId: "124552542422", //申请账号
        invoiceTypes: "个人", //发票类型
        orderNumber: 0, //订单数
        invoiceAmount: 0, //开票总额
        createTimes: "2021-06-04 15：20",
        makeInvoiceTimes: 0, //开票时间
        name: "公司名称", //公司名称
        taxNumber: "", //纳税识别号
        bankOfDeposit: "", //开户银行
        bankAccount: "", //银行卡号
        // contact: "", //联系方式
        reveiverEmail: "", //电子邮箱
        remark: "" //备注
      },
      Operation: []
    };
  },
  methods: {
    //取得上传组件传过来的url地址
    getimgUrl(val) {
      this.inuploadData.url = val;
    },
    fetchData() {
      invoiceDetail(this.searchdata).then(response => {
        if (response.code == "0") {
          this.invoicedata = response.data;
          this.Operation = response.data.orders;
          if (this.invoicedata.invoiceType == 1) {
            this.invoicedata.invoiceTypes = "企业";
          } else if (this.invoicedata.invoiceType == 2) {
            this.invoicedata.invoiceTypes = "个人";
          }
          // 发票状态
          switch (this.invoicedata.status) {
            case 1:
              this.invoicedata.statu = "待开票";
              break;
            case 2:
              this.invoicedata.statu = "已开票";
              break;
            case 3:
              this.invoicedata.statu = "已拒绝";
              break;
            default:
              break;
          }
          // 时间转换
          if(this.invoicedata.makeInvoiceTimes){
            this.invoicedata.makeInvoiceTimes = this.changedatano(
            this.invoicedata.makeInvoiceTime
          )
          }else{
            this.invoicedata.makeInvoiceTimes =""
          }

          this.invoicedata.createTimes = this.changedata(
            this.invoicedata.createTime
          );
        }
      });
    },
    clickUpload(row) {
      this.inuploadData.id = JSON.parse(JSON.stringify(this.searchdata.id));
      this.uploaddialog = true;
    },
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
      if ((this.inuploadData.url = "")) {
        this.Warning("请上传!");
        return false;
      } else {
        this.invoiceAuditFun(this.inuploadData);
      }
    },
    // 关闭上传窗口
    uploadclose() {
      this.uploaddialog = false;
    },
    // 初始化上传数据
    uploadinit() {
      this.$refs.childupload.clear();
      this.inuploadData.url = "";
    },
    /*---------------------------------------------*/
    // 拒绝开票
    clickrefuse() {
      this.refuseData.id = JSON.parse(JSON.stringify(this.searchdata.id));
      this.refusedialog = true;
    },
    // 确认拒绝
    refuseOK() {
      this.invoiceAuditFun(this.refuseData);
    },
    // 初始化拒绝数据
    refuseinit() {
      this.refuseData.remark = "";
    },
    clickreturn() {
      sessionStorage.removeItem("invoiceid");
      this.$router.go(-1);
    },
    clickorder(row){
      sessionStorage.orderid = row.id;
      sessionStorage.detailscha = "2";
      this.$router.push("/finanmanage/details");
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  height: auto;
  color: #4d4f53;
}
::v-deep .el-table td,
.el-table th {
  padding: 5px 0;
}
.title {
  font-weight: 400;
  line-height: 50px;
}
.app-container {
  background-color: #fbfcfe;
}
.mains {
  padding: 10px 20px;
  background-color: #fff;
  box-shadow: 0 0 2px rgba($color: #000000, $alpha: 0.2);
}
.cardtype-box {
  display: flex !important;
  background-color: #fff;
  justify-content: space-between;
  padding: 10px 0;
  border-radius: 2px;
  .box-card-type {
    line-height: 30px;
    width: 130px;
  }
  .box-card-btn {
    cursor: pointer;
    font-size: 16px;
    line-height: 30px;
    width: 80px;
    border: 1px solid #e4e7ed;
    text-align: center;
    border-radius: 4px;
    transform: all 0.3s;
    &:hover {
      border-color: #409eff;
      color: #409eff;
    }
  }
}
.detailmain {
  height: calc(100% - 80px);
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 0 2px rgba($color: #000000, $alpha: 0.2);
  .detailmain-header {
    line-height: 50px;
    border-bottom: 2px solid #e4e7ed;
    display: flex;
    justify-content: space-between;
    .detailmain-btn-box {
      padding-right: 20px;
    }
  }
  .detail-info {
    width: 100%;
    padding-top: 20px;
    table {
      width: 100%;
      height: 90px;
      margin-left: 10px;
    }
    td {
      width: 150px;
      line-height: 30px;
      height: 30px;
      tr {
        text-align: center;
        border-bottom: 1px solid #ebeef5;
      }
    }
  }
}
.num {
  display: inline-block;
  padding-left: 20px;
}
</style>
