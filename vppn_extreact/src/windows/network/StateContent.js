
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
      this.nowTime = +new Date();

      this.cpuCharts.setOption(this.getChartsOptions({title:"cpu 使用率",data:this.cpuUseData}));
      this.memoryCharts.setOption(this.getChartsOptions({title:"memory 使用率",data:this.memoryUseData}));
      this.getCpuAndMemoryData();
      this.cpuTimeInterval = setInterval(()=>{
      },2000);

    }
    getCpuAndMemoryData = ()=>{
      $.ajax({
        url : "http://192.168.2.1:8099/cgi-bin/getcpumem.cgi",
        type:'GET',
        async : true,
        // cache:false,
        // xhrFields: {
        //     withCredentials: true
        // },
        // crossDomain: true,
        success : (result)=>{
          console.log("cgi-bin/getcpumem.cgi-----:",result,result.split('\n'));
          let resArr = result.split('\n');

          //计算内存使用率。
          let memoryDt = resArr[0].split(' ');
          let memoryTotal,memoryUse;
          memoryDt.map((val)=>{
            if(val && $.isNumeric(val) && !memoryTotal){
              memoryTotal = parseInt(val); //总内存数。
            }
            if(val && $.isNumeric(val) && memoryTotal){
              memoryUse = parseInt(val);  //已使用的内存数。
            }
          });
          this.memoryUseData.push({
            name:this.nowTime.toString(),
            value:parseInt(memoryUse/memoryTotal*100)
          });
          //计算cpu使用率情况。
          


          this.cpuCharts.setOption({
              series: [{
                  data: this.cpuUseData
              }]
          });
          this.memoryCharts.setOption({
              series: [{
                  data: this.memoryUseData
              }]
          });
        }
      });
    }
    getChartsOptions = (obj)=>{
      return {
            title: {
                text: obj.title
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    params = params[0];
                    var date = new Date(params.name);
                    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
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
                boundaryGap: [0, '100%'],
                splitLine: {
                    show: false
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
                flex={1}
                height={'200px'}
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
            >
              <Container title={Intl.get('Internet')} cls="state_Internet">
                <div style={{margin:'20px'}}>

                </div>
              </Container>
              <Container title={Intl.get('Device List')} cls="state_equipList">
                  <div className="">
                    {Intl.get('Device List')}
                  </div>
              </Container>
              <Container title="CPU" cls="state_CPU">
                  <div id="cpuCharts" style={{width:'700px',height:'180px'}}></div>
              </Container>
              <Container title={Intl.get('Memory')} cls="state_memory">
                  <div id="memoryCharts" style={{width:'700px',height:'180px'}}></div>
              </Container>
            </TabPanel>
        </div>
    )
  }
}
