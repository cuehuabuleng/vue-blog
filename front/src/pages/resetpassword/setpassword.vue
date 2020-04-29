<template>
  <div class="wrapper">
    <div class="contain">
      <router-link to="/home">返回首页</router-link>
      <reset-top :step="step"></reset-top>
      <div class="middle">
        <div class="success-tip">
          <i class="iconfont">&#xe671;</i>
          <div>
            验证码已经发送至您的绑定邮箱{{email.slice(0,3)+'***'}}@qq.com
            <a
              target="_blank"
              href="https://mail.qq.com/"
            >请前往查收>></a>
          </div>
        </div>
        <div class="input-wrapper">
          <div class="emailinput-group">
            <label>验证码:</label>
            <input type="text" placeholder="输入验证码" maxlength="6" v-model="code" />
            <button v-if="repost" @click="handleRepostCode">重新发送</button>
            <button v-else class="resatrt">{{time}}秒后重新获取</button>
          </div>
          <div class="pswinput-group">
            <label>设置新密码:</label>
            <div>
              <i
                class="iconfont"
                :class="{showpassword:show_password==true}"
                @click="handleClickShowpsw"
              >&#xe660;</i>
              <input
                :type="[show_password ? 'text' : 'password']"
                placeholder="请输入新密码"
                v-model="newPassword"
              />
            </div>
          </div>
        </div>
        <button @click="handleClickNext">下一步</button>
      </div>
      <reset-bottom></reset-bottom>
    </div>
  </div>
</template>
<script>
import ResetTop from "./components/ResetpwTop";
import ResetBottom from "./components/ResetBottom";
import Axios from "../../Axios/axios";
export default {
  name: "setpassword",
  components: {
    ResetTop,
    ResetBottom
  },
  data() {
    return {
      show_password: false,
      step: [],
      time: 60,
      repost: false,
      timer: null,
      email: "",
      funTimer: null,
      funFirsttime: true,
      newPassword: "",
      code: ""
    };
  },
  watch: {
    time() {
      if (this.time <= 0) {
        clearInterval(this.timer);
        this.repost = true;
        sessionStorage.setItem("repost", true);
        this.time = 60;
      }
      sessionStorage.setItem("time", this.time);
    }
  },
  methods: {
    handleClickShowpsw() {
      this.show_password = !this.show_password;
    },
    handleClickNext() {
      if (this.funFirsttime) {
        this.setPsw();
        this.funFirsttime = false;
        return ;
      }
      if (this.funTimer) {
        clearTimeout(this.funTimer);
      }
      this.funTimer = setTimeout(() => {
        this.setPsw();
        this.funFirsttime = true;
      }, 500);
    },
    //开始设置密码
    setPsw() {
      window.console.log("验证码和新密码", this.code, this.newPassword);

      let data = {
        code: this.code,
        newPassword: this.newPassword,
        email:this.email
      };
      Axios.ajax({
        url: "/setpassword",
        method: "post",
        data: data,
        isMock: true,
        content_type: "application/json",
        identify: "重设密码模块"
      }).then(res => {
        if (res) {
          let data = res.data;
          if (data.resetSuccess === true) {
            this.$router.push("/resetpassword/finish");
          } else {
            return;
          }
        }
      });
    },
    // 倒计时
    count() {
      if (this.repost === false) {
        window.console.log("1");
        if (this.timer) {
          clearInterval(this.timer);
          this.timer = setInterval(() => {
            this.time--;
          }, 1000);
        } else {
          this.timer = setInterval(() => {
            this.time--;
          }, 1000);
        }
      } else {
        window.console.log("2");
        return;
      }
    },
    // 点击重新发送邮箱验证码
    handleRepostCode() {
      //发送请求
      if (this.funFirsttime) {
        this.getCode();
        this.funFirsttime = false;
        return;
      }
      if (this.funTimer) {
        clearTimeout(this.funTimer);
      }
      this.funTimer = setTimeout(() => {
        this.getCode();
        this.funFirsttime = true;
      }, 500);
    },
    //开始获取邮箱code
    getCode() {
      let data = {
        email: this.email
      };
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
            this.$message.success("验证码已发送到您的邮箱");
            this.repost = false;
            sessionStorage.setItem("repost", false);
            this.count();
          }
          window.console.log("resetpassword返回", data);
        }
      });
    }
  },
  activated() {
    this.step = [1, 2];
    //获取上一页传递过来的路由参数email
    this.email = this.$route.query.email;
    this.time = Number(sessionStorage.getItem("time"));
    this.repost = sessionStorage.getItem("repost") == "true";
    this.count();
  },
  deactivated() {
    sessionStorage.setItem("repost", false);
  }
};
</script>
<style lang="less" scoped>
@import url("./less/comment.less");
.middle {
  .success-tip {
    background: #dbebdb;
    display: flex;
    border: 1px solid #cbe2cb;
    padding: 8px 12px;
    line-height: 24px;
    height: 24px;
    margin-bottom: 25px;
    border-radius: 5px;
    i {
      color: #409740;
      font-size: 21px;
    }
    div {
      flex: 1;
      font-size: 13px;
      margin-left: 15px;
      a {
        font-size: 13px;
        margin-left: 5px;
      }
      a:hover {
        color: #ff9400;
        text-decoration: underline;
      }
    }
  }
  .input-wrapper {
    .emailinput-group {
      margin: 20px 0px;
      label {
        font-size: 13px;
        margin-right: 10px;
        display: inline-block;
        width: 80px;
        text-align: right;
      }
      input {
        border: 1px solid #c6baba;
        border-radius: 3px;
        width: 183px;
        height: 35px;
        padding: 0 10px;
        box-sizing: border-box;
        margin-right: 15px;
      }
      button {
        border: none;
        border-radius: 3px;
        /* width: 80px; */
        font-size: 12px;
        padding: 9px;
        box-sizing: border-box;
        color: white;
        background-color: #ff9c00;
        cursor: pointer;
        margin: 0;
      }
      .resatrt {
        background: #adadad;
        cursor: not-allowed;
      }
    }
    .pswinput-group {
      label {
        font-size: 13px;
        margin-right: 10px;
        display: inline-block;
        width: 80px;
        text-align: right;
      }
      div {
        position: relative;
        display: inline-block;
        i {
          position: absolute;
          position: absolute;
          right: 23px;
          top: 9px;
          color: #808080d9;
          cursor: pointer;
        }
        .showpassword {
          cursor: pointer;
          color: #ff9c00;
        }
        input {
          border: 1px solid #c6baba;
          border-radius: 3px;
          width: 183px;
          height: 35px;
          padding: 0 25px 0 10px;
          box-sizing: border-box;
          margin-right: 15px;
        }
      }
    }
  }
  button {
    margin: 21px 0px 0px 100px;
    border: 1px solid #979797;
    padding: 6px 18px;
    font-size: 15px;
    color: white;
    background-color: #ff9c00;
    border-radius: 3px;
    cursor: pointer;
  }
}
</style>