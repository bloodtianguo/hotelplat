<template>
  <div class="login-container">

    <div class="right-cont-scan" v-show="loginMode == 1">
      <p>二维码登录</p>
      <div class="scan">
        <div ref="qrCode" id="qrCode" class="scan-can"></div>
        <div class="overtimeTip" v-show="qrOverTime" @click="refreshQr">
          <p>二维码失效</p>
          <p>请点击刷新</p>
        </div>
      </div>
      <div class="tips">
        <p>打开没找APP点击"扫一扫"</p>
        <p>扫码二维码登录</p>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
import { Message } from "element-ui";
import { Base64 } from "js-base64";
import {
  getMenu
} from '@/utils/auth'
let setRemUnit;
let pageshow;
let rem;
function setRem(window, document) {
  let docEl = document.documentElement;
  // set 1rem = viewWidth / 10
  setRemUnit = function() {
    if (docEl.clientWidth < 1200) return;
    rem = docEl.clientWidth / 10;
    docEl.style.fontSize = rem + "px";
  };
  pageshow = function(e) {
    if (e.persisted) {
      setRemUnit();
    }
  };
  setRemUnit();
  window.addEventListener("resize", setRemUnit);
  window.addEventListener("pageshow", pageshow);
}
import {
  getToken,
  removeToken
} from '@/utils/auth'
export default {
  name: "Login",
  data() {
    return {
      loginMode: 1, // 登陆方式，1：扫码 2：密码
      userName: "",
      pwd: "",
      isRemember: true, // 是否记住密码
      qrOverTime: false, // 表示二维码是否超时
      errorMeg: "", // 错误提示
      errShow: false
    };
  },
  mounted () {
      if(getToken()){
        removeToken()
      }
  },
  created() {
    this.time = 0; // 定时器
    this.scanStr = ""; // 生成二维码需要的字符串
  },
  beforeMount() {
    setRem(window, document);
  },
  mounted() {
    this.createScan();
  },
  beforeDestroy() {
    window.removeEventListener("resize", setRemUnit);
    window.removeEventListener("pageshow", pageshow);
    document.documentElement.style.fontSize = "";
  },
  methods: {
    // 刷新二维码
    refreshQr() {
      this.scanStr = "";
      this.createScan();
    },
    // 生成二维码
    async createScan() {
      if (this.scanStr == "") {
        try {
          this.scanStr = await this.$store.dispatch("user/getScanStr");
        } catch (error) {
          console.log(error);
        }
      }
      this.$refs.qrCode.innerHTML = null;
      let qr = new QRCode(this.$refs.qrCode, {
        width: 300,
        height: 300,
        text: this.scanStr
      });
      qr._el.title = "";
      this.qrOverTime = false;
      this.getScanData(this.scanStr);
    },
    // 轮询扫码登陆结果
    // code: 1.登陆成功，2.无登陆权限 , 3.二维码已失效 ， 0. API模块未授权
    getScanData(str) {
      this.$store
        .dispatch("user/scanlogin", str)
        .then(res => {
          if (res.code == 0) {
            clearTimeout(this.time);
            this.time = setTimeout(() => {
              this.getScanData(str);
            }, 1500);
          } else if (res.code == 1) {
            if(getMenu()){
               Message({
              message: "扫码成功，欢迎登录",
              type: "success",
              duration: 1000
            });
            this.$router.push({ path: "/home" });
            }else{
               Message({
              message: "您没有登录权限!",
              type: "warning",
              duration: 2 * 1000,
            });
            }
          } else if (res.code == 2) {
            this.refreshQr();
            Message({
              message: "您没有登录权限",
              type: "warning",
              duration: 2 * 1000,
              center: true
            });
          } else if (res.code == 3) {
            this.qrOverTime = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  computed: {
    isLogin() {
      return this.userName != "" && this.pwd.length >= 6;
    }
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  position: relative;
  height: 100%;
  min-width: 1200px;
  background: url(../../assets/images/loginbgi.jpg) no-repeat center;
  background-size: cover;
  overflow: hidden;
  .left-cont {
    position: absolute;
    left: 0.760417rem;
    top: 50%;
    transform: translateY(-50%);
    width: 3.619792rem;
    color: #fff;
    font-family: "PingFangSC-Medium";
    font-weight: 500;
    p {
      margin: 0;
    }
    p:nth-child(1) {
      font-size: 0.46875rem;
    }
    p:nth-child(2) {
      margin-top: 0.260417rem;
      font-size: 0.364583rem;
      color: #e3e3e3;
    }
  }
  .right-cont-scan,
  .right-cont-login {
    position: absolute;
    top: 50%;
    right:10%;
    transform: translateY(-50%);
    // width: 3.385417rem;
    // height: 3.885417rem;
    width: 440px;
    height: 520px;
    border-radius: 0.078125rem;
    background: #fff;
    & > p:nth-child(1) {
      font-family: "MicrosoftYaHeiUI";
      font-size: 28px;
      color: #666;
      font-weight: 400;
      text-align: center;
    }
    .scan {
      position: relative;
      display: block;
      width: 264px;
      height: 271px;
      margin: 50px auto 0.078125rem;
      border-radius: 0.15625rem;
      box-shadow: 2px 2px 10px gray;
      overflow: hidden;
      .scan-can {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
      }
      .overtimeTip {
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        p {
          font-size: 20px;
      font-weight: 900;
      color: #fff;
        }
      }
    }
    .tips {
      margin: 30px auto;
      font-size: 20px;
      font-family: "MicrosoftYaHeiUI";
      font-weight: 400;
      color: #333;
      p {
        margin: 0;
        text-align: center;
      }
    }
  }

  .right-cont-login {
    .username,
    .pwd {
      input {
        display: block;
        padding-left: 0.338542rem;
        width: 100%;
        height: 100%;
        font-size: 0.104167rem;
        font-family: "MicrosoftYaHeiUI";
        font-weight: bold;
        color: #666;
        line-height: 0.322917rem;
        outline-style: none;
        border: 2px solid #d6d6d6;
        border-radius: 0.052083rem;
        &::placeholder {
          color: #e3e3e3;
        }
      }
    }
    .username,
    .pwd {
      position: relative;
      margin: 0.520833rem auto 0;
      width: 2.28125rem;
      height: 0.322917rem;
    }
    .username,
    .pwd {
      &::after {
        position: absolute;
        top: 0.0625rem;
        left: 0.083333rem;
        display: block;
        content: "";
        width: 0.182292rem;
        height: 0.182292rem;
        background: url(../../assets/images/loginuser.png) no-repeat center;
        background-size: cover;
      }
    }
    .pwd {
      margin-top: 0.15625rem;
      &::after {
        background: url(../../assets/images/loginpwd.png) no-repeat center;
        background-size: contain;
      }
    }
    .remember {
      margin: 0.130208rem auto 0;
      width: 2.28125rem;
      height: 0.104167rem;
      line-height: 0.104167rem;
      font-size: 0.104167rem;
      font-family: "PingFang SC";
      font-weight: bold;
      color: #999999;
      label {
        margin-left: 0.0625rem;
      }
      input {
        width: 0.114583rem;
        height: 0.114583rem;
        border: 2px solid #999999;
        border-radius: 1px;
        vertical-align: middle;
      }
    }

    .loginbtn {
      display: block;
      margin: auto;
      width: 2.28125rem;
      height: 0.322917rem;
      border-radius: 0.052083rem;
      background: #999;
      border: 0;
      font-size: 0.15625rem;
      font-family: "PingFang SC";
      font-weight: bold;
      color: #fff;
      cursor: pointer;
    }
    .err-tip {
      margin: 0.15625rem 0;
      height: 0.15625rem;
      line-height: 0.15625rem;
      font-size: 0.09375rem;
      color: red;
      text-align: center;
    }
  }
}
</style>

<style lang="scss">
.login-container {
  .right-cont-scan {
    .scan {
      .scan-can {
        img {
          width: 80% !important;
          height: 80% !important;
        }
      }
    }
  }
}

.el-message__icon {
  font-size: x-large !important;
}
</style>
