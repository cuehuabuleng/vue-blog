import axios from 'axios';
import { Message } from "element-ui";
axios.defaults.withCredentials = true;
// import router from '../../src/router/index'
//axios  response拦截器
// axios.interceptors.response.use(function (response) {
//     window.console.log('拦截器的response', response)
//     return Promise.resolve(response)
// },
//     function (error) {
//         window.console.log('拦截器response的error', error.response.status)
//         return Promise.reject(error);
//     })
export default class Axios {
    static ajax(options) {
        // window.console.log('ajax', options)
        let baseApi = '';
        if (options.isMock) {
            baseApi = 'http://localhost:3000'
        } else {
            baseApi = 'http://114.55.93.74:3000'
        }
        return new Promise((resolve) => {

            axios({
                url: options.url,
                method: options.method,
                baseURL: baseApi,
                timeout: 10000,
                data: options.data ? options.data : null,
                params: options.params ? options.params : null,
                headers: {
                    'Content-Type': options.conten_type
                },
                processData: false,
                contentType: false
            }).then((response) => {
                // window.console.log('ajax.then返回response', response)
                let res = response.data;
                if (res.code != undefined && res.code != null) {
                    switch (res.code) {
                        case -1:
                            Message.error(res.msg);
                            break;
                        case 2:
                            Message.error("当前账号没有权限");
                            break;
                        case 1:
                            Message.error('账号密码错误')
                            break;
                        case 3:
                            Message.error('参数错误')
                            break;
                        case -99:
                            Message.error('发生未知错误');
                            break;
                        default:
                            resolve(res)
                            break;
                    }
                } else {
                    Message.error('未知异常,code:xxx-x')
                }
            }).catch((err) => {
                if (err.response) {
                    // window.console.log('ajax.catch', err.response)
                    let statusCode = err.response.status;
                    switch (statusCode) {
                        case 400:
                            Message.error(options.identify + 'Bad Request,请求错误,code:' + statusCode)
                            break;
                        case 401:
                            Message.error(options.identify + 'Unauthorized,未授权，请登录，code:' + statusCode);
                            break;
                        case 402:
                            Message.info(options.identify + 'Payment Required, code:' + statusCode);
                            break;
                        case 403:
                            Message.error(options.identify + 'Forbidden,拒绝访问' + statusCode);
                            break;
                        case 404:
                            Message.error(options.identify + 'Not Found, 服务器未找到,code:' + statusCode);
                            break;
                        case 405:
                            Message.error(options.identify + '请求中的方法被禁止,code:' + statusCode);
                            break;
                        case 406:
                            Message.error(options.identify + '	Not Acceptable, 无法完成请求', +statusCode);
                            break;
                        case 407:
                            Message.error(options.identify + 'Proxy Authentication Required, 请求者应当使用代理进行授权' + statusCode);
                            break;
                        case 408:
                            Message.error(options.identify + 'Request Time-out, 请求超时' + statusCode);
                            break;
                        case 409:
                            Message.error(options.identify + '	Conflict, 服务器处理请求时发生了冲突', +statusCode);
                            break;
                        case 410:
                            Message.error(options.identify + 'Gone, 请求的资源已经不存在,code:' + statusCode);
                            break;
                        case 411:
                            Message.error(options.identify + '	Length Required,服务器无法处理不带Content-Length的请求,code:' + statusCode);
                            break;
                        case 412:
                            Message.error(options.identify + '	Precondition Failed,请求信息的先决条件错误,code:' + statusCode);
                            break;
                        case 413:
                            Message.error(options.identify + 'Request Entity Too Large, 求的实体过大，服务器无法处理，因此拒绝请求。code:' + statusCode);
                            break;
                        case 414:
                            Message.error(options.identify + 'Request-URI Too Large,请求的URI过长，服务器无法处理,code:' + statusCode);
                            break;
                        case 415:
                            Message.error(options.identify + 'Unsupported Media Type,服务器无法处理请求附带的媒体格式' + statusCode);
                            break;
                        case 416:
                            Message.error(options.identify + '	Requested range not satisfiable,请求的范围无效,code' + statusCode);
                            break;
                        case 417:
                            Message.error(options.identify + '	Expectation Failed, 服务器无法满足Expect的请求头信息' + statusCode);
                            break;
                        case 500:
                            Message.error(options.identify + '	Internal Server Error, 	服务器内部错误，无法完成请求,code:', +statusCode);
                            break;
                        case 501:
                            Message.error(options.identify + '	Not Implemented,不支持请求的功能，code:' + statusCode);
                            break;
                        case 502:
                            Message.error(options.identify + '	Bad Gateway,网关错误,code:' + statusCode);
                            break;
                        case 503:
                            Message.error(options.identify + '	Service Unavailable,服务不可用,code:' + statusCode);
                            break;
                        case 504:
                            Message.error(options.identify + '	Gateway Time-out,网关超时,code:' + statusCode);
                            break;
                        case 505:
                            Message.error(options.identify + 'HTTP Version not supported,HTTP版本不受支持,code:' + statusCode);
                            break;
                        default:
                            Message.error('请求发生错误:' + err)
                            break;
                    }
                } else {
                   alert(err)
                    resolve(null)
                }

            })
        })
    }
}