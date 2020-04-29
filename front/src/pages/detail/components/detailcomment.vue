<template>
  <div class="comment-wrapper">
    <div class="write-comment">
      <textarea placeholder="写下你的评论" v-model="comment"></textarea>
      <div class="btn">
        <button
          :class="[enable_comment==true ? 'allowed' : 'not-allowed']"
          @click="handleClickPostComment('parent')"
        >提交评论</button>
      </div>
    </div>
    <div class="comment-list">
      <span class="total-comment">全部评论 {{comments.commentTotal}}</span>
      <div class="item" v-for="(parentitem, index) of comments.parentcommentList" :key="index">
        <router-link to="/home" class="user-img">
          <img :src="parentitem.userimg" alt="头像" />
        </router-link>
        <div class="item-comment-wrapper">
          <div class="username">
            <span>{{parentitem.username}}</span>
          </div>
          <div class="dscription">
            <span>{{parentitem.tier}}楼</span>
            <span>{{parentitem.create_time}}</span>
          </div>
          <div class="content">{{parentitem.comment_content}}</div>
          <div class="option">
            <span @click="handelShowreplyInput(index+parentitem.comment_content)">
              <i class="iconfont">&#xe664;</i> 回复
            </span>
            <span>
              <i
                class="iconfont"
                @click="handleAddlike(parentitem.id, parentitem.like_num)"
                :class="{like_red:clicklike_list.indexOf(parentitem.id)>-1}"
              >&#xe60c;</i>
              <div class="like_number_wraper">
                <div
                  class="like_number"
                  :class="{like_animation:clicklike_list.indexOf(parentitem.id)>-1}"
                >
                  <span>{{parentitem.like_num}}赞</span>
                  <span>{{parentitem.like_num}}赞</span>
                </div>
              </div>
            </span>
          </div>
          <div
            class="reply"
            v-if="reply_show==index+parentitem.comment_content"
            :class="{reply_show_class:add_show_class==index+parentitem.comment_content}"
          >
            <textarea placeholder="写下你的回复" v-model="comment_reply"></textarea>
            <div>
              <button
                :class="[enable_reply==true ? 'allowed' : 'not-allowed']"
                @click="handleClickPostComment('child', parentitem.id)"
              >发布</button>
              <button @click="handleCancelReply">取消</button>
            </div>
          </div>
          <div
            class="reply-content-wrapper"
            v-for="(item, index) of parentitem.childrencommentList"
            :key="index"
          >
            <div class="reply-user">
              <router-link to="/home">
                <img :src="item.userimg" alt="头像" />
              </router-link>
              <div>
                <div class="username">
                  <span>{{item.username}}</span>
                </div>
                <div class="dscription">
                  <span>{{item.create_time}}</span>
                </div>
              </div>
            </div>
            <div class="reply-content">{{item.comment_content}}</div>
            <div class="reply-option">
              <span @click="handelShowreplyInput(index+item.comment_content, item.username)">
                <i class="iconfont">&#xe664;</i> 回复
              </span>
            </div>
            <div
              class="reply"
              v-if="reply_show==index+item.comment_content"
              :class="{ reply_show_class:add_show_class==index+item.comment_content }"
            >
              <textarea placeholder="写下你的回复" v-model="comment_reply"></textarea>
              <div>
                <button
                  :class="[enable_reply==true ? 'allowed' : 'not-allowed']"
                  @click="handleClickPostComment('child',parentitem.id,item.username)"
                >发布</button>
                <button @click="handleCancelReply">取消</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ajax-loading :loading="loading"></ajax-loading>
  </div>
