# 司法E通 项目前端说明

## 首先，Development Setup（开发环境的建立）
* 开发运行环境是nodejs v6.10.x及以上版本。

* Run `npm install`， 安装npm依赖包，如果一次正常成功最好，不行改用cnpm试试，再不行就从别人那里copy旧的node_modules整个目录。
* 一般开放环境如果要跑起来：需要两个步骤：
*      1、先编译代码：Run `npm run run` 或者Run `npm run run-fullmap` ,或者直接双击运行run.bat文件。
*      2、启动一个本地web服务器： 当前目录的dos命令运行：`node server.js` 或者直接双击运行该根目录的express_server.bat文件
* 在server.js文件里可以看到该web服务器的地址和端口为：http://localhost:10080  登录用户名和密码估计要问别人了。

* 最后是把前端代码打包编译成生产环境可用：Run `npm run build`; 该命令有可能会遇到一个问题，后面再详细说下。

## 框架和重要组件说明
* 总框架是reactJs。且整个项目是在原开源项目mattermost进行二次开放的。
