
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,Sheet,TitleBar,Button, TabPanel,FormPanel, Panel } from '@extjs/ext-react';

class NetLocalMB extends Component{
  state = {
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
    return (
      <div className='' style={{height:(bodyHeight-45)+"px"}}>
        <TabPanel cls='tabpanel_m tabpanel_bottom_m'
            height={'100%'}
            tabBar={{ docked: 'bottom' }} scrollable={true}
        >
            <Container title="Routine And IPv6" >
                <div>Docking tabs to the bottom will automatically change their style.</div>
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

export default NetLocalMB;
