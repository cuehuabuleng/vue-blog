const xss = require('xss');
const { exec, escape } = require('../db/mysql');
const { SuccessModal, ErroModal } = require('../modle/resModel')
const { getArrEqual, getTargetArr } = require('../utils/index')
//获取标签选择列表
const getTags = async () => {
    let startIndex = Math.ceil(Math.random() * 10)
    const sql = `select * from tags limit ${startIndex} , 10`
    const row = await exec(sql);
    let responseData = {}
    //将文章tags选择的tagsNmae变成数组
    let tagDataLength = row.length;
    let tagsSelect = []
    if (row) {
        for (let i = 0; i < tagDataLength; i++) {
            tagsSelect.push(row[i].tagsname)
        }
    } else {
        tagsSelect = []
    }
    responseData.tags = tagsSelect
    return new SuccessModal(responseData)
}
//获取标签墙controller
const getallTags = async () => {
    const sql = "select * from tags";
    const row = await exec(sql)
    let responseData = {}

    //将文章tags选择的tagsNmae变成数组
    let tagDataLength = row.length;
    let tagsAll = []
    if (row) {
        for (let i = 0; i < tagDataLength; i++) {
            tagsAll.push(row[i].tagsname)
        }
    } else {
        tagsAll = []
    }
    responseData.tags = tagsAll
    return new SuccessModal(responseData)
}
//上传更新标签墙
const updateTags = async (tags, ctx) => {
    let resData = {};
    let tagsList = []
    const sql = `select * from tags`
    const row = await exec(sql)
    let sql1;
    console.log('上传的标签', tags)
    if (row.length === 0) {
        //里面没有标签的情况
        //更新标签墙
        for (let i = 0; i < tags.length; i++) {
            sql1 = `insert into tags (tagsname) value ('${tags[i]}')`
            const row1 = await exec(sql1)
            if (row1.affectedRows >= 1) {
                return new SuccessModal('ok')
            } else {
                return new SuccessModal('error')
            }
        }
    } else {
        //比较数据库里面的标签和传过来的标签，找出不同的标签，更新标签墙
        for (let i = 0; i < row.length; i++) {
            tagsList.push(row[i].tagsname)
        }
        //拿到两个数组的相同部分
        let newArry = getArrEqual(tagsList, tags)
        //去掉数组里面的公共部分
        let newArry_ = getTargetArr(newArry, tags)
        //更新标签墙
        for (let i = 0; i < newArry_.length; i++) {
            sql1 = `insert into tags (tagsname) value ('${newArry_[i]}')`
            const row1 = await exec(sql1)
            if (row1.affectedRows >= 1) {
                return new SuccessModal('ok')
            } else {
                return new SuccessModal('error')
            }
        }
    }

    console.log('查询的标签', tagsList)
    return new SuccessModal('ok')
}
module.exports = {
    getTags,
    getallTags,
    updateTags
}