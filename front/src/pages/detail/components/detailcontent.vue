<template>
  <div class="wrapper ql-container ql-snow">
    <div class="article-top">
      <div class="article-mata">
        <span>{{article.updateTime}}</span>&nbsp;/&nbsp;
        <router-link
          class="article-tag"
          :to="'/tags/'+item"
          v-for="(item, index) of article.tags"
          :key="index"
        >{{item}} &nbsp;</router-link>
      </div>
      <h2>{{article.title}}</h2>
    </div>
    <div class="article-wrapper ql-editor">
      <div class="article-content" v-html="article.content"></div>

      <tags-add :isDetail="isDetail"></tags-add>
      <like-component :likes="article.likes" @getArticleLike="getArticleLike"></like-component>
    </div>
    
    <ajax-loading :loading="loading"></ajax-loading>
  </div>
</template>
<script>
import AjaxLoading from "../../../components/loading/loading";
import TagsAdd from "../../../components/tagsadd";
import LikeComponent from "../../../components/like";
export default {
  name: "DetailContent",
  data() {
    return {
      isDetail: true,
    };
  },
  props: {
    article: Object,
    loading: Boolean
  },
  watch: {
  },
  components: {
    AjaxLoading,
    TagsAdd,
    LikeComponent
  },
  methods: {
    getArticleLike(){
      this.$emit('getArticleLike')
    }
  },
  activated() {
    
  }
};
</script>
<style lang="less" scoped>
.wrapper {
  position: relative;
  .article-wrapper {
    max-width: 892px;
    margin: 0 auto;
    padding: 0 10px;
    .article-content {
      padding: 40px;
      box-sizing: border-box;
      margin: 40px auto;
      box-shadow: 8px 14px 38px rgba(39, 44, 49, 0.06),
        1px 3px 8px rgba(39, 44, 49, 0.03);
      background-color: hsla(0, 0%, 100%, 0.9);
      border-radius: 5px;
      color: #738a94;
      line-height: 30px;
    }
  }
  .article-top {
    text-align: center;
    h2 {
      font-size: 29px;
      margin: 10px 0;
      font-weight: bold;
    }
    .article-mata {
      font-size: 15px;
      padding-top: 40px;
      text-transform: uppercase;
      color: rgba(115, 138, 148, 0.8);
      span {
        text-transform: uppercase;
        color: rgba(115, 138, 148, 0.8);
      }
      .article-tag {
        color: #738a94;
      }
    }
  }
}
.ql-container.ql-snow{
  border: none;
}
</style>