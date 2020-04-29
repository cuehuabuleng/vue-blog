<template>
  <div class="top">
    <h2>找回登录密码</h2>
    <ul class="status">
      <li :class="{step:step.indexOf(1) > -1}">
        <i></i>
        <span :class="{active:Number(step.length)==1}">第一步：填写账号</span>
      </li>
      <li :class="{step:step.indexOf(2) > -1}">
        <i></i>
        <span :class="{active:Number(step.length)==2}">第二步：验证并设置新密码</span>
      </li>
      <li :class="{step:step.indexOf(3) > -1}">
        <i></i>
        <span :class="{active:Number(step.length)==3}">第三步：设置成功</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "ResetTop",
  props:{
    step:Array
  },
  watch: {
    step(){
      window.console.log(this.step.length)
    }
  },
};
</script>
<style lang="less" scoped>
.top {
  margin-bottom: 15px;
  border-bottom: 1px solid #e6e6e6;
  h2 {
    font-size: 16px;
    color: #333;
    float: left;
    font-weight: 700;
    margin: 0 10px;
  }
  ul {
    float: left;
    max-width: 620px;
    // width: 620px;
    margin: 0 0 25px 15px;
    li {
      display: inline-block;
      i {
        display: block;
        background-color: #eee;
        width: 150px;
        height: 8px;
        overflow: hidden;
        margin: 5px 0 15px;
      }
      span {
        display: block;
        font-size: 12px;
        color: #808080d9;
      }
    }
    .step {
      i {
        background-color: #ff9c00;
      }
      .active {
        color: black;
      }
    }
  }
}
.top:after {
  content: ".";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
</style>