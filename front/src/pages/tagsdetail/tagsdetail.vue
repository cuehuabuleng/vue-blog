<template>
  <div>
    <header-component></header-component>
    <leftnav-component></leftnav-component>
    <detail-top :item="tags_item" :count="article_count"></detail-top>
    <detail-content :list="article_list" :loading="tagArticlesLoading"></detail-content>
    <paging-component :total="articleTotal" @pagesListChange="pagesListChange"></paging-component>
    <footer-component></footer-component>
    <scroll-component></scroll-component>
  </div>
</template>
<script>
import DetailTop from "./components/detailtop";
import DetailContent from "./components/detailcontent";
import LeftnavComponent from "../../components/leftnav";
import FooterComponent from "../../components/footer";
import ScrollComponent from "../../components/scroll";
import HeaderComponent from "../../components/header";
import PagingComponent from "../../components/paging";
import Axios from "../../Axios/axios";
export default {
  name: "tagsdetail",
  data() {
    return {
      tags_item: "",
      article_count: 0,
      article_list: [],
      tagArticlesLoading: true,
      articleTotal: -1,
      curentPage: 1,
      pageSize: 10
    };
  },
  components: {
    DetailTop,
    DetailContent,
    HeaderComponent,
    LeftnavComponent,
    FooterComponent,
    ScrollComponent,
    PagingComponent
  },
  methods: {
    //接收子组件paging的向外触发事件
    pagesListChange(curentPage, pageSize) {
      window.console.log('父组件')
      this.curentPage = curentPage;
      this.pageSize = pageSize;
      this.getTagArticles();
    },
    getTagArticles() {
      this.tagArticlesLoading = true;
      Axios.ajax({
        url: "/home",
        method: "get",
        params: {
          page: this.curentPage,
          size:this.pageSize,
          tag: this.tags_item
        },
        isMock: true,
        content_type: "application/json",
        identify: "标签文章 "
      }).then(res => {
        window.console.log('tags',res)
        if (res) {
          let data = res.data;
          this.tagArticlesLoading = false;
          this.article_list = data.articleList;
          this.articleTotal = data.articlesTotal;
          this.article_count = data.articlesTotal;
        } else {
          this.tagArticlesLoading = true;
        }
      });
    }
  },
  activated() {
    window.console.log(this.$route.params.item);
    this.tags_item = this.$route.params.item;
    this.getTagArticles();
  }
};
</script>
<style lang = "less" scoped>
</style>