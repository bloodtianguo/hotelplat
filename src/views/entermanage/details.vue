<template>
  <div class="app-container">
    <div class="cardtype-box">
      <div class="box-card-type">入驻详情: <span :class="{fonred:invoicedata.status}">{{ invoicedata.status }}</span> </div>
      <div class="box-card-btn" @click="clickreturn()">返回</div>
    </div>
    <div class="detailmain">
      <div class="detailmain-header">
        <div><span>房间信息:</span><span class="num"></span></div>
        <div class="detailmain-btn-box" v-if="invoicedata.status=='未处理'">
           <el-button size="mini"  type="success" @click="handledialog = true;"
            >处理</el-button>
        </div>
      </div>
      <div class="detail-info mgbot20">
        <table class="vtable" cellpadding="0" cellspacing="0">
          <tr>
            <td>酒店名称</td>
            <td>联系人</td>
            <td>联系方式</td>
          </tr>
          <tr>
            <td class="fon12">{{ invoicedata.hotelName }}</td>
            <td class="fon12">{{ invoicedata.name }}</td>
            <td class="fon12">{{ invoicedata.phone }}</td>
          </tr>
          <tr>
            <td>申请时间</td>
            <td>处理状态</td>
            <td>备注</td>
          </tr>
          <tr>
            <td class="fon12">{{ invoicedata.createTime }}</td>
            <td class="fon12">{{ invoicedata.status }}</td>
            <td class="fon12">{{ invoicedata.remark }}</td>
          </tr>
          <!------------------------------------------------------------>
        </table>
      </div>
    </div>
     <el-dialog
      title="处理"
      close-on-click-modal
      :visible.sync="handledialog"
      width="30%"
      :before-close="handleClose"
      @closed="dialogClosed"
    >
      <div>
        <el-form :model="searchdata" ref="searchdata" label-width="120px">
         <!-- <el-form-item
            label="是否同意入驻"
            prop="pass"
            :rules="[{ required: true, message: '请选择是否同意入驻' }]"
          >
            <el-radio-group v-model="searchdata.pass">
              <el-radio :label="true">同意</el-radio>
              <el-radio :label="false">拒绝</el-radio>
            </el-radio-group>
          </el-form-item>-->
          <el-form-item label="处理备注">
            <el-input
               type="textarea"
               show-word-limit
               maxlength="200"
               resize="none"
               style="width:60%"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入处理备注"
              v-model="searchdata.remark"
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
import { enterGet,enterHandle } from "@/api/enter/enter";
export default {
  created() {
    this.fetchData();
  },
  data() {
    return {
      handledialog:false,
      invoicedata: {},
      searchdata: {
        id: sessionStorage.enterid,
        pass:true,
        remark:"",
      }
    };
  },
  methods: {
    fetchData() {
      enterGet(this.searchdata).then(response => {
        if (response.code == "0") {
          this.invoicedata = response.data;
          if (this.invoicedata.status == 1) {
            this.invoicedata.status = "已处理";
          }else if(this.invoicedata.status == 0){
            this.invoicedata.status = "未处理";
          }
        }
      });
    },
       handleClose() {
      this.handledialog = false;
    }, //关闭
    handleOK() {
      this.$refs.searchdata.validate(valid => {
        if (valid) {
           enterHandle(this.searchdata).then(response => {
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
      this.$refs.searchdata.resetFields()
      this.searchdata.remark=""
    }, //处理弹窗关闭完成
    clickreturn() {
      sessionStorage.removeItem("enterid");
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
.el-textarea{
  width:90% !important;
}
</style>
