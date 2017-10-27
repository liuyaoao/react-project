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
* 近期修改： 去掉了该系统的群聊部分，只用了原系统的框架结构，所以还是有很少一部分是用的原群聊的东西，没有完全剥离开。
* 总框架是reactJs。且整个项目是在原开源项目mattermost进行二次开放的。
### 0、antd和antd-mobile：
* 主ui组件是antd和antd-mobile, 一个是用于pc端的，一个是用于移动端的。
###  1、superagent：
*  是一个先进的小而先进的客户端的HTTP请求库。和node.js模块有相同的api,功能很丰富，使用还算比较简单。
*  可以和它配合使用的还有，superagent-no-cache：使用方式：.use(nocache); 该插件是用来阻止浏览器缓存该请求，以免获取的是旧的数据。
*  superagent-prefix： .use(prefix); 给url加一个绝对url的前缀，一般是测试的时候用。
### 2、mattermost-redux:
*  这个本来是mattermost开源项目自己弄的一个redux组件，可以使用npm下载。但是我们在使用的时候遇到一些问题，所以单独copy出来放在我们项目里了，然后稍微改了一些地方以适应我们自己的需求。所以可以不用原mattermost那样使用npm install的方式下载了。

###关于本地开发环境和生产打包编译:
* 首先，本地开发环境和打包编译的配置文件是分开的。
*
