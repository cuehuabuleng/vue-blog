<template>
  <div class="like-wrapper">
    <div class="like">
      <span class="like-icon" :class="{add_like:isLike==true}" @click="handleClickLike()">
        <i class="iconfont">&#xe66d;</i>
      </span>
      <div class="like-num-wrapper">
        <div class="like-num" :class="{add_like_num:isLike==true}">
          <div class="status_1">
            <span>{{likes}}赞</span>
          </div>
          <div class="status_2">
            <span>{{likes}}赞</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Axios from "../Axios/axios";
export default {
  name: "LikeComponent",
  props: {
    likes: Number
  },
  data() {
    return {
      isLike: false,
      detailId: 0,
      timer: null
    };
  },
  watch: {},
  methods: {
    //点赞
    handleClickLike() {
      // 防抖函数
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.addLike();
      }, 500);
    },
    addLike() {
      Axios.ajax({
        method: "get",
        url: "/like",
        params: {
          articleId: this.detailId,
          like_num: this.likes
        },
        isMock: true,
        content_type: "application/json",
        identify: "点赞模块"
      }).then(res => {
        if (res) {
          this.$emit('getArticleLike')
          let data = res.data;
          window.console.log("点赞接口", res);
          if (data.isLike) {
            this.isLike = false;
          } else {
            this.isLike = true;
          }
        } else {
          this.$message.error("点赞失败");
        }
      });
    },
    //查询当前用户是否点赞
    queryLike() {
      Axios.ajax({
        url: "/queryLike",
        method: "get",
        params: {
          articleId: this.detailId,
          like_num: this.likes
        },
        isMock: true,
        content_type: "application/json",
        identify: "查询点赞模块"
      }).then(res => {
        if (res) {
          let data = res.data;
          if (data) {
            if (data.isLike === true) {
              this.isLike = true;
            } else {
              this.isLike = false;
            }
          } else {
            this.isLike = false;
          }
        } else {
          this.$message.error("error，queryLike");
        }
      });
    }
  },
  activated() {
    this.detailId = this.$route.params.id;
    this.queryLike();
  }
};
</script>
<style lang="less" scoped>
.like-wrapper {
  text-align: right;
  margin-bottom: 15px;
  // position: absolute;
  .like {
    display: inline-block;
    text-align: center;
    .like-num-wrapper {
      margin-top: 10px;
      overflow: hidden;
      height: 19px;
      .like-num {
        transition: transform 0.2s;
        div {
          font-size: 15px;
          height: 19px;
        }
        .status_2 {
          color: #ec7259;
        }
      }
      .add_like_num {
        transform: translateY(-19px);
      }
    }
    .like-icon {
      display: inline-block;
      cursor: pointer;
      width: 48px;
      height: 48px;
      text-align: center;
      line-height: 48px;
      border-radius: 24px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.21);
      background-color: #fff;
      color: gray;
      i {
        font-size: 24px;
      }
    }
    .add_like {
      color: #fff;
      background-color: #ec7259;
    }
  }
}
</style>