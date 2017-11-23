
import React,{Component} from 'react';
import Intl from '../../intl/Intl';

import { TabPanel, Container, FormPanel,TextField,
  FieldSet, SelectField,Button,Menu,MenuItem,Grid,
  Column,ToggleField   } from '@extjs/ext-react';
Ext.require('Ext.field.InputMask');
Ext.require('Ext.Toast');

let bootsNodeOptions = [
    { text: '220.168.30.12', value: '220.168.30.12' },
    { text: '220.168.30.1', value: '220.168.30.1' },
    { text: '220.168.30.6', value: '220.168.30.6' }
];

export default class StateContent extends Component {
    state={
      wifi5GSwitch:true,
      wifi2_4GSwitch:true,
      menuItemVal:'',
      selectedBootsNode:'220.168.30.12',
      selectedVProxyIp:'', //选中的vProxy IP.
    }
    componentDidMount(){
      console.log("-------cpuCharts-------");
      this.cpuUseData = [];
      this.memoryUseData = [];
      this.cpuCharts = echarts.init(document.getElementById('cpuCharts'));
      this.memoryCharts = echarts.init(document.getElementById('memoryCharts'));
      this.nowTime = new Date();
      this.initLineChartsData();
      this.cpuCharts.setOption(this.getCpuMemoryChartsOptions({title:"CPU 使用率",data:this.cpuUseData}));
      this.memoryCharts.setOption(this.getCpuMemoryChartsOptions({title:"Memory 使用率",data:this.memoryUseData}));
      this.cpuTimeInterval = setInterval(()=>{
        this.getCpuAndMemoryData();
        this.nowTime = new Date(+this.nowTime + 2000);
      },2000);

    }
    initLineChartsData = ()=>{
      for(let i=0;i<300;i++){
        let tempDt = new Date(+this.nowTime-(300-i)*2000);
        this.cpuUseData.push({
          name:tempDt.toString(),
          value:[ +tempDt, 0 ]
        });
        this.memoryUseData.push({
          name:tempDt.toString(),
          value:[ +tempDt, 0 ]
        });
      }
    }
    getCpuAndMemoryData = ()=>{ //获取服务的的cpu和内存的使用率数据
      let _this = this;
      $.ajax({
        url : "http://192.168.2.1:8099/cgi-bin/getcpumem.cgi",
        type:'GET',
        async : true,
        // cache:false,
        // xhrFields: {withCredentials: true},
        // crossDomain: true,
        success : (result)=>{
          console.log("cgi-bin/getcpumem.cgi-----:",result,result.split('\n'));
          let resArr = result.split('\n');
          let memoryDtStr,cpuDtStr_1,cpuDtStr_2;
          resArr.forEach((val)=>{ //解析出内存和两次cpu使用的数据
            if(val.indexOf('Total')!=-1){
              memoryDtStr = val;
            }
            if(val.indexOf('cpu')!=-1 && !cpuDtStr_1){
              cpuDtStr_1 = val;
            }
            if(val.indexOf('cpu')!=-1 && cpuDtStr_1){
              cpuDtStr_2 = val;
            }
          });

          //计算内存使用率。
          let memoryDt = memoryDtStr.split(' ');
          let memoryTotal,memoryUse;
          memoryDt.map((val)=>{
            if(val && $.isNumeric(val) && !memoryTotal){
              memoryTotal = parseInt(val); //总内存数。
            }
            if(val && $.isNumeric(val) && memoryTotal){
              memoryUse = parseInt(val);  //已使用的内存数。
            }
          });
          _this.memoryUseData.push({
            name:_this.nowTime.toString(),
            value:[ +_this.nowTime,parseInt(memoryUse/memoryTotal*100) ]
          });
          _this.memoryUseData.splice(0,1);
          //计算cpu使用率情况。
          let cpuDt_1 = cpuDtStr_1.split(' ');
          let cpuDt_2 = cpuDtStr_2.split(' ');
          cpuDt_1 = cpuDt_1.filter((val)=>{
            return (val && $.isNumeric(val));
          });
          cpuDt_2 = cpuDt_2.filter((val)=>{
            return (val && $.isNumeric(val));
          });
          let cpuDtTotal_1=0,cpuDtTotal_2=0; ///计算两次cpu总的时间，相减就是cpu总的使用时间。
          cpuDt_1.forEach((val)=>{cpuDtTotal_1 = cpuDtTotal_1 + parseInt(val)});
          cpuDt_2.forEach((val)=>{cpuDtTotal_2 = cpuDtTotal_2 + parseInt(val)});

          _this.cpuUseData.push({
            name:_this.nowTime.toString(),
            value:[ +_this.nowTime, parseInt((cpuDt_2[3]-cpuDt_1[3])/(cpuDtTotal_2-cpuDtTotal_1)*100) ]
          });
          _this.cpuUseData.splice(0,1);
          //跟新曲线图
          _this.cpuCharts.setOption({
              series: [{
                  data: _this.cpuUseData
              }]
          });
          _this.memoryCharts.setOption({
              series: [{
                  data: _this.memoryUseData
              }]
          });
        }
      });
    }
    getCpuMemoryChartsOptions = (obj)=>{
      return {
            title: {
                text: obj.title,
                padding:1,
                itemGap:0, //主副标题之间的间距。
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    params = params[0];
                    var date = new Date(params.name);
                    return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ' (' + params.value[1]+'%)';
                },
                axisPointer: {
                    animation: false
                }
            },
            xAxis: {
                type: 'time',
                splitLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                splitLine: {
                    show: false
                },
                min:0,max:100,interval:20,
                axisLabel:{ show:true,
                  formatter: '{value} %'
                }
            },
            series: [{
                name: '数据',
                type: 'line',
                showSymbol: false,
                hoverAnimation: false,
                data: obj.data
            }]
        };
    }

    componentWillUnmount () {
      clearInterval(this.cpuTimeInterval);
      this.cpuTimeInterval = null;
    }
    onAddTypeChange = (item)=>{
      this.setState({menuItemVal:item.value});
    }
    dataStore = new Ext.data.Store({
        data: [
          {index:1, name:' Wireless',price:'342.54', priceChange:'mif-wifi-connect icon'},
          {index:2, name:' Internet',price:'342.54', priceChange:'mif-earth icon'}
        ],
        sorters: 'name'
    })
    onBootsNodeSelectChanged = (field, newValue)=>{  //引导节点有改变。
      this.setState({ selectedBootsNode:newValue });
      Ext.toast(`You selected the item with value ${newValue}`);
    }
    onVProxySelectChanged = (field, newValue) => { //vProxy 路由ip有改变。
      this.setState({ selectedVProxyIp:newValue });
      Ext.toast(`You selected the item with value ${newValue}`);
    }
    onClickWifi5GSwitch = (e)=>{
      console.log("点击了wifi 5GHz开关：",e);
      this.setState( {wifi5GSwitch:!this.state.wifi5GSwitch} );
    }
    render(){
      let {menuItemVal,selectedBootsNode} = this.state;

      return (
        <div className='stateContent' style={{height:'100%'}}>
            <Container
              layout={{ type: 'hbox', pack: Ext.os.is.Phone ? 'center' : 'left',align:'top'}}
              margin="0 0 10 0"
              height="auto"
              defaults={{ margin: "0 10 0 0",border:'1px solid #fff987',borderRadius:'4px' }}
            >
              <Container flex={1} margin="10 10 10 10">
                <SelectField cls="state_title"
                  value={1}
                  onChange={(field, newValue) => Ext.toast(`You selected the item with value ${newValue}`)}
                  options={[
                      { text: 'Internet连接-IPv4', value: 1 },
                      { text: 'Internet连接-IPv6', value: 2 },
                      { text: 'Option 3', value: 3 }
                  ]}
                />
                <div style={{height:'24px',color:'green',fontSize:'20px',margin:'8px 0 0 0'}}>
                  <i className="big check circle outline icon"></i> {Intl.get('Already Online')}
                </div>
                <TextField ui="disabled-ui" label={"IP "+Intl.get('Address')} value="192.168.1.9" disabled/>
                <TextField ui="disabled-ui" label={Intl.get('Gateway')} value="192.168.1.1" disabled/>
                <TextField ui="disabled-ui" label={"DNS "+Intl.get('Server')} value="192.168.1.1" disabled/>
              </Container>
              <Container flex={1} margin="10 10 10 10">
                  <TextField cls="state_title" value="Wi-Fi 5GHz" disabled/>
                  <div className="small ui toggle checkbox" style={{margin:'8px 0 0 0'}}>
                    <input type="checkbox" name="public"/>
                    <label> on</label>
                  </div>
                  <TextField label={Intl.get('Name')+"（SSID）"} value="Synology 5G" disabled/>
                  <TextField label={Intl.get('Safe Mode')} value="WAP-个人，AES" disabled/>
                  <TextField label={"MAC "+Intl.get('Address')} value="00:11:32:53:bd:50" disabled/>
              </Container>
              <Container flex={1} margin="10 10 10 10">
                <TextField cls="state_title" value="Wi-Fi 2.4GHz" disabled/>
                <div className="small ui toggle checkbox" style={{margin:'8px 0 0 0'}}>
                  <input type="checkbox" name="public"/>
                  <label> on</label>
                </div>
                <TextField label={Intl.get('Name')+"（SSID）"} value="Synology" disabled/>
                <TextField label={Intl.get('Safe Mode')} value="WAP-个人，AES" disabled/>
                <TextField label={"MAC "+Intl.get('Address')} value="00:11:32:53:bd:50" disabled/>
              </Container>
            </Container>

            <TabPanel cls='state_tabPanel'
                height="auto"
                defaults={{
                    cls: "card",
                    // layout: "center",
                    tab: {
                        flex: 0,
                        minWidth: 100
                    }
                }}
                tabBar={{
                    layout: {
                        pack: 'left'
                    }
                }}
                style={{height:'auto'}}
            >
              <Container title={Intl.get('Internet')} cls="state_Internet">
                <InternetChartComp/>

              </Container>
              <Container title={Intl.get('Device List')} cls="state_equipList">
                  <div className="">
                    {Intl.get('Device List')}
                  </div>
              </Container>
              <Container title="CPU" cls="state_CPU">
                  <div id="cpuCharts" style={{width:'700px',height:'250px'}}></div>
              </Container>
              <Container title={Intl.get('Memory')} cls="state_memory">
                  <div id="memoryCharts" style={{width:'700px',height:'250px'}}></div>
              </Container>
            </TabPanel>
        </div>
    )
  }
}

