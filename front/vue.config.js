const webpack = require('webpack')
module.exports = {
  devServer: {
    port: 8008, // 端口
  },
  publicPath: './',
  //解决浏览器兼容问题，出现空白页，有些依赖或者插件需要做一些处理  Vue 不支持 IE8 及以下版本，因为 Vue 使用了 IE8 无法模拟的 ECMAScript 5 特性。但对于 IE9+，Vue 底层是支持。
  transpileDependencies: [/node_modules[/\\\\](element-ui|vuex|axios|quill|quill-image-drop-module|quill-image-resize-module|vue-quill-editor|vuex|"vue-router|axios|echarts|echarts-gl|element-ui)[/\\\\]/],
  // lintOnSave: false // 取消 eslint 验证
  // 富文本中使用拖拽图片上传ImageDrop ,和拉伸图片设置大小ImageResize，遇到 import报错，需要设置下面配置
  chainWebpack: config => {
    config.plugin('provide').use(webpack.ProvidePlugin, [{
      'window.Quill': 'quill'
    }])
  }
}