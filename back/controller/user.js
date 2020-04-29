const nodeMailer = require('nodemailer')
const { exec, escape } = require('../db/mysql')
const { getuserImg } = require('../utils/index')
const { SuccessModal, ErroModal } = require('../modle/resModel')
const { github } = require('../conf/OauthConfig')
const redis = require('koa-redis');
const { genPassword } = require('../utils/cryp')
const axios = require('axios')
const store = redis().client
//获取邮箱验证码 controller
const getemailCode = async (email) => {
    // 请求到期时间
    const expire = Number(await store.hget(`nodemail:${email}`, 'expire'))
    if (expire && (+new Date() - expire < 0)) {
        return new ErroModal('验证过于频繁，一分钟后再尝试');
        return;
    }
    // 配置参数
    const conf = {
        get user() {
            return '1079713849@qq.com'
        },
        get pass() {  // smtp授权码
            return 'ekzkvfnfcozmfead'
        },
        get code() { //验证码
            return () => {
                return Math.random().toString(16).slice(2, 6).toUpperCase()
            }
        },
        get expire() {
            return () => {
                return +new Date() + 60 * 1000
            }
        }
    }

    var transporter = nodeMailer.createTransport({
        service: 'qq',
        auth: {
            user: conf.user,
            pass: conf.pass //授权码,通过QQ获取  
        }
    })
    let code;
    //邮件模板
    var mailOptions = {
        from: '1079713849@qq.com',
        to: email,
        subject: '注册验证',
        html: `<h3>注册验证码是${code = conf.code()}</h3>`
    }
    //开始发送邮件
    try {
        let info = await transporter.sendMail(mailOptions)
        if (info) {
            // 存储状态redis
            await store.hmset(`nodemail:${email}`, 'code', code, 'expire', conf.expire(), 'email', email, 'storageTime', +new Date())
            console.log(new SuccessModal('ok'))
            return new SuccessModal('ok')
        }
    } catch (err) {
        console.log(err)
        return new ErroModal('验证码发送失败，重试')
    }
}
//注册 controller
const registerUser = async (username, password, email, code) => {
    //读取redis里面的邮箱验证码
    const redis_code = await store.hget(`nodemail:${email}`, 'code')
    //读取redis里面的时间戳storageTime,过期时间为5分钟
    const expire = await store.hget(`nodemail:${email}`, 'expire')
    //随机生成用户头像
    const user_img = getuserImg();
    //查询数据库是否已经存在email
    const sql1 = `select email from users where email = '${email}'`
    const row1 = await exec(sql1)
    console.log('是否存在email', row1[0])
    const sql = `insert  into users (username, password, email, user_img) value (${escape(username)}, ${escape(genPassword(password))}, ${escape(email)}, ${escape(user_img)})`
    switch (true) {
        case redis_code === null:
            return new ErroModal('注册失败，请检查邮箱和验证码是否输入正确')
            break;
        case redis_code != code:
            return new ErroModal('邮箱验证码错误')
            break;
        case +new Date() - expire > 4 * 60 * 1000:
            return new ErroModal('超过5分钟，验证码失效，请重新获取')
            break;
        case row1[0] != undefined:
            return new ErroModal('同一个邮箱不可重复注册');
            break;
        default:
            console.log('default')
            const row = await exec(sql)
            if (row.affectedRows > 0) {
                return new SuccessModal('注册成功')
            } else {
                return new ErroModal('注册失败，请重试')
            }
            break;
    }
}

