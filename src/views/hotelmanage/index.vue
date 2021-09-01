<template>
  <div class="app-container">
    <div class="header-box">
       <headertit :headertit="headertit" />
    <div id="search_box">
      <el-form
        :model="searchdata"
        ref="searchdata"
        size="normal"
        label-position="left"
        label-width="90px"
      >
        <el-form-item label="状态:">
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
        <el-form-item label="申请时间:">
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
          label-width="90px"
        >
          <el-form-item style="margin-right:20px">
            <el-input
              size="mini"
              placeholder="请输入酒店名称"
              v-model="searchdata.hotelName"
              @clear="clickSearch()"
              clearable
            />
          </el-form-item>
          <el-form-item style="margin-right:20px">
            <el-input
              size="mini"
              placeholder="请输入申请人"
              style="width:180px"
              v-model="searchdata.contactName"
              @clear="clickSearch()"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button size="mini" @click="clickSearch()"
              >搜索</el-button
            >
            <el-button type="primary" size="mini" @click="clickReset()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    </div>
<div class="main-box">
      <!--酒店列表盒子-->
    <div class="hotel_box">
      <el-row :gutter="20" class="card_box">
        <el-col
          :span="5"
          v-for="(item, index) in hoteldata"
          :key="index"
          class="card_main"
        >
          <div class="card_info">
            <p v-if="item.hotelName.length<=8"><span>酒店名称：</span>{{hidetextFun(item.hotelName,8) }}</p>
            <el-tooltip class="item" effect="light" :content="item.hotelName" placement="top-start" v-else>
            <p><span>酒店名称：</span>{{hidetextFun(item.hotelName,8) }}</p>
            </el-tooltip>
            <p><span>申请人：</span>{{ item.contactName }}</p>
            <p><span>申请时间：</span>{{ item.createTime }}</p>
          </div>
          <div class="card_btn">
            <div class="dacolor" @click="clickdetails(item)">详情</div>
            <div
              class="foncolor"
              @click="clickdetails(item)"
              v-if="item.statu == '待审核'"
            >
              审核
            </div>
          </div>
          <div class="card_tag card_tag_blu" v-if="item.statu == '待审核'">
            {{ item.statu }}
          </div>
          <div class="card_tag card_tag_red" v-if="item.statu == '审核失败'">
            {{ item.statu }}
          </div>
          <div class="card_tag card_tag_yellow" v-if="item.statu == '营业中'">
            {{ item.statu }}
          </div>
        </el-col>
      </el-row>
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
import { hotelList } from "@/api/hotel/hotel";
export default {
  created() {
    this.fetchData();
  },
  data() {
    return {
      searchdata: {
        page: 1,
        rows: 8,
        status: "", //酒店审核状态
        hotelName: "", //酒店名称
        createUserId: "", //创建用户
        startTime: "", //开始时间
        endTime: "" //结束时间
      },
      searchinit: {
        page: 1,
        rows: 8,
        status: "", //酒店审核状态
        hotelName: "", //酒店名称
        createUserId: "", //创建用户
        startTime: "", //开始时间
        endTime: "" //结束时间
      },
      total: 0,
      // 酒店审核状态 status:0 待审核 1 营业中 2 审核失败
      headertit: "酒店管理",
      hoteldata: [],
      statulist: [
        { val: "", label: "全部" },
        { val: 1, label: "待审核" },
        { val: 2, label: "营业中" },
        { val: 3, label: "审核失败" }
      ]
    };
  },
  methods: {
    fetchData() {
      hotelList(this.searchdata).then(response => {
        if (response.code == "0") {
          this.total = response.data.total;
          this.hoteldata = response.data.records.map(item => {
            switch (item.status) {
              case 1:
                item.statu = "待审核";
                break;
              case 2:
                item.statu = "营业中";
                break;
              case 3:
                item.statu = "审核失败";
                break;
              default:
                break;
            }
            return item;
          });
        }
      });
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
    // 点击详情
    clickdetails(item) {
      sessionStorage.hotelid = item.id;
      this.$router.push("/hotel/details");
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
.el-form-item {
  margin-bottom: 10px;
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
.card_main {
  border: 1px solid #dcdfe6;
  border-radius: 10px;
  margin: 20px 20px 0 0;
  padding: 0 !important;
  position: relative;
  &:hover {
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  }
  .card_info {
    padding: 10px;
    font-size: 14px;
    border-bottom: 1px solid #dcdfe6;
    span {
      display: inline-block;
      width: 70px;
    }
  }
  .card_btn {
    font-size: 15px;
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    div {
      cursor: pointer;
    }
  }
  .card_tag {
    position: absolute;
    height: 60px;
    width: 60px;
    line-height: 60px;
    text-align: center;
    border-radius: 50%;
    top: 10px;
    right: 10px;
    font-size: 12px;
    transform: rotateZ(30deg);
  }

  .card_tag_blu {
    color: #3d50fe;
    border: 2px dashed #3d50fe;
  }
  .card_tag_yellow {
    color: #ffcc49;
    border: 2px dashed #ffcc49;
  }
  .card_tag_red {
    color: #ff7575;
    border: 2px dashed #ff7575;
  }
}
.dacolor {
  color: #2e35fc;
  font-weight: 600;
}
.foncolor {
  color: #e10bfe;
  font-weight: 600;
}
.hotel_box {
  width: 100%;
  height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-left: 20px;
}
</style>
