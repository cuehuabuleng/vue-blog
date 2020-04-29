<template>
  <div class="login-box-wrapper">
    <div class="login-box">
      <div class="form">
        <router-link to="/home" class="backhome">返回首页</router-link>

        <span class="login-lg">登录</span>
        <div class="login-username-wrapper">
          <span>账号</span>
          <div class="login-username" ref="login_username">
            <i class="iconfont" ref="usernam_icon">&#xe60a;</i>
            <input
              type="text"
              placeholder="请输入邮箱"
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
        <div class="login-password-wrapper">
          <span>密码</span>
          <div class="login-password" ref="login_password">
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
        <div class="login-forget">
          <router-link to="/resetpassword">忘记密码？</router-link>
        </div>
        <div class="login-sbmbtn-wrapper">
          <div>
            <div class="login-btn-layer" ref="btn_layer"></div>
            <button @mouseover="mouseOver" @mouseleave="mouseLeave" @click="handleLogin">登录</button>
          </div>
        </div>
        <div class="to-register">
          <router-link class="to-register-a" to="/register">立即注册</router-link>
        </div>
        <div class="otherway">
          <span>第三方登录</span>
          <div>
            <i class="iconfont" @click="handleOtherLogin">&#xe732;</i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Axios from "../../Axios/axios";
import { oauth_url } from '../../conf/OAUTH_githubconfig'
export default {
  name: "login",
  data() {
    return {
      username: "",
      password: "",
      usernametip: "",
      passwordtip: "",
      usernameTipShow: false,
      passwordTipShow: false,
      reset: false
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
    }
  },
  watch: {},
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
      var usernameDom = this.$refs.login_username;
      var usernameiconDom = this.$refs.usernam_icon;
      usernameiconDom.classList.add("username-icon-color");
      usernameDom.classList.add("login-username-width");
      this.usernameTipShow = false;
    },
    usernamHandelBlur() {
      var usernameDom = this.$refs.login_username;
      var usernameiconDom = this.$refs.usernam_icon;
      if (this.usernameStyleFlag) {
        return;
      } else {
        usernameiconDom.classList.remove("username-icon-color");
        usernameDom.classList.remove("login-username-width");
      }
    },
    passwordHandelFocus() {
      var paswwordDom = this.$refs.login_password;
      var passwordiconDom = this.$refs.password_icon;
      passwordiconDom.classList.add("password-icon-color");
      paswwordDom.classList.add("login-password-width");
      this.passwordTipShow = false;
    },
    passwordHandelBlur() {
      var paswwordDom = this.$refs.login_password;
      var passwordiconDom = this.$refs.password_icon;
      if (this.passwordStyleFlag) {
        return;
      } else {
        passwordiconDom.classList.remove("password-icon-color");
        paswwordDom.classList.remove("login-password-width");
      }
    },
    handleLogin() {
      if (this.username.length <= 0) {
        this.usernameTipShow = true;
        this.usernametip = "请输入邮箱";
      } else if (this.password.length <= 0) {
        this.passwordTipShow = true;
        this.passwordtip = "请输入密码";
      } else {
        let data = {
          email: this.username,
          password: this.password
        };
        Axios.ajax({
          url: "/login",
          method: "post",
          data: data,
          conten_type: "application/json",
          isMock: true,
          identify: "登录"
        })
          .then(res => {
            if (res) {
              this.$message.success("登录成功");
              if (this.reset == true || this.reset === "true") {
                this.$router.push("/home");
              } else {
                this.$router.go(-1);
              }
            }
            window.console.log("login", data);
          })
          .catch(err => {
            alert("login" + err);
          });
      }
    },
    //第三方登录
    handleOtherLogin() {
      this.$message.success("第三登录");
      window.location.href = oauth_url
    },
  },
  activated() {
    this.reset = this.$route.query.reset || false;
    window.console.log("reset", this.$route.query.reset);
  }
};
</script>

<style lang="less" scoped>
@import "./login.less";
</style>