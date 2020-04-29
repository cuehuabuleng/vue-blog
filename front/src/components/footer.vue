<template>
  <div class="footer">
    <div class="wrapper">
      <a href>图标一</a>
      <a href>图标二</a>
      <br />© 2020
      <router-link to="/home">J的个人博客</router-link>
      <span class="footer_heart">❤️</span>
      Powered by
      <router-link to="/home">Jack</router-link>
      <br />
      <span>前端：vue</span>
      <span>后端：java</span>
    </div>
  </div>
</template>
<script>
export default {
  name: "FooterComponent"
};
</script>
<style lang="less" scoped>
.footer {
  font-size: 12px;
  padding: 20px 0;
  background-color: #232323;
  color: #888;
  margin-top: 200px;
  line-height: 24px;
  text-align: center;
  .wrapper {
    max-width: 892px;
    margin: 0 auto;
    padding: 0 10px;
    position: relative;
    .footer_heart {
      display: inline-block;
      animation: beating 1s infinite;
      animation-timing-function: ease-out;
    }
    @keyframes beating {
      from {
        transform: none;
      }
      50% {
        transform: scale(1.4);
      }
      to {
        transform: none;
      }
    }
    a {
      color: white;
    }
    span {
      margin: 0 5px;
    }
  }
}
</style>