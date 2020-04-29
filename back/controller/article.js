const xss = require('xss');
const { exec, escape } = require('../db/mysql');
const { turnTostring, getFormatDate, changeQuotes } = require('../utils/index')
const { SuccessModal, ErroModal } = require('../modle/resModel')
const { delImg } = require('./uploadimgs')
const path = require('path')
// 获取博客文章列表controller
const getList = async (startIndex, size, tag) => {
    //查询文章列表 page和size指定的内容
    let sql = `select * from homelist where 1=1 limit ${startIndex} , ${size}`
    //查询tag相关文章列表
    if (tag) {
        sql = `select * from homelist where 1=1 and tags like '%${tag}%' limit ${startIndex} , ${size}`
    }
    // 查询数据库的总条数
    let sql1 = 'select count(*) as articleTotal  from homelist'
    //查询tag相关文章的总数
    if (tag) {
        sql1 = `select count(*) as articleTotal from homelist where  tags like '%${tag}%'`
    }
    const row = await exec(sql)
    const articleTotal = await exec(sql1)

    let responseData = {};
    responseData.articlesTotal = articleTotal[0].articleTotal;
    let dataLength = row.length;
    //将tags字符串转换成数组
    for (let i = 0; i < dataLength; i++) {
        let tags = [];
        if (row[i].tags) {
            tags = row[i].tags.split(",")
            row[i].tags = tags;
        } else {
            row[i].tags = tags
        }

    }
    responseData.articleList = row
    return new SuccessModal(responseData)
}
//获取文章详情获取博客文章详情controller
const getDetail = async (id) => {

    //获取文章详情
    const sql = `select * from homelist where id = '${id}'`
    const row = await exec(sql)
    let responseData = {}
    //将tags字符串转换成数组
    let dataLength = row.length;
    for (let i = 0; i < dataLength; i++) {
        let tags = [];
        if (row[i].tags) {
            tags = row[i].tags.split(",")
            row[i].tags = tags;
        } else {
            row[i].tags = tags
        }
    }
    //增加文章的访问量
    let views = row[0].views
    const sql1 = `update homelist set views = ${views + 1} where id = '${id}'`
    const row1 = await exec(sql1)
    responseData.artcile = row[0]
    return new SuccessModal(responseData);
}
//删除文章获取博客文章列表controller
const delArticle = async (id, ctx) => {
    //根据parent的 id删除child评论
    const sql1 = `select id from parent_comments where articleId = ${id}`
    const row1 = await exec(sql1)
    console.log('对应的parentid', row1)
    //删除与parentId相关联的child评论
    try {
        for (let i = 0; i < row1.length; i++) {
            const sql1_ = `delete from child_comments where parentId = ${row1[i].id}`
            const row1_ = await exec(sql1_);
            console.log('删除自评论', row1_)
        }
    } catch (error) {
        throw new Error(error)
    }
    //删除点赞记录表
    try {
        const email = ctx.session.email
        const sql2 = `delete from like_info where articleId = ${id} and user_email = '${email}'`
        await exec(sql2)
    } catch (error) {
        throw new Error(error)
    }
    //删除文章评论区的点赞记录
    try {
        //首先根据articleId包含的获取该文章包含的parent评论表的id
        const sql = `select id from parent_comments where articleId = ${id}`
        const row = await exec(sql)
        for (let i = 0; i < row.length; i++) {
            //删除评论点赞记录
            const sql1 = `delete from commentlike_info where commentId = ${row[i].id}`
            await exec(sql1);
        }
    } catch (error) {
        throw ErroModal(error)
    }

    //根據該文章id，刪除parent評論
    const sql2 = `delete from parent_comments where articleId  = ${id}`
    await exec(sql2)
    //根据文章标题删除文章的图片
    const articleTitle = ctx.query.title;
    const filePath = path.join(__dirname, `../public/img/blogs/${articleTitle}`);
    await delImg(filePath);
    //根據id刪除該文章
    const sql = `delete from homelist where id = ${id}`
    const delData = await exec(sql)
    if (delData.affectedRows > 0) {
        return new SuccessModal('删除成功');
    } else {
        return new ErroModal('删除收失败')
    }
}

//发表文章 controller
const postArticle = async (articlData) => {
    // console.log('文章实体', articlData)
    const title = changeQuotes(xss(articlData.title));
    //文章内容添加了防xss攻击后，样式就会消失
    const content = changeQuotes(articlData.content);
    const overview = changeQuotes(xss(articlData.overview));
    const views = articlData.views;
    const likes = articlData.likes;
    const tags = changeQuotes(xss(turnTostring(articlData.tags)))
    const createTime = xss(getFormatDate(Date.now()));
    const updateTime = xss(getFormatDate(Date.now()))
    let sql = `insert into homelist (title, content, overview, views, likes, tags, createTime, updateTime)
    value ('${title}', '${content}', '${overview}', ${views}, ${likes}, '${tags}', '${createTime}', '${updateTime}')
    `
    let responseData = {}
    const postData = await exec(sql)
    if (postData.affectedRows > 0) {
        responseData.artcileId = postData.insertId
        responseData.isSuccess = true
        return new SuccessModal('发表文章成功');
    } else {
        return new ErroModal('发表文章失败')
    }
}

//修改文章
const updateArticle = async (articlData, id) => {
    const title = changeQuotes(xss(articlData.title));
    const content = changeQuotes(xss(articlData.content));
    const overview = changeQuotes(xss(articlData.overview));
    const views = articlData.views;
    const likes = articlData.likes;
    const tags = changeQuotes(xss(turnTostring(articlData.tags)))
    const createTime = xss(articlData.createTime);
    const updateTime = xss(getFormatDate(Date.now()))
    let sql = `update homelist set title = '${title}',content = '${content}',overview = '${overview}', views = '${views}', likes = '${likes}', tags = '${tags}', createTime = '${createTime}',updateTime = '${updateTime}' where id = ${id}`

    let responseData = {}
    const updateData = await exec(sql)
    if (updateData.affectedRows > 0) {
        responseData.artcileId = updateData.insertId
        responseData.isSuccess = true
        return new SuccessModal('修改成功');
    } else {
        responseData.isSuccess = false
        return new ErroModal('修改失败')
    }
}
//文章搜素 controller
const searchArticle = async (startIndex, size, keyword) => {
    //查询文章列
    let sql = `select * from homelist where 1=1 limit ${startIndex} , ${size}`
    // 查询数据库的总条数
    let sql1 = 'select count(*) as articleTotal  from homelist'
    //查询数据库包含关键字的文章的总数以及与关键字相关的文章
    if (keyword) {
        sql1 = `select count(*) as articleTotal  from homelist where tags like '%${keyword}%' or title like '%${keyword}%'or content like '%${keyword}%' or overview like '%${keyword}%'`
        sql = sql = `select * from homelist where  1=1 and  tags like '%${keyword}%' or title like '%${keyword}%'or content like '%${keyword}%' or overview like '%${keyword}%' limit ${startIndex} , ${size}`
    }
    const row = await exec(sql)
    const articleTotal = await exec(sql1)
    let responseData = {};
    responseData.articlesTotal = articleTotal[0].articleTotal;
    let dataLength = row.length;
    //将tags字符串转换成数组
    for (let i = 0; i < dataLength; i++) {
        let tags = [];
        if (row[i].tags) {
            tags = row[i].tags.split(",")
            row[i].tags = tags;
        } else {
            row[i].tags = tags
        }

    }
    responseData.articleList = row
    return new SuccessModal(responseData)
}

module.exports = {
    getList,
    getDetail,
    delArticle,
    postArticle,
    updateArticle,
    searchArticle,

}