//登录 controller
const loginUser = async (email, password, ctx) => {
    //明日完成登录鉴权，admin和普通 游客的权限，第三方登录
    password = genPassword(password);
    console.log('login传进', email, password)
    //判断是否为管理员
    if (email === 'admin') {
        const sql1 = `select email, username from admins where email = ${escape(email)}`
        const row1 = await exec(sql1)
        if (row1.length > 0) {
            const sql = `select email, username from admins where email = ${escape(email)} and password = ${escape(password)}`
            const row = await exec(sql);
            console.log('login查询', row)
            console.log('login-1')
            if (row.length > 0) {
                let userData = {
                    username: row[0].username,
                    email: row[0].email
                }
                //设置session
                ctx.session.user = userData;
                console.log('管理员登录成功')
                return new SuccessModal({
                    superadmin: true,
                    msg: '登陆成功'
                })
            } else {
                return new ErroModal('账号密码错误')
            }

        } else {
            return new ErroModal('该账号不存在')
        }

    } else {
        const sql1 = `select email, username from users where email = ${escape(email)}`
        const row1 = await exec(sql1)
        if (row1.length > 0) {
            const sql = `select email, username from users where email = ${escape(email)} and password = ${escape(password)}`
            const row = await exec(sql)
            console.log('普通用户登录', row)
            if (row.length > 0) {
                let userData = {
                    username: row[0].username,
                    email: row[0].email
                }
                ctx.session.user = userData
                return new SuccessModal({
                    superadmin: false,
                    msg: '登陆成功'
                })
            } else {
                return new ErroModal('账号密码输入错误')
            }

        } else {
            return new ErroModal('该邮箱尚未注册')
        }

    }
}

