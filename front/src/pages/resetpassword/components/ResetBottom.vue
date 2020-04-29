<template>
  <div class="bottom">
    <h2>使用遇到的问题？</h2>
    <p>无法找回登录密码，怎么办?</p>
    <ul>
      <li>答：1、找回登录密码只能通过注册的邮箱找回，请确认您注册了盖.该邮箱。</li>
      <li class="spacing">2、如果长时间未接收到手机邮件，请查看您的拦截垃圾邮件</li>
      <li class="spacing">
        3、无法通过以上方式找回登录密码时，您可以
        <a href>申请人工审核。</a>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "ResetBottom"
};
</script>
<style lang="less" scoped>
.bottom {
  border-top: 1px dashed #d9d9d9;
  margin-top: 20px;
  padding-top: 20px;
  h2 {
    font-size: 14px;
    color: #333;
    font-weight: 700;
    margin-bottom: 10px;
    padding-top: 2px;
  }
  p {
    padding-top: 2px;
  }
  ul {
    padding-top: 5px;
    li {
      color: #999;
      font-size: 12px;
      line-height: 20px;

      a {
        color: #0b73bb;
        font-size: 12px;
      }
      a:hover {
        color: #ff9400;
        text-decoration: underline;
      }
    }
    .spacing:before {
      content: "";
      width: 2em;
      display: inline-block;
    }
  }
}
</style>