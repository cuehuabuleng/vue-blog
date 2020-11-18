const router = require('koa-router')()
const { SuccessModal, ErroModal } = require('../modle/resModel')
const { getemailCode, registerUser, loginUser, checkLogin, getEmailCode, resetNewpsw, Oauth} = require('../controller/user')


// 注册时邮箱验证码 router
router.post('/register/email', async (ctx, next) => {
  const { email } = ctx.request.body;
  const re_data = await getemailCode(email);
  ctx.body = re_data
})
//注册router
router.post('/register', async (ctx, next) => {
  const { username, password, email, code } = ctx.request.body;
  const re_data = await registerUser(username, password, email, code);
  ctx.body = re_data
})

//登录router
router.post('/login', async (ctx, next) => {
  const { email, password } = ctx.request.body
  const re_data = await loginUser(email, password, ctx)
  console.log('login',re_data)
  ctx.body = re_data;
})

//检测是否登录
router.get('/checkLogin', async (ctx, next) => {
  const re_data = await checkLogin(ctx);
  ctx.body = re_data
})

//退出登录
router.get('/logout', async (ctx, next) => {
  try {
    ctx.session = null;
    ctx.body = new SuccessModal('退出成功')
  } catch (error) {
    throw new Error(Error)
  }
})

//找回密码邮箱验证router
router.post('/resetpassword/emial', async (ctx, next) => {
  const email = ctx.request.body.email
  const re_data = await getEmailCode(email);
  ctx.body = re_data
})
//重设密码router
router.post('/setpassword', async (ctx, next) => {
  const data = ctx.request.body;
  const re_data = await resetNewpsw(data);
  ctx.body = re_data
})

//第三方登录
router.get('/oauth', async (ctx, next) => {
  const code = ctx.query.code
  const re_data = await Oauth(code, ctx);

})

module.exports = router
