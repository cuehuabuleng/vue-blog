const router = require('koa-router')()
const {
    getList,
    getDetail,
    delArticle,
    postArticle,
    updateArticle,
    searchArticle,
} = require('../controller/article')
const loginCheck = require('../middleeware/loginCheck')
// 获取文章首页的文章列表 router
router.get('/home', async (ctx, next) => {
    let startIndex;
    const tag = ctx.query.tag || null
    const page = Number(ctx.query.page) || 1;
    const size = Number(ctx.query.size) || 10
    startIndex = page * size - size
    const re_list = await getList(startIndex, size, tag);
    ctx.body = re_list
})

//获取文章详情 router
router.get('/article', async (ctx, next) => {
    let articleId = ctx.query.id;
    const re_articleDetail = await getDetail(articleId);
    ctx.body = re_articleDetail
})

//删除文章 router
router.delete('/article', loginCheck, async (ctx, next) => {
    let articleId = ctx.query.id;
    const re_deleteResult = await delArticle(articleId, ctx);
    console.log('删除文章', re_deleteResult)
    ctx.body = re_deleteResult
})

//发表文章router
router.post('/article', loginCheck, async (ctx, next) => {
    const id = ctx.request.body.id || null
    const body = ctx.request.body;
    if (id) {
        const re_updatearticle = await updateArticle(body, id)
        ctx.body = re_updatearticle
    } else {
        const re_postarticle = await postArticle(body)
        ctx.body = re_postarticle
    }
})

//搜索文章router
router.get('/search', async (ctx, next) => {
    const page = Number(ctx.query.page) || 1;
    const size = Number(ctx.query.size) || 10;
    const keyword = ctx.query.keyword;
    let startIndex = page * size - size
    const res_searchData = await searchArticle(startIndex, size, keyword);
    ctx.body = res_searchData
})

module.exports = router
