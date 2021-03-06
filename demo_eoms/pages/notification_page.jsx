//矫正系统页面
import $ from 'jquery';

import React from 'react';
import {Link,browserHistory} from 'react-router/es6';
import UserStore from 'stores/user_store.jsx';
import * as Utils from 'utils/utils.jsx';
import LogOutComp from './components/log_out_comp.jsx';
import * as commonUtils from 'pages/utils/common_utils.jsx';

import { Drawer, List, NavBar,Button,Toast } from 'antd-mobile';
import { Layout, Menu, Breadcrumb, Icon,notification} from 'antd';

const { SubMenu } = Menu;
const { Header, Content, Sider ,Footer} = Layout;

import StatisticalAnalysisPcComp from './notification/statisticalAnalysis_pc_comp.jsx'; //统计分析
import ERecordisPcComp from './notification/eRecord_pc_comp.jsx'; //电子档案
import NoticePcComp from './notification/notice_pc_comp.jsx'; //通知公告

import signup_logo from 'images/signup_logo.png';
import logOut_icon from 'images/modules_img/logOut_icon.png';
const Item = List.Item;
const Brief = Item.Brief;
const urlPrefix = 'http://218.77.44.11:10080/CS_JrlService';

notification.config({
  top: 68,
  duration: 3
});
class NotificationPage extends React.Component {
    constructor(props) {
        super(props);
        this.getStateFromStores = this.getStateFromStores.bind(this);
        this.state = this.getStateFromStores();
        this.onNavBarLeftClick = this.onNavBarLeftClick.bind(this);
    }
    getStateFromStores() {
        return {
            open: false,
            menuTab:0,
            current: '1',
            position: 'left',
            userId:'',
            organName:'',
            organFlag:'',
            organListData:[], //矫正的组织结构列表数据。
            loginUserName:'', //矫正系统的登录用户.
            redressOrganId:'', //矫正系统里的组织机构Id.
            tongjiData:null, //统计分析的数据
            isMobile: Utils.isMobile()
        };
    }
    onNavBarLeftClick = () => {
      browserHistory.goBack();
    }
    onSidebarMenuClick = (item) => {
      if(item.key==1){
        this.setState({  current: "1",menuTab:0}); }
      else if(item.key==2){
        this.setState({  current: "2",menuTab:1});
      }else if(item.key==3){
        this.setState({  current: "3",menuTab:2});
      }
      this.setState({open:!this.state.open});
    }
    onClickBackToModules(){
      browserHistory.goBack();
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
              }
              // console.log("矫正系统的登录返回---：",res,state);
          }
      );
    }
    onOpenChange = (...args) => {
      // console.log(args);
      this.setState({ open: !this.state.open });
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
    getServerAnalysisData = (organId,currentIndex)=>{
      $.post(`${urlPrefix}/android/manager/getTongJiList.action`,
        {organId:organId},(data,state)=>{
          let res = decodeURIComponent(data);
          try{
             res = JSON.parse(res);
          }catch(e){
          }
          // console.log("矫正系统的获取统计分析的返回---：",res,state);
          if(res.respCode != "0"){
            this.state.isMobile ?
              Toast.info(res.respMsg, 2, null, false):
              notification.error({message: '获取统计分析数据失败，'+res.respMsg});
          }else{
            let valueObj = res.values[0];
            this.setState({ tongjiData:valueObj });
          }
      });
    }

    parseServerListData = (values)=>{
      for(let i=0;i<values.length;i++){
        values[i]['key'] = values[i].id || values[i].identity;
      }
      return values;
    }

    getContentElements(){
      if(this.state.menuTab==0){ // 通知公告
        return (<NoticePcComp redressOrganId={this.state.redressOrganId}/>);
      }else if(this.state.menuTab==1){ //统计分析
        if(this.state.redressOrganId && !this.state.tongjiData){
          this.getServerAnalysisData(this.state.redressOrganId,1);
        }
        return (<StatisticalAnalysisPcComp
          getServerAnalysisData={this.getServerAnalysisData}
          redressOrganId={this.state.redressOrganId}
          tongjiData={this.state.tongjiData} />);
      }else if(this.state.menuTab==2){ //电子档案
        return (<ERecordisPcComp
          redressOrganId={this.state.redressOrganId}
          organListData={this.state.organListData} />);
      }
      return null;
    }
    render() {
      let sidebarMenuMarTop = this.state.isMobile ? '60px' : '0';
      const sidebar = (
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
      let content = this.getContentElements();
      let headerName = this.state.menuTab==0 ? "通知公告" : this.state.menuTab==1?"统计分析":"电子档案";
      return (
        <div className="notification_container">
          <div>
            <Layout style={{ height: '100vh' }}>
               <Header className="header custom_ant_header"
               style={{position:'fixed',width:'100%',zIndex:'13'}}>
                 <div className="custom_ant_header_logo" onClick={this.onClickBackToModules}>
                   <span className="logo_icon"><img width="40" height="40" src={signup_logo}/></span>
                   <div className="logo_title">
                     <p>@{this.state.loginUserName}</p><p>司法E通</p>
                     </div>
                 </div>
                 <div className="notificationHeader"> <h5>{headerName}</h5> </div>
                 <div className="" style={{position:'absolute',right:'32px',top:'0'}}><LogOutComp className="" addGoBackBtn/></div>
               </Header>
               <Layout style={{marginTop:'64px',height: '100%'}}>
                 {sidebar}
                 <Layout style={{ padding: '0' }}>
                   <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280,overflow: 'initial' }}>
                     {content}
                   </Content>
                 </Layout>
               </Layout>
            </Layout>
          </div>
        </div>
      );
    }
}

NotificationPage.defaultProps = {
};

NotificationPage.propTypes = {
};

export default NotificationPage;
