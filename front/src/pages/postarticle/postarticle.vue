<template>
  <div>
    <header-component></header-component>
    <leftnav-component></leftnav-component>
    <editor-top></editor-top>
    <quill-editor></quill-editor>
    <footer-component></footer-component>
    <scroll-component></scroll-component>
  </div>
</template>
<script>
import QuillEditor from "../../components/quii-editor/quilladitor";
import LeftnavComponent from "../../components/leftnav";
import FooterComponent from "../../components/footer";
import ScrollComponent from "../../components/scroll";
import HeaderComponent from "../../components/header";
import EditorTop from "./components/postarticletop";
import Axios from "../../Axios/axios";
export default {
  name: "postarticle",
  components: {
    QuillEditor,
    LeftnavComponent,
    FooterComponent,
    ScrollComponent,
    HeaderComponent,
    EditorTop
  },
  data() {
    return {
    };
  },
  methods: {
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
              this.$message.success("快來發表文章吧");
            } else {
              this.$message.error("你當前沒有權限訪問");
              setTimeout(() => {
                this.$router.push("/home");
              }, 1000);
            }
          } else {
            window.console.log("未登錄");
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
    this.getuserInfo();
  }
};
</script>
<style lang="less" >
</style>