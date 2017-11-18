
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,Sheet,TitleBar,Button, TabPanel,FormPanel, Panel,
  Menu,MenuItem,SelectField,CheckBoxField,TextField,ContainerField } from '@extjs/ext-react';

class NetWirelessMB extends Component{
  state = {
    nameType:'show',
    menuItemVal:'',
  }
  componentDidMount(){
    this.setState({
      bodyHeight:document.documentElement.clientHeight,
      bodyWidth:document.documentElement.clientWidth
    });
  }
  componentWillUnmount () {
  }
  onNameMenuChange = (item)=>{
      this.setState({nameType:item.value});
  }
  render () {
    let {bodyHeight,nameType} = this.state;
    return (
      <div className='' style={{height:(bodyHeight-45)+"px"}}>
        <TabPanel cls='tabpanel_m tabpanel_bottom_m'
            height={'100%'} margin='0 0 60 0'
            tabBar={{ docked: 'bottom' }}
        >
            <Container title="Wi-Fi">
                <div className="cnt">
                  <div className="title">5GHz</div>
                  <Container layout="vbox" >
                      <Container flex={1}>
                        <div style={{'float':'left'}}><CheckBoxField boxLabel={Intl.get('Enable wireless broadcast')} cls="black_label"/></div>
                      </Container>
                      <Container layout={{ type: 'hbox', pack:'left',align:'left'}}>
                        <TextField label={Intl.get('名称')+"(SSID)："}
                          labelTextAlign="left" labelAlign="left" textAlign="right"
                          value="5G"
                          width="75%"
                          cls="black_label auto_width disable_text"/>
                        <Button ui="menu confirm raised" text={Intl.get('Show')} style={{marginRight:'10px'}}>
                           <Menu defaults={{ handler: this.onNameMenuChange, group: 'buttonstyle' }}>
                               <MenuItem text={Intl.get('Show')} value="show" iconCls={nameType === 'show' && 'x-font-icon md-icon-check'}/>
                               <MenuItem text={Intl.get('Hide')} value="hide" iconCls={nameType === 'hide' && 'x-font-icon md-icon-check'}/>
                           </Menu>
                        </Button>
                      </Container>
                      <ContainerField label={Intl.get('Security Level')+"："}
                        labelAlign="left" labelTextAlign="left" textAlign="right"
                        cls="black_label auto_width disable_text">
                        <Button ui="menu" text="高 - WAP2-个人" style={{width:'100%','float':'left'}} textAlign="right" menuAlign="tr-br">
                           <Menu defaults={{ handler: this.onNameMenuChange, group: 'buttonstyle' }}>
                               <MenuItem text="高 - WAP2-个人" value="1" iconCls={nameType === '1' && 'x-font-icon md-icon-check'}/>
                               <MenuItem text="低 - WAP2-个人" value="2" iconCls={nameType === '2' && 'x-font-icon md-icon-check'}/>
                           </Menu>
                        </Button>
                      </ContainerField>

                      <TextField label={Intl.get('Password')+"："}
                      labelTextAlign="left" labelAlign="left" textAlign="right"
                      value="siteview"
                      cls="black_label auto_width disable_text"/>
                      <ContainerField label={Intl.get('Wireless Mode')+"："}
                        labelAlign="left" labelTextAlign="left" textAlign="right"
                        cls="black_label auto_width disable_text">
                        <Button ui="menu" text="an+ac" style={{'float':'left',width:'100%'}} textAlign="right" menuAlign="tr-br">
                           <Menu defaults={{ handler: this.onNameMenuChange, group: 'buttonstyle' }}>
                               <MenuItem text="an+ac" value="1" iconCls={nameType === '1' && 'x-font-icon md-icon-check'}/>
                               <MenuItem text="an+bd" value="2" iconCls={nameType === '2' && 'x-font-icon md-icon-check'}/>
                           </Menu>
                        </Button>
                      </ContainerField>

                      <div style={{color:'#07439e',margin:'10px 0'}}>
                        {Intl.get('Advanced Options')}<span className="x-fa fa-chevron-down"></span>
                      </div>
                  </Container>
                </div>
                {/* 2.4GHz*/}
                <div className="cnt" style={{marginTop:'10px'}}>
                  <div className="title">2.4GHz</div>
                  <Container layout="vbox" >
                      <Container flex={1}>
                        <div style={{'float':'left'}}><CheckBoxField boxLabel={Intl.get('Enable wireless broadcast')} cls="black_label"/></div>
                      </Container>
                      <Container layout={{ type: 'hbox', pack:'left',align:'left'}}>
                        <TextField label={Intl.get('Name')+"(SSID)："}
                          labelTextAlign="left" labelAlign="left" textAlign="right"
                          value="5G"
                          width="75%"
                          cls="black_label auto_width disable_text"/>
                        <Button ui="menu confirm raised"
                          text={Intl.get('Show')}
                          style={{marginRight:'10px'}}>
                           <Menu defaults={{ handler: this.onNameMenuChange, group: 'buttonstyle' }}>
                               <MenuItem text={Intl.get('Show')} value="show" iconCls={nameType === 'show' && 'x-font-icon md-icon-check'}/>
                               <MenuItem text={Intl.get('Hide')} value="hide" iconCls={nameType === 'hide' && 'x-font-icon md-icon-check'}/>
                           </Menu>
                        </Button>
                      </Container>
                      <ContainerField label={Intl.get('Security Level')+"："}
                        cls="black_label auto_width disable_text"
                        labelAlign="left" labelTextAlign="left"
                        textAlign="right">
                        <Button ui="menu" text="高 - WAP2-个人" style={{width:'100%','float':'left'}} textAlign="right" menuAlign="tr-br">
                           <Menu defaults={{ handler: this.onNameMenuChange, group: 'buttonstyle' }}>
                               <MenuItem text="高 - WAP2-个人" value="1" iconCls={nameType === '1' && 'x-font-icon md-icon-check'}/>
                               <MenuItem text="低 - WAP2-个人" value="2" iconCls={nameType === '2' && 'x-font-icon md-icon-check'}/>
                           </Menu>
                        </Button>
                      </ContainerField>

                      <TextField label={Intl.get('Password')+"："}
                        labelTextAlign="left" labelAlign="left"
                        cls="black_label auto_width disable_text"
                        value="siteview"
                        textAlign="right"/>
                      <ContainerField label={Intl.get('Wireless Mode')+"："}
                        cls="black_label auto_width disable_text"
                        labelAlign="left" labelTextAlign="left"
                        textAlign="right">
                        <Button ui="menu" text="an+ac"
                          style={{width:'100%','float':'left'}}
                          textAlign="right" menuAlign="tr-br">
                           <Menu defaults={{ handler: this.onNameMenuChange, group: 'buttonstyle' }}>
                               <MenuItem text="an+ac" value="1"
                                iconCls={nameType === '1' && 'x-font-icon md-icon-check'}/>
                               <MenuItem text="an+bd" value="2"
                                iconCls={nameType === '2' && 'x-font-icon md-icon-check'}/>
                           </Menu>
                        </Button>
                      </ContainerField>

                      <div style={{color:'#07439e',margin:'10px 0'}}>
                        {Intl.get('Advanced Options')}<span className="x-fa fa-chevron-down"></span>
                      </div>
                  </Container>
                </div>
            </Container>
            {/* 可设置右上角的标记文本：badgeText="4" */}
            <Container title="WPS">
              <div>
                <div>您可以使用WPS(Wi-Fi Protected Setup)以在Synology Router 与无线客户端之间共享无线密钥，并通过以下方法之一安全地建立无线网络。</div>
                <div style={{'float':'left'}}>
                  <CheckBoxField boxLabel="启用WPS" cls="wps_tab_checkbox"/>
                </div>
                <Container layout={{ type: 'hbox', pack:'left',align:'left'}}>
                  <div>连接状态：<span>已就绪</span></div>
                  <div style={{marginLeft:'20px'}}>连接类型：<span>2.4GHz</span></div>
                </Container>

              </div>
            </Container>
            {/* 访客网络*/}
            <Container title="访客网络">
              访客网络内容去
            </Container>
            {/* MAC过滤器 */}
            <Container title="MAC过滤器">
              MAC过滤器内容去
            </Container>

        </TabPanel>
      </div>

    );
  }

}

export default NetWirelessMB;
