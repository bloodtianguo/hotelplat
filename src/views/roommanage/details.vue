<template>
  <div class="app-container">
    <div class="mains">
      <div class="cardtype-box">
        <div class="box-card-type">
          <span>房间详情:</span>
          <span class="fon14 mgle10 colred">{{ invoicedata.checkStatus }}</span>
        </div>
        <div class="box-card-btn" @click="clickreturn()">返回</div>
      </div>
      <div class="line"></div>
      <p class="fon12">申请时间：{{ invoicedata.createTime }}</p>
    </div>

    <div class="detailmain">
      <div class="detailmain-header">
        <div><span>房间信息:</span><span class="num"></span></div>
        <div
          class="detailmain-btn-box"
          v-show="invoicedata.checkStatus == '待审核'"
        >
          <el-button type="success" plain size="mini" @click="clickagree()"
            >通过</el-button
          >
          <el-button size="mini" type="warning" @click="clickrefuse()"
            >拒绝</el-button
          >
        </div>
        <div
          class="detailmain-btn-box"
          v-show="invoicedata.checkStatus == '审核通过'&&invoicedata.status =='上架'"
        >
          <el-button size="mini" type="danger" @click="clickviolation()"
            >违规下架</el-button
          >
        </div>
      </div>
      <div class="detail-info mgbot20">
        <table class="vtable" cellpadding="0" cellspacing="0">
          <tr>
            <td>酒店名称</td>
            <td>房间名称</td>
            <td>房间数</td>
          </tr>
          <tr>
            <td class="fon12">{{ invoicedata.hotelName }}</td>
            <td class="fon12">{{ invoicedata.roomName }}</td>
            <td class="fon12">{{ invoicedata.roomNumber }}</td>
          </tr>
          <!------------------------------------------------------------>
          <tr>
            <td>可住人数</td>
            <td>销售价(元)</td>
            <td>优惠价(元)</td>
          </tr>
          <tr>
            <td class="fon12">{{ invoicedata.roomResideNumber }}</td>
            <td class="fon12">{{ invoicedata.roomPrice }}</td>
            <td class="fon12">{{ invoicedata.roomSalePrice }}</td>
          </tr>
          <tr>
            <td>视频</td>
            <td>审核时间</td>
            <td v-if="invoicedata.checkStatus == '审核通过'">销售状态</td>
            <td v-if="invoicedata.checkStatus == '待审核'"></td>
            <td v-if="invoicedata.checkStatus == '审核失败'">拒绝理由</td>
            <td v-if="invoicedata.checkStatus == '违规下架'">下架理由</td>
          </tr>
          <tr>
            <td class="fon12">
              <svg-icon icon-class="video" @click="clickvideo()" />
            </td>
            <td class="fon12">{{ invoicedata.checkTime }}</td>
            <td class="fon12" v-if="invoicedata.checkStatus == '审核通过'">
              {{ invoicedata.status }}
            </td>
            <td v-if="invoicedata.checkStatus == '待审核'"></td>
            <td class="fon12" v-if="invoicedata.checkStatus == '审核失败'">
              {{ invoicedata.remark }}
            </td>
            <td class="fon12" v-if="invoicedata.checkStatus == '违规下架'">
              {{ invoicedata.remark }}
            </td>
          </tr>
          <!------------------------------------------------------------>
        </table>
      </div>
      <!--设备设施-->
      <div class="box-card-type mgbot20">
        <div class="lh50">设备设施:</div>
        <div class="box-list">{{ invoicedata.roomFacility }}</div>
      </div>
      <div class="box-card-type mgbot20">
        <div class="lh50">房间描述:</div>
        <div
          class="box-list"
          id="roomDescribe-box"
          v-html="invoicedata.invoice"
        ></div>
      </div>
    </div>
    <!--弹窗盒子-->
    <div class="dialog-box">
      <el-dialog
        title="视频"
        :visible.sync="videodialog"
        width="300px"
        @close="videodialog = false"
        @closed="closevideo()"
        :close-on-click-modal="false"
      >
        <video
          ref="video"
          width="260"
          height="350"
          :src="invoicedata.roomVideoUrl"
          controls
        ></video>
        <span slot="footer" class="dialog-footer">
          <el-button @click="videodialog = false">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { roomget, roomaudit, roomviolation } from "@/api/room/room";
