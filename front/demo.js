const express = require('express'); //npm下载并引入express模块 npm -express -D
const path = require('path')
const app = express();
app.use(express.static(path.join(__dirname, 'dist')))
app.listen(8008,function(err){  //8080 想要监听项目的端口号
	if(err){
		console.log(err)
	}else {
		console.log('‘项目启动成功’')
	}
})