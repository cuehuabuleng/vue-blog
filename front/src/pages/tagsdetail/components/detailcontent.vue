<template>
  <div class="content-wrapper">
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
            标签：
            <router-link
              v-for="(item, index) of item.tags"
              :key="index"
              :to="'/tags/'+item"
            >{{item + '.'}}</router-link>
          </div>
          <div>
            点赞次数：
            <span>{{item.likes}}</span>
          </div>
          <div>
            浏览次数：
            <span>{{item.views}}</span>
          </div>
          <div>
            更新时间：
            <span>{{item.updateTime}}</span>
          </div>
        </div>
      </div>
    </div>
    <ajax-loading :loading="loading"></ajax-loading>
  </div>
</template>
<script>
import AjaxLoading from "../../../components/loading/loading";
export default {
  name: "DetailContent",
  props:{
      list:{
          type:Array
      },
      loading:{
        type:Boolean
      }
  },
  components:{
    AjaxLoading
  }
};
</script>
<style lang="less" scoped>
.content-wrapper {
  max-width: 892px;
  margin: 0 auto;
  padding: 0 10px;
  min-height: 30vh;
  position: relative;
  .articles {
    margin: 40px auto;
    box-shadow: 8px 14px 38px rgba(39, 44, 49, 0.06),
      1px 3px 8px rgba(39, 44, 49, 0.03);
    background-color: hsla(0, 0%, 100%, 0.9);
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
        display: flex;
        font-size: 13px;
        div {
          margin-right: 15px;
        }
      }
    }
  }
}
</style>