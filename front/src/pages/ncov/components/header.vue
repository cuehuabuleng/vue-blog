<template>
  <div class="top-header">
    <div>
      <span>
        <i class="iconfont">&#xe6cb;</i>
        <router-link to="/home">返回</router-link>
      </span>
      <h2>疫情实时动态</h2>
    </div>
  </div>
</template>
<script>
export default {
  name: "HeaderComponent"
};
</script>
<style lang="less" scoped>
.top-header {
  width: 100%;
  background: #4169e2;

  div {
    max-width: 820px;
    margin: auto;
    padding: 25px 0;
    box-sizing: border-box;
    position: relative;
    span {
      position: absolute;
      top: 32px;
      left: -224px;
      i {
        font-size: 24px;
        color: white;
      }
      a {
        font-size: 24px;
        color: white;
        margin-left: 10px;
      }
    }
    h2 {
      font-size: 30px;
      text-align: center;
      font-weight: bold;
      color: white;
    }
  }
}
</style>