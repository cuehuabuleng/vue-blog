<template>
  <div class="leftnav-wrapper">
    <div class="nav-btn" ref="nav_btn" @click="handleClickshowNav">
      <i class="iconfont">&#xe790;</i>
      menu
    </div>
    <div class="mune-wrapper" ref="mune_wrapper" v-show="mune_flag">
      <div class="cover-layer" @click="handleClickcloseNav"></div>
      <div class="menu-content" ref="mune_content">
        <div class="mune-closeicon" @click="handleClickcloseNav">
          <i class="iconfont">&#xe639;</i>
        </div>
        <div class="mune-header">
          <router-link to="/home">
            <img v-if="isLogin" :src="user_img" alt="头像" />
            <img v-else src="../assets/imgs/headimg.jpg" alt="默认头像" />
          </router-link>
          <div class="mune-meta">
            <span>欢迎，{{username}}</span>
            <br>
            <span>{{total}}文章</span>
            <span>{{views}}访问量</span>
          </div>
        </div>
        <div class="mune-title">
          <span>ღゝ◡╹)ノ❤️</span>
        </div>
        <ul class="mune-item">
          <li>
            <i class="iconfont">&#xe65f;</i>
            <router-link to="/home">首页</router-link>
          </li>
          <li>
            <i class="iconfont">&#xe602;</i>
            <router-link to="/tags">标签墙</router-link>
          </li>
          <div v-if="superAdmin">
            <li>
              <i class="iconfont">&#xe654;</i>
              <router-link to="/write">发表文章</router-link>
            </li>
            <li>
              <i class="iconfont">&#xe693;</i>
              <router-link to="/articlemanagement">文章管理</router-link>
            </li>
          </div>
          <li>
            <i class="iconfont">&#xe634;</i>
            <router-link to="/about">了解我</router-link>
          </li>
          <li>
            <i class="iconfont">&#xe607;</i>
            <router-link to="/ncov">疫情状况</router-link>
          </li>
          <li>
            <i class="iconfont">&#xe600;</i>
            <router-link to="/search">search</router-link>
          </li>
          <div v-if="!isLogin">
            <li>
              <i class="iconfont">&#xe61c;</i>
              <router-link to="/login">登录</router-link>
            </li>
            <li>
              <i class="iconfont">&#xe607;</i>
              <router-link to="/register">注册</router-link>
            </li>
          </div>
          <li v-if="isLogin">
            <a @click="handelLogout">退出</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import Axios from "../Axios/axios";
export default {
  name: "LeftnavComponent",
  data() {
    return {
      timer: true,
      mune_flag: false,
      isLogin: false,
      user_img: "",
      superAdmin: false,
      username: "無名",
      total: 0,
      views: 0
    };
  },
  methods: {
    handleScroll() {
      //一直触发window的scroll事件，影响性能，需要优化  js节流实现
      if (!this.timer) return;
      this.timer = false;
      setTimeout(() => {
        const top = document.documentElement.scrollTop;
        const nav_btn = this.$refs.nav_btn;
        if (top > 150) {
          nav_btn.classList.add("nav-btn-add");
        } else {
          nav_btn.classList.remove("nav-btn-add");
        }
        this.timer = true;
      }, 400);
    },
    //点击菜单按钮显示菜单
    handleClickshowNav() {
      const mune_content = this.$refs.mune_content;
      mune_content.classList.add("mune-content-in-animation");
      this.mune_flag = true;
      window.console.log("22");
    },
    //关掉菜单
    handleClickcloseNav() {
      const mune_content = this.$refs.mune_content;
      mune_content.classList.remove("mune-content-in-animation");
      setTimeout(() => {
        this.mune_flag = false;
      }, 1000);
    },

    //获取登录用户的信息
    getuserInfo() {
      Axios.ajax({
        url: "/checkLogin",
        method: "get",
        conten_type: "application/json",
        isMock: true,
        identify: "检测登录"
      }).then(res => {
        if (res) {
          let data = res.data;
          if (data) {
            this.isLogin = true;
            this.user_img = data.user_img;
            this.username = data.username
            if (data.superadmin) {
              this.superAdmin = true;
            } else {
              this.superAdmin = false;
            }
          } else {
            window.console.log("未登錄");
            this.isLogin = false;
          }
        }
        window.console.log("检测到已经登录用户", res);
      });
    },
    //退出登錄
    handelLogout() {
      Axios.ajax({
        url: "/logout",
        method: "get",
        conten_type: "application/json",
        isMock: true,
        identify: "退出登錄"
      }).then(res => {
        if (res) {
          this.isLogin = false;
          this.superAdmin = false;
          window.location.reload();
          window.console.log("退出登錄", res);
        }
      });
    }
  },
  activated() {
    //监听屏幕滚动事件，改变做菜单的样式
    window.addEventListener("scroll", this.handleScroll);
    this.getuserInfo();
    //获取sessionStorege里面的文章总数和首页浏览数
    this.total = sessionStorage.getItem("articlesTotal") || 0;
    this.views = sessionStorage.getItem("views") || 0;
  },
  deactivated() {
    //移除滚动事件的监听
    window.removeEventListener("scroll", this.handleScroll);
  }
};
</script>

