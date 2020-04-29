<template>
  <div class="tagsselect-wrapper">
    <el-checkbox-group v-model="tags" :min="0" :max="6">
      <el-checkbox v-for="(tag, index) in tagsSelect" :label="tag" :key="index">{{tag}}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>
<script>
import Axios from "../Axios/axios";

export default {
  name: "TagsSelect",
  data() {
    return {
      tagsSelect: ["前端", "后台", "技术", "编程", "中台"],
      tags: []
    };
  },
  watch: {
    "$store.state.Tags"() {
      let length = this.$store.state.Tags.length;
      if (length <= 6) {
          window.console.log('1')
        this.tags = this.$store.state.Tags;
      } else {
        this.$message.info("添加的标签已达到上限");
      }
    },
    tags() {
      let length = this.tags.length;
      if (length <= 6) {
        this.$store.state.Tags = this.tags;
      } else {
        this.$message.info("添加的标签已达到上限");
      }
    }
  },
  computed: {},
  methods: {
    getTagsSelect() {
      Axios.ajax({
        url: "/tag/select",
        method: "get",
        conten_type: "application/json",
        isMock: true,
        identify: "标签选择区域"
      }).then(res => {
        if (res) {
          window.console.log("标签选择接口返回数据", res);
          let data = res.data;
          this.tagsSelect = data.tags;
        } else {
          alert("获取标签出错");
        }
      });
    }
  },
  activated() {
    this.getTagsSelect();
  }
};
</script>
<style lang="less" scoped>
.tagsselect-wrapper {
  margin: 20px 0 10px 0;
}
</style>