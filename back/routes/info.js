//爬虫数据路由
const router = require('koa-router')()
const { getEpidemicInfo } = require('../controller/info')
router.get('/epidemic/info', async(ctx, next) => {
    const re_data = await getEpidemicInfo(ctx);
    // console.log('controller返回数据', re_data)
    ctx.body = re_data
})
module.exports = router