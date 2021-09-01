<template>
  <div class="app-container">
    <!-- 订单详情 -->
    <div class="cardtype-box">
      <div class="box-card-type">
        订单详情:
        <span v-if="orderType != '待入住'">{{ orderType }}</span>
        <span v-else>待入住</span>
      </div>
      <div class="box-card-btn" @click="clickreturn()">返回</div>
    </div>
    <div class="detailmain">
      <div class="detailmain-header">
        <div><span>订单编号:</span>{{ order.orderNo }}</div>
        <div class="detailmain-btn-box" v-if="detailscha !== '发票'">
          <el-button
            v-if="
              orderType == '待确定' ||
                orderType == '待入住' ||
                orderType == '已完成' ||
                orderType == '已入住'
            "
            type="primary"
            @click="clickrefund()"
            >发起退款</el-button
          >
        </div>
      </div>
      <!-- 入住信息 -->
      <div class="detail-info">
        <div class="title">入住信息</div>
        <el-table
          :data="infoData"
          ref="infoData"
          v-loading="infoloading"
          element-loading-text="数据加载中"
          border
        >
          <el-table-column
            :prop="lable.pro"
            align="center"
            :resizable="false"
            :label="lable.labels"
            v-for="lable in tablist"
            :key="lable.pro"
          />
        </el-table>
      </div>
      <div class="detail-info">
        <div class="title">订单信息</div>
        <table class="vtable" cellpadding="0" cellspacing="0">
          <tr>
            <td>预定人</td>
            <td>用户ID</td>
            <td>联系方式</td>
            <td>酒店名称</td>
          </tr>
          <tr>
            <td class="fon12">{{ order.reserveName }}</td>
            <td class="fon12">{{ order.buyerUserId }}</td>
            <td class="fon12">{{ order.reservePhone }}</td>
            <td class="fon12">{{ order.hotelName }}</td>
          </tr>
          <tbody
            v-if="
              orderType == '待支付' ||
                orderType == '待确定' ||
                orderType == '待入住' ||
                orderType == '已入住' ||
                orderType == '已完成'">
            <tr>
              <td>房型</td>
              <td>房间数</td>
              <td>预定时间段</td>
              <td>预定天数</td>
            </tr>
            <tr>
              <td class="fon12">{{ order.roomType }}</td>
              <td class="fon12">{{ order.orderRoomNumber }}</td>
              <td class="fon12">{{ order.startTime }}到{{ order.endTime }}</td>
              <td class="fon12">{{ order.dayNumber }}</td>
            </tr>
            <tr>
              <td>单价(元)</td>
              <td>订单总金额(元)</td>
              <td>支付方式</td>
              <td>入住时间</td>
            </tr>
            <tr>
              <td class="fon12">{{ order.roomSalePrice }}</td>
              <td class="fon12">{{ order.orderMoney }}</td>
              <td class="fon12">{{ order.payTypes }}</td>
              <td class="fon12">{{ order.occupancyTime }}</td>
            </tr>
            <tr>
              <td>离店时间</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td class="fon12">{{ order.finishTime }}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
          <tbody v-if="orderType == '待取消'">
            <tr>
              <td>房型</td>
              <td>房间数</td>
              <td>预定时间段</td>
              <td>预定天数</td>
            </tr>
            <tr>
              <td class="fon12">{{ order.roomType }}</td>
              <td class="fon12">{{ order.orderRoomNumber }}</td>
              <td class="fon12">{{ order.startTime }}到{{ order.endTime }}</td>
              <td class="fon12">{{ order.dayNumber }}</td>
            </tr>
            <tr>
              <td>单价(元)</td>
              <td>订单总金额(元)</td>
              <td>退款金额(元)</td>
              <td>支付方式</td>
            </tr>
            <tr>
              <td class="fon12">{{ order.roomSalePrice }}</td>
              <td class="fon12">{{ order.orderMoney }}</td>
              <td class="fon12">{{ refundOrders[0].refundMoney }}</td>
              <td class="fon12">{{ order.payTypes }}</td>
            </tr>
            <tr>
              <td>入住时间</td>
              <td>离店时间</td>
              <td>取消时间</td>
              <td></td>
            </tr>
            <tr>
              <td class="fon12">{{ order.occupancyTime }}</td>
              <td class="fon12">{{ order.finishTime }}</td>
              <td class="fon12">{{ order.cancelOrderTime }}</td>
              <td class="fon12"></td>
            </tr>
          </tbody>
          <tbody v-if="orderType == '取消中'">
            <tr>
              <td>房型</td>
              <td>房间数</td>
              <td>预定时间段</td>
              <td>预定天数</td>
            </tr>
            <tr>
              <td class="fon12">{{ order.roomType }}</td>
              <td class="fon12">{{ order.orderRoomNumber }}</td>
              <td class="fon12">{{ order.startTime }}到{{ order.endTime }}</td>
              <td class="fon12">{{ order.dayNumber }}</td>
            </tr>
            <tr>
              <td>单价(元)</td>
              <td>订单总金额(元)</td>
              <td>支付方式</td>
              <td>入住时间</td>
            </tr>
            <tr>
              <td class="fon12">{{ order.roomSalePrice }}</td>
              <td class="fon12">{{ order.orderMoney }}</td>
              <td class="fon12">{{ order.payTypes }}</td>
              <td class="fon12">{{ order.occupancyTime }}</td>
            </tr>
            <tr>
              <td>离店时间</td>
              <td>取消时间</td>
              <td>确认取消时间</td>
              <td></td>
            </tr>
            <tr>
              <td class="fon12">{{ order.finishTime }}</td>
              <td class="fon12">{{ order.cancelOrderTime }}</td>
              <td class="fon12">{{ order.confirmCancelOrderTime }}</td>
              <td class="fon12"></td>
            </tr>
          </tbody>
          <tbody v-if="orderType == '已取消'">
            <tr>
              <td>房型</td>
              <td>房间数</td>
              <td>预定时间段</td>
              <td>预定天数</td>
            </tr>
            <tr>
              <td class="fon12">{{ order.roomType }}</td>
              <td class="fon12">{{ order.orderRoomNumber }}</td>
              <td class="fon12">{{ order.startTime }}到{{ order.endTime }}</td>
              <td class="fon12">{{ order.dayNumber }}</td>
            </tr>
            <tr>
              <td>单价(元)</td>
              <td>订单总金额(元)</td>
              <td>退款金额(元)</td>
              <td>支付方式</td>
            </tr>
            <tr>
              <td class="fon12">{{ order.roomSalePrice }}</td>
              <td class="fon12">{{ order.orderMoney }}</td>
              <td class="fon12">{{ refundOrders[0].refundMoney }}</td>
              <td class="fon12">{{ order.payTypes }}</td>
            </tr>
            <tr>
              <td>入住时间</td>
              <td>离店时间</td>
              <td>发起取消时间</td>
              <td>确认取消时间</td>
            </tr>
            <tr>
              <td class="fon12">{{ order.occupancyTime }}</td>
              <td class="fon12">{{ order.finishTime }}</td>
              <td class="fon12">{{ order.startCancelOrderTime }}</td>
              <td class="fon12">{{ order.confirmCancelOrderTime }}</td>
            </tr>
            <tr>
              <td>取消时间</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td class="fon12">{{ order.cancelOrderTime }}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
          <tbody
            v-if="
              orderType == '待退款' ||
                orderType == '退款中' ||
                orderType == '已退款'">
            <tr>
              <td>酒店名称</td>
              <td>房型</td>
              <td>房间数</td>
              <td>预定时间段</td>
            </tr>
            <tr>
              <td class="fon12">{{ order.hotelName }}</td>
              <td class="fon12">{{ order.roomType }}</td>
              <td class="fon12">{{ order.orderRoomNumber }}</td>
              <td class="fon12">{{ order.startTime }}到{{ order.endTime }}</td>
            </tr>
            <tr>
              <td>预定天数</td>
              <td>单价(元)</td>
              <td>订单总金额(元)</td>
              <td>退款金额(元)</td>
            </tr>
            <tr>
              <td class="fon12">{{ order.dayNumber }}</td>
              <td class="fon12">{{ order.roomSalePrice }}</td>
              <td class="fon12">{{ order.orderMoney }}</td>
              <td class="fon12">{{ refundOrders[0].refundMoney }}</td>
            </tr>
            <tr>
              <td>支付方式</td>
              <td>入住时间</td>
              <td>离店时间</td>
              <td>退款原因</td>
            </tr>
            <tr>
              <td class="fon12">{{ order.payTypes }}</td>
              <td class="fon12">{{ order.occupancyTime }}</td>
              <td class="fon12">{{ order.finishTime }}</td>
              <td class="fon12">{{ order.remark }}</td>
            </tr>
            <tr>
              <td>发起退款时间</td>
              <td>同意退款时间</td>
              <td>实际退款时间</td>
              <td></td>
            </tr>
            <tr>
              <td class="fon12">{{ order.startRefundTime }}</td>
              <td class="fon12">{{ order.confirmRefundTime }}</td>
              <td class="fon12">{{ order.refundTime }}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 地址信息 -->
      <div class="detail-info">
        <div class="title">地址信息：</div>
        <table class="vtable" cellpadding="0" cellspacing="0">
          <tr>
            <td>收货人</td>
            <td>手机号</td>
            <td>所在地区</td>
            <td>详细地址</td>
          </tr>
          <tr>
            <td class="fon12">{{ addressData.userName || "--" }}</td>
            <td class="fon12">{{ addressData.phone || "--" }}</td>
            <td class="fon12">{{ addressData.address || "--" }}</td>
            <td class="fon12">{{ addressData.addressInfo || "--" }}</td>
          </tr>
        </table>
      </div>
      <!-- 礼包信息 -->

      <div class="detail-info">
        <div class="title">礼包信息：</div>
        <table class="vtable" cellpadding="0" cellspacing="0">
          <tr>
            <td>礼包名称</td>
            <td>副标题</td>
            <td>图片</td>
          </tr>
          <tr>
            <td class="fon12">{{ order.spreeName || "--" }}</td>
            <td class="fon12">{{ order.spreeTitle || "--" }}</td>
            <td class="fon12">
              <img
                v-if="order.spreeIcon"
                style="width: 50px; height: 50px;margin-top:10px"
                :src="order.spreeIcon"
                fit="cover"
              />
              <p v-else style="text-align:center">暂无</p>
            </td>
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
      <el-dialog
        title="确定退款"
        close-on-click-modal
        :visible.sync="refundshow"
        width="30%"
        :before-close="refundClose"
        @closed="refundClosed"
      >
        <div>
          <el-form :model="searchdata" ref="searchdata" label-width="120px">
            <el-form-item label="退款原因：" prop="remark">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                style="width:80%"
                resize="none"
                placeholder="请输入退款原因"
                v-model="searchdata.remark"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="refundClose = false">取 消</el-button>
          <el-button type="primary" @click="handleOK">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { orderdetail } from "@/api/order/ordermanage";
