
class web_client{
  constructor(){
    this.url = '';  //server url address.
    // this.url = 'http://routerlogin.net:4100'; //生产环境用
    this.mockApiMaps = { //真实api到模拟的假api的映射。当要切换到生产环境时要注释里面的所有值。
      '/GetServerList':'./app/mockDatas/vpn_proxy_bootstrap_node.json',
      '/GetPaymentInfo':'./app/mockDatas/vpn_payment_info.json',
      '/GetVLanStatus':'./app/mockDatas/vpn_status_info.json',
      '/turnOnVPort':'./app/mockDatas/common_response.json',
      '/turnOffVPort':'./app/mockDatas/common_response.json',
      '/addVPathList':'./app/mockDatas/common_response.json',
    };
  }
  setUrl(serverUrl){
    this.url = serverUrl;
  }
  getApiName(apiKey){ //获取接口名称。
    let productEnvNoApiName = ['/GetPaymentInfo','/turnOnVPort', '/turnOffVPort','/addVPathList'];
    if(productEnvNoApiName.indexOf(apiKey) != -1){
      return this.mockApiMaps[apiKey] || '';
    }
    return this.mockApiMaps[apiKey] || apiKey;
  }

  getVLanStatusInfo(portNum, succCallBack) {  //获取所有vPort的状态信息
    $.ajax({
        url : this.url+this.getApiName('/GetVLanStatus'),
        type: 'GET',
        data:{
          "action":14,
          "channel":+portNum
        },
        async : true,
        // xhrFields: {
        //     withCredentials: true
        // },
        // crossDomain: true,
        success : (res)=>{
          // console.log(res);
          succCallBack && succCallBack(res);
        }
      });
  }
  getPorxyBootsNode(succCallBack) { //获取启动节点列表
    $.ajax({
        url : this.url+this.getApiName('/GetServerList'),
        type: 'GET',
        async : true,
        // xhrFields: {
        //     withCredentials: true
        // },
        // crossDomain: true,
        success : (res)=>{
          console.log(res);
          succCallBack && succCallBack(res);
        }
      });
  }
  getPaymentInfo(succCallBack) {  //获取支付信息,也就是使用期限和剩余流量
    $.ajax({
        url : this.url+this.getApiName('/GetPaymentInfo'),
        type: 'GET',
        data:{
          "action":18,
          "channel":0
        },
        async : true,
        // xhrFields: {
        //     withCredentials: true
        // },
        // crossDomain: true,
        success : (res)=>{
          console.log(res);
          succCallBack && succCallBack(res);
        }
      });
  }

  turnOnOffVPort(params,succCallBack) {  //打开一个vLan vport端口, params又三个参数:curBootNodeIP,vPortNum,isTurnOn;
    let apiStr = params.isTurnOn ? '/turnOnVPort' : '/turnOffVPort';
    let data = {
      "action":params.isTurnOn ? 2 : 3,
      "channel":params.vPortNum,
    };
    params.isTurnOn ? data.server = params.curBootNodeIP : null;
    $.ajax({
        url : this.url+this.getApiName(apiStr),
        type: 'GET',
        data:data,
        async : true,
        // xhrFields: {
        //     withCredentials: true
        // },
        // crossDomain: true,
        success : (res)=>{
          console.log(res);
          succCallBack && succCallBack(res);
        }
      });
  }

  //添加一个vPath
  addVPath(params,succCallBack) {  //打开一个vLan vport端口, params又三个参数:vPortNum,list;
    let data = {
      "action":4,
      "channel":params.vPortNum,
      "list":params.list,
    };
    $.ajax({
        url : this.url+this.getApiName('/addVPathList'),
        type: 'GET',
        data:data,
        async : true,
        // xhrFields: {
        //     withCredentials: true
        // },
        // crossDomain: true,
        success : (res)=>{
          console.log(res);
          succCallBack && succCallBack(res);
        }
      });
  }


}

const WebClient = new web_client();
export default WebClient;
