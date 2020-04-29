<template>
  <div class="wrapper">
    <div class="verify-wrapper" v-if="verify_show">
      <div class="overlay" @click="hideVerification"></div>
      <div class="verification">
        <verification-component @verifySuccess="verifySuccess"></verification-component>
      </div>
    </div>
    <div class="contain">
      <router-link to="/home">返回首页</router-link>
      <reset-top :step="step"></reset-top>
      <div class="middle">
        <h2>输入您注册的邮箱</h2>
        <div class="input_group">
          <span>邮箱：</span>
          <input type="email" placeholder="输入您注册的邮箱" v-model="reset_email" />
        </div>
        <div class="next_btn">
          <button @click="handleClickGetCode">下一步</button>
        </div>
      </div>
      <reset-bottom></reset-bottom>
    </div>
  </div>
</template>

<script>
import VerificationComponent from "../../components/verification";
import ResetTop from "./components/ResetpwTop";
import ResetBottom from "./components/ResetBottom";
import Axios from "../../Axios/axios";
export default {
  name: "resetpassword",
  components: {
    VerificationComponent,
    ResetTop,
    ResetBottom
  },
  data() {
    return {
      verify_show: false,
      reset_email: "",
      step: []
    };
  },
  methods: {
    verifySuccess() {
      window.console.log("父组件验证成功触发");
      setTimeout(() => {
        this.verify_show = false;
      }, 500);
      let data = {
        email: this.reset_email
      };
      //发送请求
      Axios.ajax({
        url: "/resetpassword/emial",
        method: "post",
        data: data,
        isMock: true,
        content_type: "application/json",
        identify: "找回密码邮箱验证模块"
      }).then(res => {
        if (res) {
          let data = res.data;
          if (data.isVerifySuccess === true) {
            this.$message.success('验证码已发送到您的邮箱')
            setTimeout(() => {
              this.$router.push({
                path:"/resetpassword/setpassword",
                query:{
                  email:this.reset_email
                }
              });
            }, 200);
          }
          window.console.log("resetpassword返回", data);
        }
      });
    },
    //开始验证
    handleClickGetCode() {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/; //邮箱验证
      if (!mailReg.test(this.reset_email)) {
        this.$message.error("邮箱格式不正确");
        this.verify_show = false;
      } else {
        this.verify_show = true;
      }
    },
    //点击罩层，收起滑动验证
    hideVerification() {
      this.verify_show = false;
    }
  },
  activated() {
    this.step = [1];
  }
};
</script>
<style lang="less" scoped>
@import url("./less/comment.less");

.middle {
  margin-bottom: 15px;
  h2 {
    font-size: 16px;
    color: #333;
    font-weight: 700;
    margin: 0 10px;
  }
  .input_group {
    margin: 25px 0px;
    span {
      font-size: 15px;
    }
    input {
      max-width: 200px;
      width: 200px;
      border: 1px solid #ccc;
      line-height: 18px;
      height: 20px;
      display: inline-block;
      padding: 8px 6px;
      background-color: #fff;
      color: #555;
      border-radius: 3px;
      vertical-align: middle;
    }
  }
  .next_btn {
    button {
      width: 72px;
      height: 30px;
      text-align: center;
      padding: 0;
      line-height: 30px;
      margin-left: 114px;
      background-color: #ff9c00;
      border: 1px solid #d2d2d2;
      font-size: 12px;
      cursor: pointer;
      color: #fff;
    }
    button:hover {
      color: #333;
      background-color: #e6e6e6;
      border-color: #adadad;
    }
  }
}
</style>