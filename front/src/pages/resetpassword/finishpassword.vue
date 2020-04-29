<template>
  <div class="wrapper">
    <div class="contain">
      <router-link to="/home">返回首页</router-link>
      <reset-top :step="step"></reset-top>
      <div class="middle">
        <p>
          密码设置成功！
          <router-link :to="{path:'/login',query:{reset:true}}">前往登录</router-link>
        </p>
      </div>
      <reset-bottom></reset-bottom>
    </div>
  </div>
</template>
<script>
import ResetTop from "./components/ResetpwTop";
import ResetBottom from "./components/ResetBottom";
export default {
  name: "finishpassword",
  components: {
    ResetTop,
    ResetBottom
  },
  data() {
      return {
          step:[]
      }
  },
  activated() {
      this.step = [1,2,3]
  },
};
</script>
<style lang="less" scoped>
@import url("./less/comment.less");
.middle {
  margin: 55px;
  p {
    text-align: center;
    a {
      font-size: 16px;
    }
    a:hover {
      color: #ff9400;
      text-decoration: underline;
    }
  }
}
</style>