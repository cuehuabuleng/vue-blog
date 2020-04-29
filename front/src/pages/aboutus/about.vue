<template>
  <div class="about-wrapper">
    <leftnav-component></leftnav-component>
    <about-header></about-header>
    <about-content></about-content>
    <footer-component></footer-component>
    <scroll-component></scroll-component>
  </div>
</template>
<script>
import LeftnavComponent from "../../components/leftnav";
import FooterComponent from "../../components/footer";
import ScrollComponent from "../../components/scroll";
import AboutContent from './components/aboutcontent.vue'
import AboutHeader from './components/aboutheader.vue'
export default {
  name: "about",
  components: {
    LeftnavComponent,
    FooterComponent,
    ScrollComponent,
    AboutHeader,
    AboutContent
  }
};
</script>
<style lang="less" scoped>
.about-wrapper{
    background: #8080800f;
}
</style>