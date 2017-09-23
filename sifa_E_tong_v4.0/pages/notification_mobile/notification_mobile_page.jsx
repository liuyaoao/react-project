//矫正系统页面--移动端的
import $ from 'jquery';

import React from 'react';
import {Link,browserHistory} from 'react-router/es6';
import UserStore from 'stores/user_store.jsx';
import * as Utils from 'utils/utils.jsx';
import request from 'superagent';
import LogOutComp from 'pages/components/log_out_comp.jsx';
import * as commonUtils from 'pages/utils/common_utils.jsx';

import { Drawer, List, NavBar,Button,Toast } from 'antd-mobile';
import { Layout, Menu, Breadcrumb, Icon,notification} from 'antd';

const { SubMenu } = Menu;
const { Header, Content, Sider ,Footer} = Layout;

// import StatisticalAnalysisComp from 'pages/notification/statisticalAnalysis_comp.jsx'; //统计分析
// import ERecordComp from 'pages/notification/eRecord_comp.jsx'; //电子档案
// import NoticeComp from 'pages/notification/notice_comp.jsx'; //通知公告

import signup_logo from 'images/signup_logo.png';
import logOut_icon from 'images/modules_img/logOut_icon.png';
const Item = List.Item;
const Brief = Item.Brief;
const urlPrefix = 'http://218.77.44.11:10080/CS_JrlService';

notification.config({
  top: 68,
  duration: 3
});
class NotificationMobilePage extends React.Component {
    constructor(props) {
        super(props);
        let menuTabMap = {"notice":0,"tongji":1,"elec_doc":2};
        let arr = location.pathname.split('/');
        let menuTabName = arr[arr.length-1];
        this.state = {
            open: false,
            menuTab:menuTabMap[menuTabName],
            current: ''+(menuTabMap[menuTabName]+1),
            position: 'left',
            userId:'',
            organName:'',
            organFlag:'',
            organListData:[], //矫正的组织结构列表数据。
            loginUserName:'', //矫正系统的登录用户.
            redressOrganId:'', //矫正系统里的组织机构Id.
            noticeListData:null,
            tongjiData:null, //统计分析的数据
            eRecordData:null,//电子档案的数据
            isMobile: Utils.isMobile()
        };
        // this.onNavBarLeftClick = this.onNavBarLeftClick.bind(this);
    }
    componentWillMount() {
      var me = UserStore.getCurrentUser() || {};
      this.setState({loginUserName:me.redressUserName || 'csjz01'});
      //登录矫正系统的接口。
      let params = {
        loginName:`${me.redressUserName || 'csjz01'}`,
        loginPwd:`${me.redressPassword || commonUtils.Base64Encode('2016')}`
      };
      params.loginPwd = commonUtils.Base64Decode(params.loginPwd);
      // let params = {'param':encodeURIComponent(JSON.stringify(params))};
      $.post(`${urlPrefix}/android/datb/login.action`,params,
          (data,state)=>{
              //这里显示从服务器返回的数据
              let res = decodeURIComponent(data);
              try{
                 res = JSON.parse(res);
              }catch(e){
              }
              if(res.respCode != "0"){ //登录失败。
                this.state.isMobile ?
                  Toast.info(res.respMsg, 2, null, false):
                  notification.error({message: '矫正系统登录失败，'+res.respMsg});
              }else{ //登录成功。
                let values = res.values[0];
                this.setState({
                  userId:values.userId,
                  redressOrganId:values.organId, //隶属机构Id。
                  organName:values.organ,  //隶属机构名
                  organFlag:values.flag,  //隶属机构标识级别。组织机构标识：1、市 2、区 3、县 4、乡镇 5、街道
                });
                this.getServerOrganData(values.organId);
                browserHistory.push(location.pathname+'?organId='+values.organId);
              }
              // console.log("矫正系统的登录返回---：",res,state);
          }
      );
    }
    //获取组织机构数据
    getServerOrganData = (organId)=>{
      let params = {organId:organId};
      $.post(`${urlPrefix}/android/datb/getAndroidOrgan.action`,
        params,(data,state)=>{
          let res = decodeURIComponent(data);
          try{
             res = JSON.parse(res);
          }catch(e){
          }
          // console.log("矫正系统的获取的组织机构返回---：",res,state);
          if(res.respCode == "0"){
              let organList = res.values;
              this.setState({ organListData:organList });
          }
      });
    }

    onNavBarLeftClick = () => {
      browserHistory.push('/modules');
    }
    onSidebarMenuClick = (item) => {
      if(item.key==1){
        this.setState({  current: "1",menuTab:0});
        browserHistory.push('/notification_mobile/notice?organId='+this.state.redressOrganId);
      }else if(item.key==2){
        this.setState({  current: "2",menuTab:1});
        browserHistory.push('/notification_mobile/tongji?organId='+this.state.redressOrganId);
      }else if(item.key==3){
        this.setState({  current: "3",menuTab:2});
        browserHistory.push('/notification_mobile/elec_doc?organId='+this.state.redressOrganId);
      }
      this.setState({open:!this.state.open});
    }
    onOpenChange = (...args) => {
      this.setState({ open: !this.state.open });
    }
    render() {
      let sidebarMenuMarTop = this.state.isMobile ? '60px' : '0';
      const sidebarMobile = (
        <Sider width={240} className="custom_ant_sidebar"
          style={{ background: '#2071a7',color:'#fff',overflow: 'auto',
          zIndex:'99999', marginTop:sidebarMenuMarTop, height:'100%'}}>
          <Menu
            theme="dark"
            mode="inline"
            style={{ width: 240}}
            selectedKeys={[this.state.current]}
            onClick={this.onSidebarMenuClick}
          >
            <Menu.Item key="1"><Icon type="file" />通知公告</Menu.Item>
            <Menu.Item key="2"><Icon type="file-text" />统计分析</Menu.Item>
            <Menu.Item key="3"><Icon type="folder" />电子档案</Menu.Item>
          </Menu>
        </Sider>
      );
      let headerName = this.state.menuTab==0 ? "通知公告" : this.state.menuTab==1?"统计分析":"电子档案";
        const drawerProps = {
          open: this.state.open,
          position: this.state.position,
          onOpenChange: this.onOpenChange,
        };
      return (
        <div className="notification_container">
          <div className='notificationPage_drawer'>
            <Drawer
              style={{ minHeight: document.documentElement.clientHeight - 200 }}
              touch={true}
              sidebarStyle={{height:'100%',background:'#2071a7',zIndex:'12',overflow:'hidden'}}
              contentStyle={{ color: '#A6A6A6'}}
              sidebar={sidebarMobile}
              {...drawerProps}
            >
              <NavBar className="mobile_navbar_custom"
              iconName = {false} onLeftClick={this.onNavBarLeftClick}
              style={{position:'fixed',height:'60px',zIndex:'13',width:'100%'}}
              leftContent={[ <Icon type="arrow-left" className="back_arrow_icon" key={192384756}/>,
              <span style={{fontSize:'1em'}} key={13212343653}>返回</span>]}
              rightContent={[ <Icon key="6" type="ellipsis" onClick={this.onOpenChange}/>]} >
                <img width="35" height="35" src={signup_logo} style={{marginRight:15}}/>司法e通
              </NavBar>
              <div className="mobileNotificationHeader"> <h5>{headerName}</h5> </div>
              {this.props.children}
            </Drawer>
          </div>
        </div>
      );
    }
}

NotificationMobilePage.defaultProps = {
};

NotificationMobilePage.propTypes = {
};

export default NotificationMobilePage;