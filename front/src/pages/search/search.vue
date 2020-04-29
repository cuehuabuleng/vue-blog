<template>
  <div class="search-wrapper">
    <div>
      <search-header @handelSearch="handelSearch"></search-header>
      <search-content :list="articleList"></search-content>
      <paging-component :total="articleTotal" @pagesListChange="pagesListChange"></paging-component>
      <footer-component></footer-component>
    </div>
  </div>
</template>

<script>
import SearchHeader from "./components/searchheader";
import SearchContent from "./components/searchcontent";
import FooterComponent from "../../components/footer";
import PagingComponent from "../../components/paging";
import Axios from "../../Axios/axios";
export default {
  name: "search",
  components: {
    FooterComponent,
    PagingComponent,
    SearchHeader,
    SearchContent
  },
  data() {
    return {
      articleList: [],
      articleTotal: 0,
      curentPage: 1,
      pageSize: 10,
      keyword: ""
    };
  },
  methods: {
    //改变页数
    pagesListChange(curentPage, pageSize) {
        this.curentPage = curentPage;
        this.pageSize = pageSize;
        this.getSearchList();
    },
    //搜索
    handelSearch(keyword){
        this.keyword = keyword;
        this.getSearchList();
    },
    getSearchList() {
      let _this = this;
      Axios.ajax({
        url: "/search",
        method: "get",
        params: {
          page: this.curentPage,
          size: this.pageSize,
          keyword: this.keyword
        },
        conten_type: "application/json",
        isMock: true,
        identify: "首页文章列表区"
      }).then(res => {
        if (res) {
          let data = res.data;
          _this.articleList = data.articleList;
          _this.articleTotal = data.articlesTotal;
        }
      });
    }
  },
  activated() {
    this.getSearchList();
  }
};
</script>
<style lang="less" scoped>
.search-wrapper {
  position: relative;
  div {
  }
}
</style>