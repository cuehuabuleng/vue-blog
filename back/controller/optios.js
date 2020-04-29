const xss = require('xss');
const { exec, escape } = require('../db/mysql');
const { turnTostring, getFormatDate, changeQuotes } = require('../utils/index')
const { SuccessModal, ErroModal } = require('../modle/resModel')


//获取文章评论 controller
const getarticleComment = async (articleId) => {
    try {
        // console.log('文章id', articleId)
        let id = articleId
        let commentTotal = 0;
        let parentcommentTotal = 0;
        let childcommentTotal = 0;
        //查询parent评论内容和总数的sql-3
        let sql = `select * from parent_comments where articleId = ${id}`
        let sql3 = `select count(*) as parentcommentTotal  from parent_comments where articleId = ${id}`
        // 查询child评论内容和总数的sql1-2
        let sql2;
        let sql1;
        let responseData = {};
        const row = await exec(sql);
        const row3 = await exec(sql3);
        parentcommentTotal = row3[0].parentcommentTotal
        //评论楼层数
        responseData.parentcommentList = row;
        for (let i = 0; i < parentcommentTotal; i++) {
            responseData.parentcommentList[i].tier = i + 1
        }
        //子评论和评论总数的计算
        for (let i = 0; i < row.length; i++) {
            sql1 = `select * from child_comments where parentId = ${row[i].id}`
            sql2 = `select count(*) as childcommentTotal  from child_comments where parentId = ${row[i].id}`
            const row1 = await exec(sql1);

            const row2 = await exec(sql2);
            // console.log('子评论数量',row2)
            responseData.parentcommentList[i].childrencommentList = row1
            childcommentTotal = childcommentTotal + row2[0].childcommentTotal
        }
        commentTotal = childcommentTotal + parentcommentTotal;
        responseData.commentTotal = commentTotal;
        return new SuccessModal(responseData);
    } catch (error) {
        return new ErroModal(`加载评论区，模块失败${error}`)
        throw new Error(error)
    }
}
//发表文章评论 controller 
const postarticleComment = async (articleId, commentData, ctx) => {
    // console.log('发表评论收到的data',articleId, commentData)
    let { identify, parentId } = commentData;
    let username, userimg;
    //獲取當前用戶username和userimg
    let sql1
    if (ctx.session.user) {
        username = ctx.session.user.username
        if (ctx.session.user.email === 'admin') {
            sql1 = `select user_img from admins where username = '${username}'`
            const row_ = await exec(sql1)
            userimg = row_[0].user_img
        } else {
            sql1 = `select user_img from users where username = '${username}'`
            const row1_ = await exec(sql1)
            userimg = row1_[0].user_img
        }
    }else if(ctx.session.github_user){
        username = ctx.session.github_user.name
        userimg = ctx.session.github_user.avatar_url
    } else {
        return new ErroModal('尚未登錄')
    }

    const commentcontent = changeQuotes(xss(commentData.commentcontent))
    const like_num = 0;
    const create_time = xss(getFormatDate(Date.now()));
    let sql;
    //判斷子評論和父評論
    switch (identify) {
        case 'parent':
            sql = `insert into parent_comments (username, articleId, comment_content, userimg, like_num, create_time)
                     value ('${username}', ${articleId}, '${commentcontent}','${userimg}', ${like_num}, '${create_time}')`;
            const row = await exec(sql);
            if (row.affectedRows > 0) {
                return new SuccessModal('發表成功')
            } else {
                return new ErroModal('發表失敗，重試！')
            }
            break;
        case 'child':
            sql = `insert into child_comments (username, parentId, comment_content, userimg, create_time)
                    value ('${username}', ${parentId}, '${commentcontent}','${userimg}', '${create_time}')`
            const row1 = await exec(sql);
            if (row1.affectedRows > 0) {
                return new SuccessModal('發表成功')
            } else {
                return new ErroModal('發表失敗，重試！')
            }
            break;
        default:
            break;
    }
}
//点赞接口 controller
const handleLike = async (likeData, ctx) => {
    // const { articleId, like_num } = likeData;
    const articleId = Number(likeData.articleId)
    const like_num = Number(likeData.like_num)
    let resData = {};
    //查询是否已经点赞
    let articleIdlist = []
    const email = ctx.session.email
    const sql = `select articleId from like_info  where user_email = '${email}'`
    const row = await exec(sql)
    if (row.length === 0) {
        //没有记录则插入点赞记录,增加文章点赞数
        await addLike(email, articleId, like_num);

        resData.isLike = false
        return new SuccessModal(resData)
    } else {
        for (let i = 0; i < row.length; i++) {
            articleIdlist.push(row[i].articleId);
        }
        //查询该用户是否有对该文章点赞
        if (articleIdlist.indexOf(articleId) > -1) {
            //用户对该文章有点赞记录，则删除，并更新赞数 -
            await delLike(email, articleId, like_num);

            resData.isLike = true
            return new SuccessModal(resData)
        } else {

            //没有记录则插入点赞记录,增加文章点赞数
            await addLike(email, articleId, like_num);

            resData.isLike = false
            return new SuccessModal(resData)
        }
    }
}

