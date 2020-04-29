<template>
  <div class="content-wrapper">
    <div class="content">
      <h2>个人简介</h2>
      <div class="description">
        <p>
          本人是21届前端菜鸡，接触前端算起来应该也有两年了，目前在
          <a href="https://www.gdou.edu.cn/" target="blank">广东海洋大学</a>就读计算机科学与技术专业。
          主要目前主要学习了
          <a
            href="https://react.docschina.org/"
            target="blank"
          >react</a>和
          <a href="https://cn.vuejs.org/" target="blank">vue</a>，这两门框架，还有
          <a href="https://koa-impact.com/" target="blank">koa2</a>--node后端框架，
          期间使用过以上的技术栈实现了一些项目.
        </p>
        <h2>下面是我的一些项目地址</h2>
        <div class="item">
          <ul>
            <li class="left_line">
              <h3>个人博客</h3>
              <div>
                <span>前端：html+jq</span>
                <span>后端：node-koa2，mysql</span>
              </div>
              <span>主要功能：登录，注册，发表、删除、修改、查找文章，超级管理员权限</span>
              <a href="http://114.55.93.74:8080/index.html" target="blank">演示地址</a>
            </li>
            <li class="left_line right_line">
              <h3>共享单车后台管理系统</h3>
              <div>
                <span>前端：react</span>
                <span>后端：node-koa2返回假数据</span>
              </div>
              <span>主要功能： xxxx</span>
              <a href="http://114.55.93.74:8005/#/home" target="blank">演示地址</a>
            </li>
            <li class="left_line">
              <h3>响应式静态页面</h3>
              <div>
                <span>前端：html+js</span>
                <span>后端：无</span>
              </div>
              <span>主要功能：可在pc端和移动端适应</span>
              <a href="http://114.55.93.74:8002/index.html" target="blank">演示地址1</a>
              <a href="http://114.55.93.74:8003/index.html" target="blank">演示地址1</a>
            </li>
            <li class="left_line right_line">
              <h3>个人博客</h3>
              <div>
                <span>前端：vue</span>
                <span>后端：node-koa2，mysql</span>
              </div>
              <span>主要功能：通过邮箱注册账号，通过邮箱找回密码门，第三方登录，普通用户登录，管理员登录，发表、删除、修改、查找文章，2020年疫情地图概况</span>
              <a href="http://114.55.93.74:8008/#/home" target="blank">演示地址</a>
            </li>
            
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "AboutContent"
};
</script>
<style lang="less" scoped>
.content-wrapper {
  width: 100%;
  margin-top: 40px;
  .content {
    max-width: 1200px;
    margin: 0 auto;
    max-width: 1200px;
    margin: 0 auto;
    border-radius: 15px;
    padding: 70px 60px;
    box-sizing: border-box;
    background: white;
    h2 {
      text-align: center;
      font-size: 40px;
      color: #ffa500f7;
      font-weight: bold;
      padding: 10px 0;
    }
    .description {
      width: 100%;
      margin-top: 20px;
      p {
        font-size: 20px;
        color: black;
        font-family: -webkit-body;
        line-height: 38px;
        text-indent: 2em;
      }
      h2 {
        font-size: 22px;
        color: black;
        text-align: left;
        margin-top: 20px;
      }
      .item {
        width: 100%;
        ul {
          width: 100%;
          overflow: hidden;
          .left_line {
            border-left: 1px solid #17171724;
          }
          .right_line {
            border-right: 1px solid #17171724;
          }
          li {
            line-height: 20px;
            padding: 15px;
            display: inline-block;
            width: 50%;
            box-sizing: border-box;
            margin-top: 15px;
            h3 {
              text-align: center;
              margin: 10px 0px;
              font-weight: bold;
            }
            div {
              span {
                display: block;
                text-align: left;
              }
            }
            span {
              display: block;
              max-width: 250px;
              margin: 0 auto;
            }
            a {
              text-align: left;
              display: block;
              max-width: 250px;
              margin: 0 auto;
            }
          }
        }
      }
    }
  }
}
</style>