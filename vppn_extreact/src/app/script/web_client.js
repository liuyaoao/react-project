
class web_client{
  constructor(){
    this.url = '';  //server url address.
    this.mockApiMaps = { //真实api到模拟的假api的映射。
      '/GetServerList':'./app/mockDatas/vpn_proxy_bootstrap_node.json',
      '/GetPaymentInfo':'./app/mockDatas/vpn_payment_info.json',
    };
  }
  setUrl(serverUrl){
    this.url = serverUrl;
  }
  getApiName(apiKey){ //获取接口名称。
    if(apiKey == '/GetPaymentInfo'){
      return this.mockApiMaps[apiKey] || '';
    }
    return this.mockApiMaps[apiKey] || apiKey;
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
  getPaymentInfo(succCallBack) {  //获取支付信息
    $.ajax({
        url : this.url+this.getApiName('/GetPaymentInfo'),
        type: 'GET',
        // data:{
        //   "action":18,
        //   "channel":0
        // },
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
