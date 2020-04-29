<template>
  <div class="ncov-wrapper">
    <header-component></header-component>
    <div class="nav-wrapper" ref="nav_wrapper" :class="{nav_fixed:nav_fixed==true}">
      <nav>
        <div @click="handleCLickToggle('china_wrapper')" :class="{active:toggel == true}">国内疫情数据</div>
        <div @click="handleCLickToggle('global_wrapper')" :class="{active:toggel == false}">全球疫情数据</div>
      </nav>
    </div>
    <div class="china-wapper" id="china_wrapper">
      <china-curent :chinaStatistics="chinaStatistics"></china-curent>
      <ncov-map></ncov-map>
    </div>
    <div class="global-wapper" id="global_wrapper">
      <world-curent :foreignStatistics="foreignStatistics"></world-curent>
      <ncov-world></ncov-world>
    </div>
    <footer-component></footer-component>
    <scroll-component></scroll-component>
  </div>
</template>
<script>
import HeaderComponent from "./components/header";
import NcovMap from "./components/map";
import ChinaCurent from "./components/chinacurenttable";
import NcovWorld from "./components/worldmap";
import WorldCurent from "./components/worldcurent";
import FooterComponent from "../../components/footer";
import ScrollComponent from "../../components/scroll";
import Axios from "../../Axios/axios";
export default {
  name: "ncov",
  components: {
    NcovMap,
    HeaderComponent,
    ChinaCurent,
    WorldCurent,
    NcovWorld,
    FooterComponent,
    ScrollComponent
  },
  data() {
    return {
      chinaStatistics: {},
      foreignStatistics: {},
      nav_top: 80,
      toggel: true,
      nav_fixed: false,
      timer: null
    };
  },
  methods: {
    //拿到国内国外的当前疫情状况
    getInfo() {
      Axios.ajax({
        url: "/epidemic/info",
        method: "get",
        conten_type: "application/json",
        isMock: true,
        identify: "疫情数据获取"
      }).then(res => {
        if (res) {
          let data = res.data;
          //国内疫情状况
          this.chinaStatistics = {
            //累计确诊人数，和增加
            confirmedCount: data.getStatisticsService.confirmedCount,
            confirmedIncr: data.getStatisticsService.confirmedIncr,
            // 现存确诊，增加
            currentConfirmedCount:
              data.getStatisticsService.currentConfirmedCount,
            currentConfirmedIncr:
              data.getStatisticsService.currentConfirmedIncr,
            // 累计治愈，增加
            curedCount: data.getStatisticsService.curedCount,
            curedIncr: data.getStatisticsService.curedIncr,
            // 累计死亡，增加
            deadCount: data.getStatisticsService.deadCount,
            deadIncr: data.getStatisticsService.deadIncr,
            //境外输入，增加
            suspectedCount: data.getStatisticsService.suspectedCount,
            suspectedIncr: data.getStatisticsService.suspectedIncr,
            // 现存无症状,增加
            seriousCount: data.getStatisticsService.seriousCount,
            seriousIncr: data.getStatisticsService.seriousIncr
          };
          //全球疫情状况
          this.foreignStatistics = {
            //现存确诊
            currentConfirmedCount:
              data.getStatisticsService.currentConfirmedCount,
            currentConfirmedIncr:
              data.getStatisticsService.currentConfirmedIncr,
            //累计确诊
            confirmedCount: data.getStatisticsService.confirmedCount,
            confirmedIncr: data.getStatisticsService.confirmedIncr,
            //累计治愈
            curedCount: data.getStatisticsService.curedCount,
            curedIncr: data.getStatisticsService.curedIncr,
            //累计死亡
            deadCount: data.getStatisticsService.deadCount,
            deadIncr: data.getStatisticsService.deadIncr
          };
        }
      });
    },
    //切换国内外
    handleCLickToggle(flag) {
      this.toggel = !this.toggel;
      if (flag) {
        // 找到锚点
        let anchorElement = document.getElementById(flag);
        //如果对应的id锚点存在就跳转
        if (anchorElement) {
          anchorElement.scrollIntoView({ block: "start", behavior: "smooth" });
        }
      }
    },
    //获取导航栏到顶部的距离
    getNavTop() {
      let nav_wrapper = this.$refs.nav_wrapper;
      let nav_top = nav_wrapper.offsetTop;
      this.nav_top = nav_top;
    },
    //改变导航栏nav的状态
    setNavStat() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        window.console.log('11')
        let scrollTop =
          document.documentElement.scrollTop || document.body.scrollTop;
        if (scrollTop >= this.nav_top) {
          this.nav_fixed = true;
        } else {
          this.nav_fixed = false;
        }
      },10);
    }
  },
  mounted() {},
  activated() {
    this.getInfo();
    this.getNavTop();
    window.addEventListener("scroll", this.setNavStat);
  },
  deactivated() {
    window.removeEventListener("scroll", this.setNavStat);
  }
};
</script>
<style lang="less" scoped>
.ncov-wrapper {
  background-color: #f7f7f7;
  position: relative;
}
.nav_fixed {
  position: fixed;
}
.nav-wrapper {
  border-bottom: 2px solid #8080807d;
  top: 0px;
  width: 100%;
  background: white;
  z-index: 99;
  nav {
    max-width: 1200px;
    margin: auto;
    text-align: center;

    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-content: center;
    div {
      font-size: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 70px;
      flex: 1;
      cursor: pointer;
      padding: 10px 0px;
      position: relative;
    }
    .active:after {
      position: absolute;
      content: "";
      height: 4px;
      background: #4169e2d4;
      width: 125px;
      bottom: 0px;
    }
  }
}
</style>