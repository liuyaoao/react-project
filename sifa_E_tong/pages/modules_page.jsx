
import * as Utils from 'utils/utils.jsx';

import React from 'react';
import LogOutComp from './components/log_out_comp.jsx'
import * as GlobalActions from 'actions/global_actions.jsx';
import UserStore from 'stores/user_store.jsx';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import TeamStore from 'stores/team_store.jsx';
import BrowserStore from 'stores/browser_store.jsx';
import Constants from 'utils/constants.jsx';
import {sortTeamsByDisplayName} from 'utils/team_utils.jsx';

import OA_icon from 'images/modules_img/OA_icon.png';
import chat_icon from 'images/modules_img/chat_icon.png';
import document_icon from 'images/modules_img/document_icon.png';
import mailList_icon from 'images/modules_img/mailList_icon.png';
import modify_icon from 'images/modules_img/modify_icon.png';
import settings_icon from 'images/modules_img/settings_icon.png';
import signin_icon from 'images/modules_img/signin_icon.png';
import userSetting_icon from 'images/modules_img/userSetting_icon.png';

import ModulesMobileComp  from './modules_comp/modules_mobile_comp.jsx';
import ModulesPcComp  from './modules_comp/modules_pc_comp.jsx';

import {Toast} from 'antd-mobile';
import {Icon} from 'antd';
import myWebClient from 'client/my_web_client.jsx';
import Client from 'client/web_client.jsx';

const notShow_moduleId_inMobile = "1006";
const notShow_moduleId_inPC = "";
// const notShow_moduleId_inPC = "1001"; //真正上线时用这个。
window.timeCount = (new Date()).getTime();

class ChooseModulesPage extends React.Component {
    constructor(props) {
        super(props);
        this.handleGoMatter = this.handleGoMatter.bind(this);
        this.state = {
            localStoreKey4Modules:'S_F_E_T_MODULES_KEY',
            allModulesData:[],
            colsNameCn:[ "标题", "发布日期", "所属类别", "所属单位"], //通知公告的列表项。
            colsNameEn:["fileTitle", "publishTime", "type" ,"unit"],
            tokenunid:'', //登录OA系统获取认证id。
            noticeListData:[],
            randomStr:'',
            oaLoginErrorText: '',
            isMobile: Utils.isMobile(),
            unViewedCount:0, //群聊里的当前频道未读消息数。
            initUserInfo: {
              id:"",
              allow_marketing:false,
              auth_service:"",
              create_at:0,
              delete_at:0,
              email:"",
              email_verified:false,
              failed_attempts:0,
              first_name:"",
              last_activity_at:0,
              last_name:"",
              last_password_update:0,
              last_picture_update:0,
              locale:"zh-CN",
              mfa_active:false,
              mfa_secret:"",
              nickname:"",
              notify_props:{channel:"true",desktop:"all",desktop_sound:"true",email:"true",first_name:"false",mention_keys:"","push":"mention"},
              organizations:"",
              password:"",
              phone:"",
              position:"",
              restrictedUsernames:["all", "channel", "matterbot"],
              roles:"system_user",
              update_at:0,
              username:"",
              oaUserName:"",
              oaPassword:"",
              redressUserName:"",
              redressPassword:"",
              validUsernameChars:"^[a-z0-9\.\-_]+$",
              passwordChange:false,
              effective:true
            }
        };
    }
    componentWillMount() {
      this.getAllModulesData();
      // this.setState({loginUserName:me.username || ''});
    }
    componentDidMount(){
      this.getOALoginInfo();
      let randomStr = Math.random().toString().split('.')[1];
      this.setState({randomStr});
      let _this = this;
      window['handleClickBackBtn'+randomStr] = function (e) {
        // console.log("我监听到了浏览器的返回按钮事件啦");
        if((new Date()).getTime()-window.timeCount>1500){
          window.timeCount = (new Date()).getTime();
          Toast.info("再按一次退出司法E通登录.");
        }else{
          _this.handleLogOut();
        }
      }
      if (window.history && window.history.pushState) {
        setTimeout(()=>{
          // console.log('增加了监听器了！！！！',window['handleClickBackBtn'+randomStr]);
          window.addEventListener("popstate", window['handleClickBackBtn'+randomStr],false);
        },100);
      }
      this.getChatNewMessageNum();
    }
    getOALoginInfo(){
      let me = UserStore.getCurrentUser() || {};
      let loginInfo = localStorage.getItem(OAUtils.OA_LOGIN_INFO_KEY);
      if(me.oaUserName){
        if(loginInfo && me.oaUserName == JSON.parse(loginInfo)['oaUserName']){
          let loginInfoObj = JSON.parse(loginInfo);
          this.setState({tokenunid:loginInfoObj['tockenunid']});
          this.getServerNoticeListData(loginInfoObj['tockenunid']);
          return;
        }
        OAUtils.loginOASystem({oaUserName:me.oaUserName,oaPassword:me.oaPassword}, (res)=>{ //登录OA系统获取认证id。
          // console.log("successCall:"+res);
          res.values['oaUserName'] = me.oaUserName;
          res.values['tokenunid'] = res.values['tockenunid'];
          localStorage.setItem(OAUtils.OA_LOGIN_INFO_KEY,JSON.stringify(res.values));
          this.setState({tokenunid:res.values.tockenunid});
          this.getServerNoticeListData(res.values.tockenunid);
        },(res)=>{
          // console.log("errorCall:"+res);
          this.setState({oaLoginErrorText: res.ErrorText});
        });
      }
    }
    componentWillUnmount(){
      if (window.history && window.history.pushState) {
        setTimeout(()=>{
          // console.log('注销监听器了！！！！',window['handleClickBackBtn'+this.state.randomStr]);
          window.removeEventListener("popstate",window['handleClickBackBtn'+this.state.randomStr],false);
        },100);
      }
    }