</template>
<script>
import AjaxLoading from "../../../components/loading/loading";
import Axios from "../../../Axios/axios";
// import Utils from '../../../utils/index'
export default {
  name: "DetailComment",
  props: {
    loading: Boolean,
    comments: Object
  },
  data() {
    return {
      comment: "",
      comment_reply: "",
      reply_show: -1,
      add_show_class: -1,
      enable_comment: false,
      enable_reply: false,
      articleId: null,
      timer: null,
      firstTime: true,
      commentLike: false,
      clicklike_list: []
    };
  },
  components: {
    AjaxLoading
  },
  watch: {
    add_show_class() {
      // window.console.log("watch identify", this.add_show_class);
    },
    comments() {
      // window.console.log("接收到comments", this.comments);
    },
    comment() {
      if (this.comment) {
        this.enable_comment = true;
      } else {
        this.enable_comment = false;
      }
    },
    comment_reply() {
      if (this.comment_reply) {
        this.enable_reply = true;
      } else {
        this.enable_reply = false;
      }
    },
    clicklike_list() {
      window.console.log("点赞list", this.clicklike_list);
    }
  },
  methods: {
    //评论点赞
    handleAddlike(commentId, like_num) {
      // 防抖，立即执行版本
      if (this.firstTime) {
        this.addCommentLike(commentId, like_num);
        this.firstTime = false;
        return;
      }
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.addCommentLike(commentId, like_num);
        this.firstTime = true;
      }, 400);
    },
    //点赞
    addCommentLike(commentId, like_num) {
      window.console.log("parentId", commentId, like_num);
      Axios.ajax({
        url: "addCommetnLike",
        method: "get",
        params: {
          commentId: commentId,
          like_num:like_num
        },
        isMock: true,
        content_type: "application/json",
        identify: "评论点赞模块"
      }).then(res => {
        if (res) {
          //向外触发父组件的获取评论函数
          this.$emit('handleGetComment')
          let data = res.data;
          if (data.isLike) {
            this.clicklike_list.splice(this.clicklike_list.indexOf(commentId),1);
          } else {
            this.clicklike_list.push(commentId);
          }
          window.console.log("评论点赞返回", res);
        } else {
          this.clicklike_list.splice(this.clicklike_list.indexOf(commentId), 1);
        }
      });
    },
    //查询parent评论点赞
    commentLikeQuery(articleId) {
      window.console.log("查询评论点赞记录的文章id", articleId);
      Axios.ajax({
        url: "/commentlikeQuery",
        method: "get",
        params: {
          articleId: articleId
        },
        isMock: true,
        content_type: "application/json",
        identify: "查询评论点赞模块"
      }).then((res) =>{
        window.console.log('查询文章评论点赞返回',res)
        if (res) {
          let data = res.data;
          this.clicklike_list = data.clicklike_list || []
        }
      })
    },
    handelShowreplyInput(identify, reply_username) {
      // window.console.log("showreplyinput", identify);
      if (reply_username) {
        this.comment_reply = `@${reply_username}   `;
      }
      this.reply_show = identify;
      this.add_show_class = identify;
      // window.console.log(this.add_show_class == identify);
    },
    handleCancelReply() {
      this.add_show_class = -1;
      setTimeout(() => {
        this.reply_show = -1;
        this.comment_reply = "";
      }, 200);
    },
    //点击提交评论
    handleClickPostComment(identify, parentId) {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.postPostComment(identify, parentId);
      }, 400);
    },
    //提交评论
    postPostComment(identify, parentId) {
      window.console.log("what", identify, parentId);
      let data = {
        commentcontent:
          identify == "parent" ? this.comment : this.comment_reply,
        identify: identify,
        parentId: identify == "child" ? parentId : null
      };
      Axios.ajax({
        url: "/comment",
        method: "post",
        params: {
          articleId: this.articleId
        },
        data: data,
        isMock: true,
        content_type: "application/json",
        identify: "发表评论模块"
      }).then(res => {
        if (res) {
          //触发父组件的获取评论函数
          this.$emit("handleGetComment");
          let data = res.data;
          window.console.log("评论返回的data", data);
          if (identify === "parent") {
            this.comment = "";
          } else {
            this.comment_reply = "";
          }
        }
      });
    }
  },
  activated() {
    this.articleId = Number(this.$route.params.id);
    this.commentLikeQuery(this.articleId);
  }
};
</script>
<style lang="less" scoped>
@import "./less/detailcomment.less";
</style>