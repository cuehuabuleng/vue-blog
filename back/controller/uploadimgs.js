const fs = require('fs')
const path = require('path')
const { SuccessModal, ErroModal } = require('../modle/resModel')
const { exec, escape } = require('../db/mysql')
//上传图片
const uploadimg = async (ctx) => {
    const env = process.env.NODE_ENV; //环境参数
    const articleTitle = ctx.query.title;
    const articleId = ctx.query.id || null;
    let row;
    console.log('文章标题;id', articleTitle, articleId)
    //判断是否传进id（修改文章）
    if (articleId) {
        row = [];
    } else {
        // 查询是否已经存在该标题
        const sql = `select content from homelist where title = '${articleTitle}'`
        row = await exec(sql);
    }
    console.log('数据库查询', row)
    if (row.length > 0) {
        return new SuccessModal('该标题已经存在，请换一个')
    } else {
        const uploadUrl = env === 'dev' ? `http://localhost:3000/public/img/blogs/${articleTitle}` : `http://114.55.93.74:3000/public/img/blogs/${articleTitle}`;
        const files = ctx.request.files.files
        let responseData = {};

        //创建文件夹
        const filePath = path.join(__dirname, `../public/img/blogs/${articleTitle}`);
        await new Promise((resolve, reject) => {    
            //判断该文件夹是否存在
            if (!fs.existsSync(filePath)) {
                console.log('不存在,开始创建')

                fs.mkdir(filePath, function (err) {
                    if (err) {
                        console.log('创建失败')
                        throw new Error(err)
                    } else {
                        console.log('创建完成')
                        console.log('1开始写入文件')
                        // 调用写入文件函数，将图片存入文件中
                        responseData = writeFile(files, filePath, uploadUrl);
                        console.log('responseData',responseData)
                        resolve();
                    }
                })

            } else {
                console.log('文件夹已经存在')
                // 调用写入文件函数，将图片存入文件中
                responseData = writeFile(files, filePath, uploadUrl);
                resolve();
            }
        })
        console.log('开始return')
        return responseData
    }
}

//写入文件函数
const writeFile = function (files, filePath, uploadUrl) {
    let resImgList = []
    if (files.length > 1) {
        try {
            for (let i = 0; i < files.length; i++) {
                // console.log('上传图片接口接收数据读出来', files[i])
                const fileReader = fs.createReadStream(files[i].path);
                console.log('图片路径——', fs.existsSync(filePath))
                // 组装成绝对路径
                const fileResource = filePath + `/${files[i].name}`;
                //    使用 createWriteStream 写入数据，然后使用管道流pipe拼接
                const writeStream = fs.createWriteStream(fileResource);
                fileReader.pipe(writeStream);
                resImgList.push(uploadUrl + `/${files[i].name}`)
            }
            return new SuccessModal({
                imgList: resImgList
            })
        } catch (error) {
            console.log(error)
            return new ErroModal('图片上传失败')
        }
    }
    else {
        try {
            // console.log('上传图片接口接收数据读出来', files)
            const fileReader = fs.createReadStream(files.path);
            console.log('图片路径', filePath)
            // 组装成绝对路径
            const fileResource = filePath + `/${files.name}`;
            //    使用 createWriteStream 写入数据，然后使用管道流pipe拼接
            const writeStream = fs.createWriteStream(fileResource);
            fileReader.pipe(writeStream);
            resImgList.push(uploadUrl + `/${files.name}`)
            return new SuccessModal({
                imgList: resImgList
            })
        } catch (error) {
            console.log(error)
            return new ErroModal('图片上传失败')
        }
    }
}


//删除图片
const delImg = async (path) => {
    try {
        console.log('删除的文章图片path', path)
        var files = [];
        if (fs.existsSync(path)) {
            console.log('开始删除')
            files = fs.readdirSync(path);
            files.forEach((file, index) => {
                var curPath = path + "/" + file;
                if (fs.statSync(curPath).isDirectory()) {
                    delImg(curPath);
                } else {
                    fs.unlinkSync(curPath)
                }
            })
            fs.rmdirSync(path)
        } else {
            console.log('需要删除的文件不存在')
            return;
        }
    } catch (error) {
        throw new Error(error)
    }
}
module.exports = {
    uploadimg,
    delImg
}