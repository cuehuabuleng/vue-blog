<template>
  <div class="search-header-wrapper">
    <router-link to="/home">
      <img src="../../../assets/imgs/headimg.jpg" alt="home" />
    </router-link>
    <div class="search-group-wrapper">
      <div class="search-input">
        <input type="text" v-model="keyword" @keyup.enter="handelSearch" />
      </div>
      <div class="search-btn">
        <button class="btn" @click="handelSearch">搜索</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchHeader",
  data() {
      return {
          keyword:'',
          timer:null
      }
  },
  methods: {
      handelSearch(){
          if (this.timer) {
              clearTimeout(this.timer);
              this.timer = null
          }
          this.timer = setTimeout(() => {
              this.$emit('handelSearch',this.keyword)
              this.timer = null;
          }, 400)
      }
      
  },
};
</script>
<style lang="less" scoped>
.search-header-wrapper {
  margin: 20px;
  box-sizing: border-box;
  a {
    display: inline-block;
    line-height: 32px;
    min-width: 32px;

    cursor: pointer;
    img {
      width: 32px;
      height: auto;
    }
  }
  .search-group-wrapper {
    display: inline-block;
    width: 80%;

    .search-input {
      display: inline-block;
      margin: 0px 20px 0px 20px;
      input {
        height: 32px;
        width: 532px;
        border: 1px solid #80808085;
        background-color: #fafafa;
        box-shadow: inset 0 1px 2px rgba(27, 31, 35, 0.075);
        border-radius: 5px;
        padding: 0px 10px;
        box-sizing: border-box;
        outline: none;
      }
    }
    .search-btn {
      display: inline-block;
      button {
        height: 32px;
        padding: 7px 15px;
        border: 1px solid rgba(27, 31, 35, 0.2);
        font-size: 13px;
        font-weight: 700;
        text-shadow: 0 1px 0 hsla(0, 0%, 100%, 0.9);
        white-space: nowrap;
        background-color: #eff3f6;
        background-image: -webkit-gradient(
          linear,
          left top,
          left bottom,
          from(#fafbfc),
          color-stop(90%, #eff3f6)
        );
        background-image: linear-gradient(-180deg, #fafbfc, #eff3f6 90%);
        color: #24292e;
        border-radius: 3px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.075);
        cursor: pointer;
      }
      //   button:hover{
      //       background-color: red;
      //   }
    }
  }
}
@media screen and (max-width: 835px) {
  .search-header-wrapper {
    .search-group-wrapper {
      .search-input {
        margin: 0px;
        width: 60%;
        input{
            width: 100%;
        }
      }
    }
  }
}
</style>