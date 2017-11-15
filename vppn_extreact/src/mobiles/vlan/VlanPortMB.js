
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,Sheet,TitleBar,Button,SelectField,ContainerField,Menu,MenuItem, TabPanel,FormPanel, Panel } from '@extjs/ext-react';

let bootsNodeOptions = [
    { text: '220.168.30.12', value: '220.168.30.12' },
    { text: '220.168.30.1', value: '220.168.30.1' },
    { text: '220.168.30.6', value: '220.168.30.6' }
];

class VlanPortMB extends Component{
  state = {
    menuItemVal:'',
    selectedBootsNode:'220.168.30.12',
  }
  componentDidMount(){
    this.setState({
      bodyHeight:document.documentElement.clientHeight,
      bodyWidth:document.documentElement.clientWidth
    });
  }
  componentWillUnmount () {
  }

  render () {
    let {bodyHeight} = this.state;
    let {menuItemVal,selectedBootsNode} = this.state;
    let {contentId,myVirtualIp} = this.props;
    return (
      <div className='' style={{height:(bodyHeight-45)+"px"}}>
        <TabPanel cls='tabpanel_m tabpanel_bottom_m'
            height={'100%'}
            tabBar={{ docked: 'bottom' }}
        >
            <Container title="Remote Router" padding="10 10 10 10">
                <div style={{margin:'0'}}>
                  <Container
                    layout={{ type: 'vbox', pack: 'left',align:'left'}}
                  >
                    <Container flex={1}>
                      <span className={myVirtualIp?'myVirtualIp':'myVirtualIp no_connected'}>{myVirtualIp?myVirtualIp:'Connect Error!'}</span>
                    </Container>
                    <ContainerField label="引导节点：" width="100%" layout={'hbox'} labelAlign="left" labelTextAlign="left" defaults={{labelAlign: 'left'}}>
                      <Button ui="menu" text="220.168.30.12" style={{borderBottom:'1px solid gray',width:'100%','float':'left'}}>
                         <Menu defaults={{ handler: this.onBootsNodeSelectChanged, group: 'buttonstyle' }}>
                             <MenuItem text="220.168.30.12" value="1" iconCls={selectedBootsNode === '1' && 'x-font-icon md-icon-check'}/>
                             <MenuItem text="220.168.30.1" value="2" iconCls={selectedBootsNode === '2' && 'x-font-icon md-icon-check'}/>
                         </Menu>
                      </Button>
                    </ContainerField>
                  </Container>
                  <Container layout={{type:'hbox',pack:'center',align:'bottom'}} margin="10 10 10 10">
                      <Button text={"关闭"} ui={'decline alt'} style={{marginRight:'10px'}}></Button>
                      <Button text={"刷新"} ui={'confirm alt'} style={{marginLeft:'10px'}}></Button>
                  </Container>

                </div>
            </Container>
            {/* 可设置右上角的标记文本：badgeText="4" */}
            <Container title="vPath" >
                <div>Badges <em>(like the 4, below)</em> can be added by setting the <code>badgeText</code> prop.</div>
            </Container>
        </TabPanel>
      </div>

    );
  }

}

export default VlanPortMB;
