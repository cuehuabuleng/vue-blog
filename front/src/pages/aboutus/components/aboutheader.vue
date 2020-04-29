<template>
  <div class="detail-top" ref="detail_top" :style="background_img">
    <div class="bg" ref="bg" :style="background_img"></div>
  </div>
</template>
<script>
export default {
  name: "AboutHeader",
  data() {
    return {
      background_img: {
        backgroundImage: ""
      },
      img_id:Math.floor(Math.random()*20)
    };
  },
  computed: {
  },
  methods: {},
  activated() {
      window.console.log(this.img_id)
    this.background_img.backgroundImage = "url(" + require("../../../assets/imgs/detail_bg/bg_"+this.img_id+".jpg") + ")"
  }
};
</script>
<style lang="less" scoped>
// @var:`Math.random()*20`;
.detail-top {
  background-position: 50%;
  background-size: cover;
  width: 100%;
  height: 50vh;
  position: relative;
  z-index: 1;
  .bg {
    height: 100%;
    background-size: cover;
    max-width: 1404px;
    margin: 0 auto;
    background-position: 50%;
    -webkit-filter: sepia(0.2) contrast(1.3);
    filter: sepia(0.5) contrast(1.3);
  }
}
</style>