<template>
  <div class="register-box-wrapper">
    <div class="register-box">
      <div class="form">
        <router-link to="/home" class="backhome">返回首页</router-link>
        <span class="register-lg">注册</span>
        <div class="register-username-wrapper">
          <span>用户名</span>
          <div class="register-username" ref="register_username">
            <i class="iconfont" ref="usernam_icon">&#xe60a;</i>
            <input
              type="text"
              placeholder="请输入用户名"
              v-model="username"
              @focus="usernamHandelFocus"
              @blur="usernamHandelBlur"
            />
          </div>
          <div class="username-tip" v-show="usernameTipShow">
            <span>{{usernametip}}</span>
            <i class="iconfont">&#xe625;</i>
          </div>
        </div>
        <div class="register-password-wrapper">
          <span>密码</span>
          <div class="register-password" ref="register_password">
            <i class="iconfont" ref="password_icon">&#xe629;</i>
            <input
              type="password"
              placeholder="请输入密码"
              v-model="password"
              @focus="passwordHandelFocus"
              @blur="passwordHandelBlur"
            />
          </div>
          <div class="password-tip" v-show="passwordTipShow">
            <span>{{passwordtip}}</span>
            <i class="iconfont">&#xe625;</i>
          </div>
        </div>
        <div class="again-register-password-wrapper">
          <span>再次输入密码</span>
          <div class="again-register-password" ref="again_register_password">
            <i class="iconfont" ref="again_password_icon">&#xe629;</i>
            <input
              type="password"
              placeholder="请再次输入密码"
              v-model="againpassword"
              @focus="againpasswordHandelFocus"
              @blur="againpasswordHandelBlur"
            />
          </div>
          <div class="again-password-tip" v-show="againpasswordTipShow">
            <span>{{againpasswordtip}}</span>
            <i class="iconfont">&#xe625;</i>
          </div>
        </div>
        <div class="email-wrapper">
          <span>请输入邮箱</span>
          <div class="email" ref="email">
            <i class="iconfont" ref="email_icon">&#xe667;</i>
            <input
              type="email"
              placeholder="请输入邮箱"
              v-model="email"
              @focus="emailHandelFocus"
              @blur="emailHandelBlur"
            />
          </div>
          <div class="email-tip" v-show="emailTipShow">
            <span>{{emailtip}}</span>
            <i class="iconfont">&#xe625;</i>
          </div>
        </div>
        <div class="code">
          <input type="text" v-model="code" placeholder="输入验证码" />
          <div class="getcode-btn">
            <span v-if="switchCodebtn" class="span1">{{count}}秒后重新获取</span>
            <span v-else @click="handleGetcode" ref="getcode_btn" class="span2">获取验证码</span>
          </div>
        </div>
        <div class="register-sbmbtn-wrapper">
          <div>
            <div class="register-btn-layer" ref="btn_layer"></div>
            <button
              ref="register_btn"
              @mouseover="mouseOver"
              @mouseleave="mouseLeave"
              @click="handleRegister"
            >注册</button>
          </div>
        </div>
        <div class="to-login">
          <router-link class="to-login-a" to="/login">立即登录</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Axios from "../../Axios/axios";
