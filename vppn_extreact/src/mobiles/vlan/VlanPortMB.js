
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,TextField,TitleBar,Button,SelectField,ContainerField,FieldSet,
  Menu,MenuItem, TabPanel,FormPanel, Panel,Grid,Column,RendererCell } from '@extjs/ext-react';

let bootsNodeOptions = [
    { text: '220.168.30.12', value: '220.168.30.12' },
    { text: '220.168.30.1', value: '220.168.30.1' },
    { text: '220.168.30.6', value: '220.168.30.6' }
];

class VlanPortMB extends Component{
  state = {
    menuItemVal:'',
    selectedBootsNode:'220.168.30.12',
    selectedVProxyIp:'',
  }
  dataStore = new Ext.data.Store({
      data: [
        {index:1, name:' Wireless',price:'342.54', priceChange:'mif-wifi-connect icon'},
        {index:2, name:' Internet',price:'342.54', priceChange:'mif-earth icon'}
      ],
      sorters: 'name'
  })
  componentDidMount(){
    this.setState({
      bodyHeight:document.documentElement.clientHeight,
      bodyWidth:document.documentElement.clientWidth
    });
  }
  componentWillUnmount () {
  }

  renderSign = (format, value) => (
      <span style={{ color: value > 0 ? 'green' : value < 0 ? 'red' : ''}}>
          {Ext.util.Format.number(value, format)}
      </span>
  )

