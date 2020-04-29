<template>
  <div class="write-top">
    <h2 class="title">
      <router-link to="/home">j的个人博客</router-link>- 发表文章
    </h2>
  </div>
</template>
<script>
export default {
  name: "EditorTop"
};
</script>
<style lang="less" scoped>
.write-top {
  margin: 40px 0 30px;
  font-size: 28px;
  text-align: center;
  font-weight: 400;
  h2 {
    a {
      color: #738a94;
    }
  }
}
</style>