export default {
  created() {
    if (sessionStorage.roomid) {
      this.searchdata.id = sessionStorage.roomid;
    }
    this.fetchData();
  },
  data() {
    return {
      videodialog: false,
      searchdata: {
        id: "",
        pass: ""
      },
      confirmdata: {
        _uid:sessionStorage.userId,
        id: "",
        pass: "", //是否通过 boolean
        remark: ""
      }, //订单审核数据
      violadata: {
        id: "",
        remark: ""
      }, //违规下架
      invoicedata: {},
      videodata: {},
      Operation: []
    };
  },
  methods: {
    fetchData() {
      roomget(this.searchdata).then(response => {
        if (response.code == "0") {
          this.invoicedata = response.data;
          if (this.invoicedata.createTime) {
            this.invoicedata.createTime = this.changedata(
              this.invoicedata.createTime
            );
          }
          if (this.invoicedata.checkTime) {
            this.invoicedata.checkTime = this.changedata(
              this.invoicedata.checkTime
            );
          }
          if (this.invoicedata.roomDescribe) {
            if (this.invoicedata.roomDescribe.roomDescribe) {
              this.invoicedata.invoice = this.invoicedata.roomDescribe.roomDescribe;
            } else {
              this.invoicedata.invoice = " <span>无</span>";
            }
          } else {
            this.invoicedata.invoice = " <span>无</span>";
          }
          switch (this.invoicedata.checkStatus) {
            case 1:
              this.invoicedata.checkStatus = "待审核";
              break;
            case 2:
              this.invoicedata.checkStatus = "审核通过";
              break;
            case 3:
              this.invoicedata.checkStatus = "审核失败";
              break;
            case 4:
              this.invoicedata.checkStatus = "违规下架";
              break;
            default:
              break;
          }
          //销售状态
          switch (this.invoicedata.status) {
            case 1:
              this.invoicedata.status = "上架";
              break;
            case 2:
              this.invoicedata.status = "下架";
              break;
            default:
              break;
          }
        }
      });
    },
    confirmFun() {
      roomaudit(this.confirmdata).then(response => {
        if (response.code == "0") {
          this.Success("操作成功!");
          this.confirmdata.id = "";
          this.confirmdata.pass = "";
          this.confirmdata.remark = "";
          this.fetchData();
        }
      });
    },
    // 审核
    clickagree() {
      this.$confirm("是否审核通过该房间！！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.confirmdata.id = this.invoicedata.id;
        this.confirmdata.pass = true;
        this.confirmFun();
      });
    },
    clickrefuse() {
      this.$prompt("是否审核拒绝该房间！！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: "",
        inputPlaceholder: "请输入拒绝原因",
        inputErrorMessage: "请输入原因！"
      })
        .then(({ value }) => {
          this.confirmdata.id = this.invoicedata.id;
          this.confirmdata.pass = false;
          this.confirmdata.remark = value;
          this.confirmFun();
        })
        .catch(() => {
          this.Infos("取消操作");
        });
    },
    //违规下架
    clickviolation() {
      this.$prompt("是否违规下架该房间！！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: "",
        inputPlaceholder: "请输入下架原因",
        inputErrorMessage: "请输入原因！"
      })
        .then(({ value }) => {
          this.violadata.id = this.invoicedata.id;
          this.violadata.remark = value;
          roomviolation(this.violadata).then(response => {
            if (response.code == "0") {
              this.Success("操作成功!");
              this.violadata.id = "";
              this.violadata.remark = "";
              this.fetchData(false);
            }
          });
        })
        .catch(() => {
          this.Infos("取消操作");
        });
    },
    //点击视频
    clickvideo() {
      this.videodialog = true;
      this.videodata = JSON.parse(JSON.stringify(this.invoicedata));
       this.$nextTick(()=>{
      this.$refs.video.play();
      });
    },
    closevideo() {
      this.$refs.video.pause();
      this.videodata = "";
    },
    /*---------------------------------------------*/
    clickreturn() {
      sessionStorage.removeItem("roomid");
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  height: auto;
  color: #4d4f53;
  background-color: #fbfcfe;
}
::v-deep .el-table td,
.el-table th {
  padding: 5px 0;
}
.title {
  font-weight: 400;
  line-height: 50px;
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
  border-radius: 2px;
  padding-bottom: 10px;
  .box-card-type {
    line-height: 30px;
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
.svg-icon {
  margin-top: 10px;
  width: 2em;
  height: 2em;
  line-height: 30px;
  cursor: pointer;
}
.box-list {
  margin-top: 10px;
  margin-left: 10px;
  padding: 10px;
  border: 1px solid #ebeef5;
  font-size: 14px;
  color: #606266;
}
::v-deep .dialog-box {
  span.el-dialog__title {
    font-size: 16px !important;
  }
}
</style>
