<template>
  <div class="wrapper">
    <div class="header">
      <p class="title">国内疫情地图</p>
      <div class="options">
        <ul>
          <li @click="toggle(true)" :class="{activ_stat:curent==true}">现存确诊</li>
          <li @click="toggle(false)" :class="{activ_stat:curent==false}">累计确诊</li>
        </ul>
        <p>{{curent ? '当前确诊病例数（排除死亡、治愈）' : '累计确诊病例数（包含死亡、治愈）'}}</p>
      </div>
    </div>
    <div class="map-wrapper">
      <div :class="{toggle: curent==false}">
        <div ref="map1" class="echarts"></div>
        <div ref="map2" class="echarts"></div>
      </div>
    </div>
  </div>
</template>
<script>
import Axios from "../../../Axios/axios";
import "../../../../node_modules/echarts/map/js/china.js";
export default {
  name: "NcovMap",
  data() {
    return {
      // filterChinaData: []
      curent: true
    };
  },
  methods: {
    //生成地图
    drawMap1(filterChinaData) {
      var myChart = this.$echarts.init(this.$refs.map1);
      let option = {
        //提示属性
        tooltip: {
          trigger: "item", //类型
          triggerOn: "click",
          formatter: function(params) {
            window.console.log("formatter", params);
            // window.console.log(option.series[0].data);
            var data = option.series[0].data;
            for (let i = 0; i < data.length; i++) {
              if (data[i].name === params.name) {
                window.console.log("cunru");
                return `地区：${params.name}</br>现存确诊：${data[i].value ||
                  0}人</br>累计确诊：${data[i].confirmedCount ||
                  0}人</br>治愈：${data[i].curedCount || 0}人</br>死亡：${
                  data[i].deadCount
                }人</br>`;
              }
            }
          }
        },

        title: {
          //标题
          text: "nCov-全国现存确诊疫情数据分布图",
          subtext: "j的个人博客",
          sublink: "#/home",
          subtarget: "blank",
          left: "center"
        },

        series: [
          {
            //类型-中国地图
            type: "map",
            map: "china",
            label: {
              //覆盖物,
              show: true,
              // 相对的百分比
              position: ["50%", "50%"]
            },

            data: filterChinaData
          }
        ],
        backgroundColor: "white",
        visualMap: {
          type: "piecewise",
          orient: "horizontal", //方向

          left: "left", //位置
          top: "bottom", //位置
          pieces: [
            { gte: 10000 }, // (10000, Infinity]
            { gte: 1000, lte: 9999 }, // (1000, 9999]
            { gte: 100, lte: 999 }, // (100, 999]
            { gte: 10, lte: 99 }, // (10, 99]
            { gte: 0, lte: 9 } // (0, 9]
          ],
          inRange: {
            color: ["#fdebcf", "#f59e83", "#e55a4e", "#cb2a2f", "#811c24"]
          },
          show: true //图注
        }
      };

      myChart.setOption(option);
      myChart.on("click", function(params) {
        window.console.log("click", params);
      });
    },
    drawMap2(filterChinaData) {
      var myChart = this.$echarts.init(this.$refs.map2);
      let option = {
        //提示属性
        tooltip: {
          trigger: "item", //类型
          triggerOn: "click",
          formatter: function(params) {
            window.console.log("formatter", params);
            // window.console.log(option.series[0].data);
            var data = option.series[0].data;
            for (let i = 0; i < data.length; i++) {
              if (data[i].name === params.name) {
                window.console.log("cunru");
                return `地区：${params.name}</br>现存确诊：${data[i]
                  .currentConfirmedCount || 0}人</br>累计确诊：${data[i]
                  .value || 0}人</br>治愈：${data[i].curedCount ||
                  0}人</br>死亡：${data[i].deadCount}人</br>`;
              }
            }
          }
        },

        title: {
          //标题
          text: "nCov-全国累计确诊疫情数据分布图",
          subtext: "j的个人博客",
          sublink: "#/home",
          subtarget: "blank",
          left: "center"
        },

        series: [
          {
            //类型-中国地图
            type: "map",
            map: "china",
            label: {
              //覆盖物,
              show: true,
              // 相对的百分比
              position: ["50%", "50%"]
            },

            data: filterChinaData
          }
        ],
        backgroundColor: "#f7f7f7",
        visualMap: {
          type: "piecewise",
          orient: "horizontal", //方向

          left: "left", //位置
          top: "bottom", //位置
          pieces: [
            { gte: 10000 }, // (10000, Infinity]
            { gte: 1000, lte: 9999 }, // (1000, 9999]
            { gte: 100, lte: 999 }, // (100, 999]
            { gte: 10, lte: 99 }, // (10, 99]
            { gte: 0, lte: 9 } // (0, 9]
          ],
          inRange: {
            color: ["#fdebcf", "#f59e83", "#e55a4e", "#cb2a2f", "#811c24"]
          },
          show: true //图注
        }
      };

      myChart.setOption(option);
      myChart.on("click", function(params) {
        window.console.log("click", params);
      });
    },
    //切换地图
    toggle(flag) {
      this.curent = flag;
    },
    // 向后台获取疫情数据
    getEpidemicInfo() {
      Axios.ajax({
        url: "/epidemic/info",
        method: "get",
        conten_type: "application/json",
        isMock: true,
        identify: "疫情数据获取"
      }).then(res => {
        if (res) {
          let data = res.data;
          let filterChinaData1 = [];
          let filterChinaData2 = [];
          window.console.log("获取疫情数据返回", data);
          //过滤全国疫情数据
          data.getAreaStat.forEach(item => {
            filterChinaData1.push({
              name: item.provinceShortName,
              value: item.currentConfirmedCount,
              deadCount: item.deadCount,
              curedCount: item.curedCount,
              confirmedCount: item.confirmedCount
            });

            filterChinaData2.push({
              name: item.provinceShortName,
              currentConfirmedCount: item.currentConfirmedCount,
              deadCount: item.deadCount,
              curedCount: item.curedCount,
              value: item.confirmedCount
            });
          });
          //生成全国疫情map
          this.drawMap1(filterChinaData1);
          this.drawMap2(filterChinaData2);
        }
      });
    }
  },
  mounted() {},
  activated() {
    this.getEpidemicInfo();
  }
};
</script>
<style lang="less" scoped>
.wrapper {
  margin: 30px 0px;
  background: white;
  border-top: 1px solid #1919191f;
  .header {
    padding-top: 15px;
    .title {
      font-size: 25px;
      margin: 10px;
      border-left: 15px solid #4169e2;
      padding-left: 15px;
      height: 30px;
      line-height: 30px;
    }
    .options {
      display: flex;
      align-items: center;
      ul {
        padding: 10px 0px 10px 20px;
        flex: 1;
        display: flex;
        li {
          height: 30px;
          line-height: 30px;
          color: #666;
          background: #f7f7f7;
          padding: 5px;
          margin-right: 15px;
          cursor: pointer;
        }
        .activ_stat {
          color: #4169e2;
          background: #f1f5ff;
        }
      }
      p {
        flex: 1;
        text-align: right;
        color: gray;
      }
    }
  }
  .map-wrapper {
    overflow: hidden;
    div {
      display: flex;
      transition: all 0.2s;
    }
    .toggle {
      transform: translateX(-100%);
    }
  }
  .echarts {
    position: relative;
    width: 100%;
    height: 500px;
    flex-shrink: 0;
    div {
      margin: auto;
      height: 100vh;
      width: 100%;
      canvas{
        width: 100% !important;
      }
    }
  }
}
</style>