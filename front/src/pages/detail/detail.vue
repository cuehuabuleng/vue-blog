<template>
  <div class="detail-wrapper">
    <leftnav-component></leftnav-component>
    <scroll-component></scroll-component>
    <detail-header></detail-header>
    <detail-content :article="article" :loading="articleLoading" @getArticleLike="getArticleLike"></detail-content>

    <detail-comment :loading="commentLoading" :comments="comments" @handleGetComment="handleGetComment"></detail-comment>
    <footer-component></footer-component>
  </div>
</template>
<script>
import LeftnavComponent from "../../components/leftnav";
import FooterComponent from "../../components/footer";
import ScrollComponent from "../../components/scroll";
import DetailComment from "./components/detailcomment";
import DetailContent from "./components/detailcontent";
import DetailHeader from "./components/detailheader";

import Axios from "../../Axios/axios";
export default {
  name: "detail",
  data() {
    return {
      detailId: "",
      article: {},
      comments:{},
      articleLoading: false,
      commentLoading: false,
    };
  },
  components: {
    LeftnavComponent,
    FooterComponent,
    ScrollComponent,
    DetailComment,
    DetailContent,
    DetailHeader
  },
  methods: {
    //子组件触发获取评论函数
    handleGetComment(){
      this.getDetailComments()
    },
    //子组件点赞触发
    getArticleLike(){
      this.getDetaiInfo();
    },
    //获取文章详情内容
    getDetaiInfo() {
      this.articleLoading = true;
      Axios.ajax({
        method: "get",
        url: "/article",
        params: {
          id: this.detailId
        },
        isMock: true,
        content_type: "application/json",
        identify: "文章区"
      }).then(this.handleGetDataSucc);
    },
    handleGetDataSucc(res) {
      if (res) {
        let data = res.data;
        this.article = data.artcile;
        this.articleLoading = false;
        this.$store.state.Tags = data.artcile.tags;
        // window.console.log("获取详情页面内容", data);
      } else {
        this.articleLoading = true;
      }
    },

    //获取文章评论内容
    getDetailComments() {
      this.commentLoading = true;
      Axios.ajax({
        method: "get",
        url: "/comment",
        params: {
          id: this.detailId,
          page: 1,
          size: 10
        },
        isMock: true,
        content_type: "application/json",
        identify: "评论区"
      }).then(this.handleGetCommetsSucc);
    },
    handleGetCommetsSucc(res) {
      if (res) {
        let data = res.data
        this.commentLoading = false;
        window.console.log("文章评论内容", res);
        this.comments = data

      } else {
        this.commentLoading = true;
      }
    }
  },
  activated() {
    this.detailId = this.$route.params.id;
    this.getDetaiInfo();
    this.getDetailComments();
  }
};
</script>
<style lang="less" scoped>
.detail-wrapper {
  position: relative;
  background-color: #cbeafb1c;
}
</style>