    handleLogOut = ()=>{ //处理推出。
      // console.log("我监听到了浏览器的返回按钮事件啦");
      Toast.info(<div><Icon type={'loading'} /><span>  正在退出...</span></div>, 5, null, true);
      myWebClient.removeToken();
      // browserHistory.push('/login');
      GlobalActions.emitUserLoggedOutEvent('/login');
    }

    getAllModulesData(){
      let modulesData = [
        {
          id:"1001",
          name : "OA系统",
          singleclassName:"OAModule",
          iconName : OA_icon,
          tagName:'Link',
          linkTo : "office_automation"
        },
        {
          id:"1002",
          name : "矫正系统",
          singleclassName:"modifyModule",
          iconName : modify_icon,
          tagName:'Link',
          linkTo : "notification"
        },
        {
          id:"1003",
          name : "档案管理",
          singleclassName:"documentModule",
          iconName : document_icon,
          tagName:'Link',
          linkTo : "document",
          canSetPrivilege:true
        },
        {
          id:"1004",
          name : "通讯录",
          singleclassName:"mailListModule",
          iconName : mailList_icon,
          tagName:'Link',
          linkTo : "address_book",
          canSetPrivilege:true
        },
        {
          id:"1005",
          name : "群聊",
          singleclassName:"chatModule",
          iconName : chat_icon,
          tagName:'a',
          onclick:'this.props.handleGoMatter',
          linkTo : "channels",
          canSetPrivilege:true
        },
        {
          id:"1006",
          name : "系统设置",
          singleclassName:"settingsModule",
          iconName : settings_icon,
          tagName:'Link',
          linkTo : "sys_config",
          canSetPrivilege:true
        },
        {
          id:"1007",
          name : "登录签到",
          singleclassName:"signinModule",
          iconName : signin_icon,
          tagName:'Link',
          linkTo : "login_record"
        },
        // {
        //   id:"1008",
        //   name : "测试",
        //   iconName : signin_icon,
        //   tagName:'a',
        //   backColor : "#F15858",
        //   linkTo : ""
        // }
      ]
      if(this.state.isMobile){
        modulesData.push({
          id:"1008",
          name : "个人设置",
          singleclassName:"userSettingModule",
          iconName : userSetting_icon,
          tagName:'Link',
          linkTo : "user_setting"
        });
      }
      this.setState({"allModulesData":modulesData});
    }
    handleGoMatter() {
      // console.log('redirectUserToDefaultTeam');
      GlobalActions.redirectUserToDefaultTeam();
      // browserHistory.push('/siteview/channels/town-square');
    }
    getServerNoticeListData = (tokenunid)=>{ //从服务端获取列表数据
      OAUtils.getNoticeListData({
        tokenunid: tokenunid,
        currentpage:1,
        rootlbunid:'72060E133431242D987C0A80A4124268', //这个是固定的。
        shbz:"1", //表示已通过。这里只获取已通过审核了的。
        viewcolumntitles:this.state.colsNameCn.join(','),
        successCall: (data)=>{
          let {colsNameEn} = this.state;
          let parseData = OAUtils.formatServerListData(colsNameEn, data.values);
          // console.log("get 通知公告的list data:",data,parseData);
          this.setState({
            noticeListData:parseData,
          });
        },
        errorCall: (data)=>{
          this.setState({isLoading:false,isMoreLoading:false});
        }
      });
    }
    getChatNewMessageNum(){ //获取群聊里当前频道的未读消息数。
      const teams = TeamStore.getAll();
      const teamMembers = TeamStore.getMyTeamMembers();
      let teamId = BrowserStore.getGlobalItem('team');

      if (!teams[teamId] && teamMembers.length > 0) {
          let myTeams = [];
          for (const index in teamMembers) {
              if (teamMembers.hasOwnProperty(index)) {
                  const teamMember = teamMembers[index];
                  myTeams.push(teams[teamMember.team_id]);
              }
          }
          if (myTeams.length > 0) {
              myTeams = myTeams.sort(sortTeamsByDisplayName);
              teamId = myTeams[0].id;
          }
      }
      if (teams[teamId]) {
          const channelId = BrowserStore.getGlobalItem(teamId);
          Client.setTeamId(teamId);
          if (channelId) {
            this.countNewMessageNum(channelId);
          } else {
            Client.getChannels((res)=>{
                // console.log("获取所有的频道的信息--：",res);
                let curChannelId='';
                for(let i=0;i<res.length;i++){
                  if(res[i]['name'] == "town-square"){
                    curChannelId = res[i]['id'];
                  }
                }
                this.countNewMessageNum(curChannelId);
            });
              // Client.getChannelByName("town-square",(res)=>{
              //   console.log("获取默认频道的信息--：",res);
              // });
          }
      }

    }
    countNewMessageNum(channelId){ //
      let me = UserStore.getCurrentUser() || {};
      Client.getChannelMember(channelId, me.id, (res)=>{
        // console.log("获取默认频道的最近查看时间--：",res);
        let last_viewed_at = res.last_viewed_at;
        Client.getPostsPage(channelId,0,100,
          (data) => {
            const posts = data.posts;
            const order = data.order;
            let unViewedCount = 0;
            unViewedCount = order.reduce((count, orderId) => {
              const post = posts[orderId];
              if (post.create_at > last_viewed_at &&
                post.user_id !== me.id &&
                post.state !== Constants.POST_DELETED) {
                  return count + 1;
                }
                return count;
              }, 0);
              this.setState({unViewedCount:unViewedCount});
              // console.log("---------getPostsPage----------:", data,unViewedCount);
            },(err) => {}
          );
      });
    }

