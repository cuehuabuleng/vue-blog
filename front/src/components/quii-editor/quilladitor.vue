<template>
  <div class="write-wrapper">
    <div class="edict-container">
      <div class="article-title">
        <h2>请输入文章标题:</h2>
        <input v-model="title" type="text" />
      </div>
      <quill-editor v-model="content" ref="myQuillEditor" :options="editorOption"></quill-editor>
      <tags-select></tags-select>
      <tags-add></tags-add>
      <div class="btn-wrapper">
        <button class="save-btn" v-on:click="saveHtml">
          <span>发表</span>
        </button>
      </div>
    </div>
    <ajax-loading :loading="postArticleLoading"></ajax-loading>
  </div>
</template>
<script>
// import { quillEditor, Quill } from "vue-quill-editor";
import { quillEditor } from "vue-quill-editor";
import Quill from "quill";
import { addQuillTitle } from "./js/quill-title.js";
import imageResize from "quill-image-resize-module"; // 调整大小组件。
import { ImageDrop } from "quill-image-drop-module"; // 可以实现多张图片拖拽
Quill.register("modules/imageDrop", ImageDrop);
Quill.register("modules/imageResize", imageResize);
import Axios from "../../Axios/axios";
import TagsAdd from "../tagsadd";
import AjaxLoading from "../../components/loading/loading";
import TagsSelect from "../tagsselect";
import Utils from "../../utils/index";
export default {
  name: "QuillEditor",
  props: {
    articleDetail: {
      type: Object
    },
    loading: {
      type: Boolean
    }
  },
  components: {
    quillEditor,
    TagsAdd,
    AjaxLoading,
    TagsSelect
  },
  watch: {
    // 监听来自修改文章父组件的文章内容，防止刷新内容丢失,并修改编辑器里面的内容
    articleDetail() {
      window.console.log("watch", this.articleDetail);
      if (this.articleDetail.content) {
        this.content = this.articleDetail.content;
      } else {
        this.content = "无内容";
      }
      if (this.articleDetail.title) {
        this.title = this.articleDetail.title;
      } else {
        this.title = "无标题";
      }
      if (this.articleDetail.createTime) {
        this.createTime = this.articleDetail.createTime;
      } else {
        this.createTime = Utils.getFormatDate(Date.now());
      }
      if (this.articleDetail.likes) {
        this.likes = Number(this.articleDetail.likes);
      } else {
        this.likes = 0;
      }
      if (this.articleDetail.views) {
        this.views = Number(this.articleDetail.views);
      } else {
        this.views = 0;
      }
    },
    loading() {
      if (this.loading) {
        this.postArticleLoading = this.loading;
      } else {
        this.postArticleLoading = this.loading;
      }
    }
  },
  data() {
    return {
      content: ``,
      title: "",
      overview: "",
      createTime: "",
      likes: 0,
      views: 0,
      editorOption: {
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"], //加粗，斜体，下划线，删除线
            ["blockquote", "code-block"], //引用，代码块

            [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
            [{ list: "ordered" }, { list: "bullet" }], //列表
            [{ script: "sub" }, { script: "super" }], // 上下标
            [{ indent: "-1" }, { indent: "+1" }], // 缩进
            [{ direction: "rtl" }], // 文本方向

            [{ size: ["small", false, "large", "huge"] }], // 字体大小
            [{ header: [1, 2, 3, 4, 5, 6, false] }], //几级标题

            [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
            [{ font: [] }], //字体
            [{ align: [] }], //对齐方式

            ["clean"], //清除字体样式
            ["image"] //上传图片、上传视频
          ],
          imageDrop: true, // 拖动加载图片组件。
          imageResize: {
            //调整大小组件。
            displayStyles: {
              backgroundColor: "black",
              border: "none",
              color: "white"
            },
            modules: ["Resize", "DisplaySize", "Toolbar"]
          }
        },
        theme: "snow",
        placeholder: "编辑文章内容"
      },
      postArticleLoading: false,
      timer: null,
      firstTime: true
    };
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
  methods: {
    //base64转换成formdata
    dataURLtoFile(dataurl) {
      let filename;
      let timestamp = new Date().getTime();
      let arr = dataurl.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      if (mime === "image/jpeg") {
        filename = `${timestamp}.jpg`;
      } else if (mime === "image/png") {
        filename = `${timestamp}.png`;
      }
      // window.console.log("type", mime, "time", timestamp);
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      //转换成文件对象
      return new File([u8arr], filename, { type: mime });
      //转换成Blob对象
      // return new Blob([u8arr], { type: mime });
    },
    //获取文章内所有img
    handlegetImg(html) {
      let imglist = [];
      let indexList = [];

      // window.console.log("发表文章", this.content, html);
      for (let i = 0; i < html.length; i++) {
        // 截取文字内容内容
        this.overview += html[i].innerText;
        //获取图片列表和下表列表
        const elementName = html[i].nodeName;
        if (elementName === "P") {
          if (html[i].childNodes.length > 1) {
            indexList[i] = [];
            for (let j = 0; j < html[i].childNodes.length; j++) {
              if (
                html[i].childNodes[j].nodeName === "IMG" &&
                html[i].childNodes[j].src.indexOf("data:image/jpeg;base64") > -1
              ) {
                imglist.push(html[i].childNodes[j]);
                indexList[i].push(j);
              }
            }
          } else {
            if (
              html[i].firstChild.nodeName === "IMG" &&
              html[i].firstChild.src.indexOf("data:image/jpeg;base64") > -1
            ) {
              imglist.push(html[i].firstChild);
              indexList.push(i);
            }
          }
        }
      }
      // window.console.log("图片列表", imglist);
      // window.console.log("下表列表", indexList);
      let all = {
        imglist,
        indexList
      };
      return all;
    },
    //点击将图片先上传到服务器，然后返回url，插入到原来img中,再把内容上传到服务器
    handleClickPostimgs(html, all) {
      if (this.firstTime) {
        this.postImg(html, all);
        this.firstTime = false;
        return;
      }
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.postImg(html, all);
        this.firstTime = true;
      }, 400);
    },
    //上传图片函数
    postImg(html, all) {
      this.postArticleLoading = true;
      if (all.imglist.length > 0) {
        let formdata = new FormData();
        for (let i = 0; i < all.imglist.length; i++) {
          formdata.append("files", this.dataURLtoFile(all.imglist[i].src));
          // window.console.log( "图片返回对象", this.dataURLtoFile(all.imglist[i].src));
        }
        // 根据id判断是发表新文章还是修改文章，传递不同的参数
        let id = this.$route.query.id || null;
        let params = {};
        if (id) {
          params = {
            title: this.title,
            id: id
          };
        } else {
          params = {
            title: this.title
          };
        }
        Axios.ajax({
          url: "/articleImage",
          method: "post",
          isMock: true,
          content_type: "multipart/form-data;",
          identify: "上传图片模块",
          data: formdata,
          params:params
        })
          .then(res => {
            let data = res.data || null;
            if (data) {
              let imgIndex = 0;
              for (let i = 0; i < html.length; i++) {
                if (all.indexList[i] instanceof Array) {
                  for (let j = 0; j < all.indexList[i].length; j++) {
                    html[i].childNodes[all.indexList[i][j]].src =
                      data.imgList[imgIndex];
                    imgIndex++;
                  }
                } else if (
                  all.indexList.length > 0 &&
                  all.indexList[i] != undefined
                ) {
                  // window.console.log('all',html, all.indexList[i])
                  html[all.indexList[i]].firstChild.src =
                    data.imgList[imgIndex];
                  imgIndex++;
                }
              }
            } else {
              window.console.log("没有上传成功");
              this.postArticleLoading = false;
              return Promise.reject(res.msg);
            }
            //  window.console.log('结束')
          })
          .then(() => {
            //完成后，调用上传文章函数
            // window.console.log('调用上传图片函数')
            this.handlePostarticle(this.content);
          })
          .catch(err => {
            this.$message.error(err);
            window.console.log("catch", err);
          });
      } else {
        this.handlePostarticle(this.content);
      }
    },
    //上传文章函数
    handlePostarticle(content) {
      this.overview =
        this.overview.slice(0, 50 + Math.floor(Math.random() * 10)) + "...";
      window.console.log("发表文章开始", this.$store.state.Tags);
      let tags = this.$store.state.Tags;
      if (tags.length === 0) {
        tags[0] = "随笔";
      }
      //调用上传标签函数
      this.postTags(tags);
      // 根据id判断是发表新文章还是修改文章，传递不同的参数
      let id = this.$route.query.id || null;
      let data;
      if (id === null) {
        data = {
          content: content,
          title: this.title,
          enableComment: 0,
          status: 0,
          overview: this.overview,
          tags: tags,
          likes: 0,
          views: 0
        };
      } else {
        data = {
          content: content,
          title: this.title,
          enableComment: 0,
          status: 0,
          overview: this.overview,
          tags: tags,
          likes: this.likes,
          views: this.views,
          id: id,
          createTime: this.createTime
        };
      }
      Axios.ajax({
        url: "/article",
        method: "post",
        data: data,
        isMock: true,
        content_type: "multipart/form-data;",
        identify: "发表文章模块"
      }).then(res => {
        if (res) {
          // let data = res.data;
          this.$message.success("操作成功,即将返回首页");
          // 发表完文章后清除内容和预览内容、标题
          this.overview = "";
          this.content = "";
          this.title = "";
          setTimeout(() => {
            this.postArticleLoading = false;
            this.$router.push({ path: "/home" });
          }, 500);
        } else {
          this.postArticleLoading = true;
        }
      });
    },
    //上传标签函数
    postTags(tags) {
      let data = {
        tags: tags
      };
      Axios.ajax({
        url: "/posttags",
        method: "post",
        data: data,
        isMock: true,
        content_type: "multipart/form-data;",
        identify: "上传标签模块"
      }).then(res => {
        if (res) {
          window.console.log("上传标签返回", res);
        }
      });
    },
    saveHtml: function() {
      let html = this.$refs.myQuillEditor.quill.container.children[0]
        .childNodes;
      if (this.content === "") {
        this.$message.info("请输入内容");
      } else if (this.title === "") {
        this.$message.info("请输入文章标题");
      } else {
        let all = this.handlegetImg(html);
        this.handleClickPostimgs(html, all);
      }
    }
  },
  mounted() {
    //鼠标停留按钮提示的交互
    addQuillTitle();
  },
  activated() {}
};
</script>
<style lang="less" >
@import "./less/quilladitor.less";
</style>