const redis = require('redis');
var port = 6379;
var host = '127.0.0.1';
var password = '111111';

var client = redis.createClient(port, host);
// 如果redis没开启验证,可不写
// client.auth(password, function (e) {
//     console.log(e)
// })

// 设置key的value
function setKey(key, value, callback) {
    client.on('connect', function () {
        client.set(key, value, callback);
    })
}
// 得到key的value
function getKey(key, callback) {
    client.on('connect', function () {
        client.get(key, callback);
    })
}
// 设置key对象的field属性的value
function hset(hash, key, value, callback) {
    client.on('connect', function () {
        client.hset(hash, key, value, callback);
    })
}
// 得到key对象的field属性的value
function hget(hash, key, callback) {
    client.on('connect', function () {
        client.hget(hash, key, callback);
    })
}
//得到key对象的所有的属性和值
function hgetall(hash, callback) {
    client.on('connect', function () {
        client.hgetall(hash, callback);
    })
}
// 同时将多个 field-value (域-值)对设置到哈希表 key 中
function hmset(hash, paramArr, callback) {
    client.on('connect', function () {
        client.hmset(hash, ...paramArr, callback);
    })
}
/**
 * keys * 得到所有key
 * hdel key field 删除
 * hexists key field 判断对象是否存在这个field
 */

module.exports = {
    setKey, getKey, hset, hget, hgetall, hmset
}