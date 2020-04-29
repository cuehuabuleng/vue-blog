<template>
  <div class="articleedit">
    <editor-top></editor-top>
    <quill-editor :articleDetail="articleDetail" :loading="editArticleLoading"></quill-editor>
    <footer-component></footer-component>
  </div>
</template>
<script>
import QuillEditor from "../../components/quii-editor/quilladitor";
import EditorTop from "./components/edittop";
import FooterComponent from "../../components/footer";
import Axios from "../../Axios/axios";
export default {
  name: "edit",
  components: {
    QuillEditor,
    EditorTop,
    FooterComponent
  },
  data() {
    return {
      articleId: "",
      articleDetail: {},
      title: "",
      editArticleLoading: false
    };
  },
  methods: {
    getArticleDetail() {
      this.editArticleLoading = true;
      Axios.ajax({
        url: "/article",
        method: "get",
        params: {
          id: this.articleId
        },
        isMock: true,
        content_type: "application/json",
        identify: "修改文章模块"
      }).then(res => {
        if (res) {
          let data = res.data;
          this.articleDetail = data.artcile;
          this.$store.state.Tags = data.artcile.tags;
          window.console.log('修改文章tags',data.artcile.tags)
          this.editArticleLoading = false;
        } else {
          this.editArticleLoading = true;
        }
        window.console.log("修改文章", res);
      });
    }
  },
  activated() {
    this.articleId = this.$route.query.id;
    window.console.log("修改文章id", this.$route.query.id);
    this.getArticleDetail();
  }
};
</script>
<style lang="less" scoped>
</style>