<template>
  <div class="scroll-wrapper" ref="scroll_icon" @click="handleClickScroll">
    <div class="scroll">
      <i class="iconfont">&#xe666;</i>
    </div>
  </div>
</template>
<script>
import Utils from "../../src/utils/index";
export default {
  name: "ScrollComponent",
  data() {
    return {
      derection: true
    };
  },
  methods: {
    handleChangeiconDerection() {
      const top = document.documentElement.scrollTop || document.body.scrollTop;
      const scroll_icon = this.$refs.scroll_icon;
      if (top > 200) {
        this.derection = false;
        scroll_icon.classList.add("scroll-wrapper-up");
      } else {
        this.derection = true;
        scroll_icon.classList.remove("scroll-wrapper-up");
      }
    },
    handleClickScroll() {
      window.console.log(this.derection);
      window.console.log(
        "body,documentElement,window.pageYOffset,clientHeight",
        document.body.scrollTop,
        document.documentElement.scrollTop,
        window.pageYOffset,
        document.documentElement.clientHeight
      );
      if (this.derection) {
        Utils.ScrollTop(
          document.body.scrollHeight || document.documentElement.scrollHeight,
          100
        );
      } else {
        Utils.ScrollTop(0, 100);
      }
    }
  },
  activated() {
    window.addEventListener("scroll", this.handleChangeiconDerection);
  },
  deactivated() {
    window.removeEventListener("scroll", this.handleChangeiconDerection);
  }
};
</script>
<style lang="less" scopd>
.scroll-wrapper {
  position: fixed;
  bottom: 20px;
  right: 20px;
  transition: all 0.5s ease;
  z-index: 99;
  .scroll {
    i {
      height: 24px;
      width: 24px;
      cursor: pointer;
      color: #555;
      opacity: 0.5;
      font-size: 35px;
      font-weight: 100;
    }
  }
}
.scroll-wrapper-up {
  transform: rotate(180deg);
  transition: all 0.5s ease;
}
</style>