
import $ from 'jquery';
import React from 'react';
import {Link,browserHistory} from 'react-router/es6';
import UserStore from 'stores/user_store.jsx';

// import * as Utils from 'utils/utils.jsx';
// import myWebClient from 'client/my_web_client.jsx';
import UserLoginRecordComp from 'pages/login_record/userLoginRecord_comp.jsx';
import AdminLoginMobileComp from 'pages/login_record/adminLogin_mobile_comp.jsx';
import { Drawer, NavBar } from 'antd-mobile';
import { Layout, Menu, Icon} from 'antd';
const { SubMenu } = Menu;
const { Sider } = Layout;

import signup_logo from 'images/signup_logo.png';

class LoginRecordMobilePage extends React.Component {
  constructor(props) {
      super(props);
      this.getStateFromStores = this.getStateFromStores.bind(this);
      this.state = this.getStateFromStores();
  }
  getStateFromStores() {
      return {
          open: false,
          position: 'left',
          isAdmin:UserStore.getIsadmin() || false,
      };
  }

  onNavBarLeftClick () {
    browserHistory.goBack();
  }

  handleMenuClick = (item)=>{
    this.setState({current:item.key, open:!this.state.open});
  }
  componentWillMount() {
  }
  onOpenChange = (...args) => {
    console.log(args);
    this.setState({ open: !this.state.open });
  }

  render() {
      const sidebarMobile = (
      <Sider width={240} className="custom_ant_sidebar addressSidebar"
        style={{ background: '#2071a7',color:'#fff', zIndex:'12', overflow: 'hidden' ,
        height:'100%',marginTop:'60px'}}>
        <Menu
          theme="dark"
          mode="inline"
          style={{ width: 246}}
          selectedKeys={[this.state.current]}
          onClick={this.handleMenuClick}
        >
        <Menu.Item key="1" style={{fontSize:'18px'}}><Icon type="file" />登录签到</Menu.Item>
        </Menu>
      </Sider>
    )
    const drawerProps = {
      open: this.state.open,
      position: this.state.position,
      onOpenChange: this.onOpenChange,
    };
    return (
      <div className="login_record_container">
        <div className='office_automation_drawer'>
          <Drawer
            style={{ minHeight: document.documentElement.clientHeight - 200 }}
            touch={true}
            sidebarStyle={{height:'100%',background:'#2071a7',overflow:'hidden'}}
            contentStyle={{ color: '#A6A6A6'}}
            sidebar={sidebarMobile}
            {...drawerProps} >
            <NavBar className="mobile_navbar_custom"
            iconName = {false} onLeftClick={this.onNavBarLeftClick}
            style={{position:'fixed',height:'60px',zIndex:'13',width:'100%'}}
            leftContent={[ <Icon type="arrow-left" className="back_arrow_icon" key={2}/>,
            <span style={{fontSize:'1em'}} key={3}>返回</span>]}
            rightContent={[ <Icon key="6" type="ellipsis" onClick={this.onOpenChange}/>]} >
              <img width="35" height="35" src={signup_logo}/>吉视E通
            </NavBar>
            <div className="loginRecordMobile">{this.state.isAdmin ? (<AdminLoginMobileComp />) : (<UserLoginRecordComp />)}</div>
          </Drawer>
        </div>
      </div>
    );
  }
}

LoginRecordMobilePage.defaultProps = {
};

LoginRecordMobilePage.propTypes = {
};

export default LoginRecordMobilePage;
