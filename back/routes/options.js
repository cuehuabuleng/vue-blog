const router = require('koa-router')()
const loginCheck = require('../middleeware/loginCheck')
const {
  getarticleComment,
  postarticleComment,
  handleLike,
  queryLike,
  commentAddlike,
  commentQuerylike,
  viewCount
} = require('../controller/optios')



//获取文章评论router
router.get('/comment', async (ctx, next) => {
  const articleId = ctx.query.id;
  let re_data = {}
  const res_getcommentData = await getarticleComment(articleId)
  re_data = {
    "commentTotal": 30,
    "parentcommentList": [
      {
        "id": 0,
        "username": "我是第一条",
        "img": "https://upload.jianshu.io/users/upload_avatars/20481438/eecd9d27-bf9d-42c2-a3dd-305a97bc49ef?imageMogr2/auto-orient/strip|imageView2/1/w/80/h/80/format/webp",
        "tier": 11,
        "content": "我是第一条评论我是第一条评论我是第一条评论我是第一条评论我是第一条评论我是第一条评论我是第一条评论",
        "like": 11,
        "time": "2019-09-09 14:21",
        "childrencommentList": [
          {
            "id": 0,
            "username": "第一条子评论",
            "img": "https://upload.jianshu.io/users/upload_avatars/20481438/eecd9d27-bf9d-42c2-a3dd-305a97bc49ef?imageMogr2/auto-orient/strip|imageView2/1/w/80/h/80/format/webp",
            "content": "我是第一条评论的子评论我是第一条评论的子评论我是第一条评论的子评论我是第一条评论的子评论我是第一条评论的子评论",
            "time": "2019-09-09 14:21"
          },
          {
            "id": 2,
            "username": "第一条子评论2",
            "img": "https://upload.jianshu.io/users/upload_avatars/20481438/eecd9d27-bf9d-42c2-a3dd-305a97bc49ef?imageMogr2/auto-orient/strip|imageView2/1/w/80/h/80/format/webp",
            "content": "我是第一条评论的子评论我是第一条评论的子评论我是第一条评论的子评论我是第一条评论的子评论我是第一条评论的子评论",
            "time": "2019-09-09 14:21"
          }
        ]
      },
      {
        "id": 1,
        "username": "我是第2条",
        "img": "https://upload.jianshu.io/users/upload_avatars/20481438/eecd9d27-bf9d-42c2-a3dd-305a97bc49ef?imageMogr2/auto-orient/strip|imageView2/1/w/80/h/80/format/webp",
        "tier": 11,
        "content": "我是第二条评论我是第二条评论我是第二条评论我是第二条评论我是第二条评论我是第二条评论我是第二条评论",
        "like": 11,
        "time": "2019-09-09 14:21",
        "childrencommentList": [
          {
            "id": 0,
            "username": "第二条子评论",
            "img": "https://upload.jianshu.io/users/upload_avatars/20481438/eecd9d27-bf9d-42c2-a3dd-305a97bc49ef?imageMogr2/auto-orient/strip|imageView2/1/w/80/h/80/format/webp",
            "content": "我是第二条评论的子评论我是第二条评论的子评论我是第二条评论的子评论我是第二条评论的子评论我是第二条评论的子评论",
            "time": "2019-09-09 14:21"
          },
          {
            "id": 2,
            "username": "第二条子评论2",
            "img": "https://upload.jianshu.io/users/upload_avatars/20481438/eecd9d27-bf9d-42c2-a3dd-305a97bc49ef?imageMogr2/auto-orient/strip|imageView2/1/w/80/h/80/format/webp",
            "content": "我是第二条评论的子评论我是第二条评论的子评论我是第二条评论的子评论我是第二条评论的子评论我是第二条评论的子评论",
            "time": "2019-09-09 14:21"
          }
        ]
      }
    ]
  }
  ctx.body = res_getcommentData
})
//发表文章评论 router
router.post('/comment', loginCheck, async (ctx, next) => {
  const articleId = ctx.query.articleId;
  const commentData = ctx.request.body;
  const res_postcommentData = await postarticleComment(articleId, commentData, ctx)
  ctx.body = res_postcommentData
})

// 文章点赞
router.get('/like', loginCheck, async (ctx, next) => {
  const likeData = ctx.query;
  const re_data = await handleLike(likeData, ctx);
  ctx.body = re_data
})

// 查询该文章是点赞
router.get('/queryLike', async (ctx, next) => {
  const articleId = Number(ctx.query.articleId);
  const re_data = await queryLike(articleId, ctx);
  ctx.body = re_data
})

//parent评论点赞
router.get('/addCommetnLike', loginCheck, async (ctx, next) => {
  const likeData = ctx.query;
  const re_data =  await commentAddlike(likeData, ctx);
  ctx.body = re_data
})
//parent评论点赞查询
router.get('/commentlikeQuery', async (ctx, next) => {
  const articleId = ctx.query.articleId
  const re_data = await commentQuerylike(articleId, ctx)
  ctx.body = re_data
})

//统计网站访问，存进cookie
router.get('/viewsConut', async (ctx, next) => {
  const re_data = await viewCount(ctx)
  ctx.body = re_data
})
module.exports = router
