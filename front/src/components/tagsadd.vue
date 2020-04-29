<template>
  <div class="tags-wrapper">
    <span class="tag-span" v-if="isDetail">
      &nbsp;
      <i class="iconfont">&#xe602;</i>&nbsp;: &nbsp;&nbsp;&nbsp;
    </span>
    <el-tag
      :key="tag"
      v-for="tag in this.$store.state.Tags"
      :closable="!isDetail"
      :disable-transitions="false"
      @close="handleClose(tag)"
    >{{tag}}</el-tag>
    <el-input
      class="input-new-tag"
      v-if="inputVisible"
      v-model="inputValue"
      ref="saveTagInput"
      size="small"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm"
    ></el-input>
    <el-button
      v-else
      class="button-new-tag"
      size="small"
      @click="showInput"
      :disabled="disabled_add"
      v-show="!isDetail"
    >+ 添加其他标签</el-button>
  </div>
</template>
<script>
export default {
  name: "TagsAdd",
  props: {
    isDetail: Boolean
  },
  data() {
    return {
      //   tags: [],
      inputVisible: false,
      inputValue: "",
      disabled_add: false,
      show_btn: true,
      closeicon_show: true
    };
  },
  watch: {
    "$store.state.Tags"() {
      let length = this.$store.state.Tags.length;
      if (length < 6) {
        this.disabled_add = false;
      } else {
        this.disabled_add = true;
      }
    }
  },
  methods: {
    handleClose(tag) {
      this.$store.state.Tags.splice(this.$store.state.Tags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.$store.state.Tags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    }
  },
  activated() {}
};
</script>
<style lang="less" scoped>
.tags-wrapper {
  margin: 20px 0px 0px 0px;
  .tag-span {
    margin-right: 10px;
  }
  span {
    margin: 5px 0px;
  }
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>