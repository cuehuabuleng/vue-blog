<template>
  <div class="top-wrapper">
    <h2>
      <router-link to="/tags">标签墙</router-link>
      -{{item}}
    </h2>
    <div>{{count}}篇文章</div>
  </div>
</template>
<script>
export default {
  name: "DetaiTop",
  props: {
    item: {
      type: String
    },
    count: {
      type: Number
    }
  },
  activated() {}
};
</script>
<style lang="less" scoped>
.top-wrapper {
  max-width: 892px;
  margin: 0 auto;
  h2 {
    margin: 40px 0 30px;
    font-size: 28px;
    text-align: center;
    font-weight: 400;
    a {
      color: #738a94;
    }
  }
  div {
    text-align: center;
  }
}
</style>