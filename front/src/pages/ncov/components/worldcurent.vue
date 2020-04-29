<template>
  <div class="wrapper">
    <div class="time-tip">
      <span>截止北京时间{{time_now}}</span>
    </div>

    <ul>
      <li>
        <b>
          较昨日
          <em>{{foreignStatistics.currentConfirmedIncr}}</em>
        </b>
        <strong>{{foreignStatistics.currentConfirmedCount}}</strong>
        <span>现存确诊</span>
      </li>
      <li>
        <b>
          较昨日
          <em>{{foreignStatistics.confirmedIncr}}</em>
        </b>
        <strong>{{foreignStatistics.confirmedCount}}</strong>
        <span>累计确诊</span>
      </li>
      <li>
        <b>
          较昨日
          <em>{{foreignStatistics.curedIncr}}</em>
        </b>
        <strong>{{foreignStatistics.curedCount}}</strong>
        <span>累计死亡</span>
      </li>
      <li>
        <b>
          较昨日
          <em>{{foreignStatistics.deadIncr}}</em>
        </b>
        <strong>{{foreignStatistics.deadCount}}</strong>
        <span>累计治愈</span>
      </li>
    </ul>
  </div>
</template>
<script>
import Utils from "../../../utils/index";
export default {
  name: "WorldCurent",
  data() {
    return {
      time_now: ""
    };
  },
  props: {
    foreignStatistics: Object
  },
  methods: {
    getTime() {
      this.time_now = Utils.getFormatDate(Date.now());
    }
  },
  activated() {
    this.getTime();
  }
};
</script>
<style lang="less" scoped>
.wrapper {
  width: 100%;
  box-sizing: border-box;
  background: white;
  margin-top: 15px;
  padding: 25px;
  .time-tip {
    max-width: 1200px;
    padding: 0px 10px;
    margin: 0 auto;
    padding: 10px 0px;
    span {
      color: gray;
    }
  }
  ul {
    max-width: 1200px;
    padding: 0px 10px;
    margin: 0 auto;
    padding: 0px 0px;
    display: flex;
    flex-flow: wrap;
    border: 1px solid #2c282817;
    padding: 15px 25px;
    box-sizing: border-box;
    li {
      width: 50%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 15px 0px;
      b {
        font-size: 10px;
        em {
          color: rgb(247, 76, 49);
        }
      }
      strong {
        font-size: 29px;
        font-weight: bold;
        color: rgb(247, 76, 49);
        margin: 5px 0px;
      }
      span {
        font-weight: 700;
        color: #333;
        font-size: 17px;
      }
    }
  }
}
</style>