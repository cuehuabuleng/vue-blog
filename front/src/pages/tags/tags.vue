<template>
  <div class="tags-wrapper">
    <header-component></header-component>
    <leftnav-component></leftnav-component>
    <tags-content :list="articleTags" :loading="tagsLoading" :tagsCount="tagsCount"></tags-content>
    <footer-component></footer-component>
    <scroll-component></scroll-component>
  </div>
</template>
<script>
import LeftnavComponent from "../../components/leftnav";
import FooterComponent from "../../components/footer";
import ScrollComponent from "../../components/scroll";
import HeaderComponent from "../../components/header";
import TagsContent from "./components/tagscontent.vue";
import Axios from "../../Axios/axios";
export default {
  name: "tags",
  data() {
    return {
      articleTags: [],
      tagsLoading: true,
      tagsCount: 0
    };
  },
  components: {
    LeftnavComponent,
    FooterComponent,
    ScrollComponent,
    HeaderComponent,
    TagsContent
  },
  methods: {
    getArticleTags() {
      this.tagsLoading = true;
      Axios.ajax({
        url: "/tag/all",
        method: "get",
        isMock: true,
        content_type: "application/json",
        identify: "标签墙 "
      }).then(res => {
        if (res) {
          window.console.log('标签墙返回',res.data.tags)
          let data = res.data;
          this.tagsLoading = false;
          this.tagsCount = data.tags.length;
          this.articleTags = data.tags;
        } else {
          this.tagsLoading = true;
        }
      });
    }
  },
  activated() {
    this.getArticleTags();
  }
};
</script>
<style lang="less" scoped>
.tags-wrapper {
  position: relative;
}
</style>