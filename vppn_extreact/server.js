const http = require('http'),//引入http模块
express = require('express'),//引入epxress模块
app = express();// 初始化(将express执行一次即完成初始化)
var router = express.Router();
var path = require('path');
var listenPort = '10060';
/*
 *搭建一个服务器，直接传入初始化后的app即可，listen后为监听端口号
 **/
http.createServer(app).listen(listenPort,function(){
	console.log('正常打开10060端口');
	console.log('node express server successfully started.');
	console.log('Serving files at: http://localhost:'+listenPort);
	console.log("Press Ctrl+C to shutdown.");
});

app.use('/files',express.static('build/files'));
app.use('/scss',express.static('build/scss'));
app.use('/images',express.static('build/images'));
app.use('/ext-react',express.static('build/ext-react'));
app.use('/app.js',express.static('build/app.js'));

router.get('/', function(req, res) {
	res.sendFile(__dirname + '/build/index.html')
});

router.get('/*', function(req, res) {
	res.sendFile(__dirname + '/build/index.html')
});

app.use('/',router);
// module.export = router;