//检测是否登录controller
const checkLogin = async (ctx) => {
    try {
        console.log('session-github',ctx.session.github_user)
        if (ctx.session.user) {
            //获取头像
            let sql;
            let return_data;
            if (ctx.session.user.email && ctx.session.user.email === 'admin') {
                sql = `select user_img from admins where email = '${ctx.session.user.email}'`
                const row = await exec(sql)
                if (row.length > 0) {
                    return_data = {
                        superadmin: true,
                        user_img: row[0].user_img,
                        username: ctx.session.user.username,
                        email: ctx.session.user.email,
                        msg: '已经登录'
                    }
                } else {
                    return new ErroModal('账号异常')
                }

            } else {
                sql = `select user_img from users where email = '${ctx.session.user.email}'`
                const row = await exec(sql)
                if (row.length > 0) {
                    return_data = {
                        superadmin: false,
                        user_img: row[0].user_img,
                        username: ctx.session.user.username,
                        email: ctx.session.user.email,
                        msg: '已经登录'
                    }
                } else {
                    return new ErroModal('账号异常')
                }
            }
            return new SuccessModal(return_data)
        } else if (ctx.session.github_user) {
            console.log('github')
            let return_data = {};
            return_data = {
                superadmin: false,
                user_img: ctx.session.github_user.avatar_url,
                username: ctx.session.github_user.name,
                email: ctx.session.github_user.email || ctx.session.github_user.login
            }
            return new SuccessModal(return_data)
        } else {
            return new SuccessModal('未登錄')
        }
    } catch (error) {
        throw new Error(error)
    }
}
//重设密码邮箱验证
const getEmailCode = async (email) => {
    console.log('邮箱验证', email)
    let resData = {}
    const sql = `select username from users where email = '${email}'`
    const row = await exec(sql)
    console.log('查询结果', row)
    if (row.length === 0) {
        return new ErroModal('邮箱不存在')
    } else {
        //开始向邮箱发送验证码
        // 请求到期时间
        const expire = Number(await store.hget(`nodemail:${email}`, 'expire'))
        if (expire && (+new Date() - expire < 0)) {
            return new ErroModal('验证过于频繁，一分钟后再尝试');
            return;
        }
        // 配置参数
        const conf = {
            get user() {
                return '1079713849@qq.com'
            },
            get pass() {  // smtp授权码
                return 'ekzkvfnfcozmfead'
            },
            get code() { //验证码
                return () => {
                    return Math.random().toString(16).slice(2, 6).toUpperCase()
                }
            },
            get expire() {
                return () => {
                    return +new Date() + 60 * 1000
                }
            }
        }
        var transporter = nodeMailer.createTransport({
            service: 'qq',
            auth: {
                user: conf.user,
                pass: conf.pass //授权码,通过QQ获取  
            }
        })
        let code;
        //邮件模板
        var mailOptions = {
            from: '1079713849@qq.com',
            to: email,
            subject: '修改密码验证',
            html: `<h3>修改密码验证码是${code = conf.code()}</h3>`
        }
        //开始发送邮件
        try {
            let info = await transporter.sendMail(mailOptions)
            if (info) {
                // 存储状态redis
                await store.hmset(`nodemail:${email}`, 'code', code, 'expire', conf.expire(), 'email', email, 'storageTime', +new Date())
                resData.isVerifySuccess = true
                return new SuccessModal(resData)
            }
        } catch (err) {
            console.log(err)
            return new ErroModal('验证码发送失败，重试')
        }
    }
}
//重设密码
const resetNewpsw = async (data) => {
    const { code, newPassword, email } = data
    console.log('重设密码', code, newPassword, email)
    let resData = {}
    //修改密码sql
    const sql = `update users set password = ${escape(genPassword(newPassword))} where email = '${email}'`
    //读取redis里面的邮箱验证码
    const redis_code = await store.hget(`nodemail:${email}`, 'code')
    //读取redis里面的时间戳storageTime,过期时间为5分钟
    const expire = await store.hget(`nodemail:${email}`, 'expire')
    switch (true) {
        case redis_code != code:
            return new ErroModal('邮箱验证码错误')
            break;
        case +new Date() - expire > 4 * 60 * 1000:
            return new ErroModal('超过5分钟，验证码失效，请重新获取')
            break;
        default:
            const row = await exec(sql);
            if (row.affectedRows >= 1) {
                resData.resetSuccess = true;
                return new SuccessModal(resData)
            } else {
                return new ErroModal('修改密码错误，请重试！')
            }
            break;
    }

}
//第三方登录
const Oauth = async (code, ctx) => {
    const env = process.env.NODE_ENV; //环境参数
    console.log('code', code)
    try {
        //用code换区token
        const result = await axios({
            url: github.request_token_url,
            method: 'post',
            data: {
                client_id: github.client_id,
                client_secret: github.client_secret,
                code: code
            },
            headers: {
                'Accept': 'application/json'
            }
        })
        console.log('tolen_info', result.data, result.status)
        if (result.status === 200 && (result.data && !result.data.error)) {
            //使用token换取用户信息
            const { access_token, token_type, scope } = result.data
            const userInfoResponse = await axios({
                url: github.request_user_info,
                method: 'get',
                params:{
                    access_token:access_token
                }
                // headers: {
                //     'Authorization': `token ${access_token}`
                // }
            })
            console.log('user_info', userInfoResponse.data)
            //将github用户信息存入session,和普通登录区别开，
            // 保证session中只有一种登录方式,将另外一种设为null
            ctx.session.github_user = userInfoResponse.data
            ctx.redirect(`${env === 'dev' ? 'http://localhost:8008/#/home' : 'http://114.55.93.74:8008/#/home'}`)
        } else {
            ctx.body = `
            <div style = 'text-align:center'>
                <h1>request token failed: ${result.data.error_description}</h1>
                <a style = 'text-decoration: none;color: #119ace;font-size: 30px;' href='${env === 'dev' ? 'http://localhost:8008/#/home' : 'http://114.55.93.74:8008/#/home'}'>点击返回首页</a>
            </div>
            `
        }
    } catch (error) {
        console.error(error)
        ctx.body = `
            <div style = 'text-align:center'>
                <h1>登录出错</h1>
                <a style = 'text-decoration: none;color: #119ace;font-size: 30px;' href='${env === 'dev' ? 'http://localhost:8008/#/home' : 'http://114.55.93.74:8008/#/home'}'>点击返回首页</a>
            </div>
        `
    }
}
module.exports = {
    getemailCode,
    registerUser,
    loginUser,
    checkLogin,
    getEmailCode,
    resetNewpsw,
    Oauth
}