import { orderRefund } from "@/api/finan/invoice";
import { switchtypeFin } from "@/utils/tools/switchfin";
export default {
  created() {
    if (sessionStorage.detailscha == "2") {
      this.detailscha = "发票";
    }
    if (sessionStorage.orderid) {
      this.searchdata.id = sessionStorage.orderid;
    }
    this.fetchData();
  },
  data() {
    return {
      refundshow: false,
      detailscha: "",
      infoloading: false,
      orderType: "",
      tablist: [
        { pro: "occupancyName", labels: "入住姓名" },
        { pro: "occupancyPhone", labels: "预留电话" }
      ],
      tablistoper: [
        { pro: "operation", labels: "操作者" },
        { pro: "createTime", labels: "操作时间" },
        { pro: "orderStatu", labels: "订单状态" },
        { pro: "remark", labels: "备注" }
      ],
      spreeIcon: "",
      searchdata: {
        id: "",
        remark: ""
      },
      order: {},
      refundOrders:[{refundMoney:0}],
      addressData: {},
      Operation: [],
      infoData: []
    };
  },
  methods: {
    /*-----------------------------------------------*/
    clickrefund() {
      this.refundshow = true;
    },
    refundClose() {
      this.refundshow = false;
    },
    refundClosed() {
      this.searchdata.remark = "";
    },
    handleOK() {
      orderRefund(this.searchdata).then(response => {
        if (response.code == "0") {
          this.Success("操作成功!");
          this.refundshow = false;
          this.fetchData();
        }
      });
    },

    /*-----------------------------------------------------------*/
    fetchData() {
      orderdetail(this.searchdata).then(response => {
        if (response.code == "0") {
          this.order = response.data.orderDetailDto;
          if(response.data.refundOrders){
            this.refundOrders=response.data.refundOrders
          }
          if (this.order.shippingAddress) {
            this.addressData = JSON.parse(this.order.shippingAddress);
          }
          if (this.order.payType == 1) {
            this.order.payTypes = "支付宝";
          } else if (this.order.payType == 2) {
            this.order.payTypes = "微信";
          } else {
            this.order.payTypes = "";
          }
          this.order.startTime = this.changedatano(this.order.startTime);
          this.order.endTime = this.changedatano(this.order.endTime);
          this.infoData = response.data.occupancyInfos;
          this.orderType = switchtypeFin(this.order.status);
          this.Operation = response.data.orderOperation.map(item => {
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
  font-weight: 400;
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
</style>
