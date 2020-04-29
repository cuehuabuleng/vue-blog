const router = require('koa-router')()
const { uploadimg } = require('../controller/uploadimgs')

router.post('/articleImage', async (ctx, next) => {
    const re_data = await uploadimg(ctx);
    console.log('router,上传图片返回',re_data)
    ctx.body = re_data
})

module.exports = router;
