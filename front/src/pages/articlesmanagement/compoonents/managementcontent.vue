<template>
  <div class="articles-wrapper">
    <div class="article-list">
      <div class="article-item" v-for="(item, index) of list" :key="index">
        <div class="left">
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
                :to="'/tags/'+tag"
                v-for="(tag, tagindex) of item.tags"
                :key="tagindex"
              >{{tag + '.'}}</router-link>
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
              更新时间:
              <span>{{item.updateTime}}</span>
            </div>
          </div>
        </div>
        <div class="right">
          <el-button @click="handleDelete(item.id, item.title)">删除</el-button>
          <el-button @click="handleModify(item.id)">修改</el-button>
        </div>
      </div>
    </div>
    <ajax-loading :loading="loading"></ajax-loading>
  </div>
</template>
<script>
// import axios from "axios";
import AjaxLoading from "../../../components/loading/loading";
import Axios from "./../../../Axios/axios";
export default {
  props: {
    list: Array,
    loading: Boolean
  },
  components: {
    AjaxLoading
  },
  name: "ManagementContent",
  methods: {
    handleDelete(id, title) {
      this.$confirm("此操作将永久删除该文章, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          Axios.ajax({
            url: "/article",
            method: "delete",
            params: {
              id: id,
              title:title
            },
            isMock: true,
            content_type: "application/json",
            identify: "删除处理"
          }).then(res => {
            if (res) {
              this.$emit("reloadArticleList");
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            } else {
              this.$message.error("删除失败！");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //修改文章
    handleModify(id) {
      this.$confirm("将对该文章进行修改, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$router.push({ path: "/edit", query: { id: id } });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消修改"
          });
        });
    }
  }
};
</script>
<style lang="less" scoped>
.articles-wrapper {
  max-width: 1170px;
  margin: 0 auto;
  position: relative;
  min-height: 30vh;
  .article-list {
    margin: 40px 0;
    box-shadow: 8px 14px 38px rgba(39, 44, 49, 0.06),
      1px 3px 8px rgba(39, 44, 49, 0.03);
    background-color: hsla(0, 0%, 100%, 0.9);
    border-radius: 5px;
    color: #738a94;
    .article-item {
      border-bottom: 1px solid #f0f2f7;
      padding: 20px;
      overflow: hidden;
      .left {
        float: left;
        h2 a {
          color: #15171a;
          font-size: 24px;
          line-height: 24px;
          font-weight: bold;
        }
        .item-overview {
          a {
            display: block;
            line-height: 24px;
            color: #15171a;
            font-size: 16px;
            margin: 10px 0;
          }
        }
        .describe div {
          display: inline-block;
          margin-right: 20px;
        }
      }
      .right {
        float: right;
      }
    }
  }
}
</style>