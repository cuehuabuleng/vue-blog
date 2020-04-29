<template>
  <div class="tagscontent-wrapper">
    <h2 class="title">
      <router-link to="/home">j的个人博客</router-link>- 标签墙
    </h2>
    <div class="meta">{{tagsCount}}-标签</div>
    <div class="tags-content">
      <div>
        <routerLink v-for="(item,index) of list" :key="index" :to="'/tags/'+item">
          {{item}} 
        </routerLink>
      </div>
    </div>
    <ajax-loading :loading="loading"></ajax-loading>
  </div>
</template>
<script>
import AjaxLoading from "../../../components/loading/loading";
export default {
  name: "TagsContent",
  props: {
    list: Array,
    loading: Boolean,
    tagsCount:Number
  },
  components: {
    AjaxLoading
  }
};
</script>
<style lang="less" scoped>
.tagscontent-wrapper {
  max-width: 892px;
  margin: 0 auto;
  padding: 0 10px;
  min-height: 30vh;
  position: relative;
  .title {
    margin: 40px 10px;
    font-size: 28px;
    text-align: center;
    font-weight: 400;
    a {
      color: #738a94;
    }
  }
  .meta {
    text-align: center;
  }
  .tags-content {
    background-color: hsla(0, 0%, 100%, 0.9);
    border-radius: 5px;
    color: #738a94;
    margin: 40px auto;
    box-shadow: 8px 14px 38px rgba(39, 44, 49, 0.06),
      1px 3px 8px rgba(39, 44, 49, 0.03);
    div {
      overflow: hidden;
      padding: 35px 0px;
      a {
        line-height: 20px;
        margin: 20px 35px 0;
        white-space: nowrap;
        display: block;
        color: #738a94;
        word-break: break-all;
        float: left;
        font-size: 16px;
      }
    }
  }
}
</style>