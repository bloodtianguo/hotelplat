<template>
  <div class="dashboard-container">
    <div class="dataShow mgbot20">
      <p class="dataShow_title fonwei">经营概况</p>
      <div id="cardmain">
        <el-card
          shadow="hover"
          :body-style="{
            height: '100%',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center'
          }"
          v-for="item in dataPresen"
          :key="item.name"
          :class="item.classname"
        >
          <span class="content_name">
            <p class="names">
              <i class="icons" :class="item.iconclass"></i>
              {{ item.name }}
            </p>
            <p>{{ item.number||"0" }}</p>
          </span>
        </el-card>
      </div>
    </div>
    <div class="dataShow">
      <p class="dataShow_title fonwei">实时概况</p>
      <div id="cardmain">
        <el-card
          shadow="hover"
          :body-style="{
            height: '100%',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center'
          }"
          v-for="item in datasurvey"
          :key="item.name"
          :class="item.classname"
        >
          <span class="content_name">
            <p class="names">
              <i class="icons" :class="item.iconclass"></i>
              {{ item.name }}
            </p>
            <p>{{ item.number||"0" }}</p>
          </span>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { getwork } from "@/api/dashboard/work";
export default {
  created() {
    this.getdata();
  },
  components: {},
  computed: {},
  data() {
    return {
      dataPresen: [
        {
          name: "入驻中酒店",
          number: 0,
          classname: "cardBgc_one",
          iconclass: "iconclass--one"
        },
        {
          name: "出售中房型数",
          number: 0,
          classname: "cardBgc_two",
          iconclass: "iconclass--two"
        },
        {
          name: "待付款房间数",
          number: 0,
          classname: "cardBgc_three",
          iconclass: "iconclass--three"
        },
        {
          name: "退款中房间数",
          number: 0,
          classname: "cardBgc_four",
          iconclass: "iconclass--four"
        }
      ],
      datasurvey: [
        {
          name: "昨日订单数",
          number: 0,
          classname: "cardBgc_one",
          iconclass: "iconclass--five"
        },
        {
          name: "昨日销售额(元)",
          number: 0,
          classname: "cardBgc_two",
          iconclass: "iconclass--six"
        },
        {
          name: "昨日申请酒店数",
          number: 0,
          classname: "cardBgc_three",
          iconclass: "iconclass--seven"
        },
        {
          name: "昨日申请房型数",
          number: 0,
          classname: "cardBgc_four",
          iconclass: "iconclass--eight"
        }
      ]
    };
  },
  methods: {
    getdata() {
      getwork().then(response => {
        if (response.code == "0") {
          this.dataPresen[0].number = response.data.enterHotelNumber;
          this.dataPresen[1].number = response.data.saleRoomNumber;
          this.dataPresen[2].number = response.data.waitPayRoomNumber;
          this.dataPresen[3].number = response.data.refundRoomNumber;
          this.datasurvey[0].number = response.data.yesterdayOrderNumber;
          this.datasurvey[1].number = response.data.yesterdayOrderAmount;
          this.datasurvey[2].number = response.data.yesterdayApplyHotelNumber;
          this.datasurvey[3].number = response.data.yesterdayApplyRoomNumber;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
#cardmain {
  display: flex;
  justify-content: space-between;
  text-align: center;
}
.el-card__body {
  display: flex !important;
  justify-content: space-around !important;
  align-items: center !important;
}
.el-card {
  border-radius: 5px;
  color: #fff;
  font-weight: 900;
  overflow: hidden;
}
.names {
  margin-bottom: 10px;
  position: relative;
  left: 30px;
  display: inline-block;
  .icons {
    width: 30px;
    height: 30px;
    position: absolute;
    left: -45px;
    top: 0;
    background-size: cover;
    overflow: hidden;
  }
}
.cardBgc_one {
  width: 16%;
  height: 130px;
  background: url(../../assets/images/bg1.jpg) center;
}
.cardBgc_two {
  width: 16%;
  height: 130px;
  background: url(../../assets/images/bg2.jpg) center;
}
.cardBgc_three {
  width: 16%;
  height: 130px;
  background: url(../../assets/images/bg3.jpg) center;
}
.cardBgc_four {
  width: 16%;
  height: 130px;
  background: url(../../assets/images/bg4.jpg) center;
}

.iconclass--one{
  width: 30px;
  height: 30px;
  background: url(../../assets/icon/enterHotel.png) center;
}
.iconclass--two{
  background: url(../../assets/icon/saleRoom.png) center;
}
.iconclass--three{
  background: url(../../assets/icon/waitPay.png) center;
}
.iconclass--four{
  background: url(../../assets/icon/refundroom.png) center;
}

.iconclass--five{
  background: url(../../assets/icon/yesOrder.png) center;
}
.iconclass--six{
  background: url(../../assets/icon/shouru.png) center;
}
.iconclass--seven{
  background: url(../../assets/icon/yesApplyHotel.png) center;
}
.iconclass--eight{
  background: url(../../assets/icon/yesApplyRoom.png) center;
}

.content_name,
.svg-container {
  display: inline-block;
}
.content_name {
  flex: 8;
  line-height: 30px;
}
.content {
  flex: 8;
  line-height: 20px;
}
.svg-container {
  flex: 2;
  font-size: 48px;
}
.Withdra_box {
  display: flex;
}
.dataShow {
  padding: 15px;
  box-shadow: 0 0 3px rgba($color: #000000, $alpha: 0.3);
  border-radius: 10px;
  .dataShow_title {
    font-size: 18px;
    margin: 18px 0;
  }
}
</style>
