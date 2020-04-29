const path = require('path')
const fs = require('fs')
const { SuccessModal, ErroModal } = require('../modle/resModel')



const getEpidemicInfo = async () => {
    //获取当前日期
    const date = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`;
    const filePath = path.join(__dirname, `../public/${date}`)
    //将写入的数据返回
    let resData;
    await new Promise((resolve, reject) => {
        fs.readFile(`${filePath}/data.json`, 'utf8', (err, data) => {
            if (err) {
                throw new Error(err)
            }
            resData = JSON.parse(data);
            resolve();
        })
    })
    return new SuccessModal(resData)
}
module.exports = {
    getEpidemicInfo
}