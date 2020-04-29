<template>
  <div class="management-wrapper">
    <header-component></header-component>
    <leftnav-component></leftnav-component>
    <management-content
      :list="articles"
      :loading="managementLoading"
      @reloadArticleList="reloadArticleList"
    ></management-content>
    <paging-component :total="articleTotal" @pagesListChange="pagesListChange"></paging-component>
    <footer-component></footer-component>
    <scroll-component></scroll-component>
  </div>
</template>

<script>
import LeftnavComponent from "../../components/leftnav";
import FooterComponent from "../../components/footer";
import ScrollComponent from "../../components/scroll";
import HeaderComponent from "../../components/header";
import ManagementContent from "./compoonents/managementcontent.vue";
import PagingComponent from "../../components/paging";
import Axios from "../../Axios/axios";
export default {
  name: "articlemanagement",
  data() {
    return {
      articles: [],
      managementLoading: false,
      articleTotal: 0,
      curentPage: 1,
      pageSize: 10
    };
  },
  components: {
    LeftnavComponent,
    FooterComponent,
    ScrollComponent,
    HeaderComponent,
    ManagementContent,
    PagingComponent
  },
  methods: {
    //接收子组件paging的向外触发事件
    pagesListChange(curentPage, pageSize) {
      this.curentPage = curentPage;
      this.pageSize = pageSize;
      this.getarticles();
    },
    getarticles() {
      this.managementLoading = true;
      Axios.ajax({
        url: "/home",
        method: "get",
        params: {
          page: this.curentPage,
          size: this.pageSize
        },
        isMock: true,
        content_type: "application/json",
        identify: "文章管理区"
      }).then(res => {
        if (res) {
          let data = res.data;
          window.console.log("管理文章页面", data);
          this.articles = data.articleList;
          this.articleTotal = data.articlesTotal;
          this.managementLoading = false;
        } else {
          this.managementLoading = true;
        }
      });
    },
    reloadArticleList() {
      this.getarticles();
    },
    //判斷當前用戶是否有權限是否登錄
    getuserInfo() {
      Axios.ajax({
        url: "/checkLogin",
        method: "get",
        conten_type: "application/json",
        isMock: true,
        identify: "检测登录"
      }).then(res => {
        if (res) {
          let data = res.data;
          if (data) {
            if (data.superadmin) {
              return
            } else {
              this.$message.error("你當前沒有權限訪問");
              setTimeout(() => {
                this.$router.push("/home");
              }, 1000);
            }
          } else {
            this.$message.info("當前尚未登錄,即將返回");
            setTimeout(() => {
              this.$router.push("/home");
            }, 500);
          }
        }
      });
    }
  },
  activated() {
    this.getarticles();
    this.getuserInfo();
  }
};
</script>

<style>
.management-wrapper {
  position: relative;
}
</style>