  render () {
    let {bodyHeight,selectedVProxyIp} = this.state;
    let {menuItemVal,selectedBootsNode} = this.state;
    let {tabType,myVirtualIp} = this.props;
    let idNum = tabType.split('_')[1];
    let vProxyIpOptions = this.props.vProxyIpArr.map((val)=>{
      return {text:val,value:val};
    });

    return (
      <div className='' style={{height:(bodyHeight-45)+"px"}}>
        <TabPanel cls='tabpanel_m tabpanel_bottom_m'
            height={'100%'}
            tabBar={{ docked: 'bottom' }} scrollable={true}
        >
            <Container title={Intl.get('Remote Router')} padding="10 10 60 10">
                <div style={{margin:'0'}}>
                  <Container
                    layout={{ type: 'vbox', pack: 'left',align:'left'}}>
                    <Container flex={1}>
                      <span className={myVirtualIp?'myVirtualIp':'myVirtualIp no_connected'}>{myVirtualIp?myVirtualIp:'Connect Error!'}</span>
                    </Container>
                    <ContainerField label={Intl.get('Boot Nodes')+'：'} cls="black_label auto_width disable_text" width="100%" layout={'hbox'} labelAlign="left" labelTextAlign="left">
                      <Button ui="menu" text="220.168.30.12" style={{width:'100%','float':'left'}} textAlign="right" menuAlign="tr-br">
                         <Menu defaults={{ handler: this.onBootsNodeSelectChanged, group: 'buttonstyle' }}>
                             <MenuItem text="220.168.30.12" value="1" iconCls={selectedBootsNode === '1' && 'x-font-icon md-icon-check'}/>
                             <MenuItem text="220.168.30.1" value="2" iconCls={selectedBootsNode === '2' && 'x-font-icon md-icon-check'}/>
                         </Menu>
                      </Button>
                    </ContainerField>
                  </Container>
                  <Container layout={{type:'hbox',pack:'center',align:'bottom'}} margin="10 10 10 10">
                      <Button text={Intl.get('close')} ui={'decline alt'} style={{marginRight:'10px'}}></Button>
                      <Button text={Intl.get('refresh')} ui={'confirm alt'} style={{marginLeft:'10px'}}></Button>
                  </Container>
                  <Container layout={{type:'hbox',pack:'space-between',align:'bottom'}} margin="10 10 10 10">
                      <TextField flex={2.5} cls="black_label auto_width" labelAlign="left" label={Intl.get('Virtual')+' IP:'} value=""/>
                      <Container flex={1} layout="hbox"><Button text={Intl.get('Add New')} ui={'confirm alt'}></Button></Container>
                  </Container>
                  <Container height={'100%'}>
                    <Grid store={this.dataStore} shadow grouped style={{minHeight:'400px'}} scrollable={true}>
                        <Column text={Intl.get('state')} width="100" dataIndex="name"/>
                        <Column text={Intl.get('Remote Virtual IP')} width="120" dataIndex="price"/>
                        <Column text={Intl.get('Remote Subnet')} width="100" dataIndex="priceChange"/>
                        <Column text={Intl.get('Link State')} width="100" dataIndex="priceChange"/>
                        <Column text={Intl.get('delay')} width="100" dataIndex="priceChange"/>
                        <Column text={Intl.get('description')} width="100" dataIndex="priceChange"/>
                    </Grid>
                  </Container>
                </div>
            </Container>
            {/* 可设置右上角的标记文本：badgeText="4" */}
            <Container title={Intl.get('vPath')} padding="10 10 60 10">
                <div className="action">
                  <div style={{marginBottom:'10px'}}>
                    { Intl.get('vPath_title',null,{idNum}) }
                  </div>
                  <FieldSet shadow margin="0 0 10 0"
                    layout={{type:'vbox',pack:'left',align: 'bottom'}}
                    defaults={{labelAlign: "placeholder"}}
                    >
                      <TextField placeholder="Enter..." cls="black_label" width="100%" label={Intl.get('Please input keywords or domain or URL')+'：'} required />
                      <ContainerField label={Intl.get('vProxy')+'：'} cls="black_label auto_width disable_text" width="100%" labelAlign="left" >
                        <Button ui="menu" text="220.168.30.12" style={{width:'100%','float':'left'}} textAlign="right" menuAlign="tr-br">
                           <Menu defaults={{ handler: this.onVProxySelectChanged, group: 'buttonstyle' }}>
                               <MenuItem text="220.168.30.12" value="1" iconCls={selectedVProxyIp === '1' && 'x-font-icon md-icon-check'}/>
                               <MenuItem text="220.168.30.1" value="2" iconCls={selectedVProxyIp === '2' && 'x-font-icon md-icon-check'}/>
                           </Menu>
                        </Button>
                      </ContainerField>
                      <Container layout={{type:'hbox',pack:'center',align: 'bottom'}} width="100%" margin="10 10 10 10">
                        <Button ui="menu raised" text={Intl.get("Add")} style={{marginRight:'10px',marginBottom:'2px'}}>
                           <Menu defaults={{ handler: this.onAddTypeChange, group: 'buttonstyle' }}>
                               <MenuItem text="Add" value="" iconCls={menuItemVal === '' && 'x-font-icon md-icon-check'}/>
                               <MenuItem text="Import cloud vPath to 10.100.16.24" value="action" iconCls={menuItemVal === 'action' && 'x-font-icon md-icon-check'}/>
                               <MenuItem text="import from China2World pack" value="decline" iconCls={menuItemVal === 'decline' && 'x-font-icon md-icon-check'}/>
                               <MenuItem text="import from World2China pack" value="confirm" iconCls={menuItemVal === 'confirm' && 'x-font-icon md-icon-check'}/>
                           </Menu>
                        </Button>
                        <Button ui={'confirm alt'} text={Intl.get('Refresh')}/>
                      </Container>
                  </FieldSet>
                  <Container>
                    <Grid store={this.dataStore} shadow grouped style={{minHeight:'400px'}} scrollable={true}>
                        <Column text={Intl.get('domain')} width="120" dataIndex="name"/>
                        <Column text={Intl.get('proxy')} width="100" dataIndex="price"/>
                        <Column text={Intl.get('description')} width="100" dataIndex="priceChange"/>
                    </Grid>
                  </Container>

                </div>

            </Container>
        </TabPanel>
      </div>

    );
  }

}

export default VlanPortMB;
