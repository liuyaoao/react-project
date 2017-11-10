
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,Sheet,TitleBar,Button,SegmentedButton, Label,FormPanel, Panel } from '@extjs/ext-react';

import SidebarMobile from './mobiles/SidebarMobile';
// Ext.require('Ext.viewport.Viewport');

class RootMobile extends Component{
  state = {
      bodyHeight:500,
      bodyWidth:'100%',
      modal: true, //右边内容是否有遮罩层。
      reveal: false, //是否是侧窗的形式，就是是否同时把右边的内容往右推。
      displayed: false
  }
  componentDidMount(){
    this.setState({
      bodyHeight:document.documentElement.clientHeight,
      bodyWidth:document.documentElement.clientWidth
    });
  }

  toggleMenu = () => {
      this.setState({
          displayed: !this.state.displayed
      })
  }
  componentWillUnmount () {
  }

  render () {
    const { displayed, modal, reveal } = this.state;

    return (
      <div className="phone_root_container" style={{width:this.state.bodyWidth+'px',height:this.state.bodyHeight+'px'}}>
        <div>
            <div style={{zIndex:'99',width:'100%',height:'100%',position:'absolute'}}
              className={displayed ? "mask active" : "mask"}
              onClick={this.toggleMenu}
            ></div>
              <Container
                  cls={displayed ? "sidebar_container active" : "sidebar_container"}
                  top='0'
                  width="300px"
                  height='100%'
                  layout="vbox"
                  zIndex='100'
                  padding="15 0"
              >
                <SidebarMobile
                  toggleMenu={this.toggleMenu}
                />
              </Container>

              <Container
                  cls={displayed ? "cnt_container hide" : "cnt_container"}
                  top='0'
                  height='100%'
                  zIndex='96'
                  width={this.state.bodyWidth}
              >
                <Panel layout={{type: 'vbox', align: 'left'}} margin="20 0 0 0" padding="15" shadow>
                  <div><b>Sheet</b> is a component which allows you to easily display sliding menus from any side of the screen. You can show the menu by clicking the "Show Menu" button below or by swiping from the edge of the screen.</div>
                  <Button
                      ui="action"
                      enableToggle={true}
                      pressed={displayed}
                      text={displayed ? 'Hide Menu' : 'Show Menu'}
                      onTap={this.toggleMenu}
                  />

                </Panel>
              </Container>
          </div>
      </div>
    );
  }

}

export default RootMobile;
