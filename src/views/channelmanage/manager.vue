<template>
  <div class="app-container">
    <div class="header-box">
      <headertit :headertit="headertit" />
      <div id="search_box mgbot20">
        <div class="form_second">
          <el-form
            :model="searchdata"
            ref="searchdata"
            size="normal"
            :inline="true"
            label-position="left"
          >
            <el-form-item>
              <el-input
                size="mini"
                placeholder="请输入渠道商名称"
                v-model="searchdata.serverName"
                @clear="fetchData()"
                clearable
              />
            </el-form-item>
            <el-form-item>
              <el-button size="mini" @click="fetchData()">搜索</el-button>
              <el-button
                size="mini"
                type="primary"
                @click="addclick('新增渠道商')"
                >新增渠道商</el-button
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
          max-height="630"
          height="630"
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
                type="warning"
                size="mini"
                @click="clickUnbind(scope.row)"
                >解绑</el-button
              >
              <el-button
                type="success"
                plain
                size="mini"
                @click="clickEdit(scope.row, '编辑渠道商')"
                >编辑</el-button
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
    <el-dialog
      :title="textdialog"
      :close-on-click-modal="false"
      :visible.sync="addshow"
      width="30%"
      :before-close="addClose"
      @closed="addClosed"
    >
      <div>
        <el-form
          :model="addforme"
          ref="addforme"
          label-width="120px"
          :rules="rules"
        >
          <el-form-item label="渠道商名称：" prop="serverName">
            <el-input
              type="text"
              maxlength="15"
              style="width:80%"
              placeholder="请输入渠道商名称"
              v-model="addforme.serverName"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号：" prop="serverPhone" :error="phoneerr">
            <el-input
              type="text"
              maxlength="11"
              style="width:80%"
              placeholder="请输入负责人手机号"
              v-model="addforme.serverPhone"
              :disabled="this.textdialog == '编辑渠道商'"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="验证码："
            prop="phoneSms"
            :rules="[{ required: true, message: '请输入验证码' }]"
            v-if="this.textdialog == '新增渠道商'"
          >
            <el-input
              type="text"
              maxlength="11"
              style="width:80%"
              placeholder="请输入验证码"
              v-model="addforme.phoneSms"
              autocomplete="off"
            >
              <el-button
                slot="append"
                :disabled="Countdownstatu"
                @click="clickSend()"
                :loading="Smsloading"
                >{{ Countdowntext }}</el-button
              >
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addshow = false">取 消</el-button>
        <el-button type="primary" @click="handleOK">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  serverList,
  getPhoneSms,
  serveradd,
  serverunbind,
  servereditor
} from "@/api/channel/channel";
import { isPhone } from "@/utils/validate";
export default {
  created() {
    this.fetchData();
  },
  data() {
    return {
      rules: {
        serverPhone: [
          { required: true, message: "请输入手机号" },
          {
            pattern: /^(?:(?:\+|00)86)?1\d{10}$/,
            required: true,
            message: "请输入正确格式的手机号",
            trigger: "blur"
          }
        ],
        serverName: [{ required: true, message: "请输入渠道商名称" }]
      },
      timer:undefined,//倒计时函数
      textdialog: "",
      phoneerr: null,
      Smsloading: false, //获取验证码加载状态
      Countdowntext: "发送",
      Countdownnum: 120,
      Countdownstatu: false, //发送按钮是否可点击
      addshow: false,
      headertit: "渠道商管理",
      filename: "渠道商管理",
      multipleSelection: [],
      loading: false,
      tHeader: ["渠道商名称", "手机号", "添加时间"], //导出组件头部
      filterVal: ["serverName", "serverPhone", "createTime"], //导出组件头部对应值
      addinit: {
        serverName: "", //渠道商名
        serverPhone: "",
        phoneSms: "" //验证码
      },
      addforme: {
        serverName: "", //渠道商名
        serverPhone: "",
        phoneSms: "" //验证码
      },
      Smsfrome: {
        phone: ""
      },
      searchdata: {
        page: 1,
        rows: 20,
        serverName: ""
      },
      tablist: [
        { pro: "serverName", labels: "渠道商名称" },
        { pro: "serverPhone", labels: "手机号" },
        { pro: "createTime", labels: "添加时间" }
      ],
      total: 0,
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
    fetchData() {
      serverList(this.searchdata).then(response => {
        if (response.code == "0") {
          this.tableData = response.data.records.map(item => {
            if (item.createTime) {
              item.createTime = this.changedata(item.createTime);
            }
            return item;
          });
          this.total = response.data.total;
          this.loading = false;
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    clearmultiple() {
      this.$refs.tableData.clearSelection();
    }, //重置勾选状态
    // 点击发送
    clickSend() {
      if (isPhone(this.addforme.serverPhone)) {
        this.Smsfrome.phone = this.addforme.serverPhone;
        if (this.Countdowntext == "发送") {
          if(this.timer!==undefined){clearInterval(this.timer)}
          this.Countdownstatu = true;
          this.Smsloading = true;
          this.Countdowntext = "";
          getPhoneSms(this.Smsfrome)
            .then(response => {
              if (response.code == "0") {
                this.Success("验证码获取成功");
                // console.log("倒计时数字",this.Countdownnum);
                this.timer = setInterval(() => {
                  this.Smsloading = false;
                  this.Countdowntext = `${this.Countdownnum}S`;
                  if (this.Countdownnum !== 0) {
                    this.Countdownnum--;
                  } else if (this.Countdownnum == 0) {
                    clearInterval(this.timer);
                    this.Countdownnum =120;
                    this.Countdowntext = "发送";
                    this.Countdownstatu = false;
                  }
                }, 1000);
              }
            })
            .catch(() => {
              this.Smsloading = false;
              this.Countdownstatu = false;
              this.Countdowntext = "发送";
            });
        }
      } else {
        this.phoneerr = "请输入正确的手机号";
      }
    },
    // 点击新增
    addclick(text) {
      this.addforme = JSON.parse(JSON.stringify(this.addinit));
      this.addshow = true;
      this.textdialog = text;
    },
    clickEdit(row, text) {
      this.addshow = true;
      this.textdialog = text;
      this.addforme = JSON.parse(JSON.stringify(row));
    },
    addClose() {
      this.addshow = false;
    },
    addClosed() {
      this.$refs.addforme.resetFields();
      if(this.timer!==undefined){clearInterval(this.timer)}
      this.Countdowntext = "发送";
    },
    // 判断是添加还是编辑分别发送接口
    judgeFun() {
      if (this.textdialog == "编辑渠道商") {
        servereditor(this.addforme).then(response => {
          if (response.code == "0") {
            this.addshow = false;
            this.Success("编辑成功");
            this.fetchData();
          }
        });
      } else if (this.textdialog == "新增渠道商") {
        serveradd(this.addforme).then(response => {
          if (response.code == "0") {
            this.addshow = false;
            this.Success("新增成功");
            this.fetchData();
          }
        });
      }
    },
    handleOK() {
      this.$refs.addforme.validate(valid => {
        if (valid) {
          this.judgeFun();
        } else {
          return false;
        }
      });
    },
    clickUnbind(row) {
      this.$confirm("你真的要解除服务商吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        type: "warning"
      })
        .then(() => {
          serverunbind(row).then(response => {
            if (response.code == "0") {
              this.Success("解绑成功!");
              this.fetchData();
            }
          });
        })
        .catch(() => {
          console.log("取消操作");
        });
    }, //点击解绑
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
.form_second {
  display: flex;
  justify-content: start;
}
.export {
  padding-top: 5px;
}
//::v-deep .el-table td,
//.el-table th {
//  padding: 10px 0;
//}
</style>
