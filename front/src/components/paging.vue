<template>
  <div class="pagination-wrapper">
    <div class="pagination">
      <span class="total">共{{articlesTotal}}条</span>
      <div class="sizeselect">
        <el-select v-model="pageSize" placeholder="请选择" @change="sizeSelectChange">
          <el-option
            v-for="item of options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="pages">
        <button class="btn-prev" @click="handleClickPrev">
          <i class="el-icon-arrow-left"></i>
        </button>
        <ul class="pages-ul">
          <li @click="handleChangepage(1)" :class="{active:isActie==1}">1</li>
          <li class="ellipsis-left" v-if="ellipsis_left">...</li>

          <li
            v-for="(item, index) of pagesList"
            :key="index"
            @click="handleChangepage(item)"
            :class="{active:isActie==item}"
          >{{item}}</li>

          <li class="ellipsis-right" v-if="ellipsis_right">...</li>
          <li
            @click="handleChangepage(totalPage)"
            :class="{active:isActie==totalPage}"
            v-if="lastPageShow"
          >{{totalPage}}</li>
        </ul>
        <button class="btn-next" @click="handleClickNext">
          <i class="el-icon-arrow-right"></i>
        </button>
      </div>

      <div class="pageselect">
        <span>
          前往
          <div>
            <input type="number" min="1" :max="totalPage" v-model="to_Page" @blur="handleinputBlur" />
          </div>页
        </span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "PagingComponent",
  props: {
    total: Number
  },
  data() {
    return {
      isActie: 1,
      options: [
        {
          value: 10,
          label: "10条/页"
        },
        {
          value: 20,
          label: "20条/页"
        }
      ],
      to_Page: 1,
      pageSize: 10,
      pagesList: [2, 3, 4, 5, 6],
      curentPage: 1,
      totalPage: -1,
      articlesTotal: -1,
      ellipsis_left: false,
      ellipsis_right: true,
      lastPageShow: true
    };
  },
  watch: {
    //拿到父组件传过来的文章总数，赋值给articlsTotals
    total() {
      window.console.log('拿到总条数',this.total)
      this.articlesTotal = this.total;
    },
    //监听子组件的articlesTotals，初始化总页数
    articlesTotal() {
      this.totalPage = Math.ceil(this.articlesTotal / this.pageSize) || 1;
      this.curentPage = parseInt(sessionStorage.getItem("curentPage")) || 1;
      // window.console.log("watch articlesTotal", this.articlesTotal);
      // window.console.log("q", parseInt(sessionStorage.getItem("curentPage")) || 1);
      // window.console.log("totalPage", this.totalPage);
    },
    //监听pageszie，改变总页数的大小
    pageSize() {
      this.totalPage = Math.ceil(this.articlesTotal / this.pageSize);
      this.agrrangePageList();
    },
    totalPage() {
      // window.console.log("here", this.totalPage);
      switch (true) {
        case this.totalPage <= 1:
          this.pagesList = [];
          this.lastPageShow = false;
          this.ellipsis_right = false;
          break;
        case this.totalPage > 1 && this.totalPage <= 10:
          this.pagesList = [];
          for (let i = 0; i < this.totalPage - 1; i++) {
            this.pagesList.push(i + 2);
          }
          this.lastPageShow = false;
          this.ellipsis_right = false;
          this.ellipsis_left = false
          break;
        default: 
          this.lastPageShow = true;
          this.ellipsis_right = true;
          break;
      }
    },
    curentPage() {
      // window.console.log("watch curentPage", this.curentPage);
      this.agrrangePageList();
      this.isActie = this.curentPage;
      this.to_Page = this.curentPage;
      sessionStorage.setItem("curentPage", this.curentPage);
      // 向外触发事件
      this.$emit("pagesListChange", this.curentPage, this.pageSize);
    },
    to_Page() {
      this.to_Page = parseInt(this.to_Page);
      if (this.to_Page > this.totalPage) {
        this.to_Page = this.totalPage;
      } else if (this.to_Page < 1) {
        this.to_Page = 1;
      }
    }
  },
  methods: {
    //上一页
    handleClickPrev() {
      if (this.curentPage > 1) {
        this.curentPage--;
      } else {
        return;
      }
    },
    // 下一页
    handleClickNext() {
      if (this.curentPage < this.totalPage) {
        this.curentPage++;
      } else {
        return;
      }
    },
    sizeSelectChange(value) {
      window.console.log("每页", value, "条");
    },
    handleChangepage(item) {
      this.isActie = item;
      this.curentPage = item;
    },
    //输入框失去焦点后，赋值curentPage
    handleinputBlur() {
      if (this.to_Page == "") {
        this.to_Page = 1;
      }
      this.curentPage = this.to_Page;
      // window.console.log("input blur", typeof this.to_Page);
    },
    //根据curetpage重新排列pagelist
    agrrangePageList() {
      let length = this.pagesList.length;
      let indexStart;
      switch (true) {
        case this.totalPage <= 1:
          this.pagesList = [];
          this.lastPageShow = false;
          this.ellipsis_right = false;
          break;
        case this.totalPage > 1 && this.totalPage <= 10:
          this.pagesList = [];
          for (let i = 0; i < this.totalPage - 1; i++) {
            this.pagesList.push(i + 2);
          }
          this.lastPageShow = false;
          this.ellipsis_right = false;
          break;
        case this.curentPage > 4 && this.curentPage < this.totalPage - 3:
          // window.console.log("case1");
          indexStart = this.curentPage - 2;
          this.ellipsis_left = true;
          this.ellipsis_right = true;
          this.pagesList.splice(0, length);
          for (let i = 0; i < length; i++) {
            this.pagesList.push(indexStart++);
          }
          break;
        case this.curentPage <= 4 && this.curentPage >= 1:
          // window.console.log("case2");
          this.ellipsis_left = false;
          this.ellipsis_right = true;
          this.pagesList.splice(0, length);
          this.pagesList = [2, 3, 4, 5, 6];
          break;
        case this.curentPage <= this.totalPage &&
          this.curentPage >= this.totalPage - 3:
          // window.console.log("case3");
          indexStart = this.totalPage - 5;
          this.ellipsis_right = false;
          this.ellipsis_left = true;
          this.pagesList.splice(0, length);
          for (let i = 0; i < length; i++) {
            this.pagesList.push(indexStart++);
          }
          break;
        case this.curentPage < 1:
          // window.console.log("case4");
          this.curentPage = 1;
          break;
        default:
          // window.console.log("case5");
          this.curentPage = this.totalPage;
          break;
      }
    }
  },
  activated() {
    //初始化page组件的总页数
    this.articlesTotal = this.total
  },
  updated() {}
};
</script>
<style lang="less" scoped>
.pagination-wrapper {
  max-width: 892px;
  margin: 0 auto;
  padding: 0 10px;
  position: relative;
  text-align: right;
  .pagination {
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    line-height: 40px;
    height: 40px;
    vertical-align: top;
    box-sizing: border-box;
    .total {
      margin-right: 15px;
    }
    .sizeselect {
      display: inline-block;
      max-width: 100px;
      margin-right: 10px;
    }
    .pages {
      display: inline-block;
      .disable {
        color: #c0c4cc;
        background-color: #fff;
        cursor: not-allowed;
      }
      button {
        border: none;
        padding: 0 6px;
        background: transparent;
        background: 50% no-repeat;
        background-size: 16px;
        background-color: #fff;
        cursor: pointer;
        margin: 0;
        color: #303133;
        height: 100%;
      }
      .btn-prev {
        padding-right: 12px;
      }
      .btn-next {
        padding-left: 12px;
      }
      ul {
        user-select: none;
        list-style: none;
        display: inline-block;
        vertical-align: top;
        font-size: 13px;
        padding: 0;
        margin: 0;
        .active {
          color: #409eff;
          cursor: default;
        }
        li {
          padding: 0 4px;
          background: #fff;
          vertical-align: top;
          display: inline-block;
          font-size: 13px;
          min-width: 35.5px;
          height: 40px;
          line-height: 40px;
          cursor: pointer;
          box-sizing: border-box;
          text-align: center;
          margin: 0;
          color: #303133;
          font-weight: 700;
        }
      }
    }
    .pageselect {
      display: inline-block;
      margin-left: 24px;
      font-size: 13px;
      min-width: 35.5px;
      height: 28px;
      line-height: 28px;
      box-sizing: border-box;
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
      }
      input[type="number"] {
        -moz-appearance: textfield;
      }
      div {
        display: inline-block;
        width: 50px;
        line-height: 18px;
        padding: 0 3px;
        height: 28px;
        text-align: center;
        margin: 0 2px;
        box-sizing: border-box;
        border-radius: 3px;
        input {
          border: 1px solid #dcdfe6;
          width: 100%;
          height: 28px;
          text-align: center;
          padding: 0 3px;
          box-sizing: border-box;
        }
      }
    }
  }
}
</style>