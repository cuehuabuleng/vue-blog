<template>
  <div class="header-wrapper">
    <canvas ref="canvas" class="canvas"></canvas>
    <div class="deadercontent-wrapper">
      <h1>
        <router-link to="/home">J的个人博客</router-link>
      </h1>
      <h2>xxxx,xxxxx</h2>
      <div>
        xxxxx,xxxxxxx,
        <br />xxxxxxxxxxxxx
        <br />xxxxxxxxxxxxxxxxx
      </div>
      <div class="scrolldown-icon" @click="handleScrolldown">
        <i class="iconfont">&#xe635;</i>
      </div>
    </div>
  </div>
</template>

<script>
import Utils from "../../src/utils/index";
export default {
  name: "HeaderComponent",
  data() {
    return {
      canvas: "",
      ctx: "",
      cw: "",
      ch: "",
      r: "66",
      setinterval: "",
      bubblecount: 250,
      bubbles: [],
      timer: null
    };
  },
  watch: {},
  methods: {
    //定义一个创建小球的方法
    Bubble(_this) {
      //初始化小球的位置
      this.initialize = function() {
        this.x = Math.random() * _this.canvas.width;
        this.y = Math.random() * _this.canvas.height + _this.canvas.height;
        this.r = Math.random() * 6;
      };
      //定义小球向上运动的函数
      this.move = function() {
        this.x;
        this.y -= 0.5;
        // window.console.log(this.isOutOfBounds())
        // 小球飞出屏幕上方之后，重新初始化小球的位置（再生）
        if (this.isOutOfBounds()) {
          this.initialize();
        }
      };
      //画小球的方法
      this.draw = function() {
        // window.console.log(_this.ctx)
        _this.ctx.beginPath();
        _this.ctx.fillStyle = "#ffffff29";
        _this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        _this.ctx.fill();
      };
      //判断小球是否已经飞出屏幕
      this.isOutOfBounds = function() {
        return this.y < 0;
      };
    },
    //创建小球方法
    createBubble() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      //传递this过去
      let _this = this;
      for (let i = 0; i < this.bubblecount; i++) {
        var newBubble = new this.Bubble(_this);
        // window.console.log(newBubble.draw)
        newBubble.initialize();
        // newBubble.draw();
        this.bubbles.push(newBubble);
      }
    },
    bubblerender() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      // window.console.log(this.bubbles[0].y)
      for (var i = 0; i < this.bubbles.length; i++) {
        this.bubbles[i].draw();
        this.bubbles[i].move();
      }
    },
    //初始化canvas画布的基本参数
    initCanvas() {
      //获取canvas的dom
      this.canvas = this.$refs.canvas;
      this.ctx = this.canvas.getContext("2d");
      this.canvas.width = document.body.clientWidth;
      this.canvas.height = document.documentElement.clientHeight;
      // window.console.log("canvas", this.canvas.width, this.canvas.height);
      // window.console.log("屏幕", this.cw, this.ch);
    },
    //定义一个获取屏幕宽高的函数
    setSize() {
      window.console.log("执行setSize");
      // this.cw = document.body.clientWidth;
      // this.ch = document.documentElement.clientHeight;
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        window.console.log('执行setsize')
        this.canvas.width = document.body.clientWidth;
        this.canvas.height = document.documentElement.clientHeight;
      }, 200);
    },
    //页面向下滑动事件
    handleScrolldown() {
      let scrollY = document.documentElement.clientHeight || document.body.clientHeight;
      window.console.log('顶部header',scrollY)
      Utils.ScrollTop(scrollY, 100);
    }
  },
  mounted() {
    //   组件初次挂在，执行mounted生命周期函数，使用了keep-alive之后，第二次进来就不会再次触发这mounted事件
    // window.console.log("mounted");
    this.initCanvas();
  },
  activated() {
    //因为使用了keep-alive，会在组件进来的时候同事触发mounted和activeed事件

    this.initCanvas();
    this.createBubble();
    //绑定定时器，实现动画效果
    this.setinterval = setInterval(() => {
      this.bubblerender();
    }, 1000 / 60);
    //   添加监听器，监听屏幕大小的变化
    window.addEventListener("resize", this.setSize);
  },
  deactivated() {
    //   使用了keep-alive之后，在组件被巧销毁的时候，会触发deactive事件，
    // 将挂在的resize事件移除
    window.removeEventListener("resize", this.setSize);
    //去除定时器
    clearInterval(this.setinterval);
  }
};
</script>
<style lang="less" scoped>
.header-wrapper {
  position: relative;
  z-index: 1;
  height: 100vh;
  .canvas {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: -1;
  }
}
.deadercontent-wrapper {
  position: relative;
  max-width: 892px;
  margin: 0 auto;
  padding: 0 10px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  h1 {
    font-size: 45px;
    margin: 10px 0px;
    a {
      color: white;
    }
  }
  h2 {
    font-size: 40px;
    margin: 10px 0px;
    color: #ffffffa3;
  }
  div {
    font-size: 15px;
    color: #ffffffa3;
    line-height: 20px;
  }
  .scrolldown-icon {
    position: absolute;
    bottom: 15px;
    transition: all 4s;
    animation: bounce 4s infinite;
    i {
      font-size: 25px;
      color: #ffffffc3;
    }
    i:hover {
      cursor: pointer;
      color: white;
    }
  }
  @keyframes bounce {
    0% {
      transform: translate(0, 0);
    }
    25% {
      transform: translate(0, 5px);
    }
    50% {
      transform: translate(0, 10px);
    }
    75% {
      transform: translate(0, 5px);
    }
    100% {
      transform: translate(0, 0);
    }
  }
}
.header-wrapper:after {
  content: "";
  height: 100%;
  position: absolute;
  background: url(../assets/imgs/header-bg.jpg) no-repeat 50%;
  width: 100%;
  top: 0;
  background-size: cover;
  z-index: -2;
}
</style>


