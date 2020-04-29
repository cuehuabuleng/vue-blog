const superagent = require('superagent')
const cheerio = require('cheerio')
const path = require('path')
const fs = require('fs')
const schedule = require('node-schedule')
function setEpidemicInfo() {
    const url = 'https://ncov.dxy.cn/ncovh5/view/pneumonia';
    //定时执行爬虫
    schedule.scheduleJob('30 1 * * * *', () => {
        superagent.get(url).then(res => {
            //获取当前日期
            const date = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`;
            const filePath = path.join(__dirname, `../public/${date}`);
            // 创建文件夹-day
            if (!fs.existsSync(filePath)) {
                console.log('文件夹不存在，开始创建')
                fs.mkdir(filePath, function (err) {
                    if (err) {
                        console.log('创建失败')
                        throw new Error(err)
                    } else {
                        console.log('创建成功!')
                        return;
                    }
                })
            } else {
                console.log('文件夹已经存在')
                return;
            }


            const $ = cheerio.load(res.text)//可以通过jq的方式操作dom
            //获取疫情信息
            //全国的疫情信息
            var $getAreaStat = $('#getAreaStat').html()
            //疫情增长情况信息
            var $getStatisticsService = $('#getStatisticsService').html();
            //全球疫情信息
            var $getListByCountryTypeService2true = $('#getListByCountryTypeService2true').html();
            var dataObj = {};
            eval($getAreaStat.replace(/window/g, 'dataObj'))
            eval($getStatisticsService.replace(/window/g, 'dataObj'))
            eval($getListByCountryTypeService2true.replace(/window/g, 'dataObj'))
            //写入本地
            fs.writeFile(`${filePath}/data.json`, JSON.stringify(dataObj), err => {
                if (err) {
                    throw new Error(err)
                }
                console.log('数据写入成功')
            })
            // console.log('爬取到的数据',dataObj)

        }).catch(err => {
            throw new Error(err)
        })
    })

}

module.exports = {
    setEpidemicInfo
}