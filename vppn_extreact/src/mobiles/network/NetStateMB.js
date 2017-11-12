
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,Menu,MenuItem,TextField,TitleBar,Button,
  TabBar,Tab,TabPanel,FormPanel, Panel } from '@extjs/ext-react';

  Ext.require('Ext.field.InputMask');
  Ext.require('Ext.Toast');
class NetStateMB extends Component{
  state = {
    networkType:'Internet连接-IPv4',
    wifiType:'Wi-Fi 5GHz',
  }
  componentDidMount(){
    this.setState({
      bodyHeight:document.documentElement.clientHeight,
      bodyWidth:document.documentElement.clientWidth
    });
  }
  onNetworkTypeChange = (item)=>{
    this.setState({
      networkType:item.value
    });
  }
  onWifiTypeChange = (item)=>{
    this.setState({ wifiType: item.value});
  }
  componentWillUnmount () {
  }

  render () {
    let {networkType,wifiType,bodyHeight} = this.state;
    return (
      <div className='' style={{height:(bodyHeight-45)+"px"}}>
        <Container layout="vbox" padding="10 10 10 10">
          <Container layout="vbox">
            <Button textAlign="left" ui="raised" text={networkType}>
              <Menu defaults={{ handler: this.onNetworkTypeChange, group: 'buttonstyle' }}>
                  <MenuItem text="Internet连接-IPv4"
                    value="Internet连接-IPv4"
                    iconCls={networkType === 'Internet连接-IPv4' && 'x-font-icon md-icon-check'}
                  />
                  <MenuItem text="Internet连接-IPv6"
                    value="Internet连接-IPv6"
                    iconCls={networkType === 'Internet连接-IPv6' && 'x-font-icon md-icon-check'}
                  />
              </Menu>
            </Button>
            <div style={{height:'24px',color:'green',fontSize:'20px',margin:'8px 0 0 0'}}>
              <i className="big check circle outline icon"></i> 已联机
            </div>
            <TextField labelAlign="left" ui="disabled-ui" label="IP 地址" value="192.168.1.9" disabled/>
            <TextField labelAlign="left" ui="disabled-ui" label="网关" value="192.168.1.1" disabled/>
            <TextField labelAlign="left" ui="disabled-ui" label="DNS Server" value="192.168.1.1" disabled/>
          </Container>
          {/* wifi 类型*/}
          <Container layout="vbox" margin="10 0 0 0">
            <Button textAlign="left" ui="raised" text={wifiType}>
              <Menu defaults={{ handler: this.onWifiTypeChange, group: 'buttonstyle' }}>
                  <MenuItem text="Wi-Fi 5GHz"
                    value="Wi-Fi 5GHz"
                    iconCls={wifiType === "Wi-Fi 5GHz" && 'x-font-icon md-icon-check'}
                  />
                  <MenuItem text="Wi-Fi 2.4GHz"
                    value="Wi-Fi 2.4GHz"
                    iconCls={wifiType === 'Wi-Fi 2.4GHz' && 'x-font-icon md-icon-check'}
                  />
              </Menu>
            </Button>
            <div className="small ui toggle checkbox" style={{margin:'8px 0 0 0'}}>
              <input type="checkbox" name="public"/>
              <label> on</label>
            </div>
            <TextField labelAlign="left" label="名称（SSID）" value="Synology 5G" disabled/>
            <TextField labelAlign="left" label="安全模式" value="WAP-个人，AES" disabled/>
            <TextField labelAlign="left" label="MAC地址" value="00:11:32:53:bd:50" disabled/>
          </Container>

          <TabPanel cls="tabpanel_m"
              height={'100%'}
              margin="10 0 0 0"
          >
              <Container title="互联网" >
                <div>上传.</div>
                <div>下载.</div>
              </Container>
              {/* 可设置右上角的标记文本：badgeText="4" */}
              <Container title="设备列表" >
                  <div>Badges <em>(like the 4, below)</em> can be added by setting the <code>badgeText</code> prop.</div>
              </Container>
              <Container title="CPU" >
                  <div>Badges <em>(like the 4, below)</em> can be added by setting the <code>badgeText</code> prop.</div>
              </Container>
              <Container title="内存" >
                  <div>Badges <em>(like the 4, below)</em> can be added by setting the <code>badgeText</code> prop.</div>
              </Container>
          </TabPanel>

        </Container>

      </div>

    );
  }

}

export default NetStateMB;
