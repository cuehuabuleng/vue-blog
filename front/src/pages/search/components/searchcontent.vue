<template>
  <div class="search-content-wrapper">
    <div class="articles">
      <div class="item" v-for="(item, index) of list" :key="index">
        <h2>
          <router-link :to="'/detail/'+item.id">{{item.title}}</router-link>
        </h2>
        <div class="item-overview">
          <router-link :to="'/detail/'+item.id">{{item.overview}}</router-link>
        </div>
        <div class="describe">
          <div>
            上传时间：
            <span>{{item.createTime}}</span>
          </div>
          <div>
            <i class="iconfont">&#xe601;</i>:
            <router-link
              v-for="(item, index) of item.tags"
              :key="index"
              :to="'/tags/'+item"
            >{{item + '.'}}</router-link>
          </div>
          <div>
            <i class="iconfont">&#xe66d;</i>:
            <span>{{item.likes}}</span>
          </div>
          <div>
            <i class="iconfont">&#xe660;</i>:
            <span>{{item.views}}</span>
          </div>
          <div>
            更新时间：
            <span>{{item.updateTime}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchContent",
  props: {
    list: Array
  },
  watch: {}
};
</script>
<style lang="less" scoped>
.search-content-wrapper {
  min-height: 45vh;
}
.articles {
  margin: 40px auto;
  box-shadow: 8px 14px 38px rgba(39, 44, 49, 0.06),
    1px 3px 8px rgba(39, 44, 49, 0.03);
  background-color: #f3f1e5;
  border-top: 5px solid #e6e5d9;
  border-radius: 5px;
  color: #738a94;
  .item {
    border-bottom: 1px solid #f0f2f7;
    padding: 20px;
    h2 {
      margin: 0;
      a {
        color: #15171a;
        font-size: 24px;
        line-height: 24px;
        font-weight: bold;
        font-family: fantasy;
      }
    }
    .item-overview {
      margin: 10px 0;
      a {
        display: block;
        line-height: 35px;
        color: #15171a;
        font-size: 18px;
        font-family: cursive;
      }
    }
    .describe {
      font-size: 13px;
      div {
        display: inline-block;
        margin-right: 15px;
      }
    }
  }
}
</style>