<style lang="less" scoped>
.nav-btn {
  position: fixed;
  z-index: 2;
  top: 30px;
  left: 29px;
  border: 1px solid hsla(0, 0%, 100%, 0.6);
  border-radius: 3px;
  font-size: 12px;
  text-transform: uppercase;
  color: #fff;
  padding: 10px;
  cursor: pointer;
  text-align: center;
  transition: left 0.3s ease;
}
.nav-btn:hover {
  opacity: 0.6;
}
.nav-btn-add {
  left: -3px;
  font-size: 0;
  background-color: #333;
}
.mune-wrapper {
  // display: none;
  -webkit-transition: all 1s ease;
  transition: all 1s ease;
  .cover-layer {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: #322d2d52;
    z-index: 3;
  }
  .menu-content {
    animation-name: bounceOutLeft;
    animation-duration: 1s;
    position: fixed;
    top: 0px;
    left: 0px;
    z-index: 4;
    width: 280px;
    height: 100vh;
    background-color: #000;
    overflow: auto;
    .mune-closeicon {
      position: absolute;
      right: 10px;
      top: 10px;
      cursor: pointer;
      width: 18px;
      height: 18px;
      color: #738a94;
      font-size: 18px;
      i {
        font-size: 18px;
      }
    }
    .mune-header {
      width: 100%;
      height: 239px;
      padding-top: 40px;
      background: #000 url(../assets/imgs/side-bg.gif) top/contain no-repeat;
      a {
        img {
          width: 66px;
          height: 66px;
          border: 4px solid hsla(0, 0%, 100%, 0.5);
          border-radius: 100%;
          box-shadow: inset 1px 1px 4px rgba(0, 0, 0, 0.3),
            0 2px 3px rgba(0, 0, 0, 0.4);
          margin: 0 auto 20px;
          display: block;
          -webkit-transition: all 0.3s ease;
          transition: all 0.3s ease;
        }
        img:hover {
          transform: rotate(-45deg);
          cursor: pointer;
        }
      }
      .mune-meta {
        text-align: center;
        span {
          display: block;
          color: white;
          line-height: 24px;
          font-size: 17px;
        }
      }
    }
    .mune-title {
      position: relative;
      span {
        position: absolute;
        top: -11px;
        left: 91px;
        z-index: 1;
        padding: 0 10px;
        background-color: #000;
        color: #b8b8b8;
      }
    }
    .mune-title:after {
      content: "";
      position: absolute;
      width: 100%;
      height: 1px;
      background-color: #3b3b3b;
    }
    .mune-item {
      margin: 30px 0 20px;
      padding: 0;
      counter-reset: item; /* 重置计数器为 0 */
      li {
        height: 30px;
        display: -webkit-box;
        display: flex;
        i {
          line-height: 2;
          padding: 0 0 0 10px;
          color: gray;
        }
        a {
          color: #989898;
          text-decoration: none;
          line-height: 2;
          padding: 0 10px 0 10px;
          overflow: hidden;
          white-space: nowrap;
          cursor: pointer;
        }
        a:after {
          display: inline-block;
          content: " .......................................................";
          color: hsla(0, 0%, 100%, 0.2);
          margin-left: 5px;
        }
      }
      li:after {
        padding-right: 20px;
        text-align: right;
        vertical-align: bottom;
        color: #b8b8b8;
        content: counter(item, lower-roman); /*将item变量转化为罗马数字*/
        counter-increment: item; /* 将罗马数字显示在页面上*/
        line-height: 2;
      }
    }
  }
  @keyframes bounceOutLeft {
    0% {
      left: 0px;
    }
    25% {
      left: 10px;
    }
    50% {
      left: 0px;
    }
    100% {
      left: -100%;
    }
  }
  .mune-content-in-animation {
    animation-name: bounceInLeft;
    animation-duration: 1s;
  }
  @keyframes bounceInLeft {
    from {
      transform: rotate(-180deg);
      transform-origin: left bottom;
    }
    to {
      transform: rotate(0deg);
      transform-origin: left bottom;
    }
  }
}
</style>