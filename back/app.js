const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const koaBody = require('koa-body');
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const { REDIS_CONF } = require('./conf/db')

const options = require('./routes/options')
const users = require('./routes/users')
const article = require('./routes/article')
const tags = require('./routes/tags')
const uploadimgs = require('./routes/uploadimgs')
const info = require('./routes/info')

const { setEpidemicInfo } = require('./utils/spider')
// 定时执行爬虫更新数据
setEpidemicInfo();
// 设置跨域等问题
app.use(async (ctx, next) => {

  //   前端要携带cookie到服务端，需要三个条件：
  // 1. Access-Control-Allow-Origin不能为*，应为具体域名
  // 2. 服务端Access-Control-Allow-Credentials应为true
  // 3. 客户端XMLHttpRequest 的 withCredentials=true
  const env = process.env.NODE_ENV; //环境参数
  ctx.set('Access-Control-Allow-Origin', env === 'dev' ? 'http://localhost:8008' :'http://114.55.93.74:8008');
  ctx.set('Access-Control-Allow-Credentials', true)
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (ctx.method == 'OPTIONS') {
    ctx.body = 200;
  } else {
    await next();
  }
})
// error handler
onerror(app)
// middlewares
// app.use(bodyparser({
//   enableTypes: ['json', 'form', 'text']
// }))

app.use(koaBody({
  multipart: true, // 支持文件上传
  formidable: {
    maxFieldsSize: 4 * 1024 * 1024, // 最大文件为2兆
    multipart: true // 是否支持 multipart-formdate 的表单
  }
}));

app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname, "/public"))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// session配置
app.keys = ['chenwenjie!23123_']
app.use(session({
  //配置cookie
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 2 * 60 * 60 * 1000
  },
  // 配置redis
  store: redisStore({
    all: `${REDIS_CONF.host}:${REDIS_CONF.port}` //写死本地的redis
  })
}))
// routes
app.use(options.routes(), options.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(article.routes(), article.allowedMethods())
app.use(tags.routes(), tags.allowedMethods())
app.use(uploadimgs.routes(), uploadimgs.allowedMethods())
app.use(info.routes(), info.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
