
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,Sheet,TitleBar,Button,SegmentedButton, Label,FormPanel, Panel } from '@extjs/ext-react';

import SidebarMobile from './mobiles/SidebarMobile';
import MainContentMobile from './mobiles/MainContentMobile';
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
            {/* 遮罩层*/}
            <div className={displayed ? "mask active" : "mask"}onClick={this.toggleMenu}></div>
            {/* 侧边栏区*/}
            <Container
                cls={displayed ? "sidebar_container active" : "sidebar_container"}
                top='0'
                width="300px"
                height='100%'
                layout="vbox"
                zIndex='100'
            >
              <SidebarMobile
                  displayed={displayed}
                  toggleMenu={this.toggleMenu}
              />
            </Container>
            {/* 主体内容区*/}
            <Container
                cls={displayed ? "cnt_container hide" : "cnt_container"}
                top='0'
                height='100%'
                zIndex='96'
                width={this.state.bodyWidth}
            >
              <MainContentMobile
                  displayed={displayed}
                  toggleMenu={this.toggleMenu}
              />
            </Container>
          </div>
      </div>
    );
  }

}

export default RootMobile;
