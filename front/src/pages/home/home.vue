<template>
  <div class="home">
    <div class="container-wrapper">
      <header-component></header-component>
      <home-content :list="articleList" :loading="homelistLoading"></home-content>
      <paging-component :total="articleTotal" @pagesListChange="pagesListChange"></paging-component>
      <leftnav-component></leftnav-component>
      <footer-component></footer-component>
      <scroll-component></scroll-component>
    </div>
  </div>
</template>
<script>
// import axios from "axios";
import Axios from "../../Axios/axios";
import HeaderComponent from "../../components/header";
import HomeContent from "./components/homecontent";
import LeftnavComponent from "../../components/leftnav";
import FooterComponent from "../../components/footer";
import ScrollComponent from "../../components/scroll";
import PagingComponent from "../../components/paging";
// import Axios from './../../Axios/axios';
export default {
  name: "home",
  components: {
    HeaderComponent,
    HomeContent,
    LeftnavComponent,
    FooterComponent,
    ScrollComponent,
    PagingComponent
  },
  data() {
    return {
      articleList: [],
      articleTotal: 0,
      homelistLoading: false,
      curentPage: 1,
      pageSize: 10
    };
  },
  methods: {
    //接收子组件paging的向外触发事件
    pagesListChange(curentPage, pageSize) {
      this.curentPage = curentPage;
      this.pageSize = pageSize;
      this.getHomeArticles();
    },
    //获取文章数据
    getHomeArticles() {
      this.homelistLoading = true;
      let _this = this;
      Axios.ajax({
        url: "/home",
        method: "get",
        params: {
          page: this.curentPage,
          size: this.pageSize
        },
        conten_type: "application/json",
        isMock: true,
        identify: "首页文章列表区"
      }).then(res => {
        if (res) {
          let data = res.data;
          this.homelistLoading = false;
          _this.articleList = data.articleList;
          _this.articleTotal = data.articlesTotal;
          sessionStorage.setItem("articlesTotal", data.articlesTotal);
          // window.console.log("获取文章的数据", data);
        } else {
          this.homelistLoading = true;
        }
      });
    },
    //统计访问量
    viewsCount() {
      Axios.ajax({
        url: "/viewsConut",
        method: "get",
        conten_type: "application/json",
        isMock: true,
        identify: "访问量模块"
      }).then(res => {
        console.log("统计访问量返回", res);
        if (res) {
          let data = res.data;
          sessionStorage.setItem("views", data.views);
        }
      });
    }
  },
  activated() {
    let code = this.$route.query.code || null;
    window.console.log("home,actived", code);
    this.getHomeArticles();
  },
  mounted() {
    let code = this.$route.query.code || null;
    window.console.log("home,mounted", code);
    this.viewsCount();
  }
};
</script>
<style lang="less" scoped>
.home {
  position: relative;
}
</style>