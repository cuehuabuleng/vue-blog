const router = require('koa-router')()
const {  getTags, getallTags, updateTags } = require('../controller/tags')

//获取标签选择
router.get('/tag/select', async (ctx, next) => {
    const re_data = await getTags();
    ctx.body = re_data
})
//获取标签墙的标签
router.get('/tag/all',async (ctx, next) => {
    const re_data = await getallTags();
    ctx.body = re_data
})
//上传标签 router
router.post('/posttags', async (ctx, next) => {
    const tags = ctx.request.body.tags;
    const re_data  = await updateTags(tags, ctx)
    ctx.body = re_data
})
module.exports = router