//查询点赞 controller
const queryLike = async (articleId, ctx) => {
    // console.log('查询点赞传送数据', articleId)
    let resData = {}
    let articleIdlist = []
    //查询是否登录
    if (ctx.session.email) {
        const sql = `select articleId from like_info  where user_email = '${ctx.session.email}'`
        const row = await exec(sql)
        // console.log('查询点赞返回',row)
        if (row.length === 0) {
            //没有点赞记录
            resData.isLike = false
            return new SuccessModal(resData)
        } else {
            for (let i = 0; i < row.length; i++) {
                articleIdlist.push(row[i].articleId)
            }
            if (articleIdlist.indexOf(articleId) > -1) {
                // console.log('存在记录',articleIdlist.indexOf(articleId) > -1)
                resData.isLike = true;
                return new SuccessModal(resData)
            } else {
                // console.log('不存在记录',articleIdlist.indexOf(articleId) > -1)
                resData.isLike = false;
                return new SuccessModal(resData)
            }
        }
    } else {
        // 没有登录就false
        resData.isLike = false;
        return new SuccessModal(resData)
    }
}

//增加点赞函数
const addLike = async (email, articleId, like_num) => {
    //没有记录则插入点赞记录,增加文章点赞数
    const sql = `insert into like_info (user_email, articleId) value ('${email}', ${articleId})`
    const sql1 = `update homelist set likes = ${like_num + 1} where id = ${articleId};`
    const row = await exec(sql)
    if (row.affectedRows < 1) {
        return new ErroModal('操作失败')
    }
    const row1 = await exec(sql1)
    if (row1.affectedRows < 1) {
        return new ErroModal('操作失败')
    }
}
//删除点赞函数
const delLike = async (email, articleId, like_num) => {
    //用户对该文章有点赞记录，则删除，并更新赞数 -
    const sql = `delete from like_info where user_email = '${email}' and articleId = ${articleId}`
    const sql1 = `update homelist set likes = ${like_num - 1} where id = ${articleId};`
    const row = await exec(sql)
    if (row.affectedRows < 1) {
        return new ErroModal('操作失败')
    }
    const row1 = await exec(sql1)
    if (row1.affectedRows < 1) {
        return new ErroModal('操作失败')
    }
}

//parent评论点赞
const commentAddlike = async (likeData, ctx) => {
    const commentId = Number(likeData.commentId)
    const like_num = Number(likeData.like_num)
    const email = ctx.session.email
    console.log('文章id和评论点赞Id;', commentId)
    let resData = {};
    let commentslikeList = []
    const sql = `select commentId from commentlike_info  where user_email = '${email}'`
    const row = await exec(sql)
    console.log('查询评论点赞', row)
    if (row.length === 0) {
        //没有评论的点赞记录
        await addCommentlike(email, commentId, like_num);
        resData.isLike = false
        return new SuccessModal(resData)
    } else {
        for (let i = 0; i < row.length; i++) {
            commentslikeList.push(row[i].commentId)
        }
        if (commentslikeList.indexOf(commentId) > -1) {
            //有点赞记录,删除点赞记录
            await delCommentlike(email, commentId, like_num);
            resData.isLike = true;
            return new SuccessModal(resData)
        } else {
            //没有改用户的点赞记录,添加记录
            await addCommentlike(email, commentId, like_num);
            resData.isLike = false
            return new SuccessModal(resData)
        }
    }
}
//parent评论点赞查询
const commentQuerylike = async (articleId, ctx) => {
    console.log('查询评论点赞文章Id', articleId)
    let resData = {}
    let clicklike_list = [];
    if (ctx.session.email) {
        const sql = `select commentId from commentlike_info  where user_email = '${ctx.session.email}'`
        const row = await exec(sql)
        console.log('查询评论点赞', row)
        if (row.length === 0) {
            resData.clicklike_list = [];
            return new SuccessModal(resData)
        } else {
            for (let i = 0; i < row.length; i++) {
                clicklike_list.push(row[i].commentId)
            }
            resData.clicklike_list = clicklike_list;
            return new SuccessModal(resData)
        }
    } else {
        resData.clicklike_list = []
        return new SuccessModal(resData)
    }
}

//增加评论点赞函数
const addCommentlike = async (email, commentId, like_num) => {

    //没有记录则插入点赞记录,增加文章点赞数
    const sql = `insert into commentlike_info (user_email, commentId) value ('${email}', ${commentId})`
    const sql1 = `update parent_comments set like_num = ${like_num + 1} where id = ${commentId};`
    const row = await exec(sql)
    if (row.affectedRows < 1) {
        return new ErroModal('操作失败')
    }
    const row1 = await exec(sql1)
    if (row1.affectedRows < 1) {
        return new ErroModal('操作失败')
    }

}
//删除评评论点赞记录
const delCommentlike = async (email, commentId, like_num) => {

    //用户对该文章有点赞记录，则删除，并更新赞数 -
    const sql = `delete from commentlike_info where user_email = '${email}' and commentId = ${commentId}`
    const sql1 = `update parent_comments set like_num = ${like_num - 1} where id = ${commentId};`
    const row = await exec(sql)
    if (row.affectedRows < 1) {
        return new ErroModal('操作失败')
    }
    const row1 = await exec(sql1)
    if (row1.affectedRows < 1) {
        return new ErroModal('操作失败')
    }

}

//统计网站访问量
const viewCount = async (ctx) => {
    const sql = `select views from views_info`
    const row = await exec(sql)
    console.log('访问量',row)
    let resData = {}
    let views = row[0].views;
    const sql1 = `update views_info set views = ${views+1} where id = 1`
    const row1 = await exec(sql1)
    if (row1.affectedRows >= 1) {
        const row_ =  await exec(sql)
        resData.views = row_[0].views
        return new SuccessModal(resData)
    }
}

module.exports = {
    getarticleComment,
    postarticleComment,
    handleLike,
    queryLike,
    commentAddlike,
    commentQuerylike,
    viewCount
}