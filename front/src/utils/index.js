import Jsonp from 'jsonp'
export default class Utils {
    //格式化时间
    static getFormatDate(dt) {
        var date = new Date(dt);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() + ' ';
        var h = date.getHours() + ':';
        var m = date.getMinutes() + ':';
        var s = date.getSeconds();
        return (`${Y + M + D + h + m + s}`)
    }
    //防抖函数
    static debounce(fnc, commentId) {
        // window.console.log('参数', fnc, commentId)
        let timer;
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            fnc(commentId);
        }, 300)

    }
    //页面滑动函数动画
    static ScrollTop(number, time) {
        if (!time) {
            document.body.scrollTop = document.documentElement.scrollTop = number;
            return ;
        }
        // window.console.log('滚动的位置，时间', number, time)
        let spacingTime = 1//设置循环的间隔时间  值越小消耗性能越高
        let spacingInex = time / spacingTime; //计算循环次数
        let nowTop = document.body.scrollTop + document.documentElement.scrollTop; // 获取当前滚动条位置
        let everTop = (number - nowTop) / spacingInex; // 计算每次滑动的距离
        // window.console.log('每次滑动的距离', everTop)
        let scrollTimer = setInterval(() => {
            if (spacingInex > 0) {
                spacingInex--;
                this.ScrollTop(nowTop += everTop);
            } else {
                clearInterval(scrollTimer); // 清除计时器
            }
        }, spacingTime);
    }
    //jspn跨域请求
    static jsonp(options){
        return new Promise((resolve, reject) => {
            Jsonp(options.url, {
                param:options.param
            }, function (err, response) {
                if (response.status && response.status === 'success') {
                    resolve(response);
                }else{
                    reject(err);
                }
            })
        })
    }
}