    render() {
        let {localStoreKey4Modules, allModulesData,initUserInfo} = this.state;
        let finalEle = this.state.isMobile ?
            (<ModulesMobileComp
              initUserInfo={initUserInfo}
              tokenunid={this.state.tokenunid}
              oaLoginErrorText={this.state.oaLoginErrorText}
              localStoreKey4Modules={localStoreKey4Modules}
              allModulesData={allModulesData}
              notShowModuleIdInMobile={notShow_moduleId_inMobile}
              noticeListData={this.state.noticeListData}
              unViewedCount={this.state.unViewedCount}
              handleGoMatter={this.handleGoMatter} />) :
            (<ModulesPcComp
              initUserInfo={initUserInfo}
              tokenunid={this.state.tokenunid}
              oaLoginErrorText={this.state.oaLoginErrorText}
              localStoreKey4Modules={localStoreKey4Modules}
              allModulesData={allModulesData}
              notShowModuleIdInMobile={notShow_moduleId_inMobile}
              notShowModuleIdInPC={notShow_moduleId_inPC}
              noticeListData={this.state.noticeListData}
              unViewedCount={this.state.unViewedCount}
              handleGoMatter={this.handleGoMatter}/>);
        return (
          <div className='' style={{height:'100%'}}>
            {finalEle}
          </div>
        );
    }
}

ChooseModulesPage.defaultProps = {
};
ChooseModulesPage.propTypes = {
    // params: React.PropTypes.object.isRequired
};

export default ChooseModulesPage;