export default {
  name: "register",
  data() {
    return {
      username: "",
      password: "",
      againpassword: "",
      email: "",
      code: "",
      usernametip: "",
      passwordtip: "",
      emailtip: "",
      againpasswordtip: "",
      count: 60,
      countdownInterval: null,
      usernameTipShow: false,
      passwordTipShow: false,
      againpasswordTipShow: false,
      emailTipShow: false,
      switchCodebtn: false
    };
  },
  computed: {
    usernameStyleFlag() {
      if (this.username.length > 0) {
        return true;
      } else {
        return false;
      }
    },
    passwordStyleFlag() {
      if (this.password.length > 0) {
        return true;
      } else {
        return false;
      }
    },
    againpasswordStyleFlag() {
      if (this.againpassword.length > 0) {
        return true;
      } else {
        return false;
      }
    },
    emailStyleFlag() {
      if (this.email.length > 0) {
        return true;
      } else {
        return false;
      }
    }
  },
  watch: {
    //监听count，当等于0的时候，清除定时器
    count() {
      if (this.count === 0) {
        clearInterval(this.countdownInterval);
        this.count = 60;
        this.switchCodebtn = false;
      }
    }
  },
  methods: {
    mouseOver() {
      var btnLayer = this.$refs.btn_layer;
      btnLayer.style.left = "0";
    },
    mouseLeave() {
      var btnLayer = this.$refs.btn_layer;
      btnLayer.style.left = "-100%";
    },
    usernamHandelFocus() {
      var usernameDom = this.$refs.register_username;
      var usernameiconDom = this.$refs.usernam_icon;
      usernameiconDom.classList.add("username-icon-color");
      usernameDom.classList.add("register-username-width");
      this.usernameTipShow = false;
    },
    usernamHandelBlur() {
      var usernameDom = this.$refs.register_username;
      var usernameiconDom = this.$refs.usernam_icon;
      if (this.usernameStyleFlag) {
        return;
      } else {
        usernameiconDom.classList.remove("username-icon-color");
        usernameDom.classList.remove("register-username-width");
      }
    },
    passwordHandelFocus() {
      var paswwordDom = this.$refs.register_password;
      var passwordiconDom = this.$refs.password_icon;
      passwordiconDom.classList.add("password-icon-color");
      paswwordDom.classList.add("register-password-width");
      this.passwordTipShow = false;
    },
    passwordHandelBlur() {
      var paswwordDom = this.$refs.register_password;
      var passwordiconDom = this.$refs.password_icon;
      if (this.passwordStyleFlag) {
        return;
      } else {
        passwordiconDom.classList.remove("password-icon-color");
        paswwordDom.classList.remove("register-password-width");
      }
    },
    againpasswordHandelFocus() {
      var againpaswwordDom = this.$refs.again_register_password;
      var againpasswordiconDom = this.$refs.again_password_icon;
      againpasswordiconDom.classList.add("again-password-icon-color");
      againpaswwordDom.classList.add("again-register-password-width");
      this.againpasswordTipShow = false;
    },
    againpasswordHandelBlur() {
      var againpaswwordDom = this.$refs.again_register_password;
      var againpasswordiconDom = this.$refs.again_password_icon;
      if (this.againpasswordStyleFlag) {
        return;
      } else {
        againpasswordiconDom.classList.remove("again-password-icon-color");
        againpaswwordDom.classList.remove("again-register-password-width");
      }
    },
    emailHandelFocus() {
      var emailDom = this.$refs.email;
      var emailiconDom = this.$refs.email_icon;
      emailiconDom.classList.add("email-icon-color");
      emailDom.classList.add("email-width");
      this.emailTipShow = false;
    },
    emailHandelBlur() {
      var emailDom = this.$refs.email;
      var emailiconDom = this.$refs.email_icon;
      if (this.emailStyleFlag) {
        return;
      } else {
        emailiconDom.classList.remove("email-icon-color");
        emailDom.classList.remove("email-width");
      }
    },
    //验证码倒计时
    codeCountdown() {
      this.countdownInterval = setInterval(() => {
        this.count--;
      }, 1000);
    },
    //获取邮箱验证码
    handleGetcode() {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/; //邮箱验证
      if (!mailReg.test(this.email)) {
        this.emailtip = "邮箱格式不正确";
        this.emailTipShow = true;
      } else {
        let data = {
          email: this.email
        };
        Axios.ajax({
          url: "/register/email",
          method: "post",
          data: data,
          isMock: true,
          content_type: "application/json",
          identify: "邮箱验证模块"
        }).then(res => {
          if (res) {
            this.switchCodebtn = true;
            this.codeCountdown();
            this.$message.success("验证码已发送到您的邮箱，注意查收！");
          }
          window.console.log("获取邮箱返回数据", res);
        });
      }
    },
    //开始注册的函数
    Register() {
      const register_btn = this.$refs.register_btn;
      register_btn.classList.add("cursor-not-allowed");
      let data = {
        username: this.username,
        password: this.password,
        email: this.email,
        code: this.code
      };
      Axios.ajax({
        url: "/register",
        method: "post",
        data: data,
        isMock: true,
        content_type: "application/json",
        identify: "邮箱验证模块"
      }).then(res => {
        if (res) {
          window.console.log('注册返回',res)
          this.$alert("注册成功,请前往登录", "成功", {
            confirmButtonText: "确定",
            callback: () => {
              this.$router.push({ path: "/login" });
            }
          });
        }
      });
    },
    handleRegister() {
      switch (true) {
        case this.username.length <= 0:
          this.usernametip = "请输入用户名";
          this.usernameTipShow = true;
          break;
        case this.password.length <= 0:
          this.passwordtip = "请输入密码";
          this.passwordTipShow = true;
          break;
        case this.againpassword.length <= 0:
          this.againpasswordtip = "请再次输入密码";
          this.againpasswordTipShow = true;
          break;
        case this.againpassword != this.password:
          this.againpasswordtip = "两次密码不一致";
          this.againpasswordTipShow = true;
          break;
        case this.code.length <= 0:
          this.$message.info("请输入验证码");
          break;
        default:
          this.Register();
          break;
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "./register.less";
</style>