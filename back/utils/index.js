// 将数组转换成字符串
function turnTostring(arr) {
    let newArr = []
    if (arr) {
        newArr = arr.join(',')
        return newArr;
    } else {
        return newArr;
    }

}
//格式化时间
function getFormatDate(dt) {
    var date = new Date(dt);
    Y = date.getFullYear() + '-';
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    D = date.getDate() + ' ';
    h = date.getHours() + ':';
    m = date.getMinutes() + ':';
    s = date.getSeconds();
    return (`${Y + M + D + h + m + s}`)
}
//将字符串中的单引号转换成双引号
function changeQuotes(str){
    let newStr;
    newStr = str.replace(/'/g, '"');
    return newStr;
}
//随机生成用户头像
function getuserImg(){
    let userImg;
    const env = process.env.NODE_ENV; //环境参数
    const imgUrl = env === 'dev' ? '"http://localhost:3000/public/userimg' :'http://114.55.93.74:3000/public/userimg'
    const number = Math.floor(Math.random()*12);
    userImg = imgUrl+`/${number}.jpg`
    console.log('userimg',userImg)
    return userImg
}
//提取两数组之间的相同部分
function getArrEqual(arr1,arr2){
    let newArr = []
    for (let i = 0; i < arr1.length; i++) {
        for (let j = 0; j < arr2.length; j++) {
            if (arr1[i] === arr2[j]) {
                newArr.push(arr2[j])
            }
        }
    }
    return newArr;
}
//去掉数组中的公共部分
function getTargetArr(arr1,arr2){
    let newArr = []
    for (let i = 0; i < arr1.length; i++) {
        let index = arr2.indexOf(arr1[i])
        if (index > -1) {
            arr2.splice(index, 1)
        }
    }
    newArr = arr2;
    return newArr;
}
module.exports = {
    turnTostring,
    getFormatDate,
    changeQuotes,
    getuserImg,
    getArrEqual,
    getTargetArr
}