class InternetChartComp extends Component{
  componentDidMount(){
    this.uploadData = [];
    this.downloadData = [];
    this.uploadChart = echarts.init(document.getElementById('uploadChart'));
    this.downloadChart = echarts.init(document.getElementById('downloadChart'));
    this.nowTime = new Date();
    this.initLineChartsData();
    this.uploadChart.setOption(this.getChartsOptions({title:"上传",data:this.uploadData}));
    this.downloadChart.setOption(this.getChartsOptions({title:"下载",data:this.downloadData}));
    this.timeInterval = setInterval(()=>{
      this.getUploadDownloadData();
      this.nowTime = new Date(+this.nowTime + 2000);
    },2000);
  }
  initLineChartsData = ()=>{
    for(let i=0;i<300;i++){
      let tempDt = new Date(+this.nowTime-(300-i)*2000);
      this.uploadData.push({
        name:tempDt.toString(),
        value:[ +tempDt, 0 ]
      });
      this.downloadData.push({
        name:tempDt.toString(),
        value:[ +tempDt, 0 ]
      });
    }
  }
  getUploadDownloadData = ()=>{ //获取服务的的cpu和内存的使用率数据
    let _this = this;
    $.ajax({
      url : "http://192.168.2.1:8099/cgi-bin/getcpumem.cgi",
      type:'GET',
      async : true,
      // cache:false,
      // xhrFields: {withCredentials: true},
      // crossDomain: true,
      success : (result)=>{
        // console.log("cgi-bin/getcpumem.cgi-----:",result,result.split('\n'));
        let resArr = result.split('\n');
        let memoryDtStr,cpuDtStr_1,cpuDtStr_2;
        resArr.forEach((val)=>{ //解析出内存和两次cpu使用的数据
          if(val.indexOf('Total')!=-1){
            memoryDtStr = val;
          }
          if(val.indexOf('cpu')!=-1 && !cpuDtStr_1){
            cpuDtStr_1 = val;
          }
          if(val.indexOf('cpu')!=-1 && cpuDtStr_1){
            cpuDtStr_2 = val;
          }
        });

        //计算内存使用率。
        let memoryDt = memoryDtStr.split(' ');
        let memoryTotal,memoryUse;
        memoryDt.map((val)=>{
          if(val && $.isNumeric(val) && !memoryTotal){
            memoryTotal = parseInt(val); //总内存数。
          }
          if(val && $.isNumeric(val) && memoryTotal){
            memoryUse = parseInt(val);  //已使用的内存数。
          }
        });
        _this.downloadData.push({
          name:_this.nowTime.toString(),
          value:[ +_this.nowTime,parseInt(memoryUse/memoryTotal*100) ]
        });
        _this.downloadData.splice(0,1);
        //计算cpu使用率情况。
        let cpuDt_1 = cpuDtStr_1.split(' ');
        let cpuDt_2 = cpuDtStr_2.split(' ');
        cpuDt_1 = cpuDt_1.filter((val)=>{
          return (val && $.isNumeric(val));
        });
        cpuDt_2 = cpuDt_2.filter((val)=>{
          return (val && $.isNumeric(val));
        });
        let cpuDtTotal_1=0,cpuDtTotal_2=0; ///计算两次cpu总的时间，相减就是cpu总的使用时间。
        cpuDt_1.forEach((val)=>{cpuDtTotal_1 = cpuDtTotal_1 + parseInt(val)});
        cpuDt_2.forEach((val)=>{cpuDtTotal_2 = cpuDtTotal_2 + parseInt(val)});

        _this.uploadData.push({
          name:_this.nowTime.toString(),
          value:[ +_this.nowTime, parseInt((cpuDt_2[3]-cpuDt_1[3])/(cpuDtTotal_2-cpuDtTotal_1)*100) ]
        });
        _this.uploadData.splice(0,1);
        //跟新曲线图
        _this.uploadChart.setOption({
            series: [{
                data: _this.uploadData
            }]
        });
        _this.downloadChart.setOption({
            series: [{
                data: _this.downloadData
            }]
        });
      }
    });
  }
  getChartsOptions = (obj)=>{
    return {
          title: {
              text: obj.title,
              padding:1,
              itemGap:0, //主副标题之间的间距。
          },
          tooltip: {
              trigger: 'axis',
              formatter: function (params) {
                  params = params[0];
                  return obj.title+': (' + params.value[1]+'%)';
              },
              axisPointer: {
                  animation: false
              }
          },
          xAxis: {
              type: 'time',
              splitLine: {
                  show: false
              }
          },
          yAxis: {
              type: 'value',
              splitLine: {
                  show: false
              },
              axisLabel:{ show:true,
                formatter: '       {value}kb'
              }
          },
          series: [{
              name: '数据',
              type: 'line',
              showSymbol: false,
              hoverAnimation: false,
              areaStyle:{
                normal:{
                  color:obj.title=="上传"?"#6FE4DF":"#67E477",
                  opacity:0.8,
                }
              },
              data: obj.data
          }]
      };
  }

  componentWillUnmount () {
    clearInterval(this.timeInterval);
    this.timeInterval = null;
  }

  render(){

    return (
      <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start'}}>
        <div id="uploadChart" style={{width:'96%',height:'250px'}}></div>
        <div id="downloadChart" style={{width:'96%',height:'250px'}}></div>
      </div>
    )
  }
}
