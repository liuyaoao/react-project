

//当前我连接的虚拟ip
export const allMyVirtualIP = {
  'vPort1':'10.100.16.89',
  'vPort2':'10.100.16.37',
  'vPort3':'10.100.16.5',
  'vPort4':'',
  'vPort5':'',
}


//所有端口上的远程路由器列表
export const allRemoteRouterList = {
  'vPort1':[
    {status: 1, virtualIp: '10.100.16.9', subnet: "192.168.101.0/255.255.255.0", latency: 0, 'link': 'Direct'},
    {status: 0, virtualIp: '10.100.16.68', subnet: "192.168.1.0/255.255.255.0", latency: 100, 'link': 'Direct'},
  ],
  'vPort2':[
    {status: 1, virtualIp: '10.100.16.12', subnet: "192.168.101.0/255.255.255.0", latency: 90, 'link': 'Direct'},
    {status: 1, virtualIp: '10.100.16.17', subnet: "192.168.1.0/255.255.255.0", latency: 0, 'link': 'Direct'},
    {status: 0, virtualIp: '10.100.16.24', subnet: "10.0.0.0/255.255.255.0", latency: 50, 'link': 'Relayed'},
    {status: 0, virtualIp: '10.100.16.56', subnet: "10.0.0.0/255.255.255.0", latency: 20, 'link': 'Relayed'}
  ],
  'vPort3':[
    {status: 0, virtualIp: '10.100.18.26', subnet: "192.168.101.0/255.255.255.0", latency: 0, 'link': 'Direct'},
    {status: 0, virtualIp: '10.100.18.58', subnet: "192.168.1.0/255.255.255.0", latency: 0, 'link': 'Direct'},
    {status: 1, virtualIp: '10.100.18.35', subnet: "10.0.0.0/255.255.255.0", latency: 200, 'link': 'Relayed'}
  ],
  'vPort4':[],
  'vPort5':[],

}
//所有的vPath列表
export const allVPathList = {
  'vPort1':[
    {domain: 'google', proxy: '10.100.16.24', desc: "美国"},
    {domain: 'twitter', proxy: '10.100.16.24', desc: '美国'},
    {domain: 'facebook', proxy: '10.100.16.24', desc: '美国'}
  ],
  'vPort2':[
    {domain: 'baidu', proxy: '10.100.87.32', desc: "中国"},
    {domain: 'soho', proxy: '10.100.65.84', desc: '中国'},
    {domain: 'twiter', proxy: '10.100.65.84', desc: '美国'},
    {domain: 'alibaba', proxy: '10.100.28.74', desc: '中国'}
  ],
  'vPort3':[
    {domain: 'baidu', proxy: '10.100.87.32', desc: "中国"},
  ],
  'vPort4':[],
  'vPort5':[],
}
export const allVProxyList = {
  'vPort1':[
    {text:'220.168.30.12', value:'220.168.30.12'},
    {text:'220.168.30.16', value:'220.168.30.16'},
    {text:'220.168.30.9', value:'220.168.30.9'},
  ],
  'vPort2':[
    {text:'220.168.10.16', value:'220.168.10.16'},
    {text:'220.168.10.46', value:'220.168.10.46'},
    {text:'220.168.10.83', value:'220.168.10.83'},
  ],
  'vPort3':[
    {text:'220.168.70.98', value:'220.168.70.98'},
    {text:'220.168.70.23', value:'220.168.70.23'},
    {text:'220.168.70.15', value:'220.168.70.15'},
  ],
  'vPort4':[],
  'vPort5':[],
}
