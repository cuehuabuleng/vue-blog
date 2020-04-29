<template>
  <div class="ajax-loading" id="ajaxLoading" v-if="loading">
    <div class="overlay"></div>
    <div class="loading">
      <img src="../../../src/assets/imgs/loading.gif" alt />
      <span>加载中，请稍后...</span>
    </div>
  </div>
</template>
<script>
export default {
  name: "AjaxLoading",
  props:{
    loading:Boolean
  }
};
</script>
<style lang="less" scoped>
@import './loading.less';
</style>