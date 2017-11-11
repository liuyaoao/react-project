
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,Sheet,TitleBar,Button,SegmentedButton, Label,FormPanel, Panel } from '@extjs/ext-react';

import SidebarMobile from './mobiles/SidebarMobile';
import HeaderPopupsMenu from './mobiles/components/HeaderPopupsMenu';
import MainContentMobile from './mobiles/MainContentMobile';
// Ext.require('Ext.viewport.Viewport');

class RootMobile extends Component{
  state = {
      bodyHeight:500,
      bodyWidth:'100%',
      modal: true, //右边内容是否有遮罩层。
      reveal: false, //是否是侧窗的形式，就是是否同时把右边的内容往右推。
      displayed: false,
      popupsDisplayed:false,
      contentId:'VlanWindow', //默认显示的模块Id.
  }
  componentDidMount(){
    $("body").css("overflow-y","hidden");
    this.setState({
      bodyHeight:document.documentElement.clientHeight,
      bodyWidth:document.documentElement.clientWidth
    });
  }

  toggleSidebar = () => {
      this.setState({
          displayed: !this.state.displayed
      })
  }
  onSelectMenuItem = (id)=>{
    this.setState({
      contentId:id
    });
  }
  onShowHeaderPopup = ()=>{
    this.setState({popupsDisplayed:true});
  }
  componentWillUnmount () {
  }

  render () {
    const { contentId,displayed, modal, reveal } = this.state;

    return (
      <div className="phone_root_container" style={{width:this.state.bodyWidth+'px',height:this.state.bodyHeight+'px'}}>
        <div>
            {/* 遮罩层*/}
            <div className={displayed ? "mask active" : "mask"}onClick={this.toggleSidebar}></div>
            {/* 侧边栏区*/}
            <Container
                cls={displayed ? "sidebar_container active" : "sidebar_container"}
                top='0'
                width="300px"
                height='100%'
                layout="vbox"
                zIndex='110'
            >
              <SidebarMobile
                  contentId={contentId}
                  displayed={displayed}
                  toggleSidebar={this.toggleSidebar}
                  onSelectMenuItem={this.onSelectMenuItem}
                  onShowHeaderPopup={this.onShowHeaderPopup}
              />
            </Container>
            {/* 全局popups菜单*/}
            <HeaderPopupsMenu
              popupsDisplayed={this.state.popupsDisplayed}
              onHideHeaderPopup={()=>this.setState( {popupsDisplayed:false} )}
            />
            {/* 主体内容区*/}
            <div
                className={displayed ? "cnt_container folded" : "cnt_container"}
                style={{width:this.state.bodyWidth+"px"}}
            >
              <MainContentMobile
                  contentId={contentId}
                  displayed={displayed}
                  toggleSidebar={this.toggleSidebar}
              />
            </div>
          </div>
      </div>
    );
  }

}

export default RootMobile;
