<template>
  <div class="app-container">
    <!-- 订单详情 -->
    <div class="cardtype-box">
      <div class="box-card-type"><span>订单详情：{{ orderType }}</span></div>
      <div class="box-card-btn" @click="clickreturn()">返回</div>
    </div>
    <div class="detailmain">
      <div class="detailmain-header">
        <div><span>订单编号：</span>{{ order.orderNo }}</div>
      </div>
      <div class="detail-info">
        <div class="title">订单信息</div>
        <table class="vtable" cellpadding="0" cellspacing="0">
          <tr>
            <td>酒店名称</td>
            <td>房型</td>
            <td>房间数</td>
            <td>预定时间段</td>
          </tr>
          <tr>
            <td class="fon12">{{refundOrder.hotelName}}</td>
            <td class="fon12">{{ order.roomType }}</td>
            <td class="fon12">{{ order.orderRoomNumber }}</td>
            <td class="fon12">{{ order.startTime }}到{{ order.endTime }}</td>
          </tr>
          <tr>
            <td>预定天数</td>
            <td>单价(元)</td>
            <td>订单总金额(元)</td>
            <td></td>
          </tr>
          <tr>
            <td class="fon12">{{ order.dayNumber }}</td>
            <td class="fon12">{{ order.roomPrice }}</td>
            <td class="fon12">{{ order.orderMoney }}</td>
            <td></td>
          </tr>
          <tr>
            <td>支付方式</td>
            <td>入住时间</td>
            <td>离店时间</td>
            <td>备注</td>
          </tr>
          <tr>
            <td class="fon12">{{ order.payTypes }}</td>
            <td class="fon12">{{ order.occupancyTime }}</td>
            <td class="fon12">{{ order.finishTime }}</td>
            <td class="fon12">{{ order.remark }}</td>
          </tr>
        </table>
      </div>

      <!--退单信息-->
     <div class="detail-info">
        <div class="title">退单信息</div>
        <table class="vtable" cellpadding="0" cellspacing="0">
          <tr>
            <td>退款状态</td>
            <td>退款原因</td>
            <td>退款金额(元)</td>
            <td>发起退款时间</td>
          </tr>
          <tr>
            <td class="fon12">{{refundOrder.status}}</td>
            <td class="fon12">{{refundOrder.remark}}</td>
            <td class="fon12">{{refundOrder.refundMoney}}</td>
            <td class="fon12">{{refundOrder.createTime}}</td>
          </tr>
           <tr>
            <td>同意退款时间</td>
            <td>实际退款时间</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
           <td class="fon12">{{order.confirmRefundTime}}</td>
           <td class="fon12">{{order.refundTime}}</td>
            <td></td>
            <td></td>
          </tr>
        </table>
      </div>
      <div class="detail-info">
        <div class="title">操作信息</div>
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
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { refundGet } from "@/api/finan/invoice";
import { switchtypeFin } from "@/utils/tools/switchfin";
export default {
  created() {
    if (sessionStorage.orderid) {
      this.searchdata.id = sessionStorage.orderid;
    }
    this.fetchData();
  },
  data() {
    return {
      infoloading: false,
      orderType: "",
      // tablist: [
      //   { pro: "occupancyName", labels: "入住姓名" },
      //   { pro: "occupancyPhone", labels: "预留电话" }
      // ],
      tablistoper: [
        { pro: "operation", labels: "操作者" },
        { pro: "createTime", labels: "操作时间" },
        { pro: "orderStatu", labels: "订单状态" },
        { pro: "remark", labels: "备注" }
      ],
      searchdata: {
        id: ""
      },
      order: {},
      Operation: [],
      refundData:{},
      refundOrder:{},
      order:{}
    };
  },

  methods: {
    fetchData() {
      refundGet(this.searchdata).then(response => {
        if (response.code == "0") {
          this.order = response.data.order;
          this.refundOrder = response.data.refundOrder;
          this.order=response.data.order;
          if (this.order.payType == 1) {
            this.order.payTypes = "支付宝";
          } else if (this.order.payType == 2) {
            this.order.payTypes = "微信";
          } else {
            this.order.payTypes = "";
          }
               switch (this.refundOrder.status) {
              case 1:
                this.refundOrder.status="待退款"
              break;
              case 2:
                this.refundOrder.status="退款中"
              break;
              case 3:
                this.refundOrder.status="已退款"
              break;
              case 4:
                this.refundOrder.status="拒绝退款"
              break;
              default:
               this.refundOrder.status="--"
              break;
            }
          this.order.startTime = this.changedatano(this.order.startTime);
          this.order.endTime = this.changedatano(this.order.endTime);
          this.orderType = switchtypeFin(this.order.status);
          this.shows = true;
          this.Operation = response.data.orderOperations.map(item => {
            item.orderStatu = switchtypeFin(item.orderStatus);
            return item;
          });
        }
      });
    },
    clickreturn() {
      sessionStorage.removeItem("orderid");
      this.$router.go(-1);
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
  font-weight: 800;
  line-height: 50px;
}
.app-container {
  background-color: #fbfcfe;
}
.cardtype-box {
  display: flex !important;
  background-color: #fff;
  box-shadow: 0 0 2px rgba($color: #000000, $alpha: 0.2);
  justify-content: space-between;
  border-radius: 2px;
  padding: 10px 20px;
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

</style>
