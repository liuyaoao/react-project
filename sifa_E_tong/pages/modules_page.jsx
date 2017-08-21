
import * as Utils from 'utils/utils.jsx';

import React from 'react';
// import {message} from 'antd';
import LogOutComp from './components/log_out_comp.jsx'
// import {browserHistory} from 'react-router/es6';
import * as GlobalActions from 'actions/global_actions.jsx';
import UserStore from 'stores/user_store.jsx';
import * as OAUtils from 'pages/utils/OA_utils.jsx';

import OA_icon from 'images/modules_img/OA_icon.png';
import chat_icon from 'images/modules_img/chat_icon.png';
import document_icon from 'images/modules_img/document_icon.png';
import mailList_icon from 'images/modules_img/mailList_icon.png';
import modify_icon from 'images/modules_img/modify_icon.png';
import settings_icon from 'images/modules_img/settings_icon.png';
import signin_icon from 'images/modules_img/signin_icon.png';

import ModulesMobileComp  from './modules_comp/modules_mobile_comp.jsx';
import ModulesPcComp  from './modules_comp/modules_pc_comp.jsx';

const notShow_moduleId_inMobile = "1006";
const notShow_moduleId_inPC = "";
// const notShow_moduleId_inPC = "1001"; //真正上线时用这个。

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
            isMobile: Utils.isMobile()
        };
    }
    componentWillMount() {
      this.getAllModulesData();
      // this.setState({loginUserName:me.username || ''});
    }
    componentDidMount(){
      let me = UserStore.getCurrentUser() || {};
      if(me.oaUserName){
        OAUtils.loginOASystem({oaUserName:me.oaUserName,oaPassword:me.oaPassword}, (res)=>{ //登录OA系统获取认证id。
          this.setState({tokenunid:res.values.tockenunid});
          this.getServerListData(res.values.tockenunid);
        });
      }
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
      this.setState({"allModulesData":modulesData});
    }
    handleGoMatter() {
      // console.log('redirectUserToDefaultTeam');
      GlobalActions.redirectUserToDefaultTeam();
      // browserHistory.push('/siteview/channels/town-square');
    }
    getServerListData = (tokenunid)=>{ //从服务端获取列表数据
      OAUtils.getNoticeListData({
        tokenunid: tokenunid,
        currentpage:1,
        rootlbunid:'72060E133431242D987C0A80A4124268', //这个是固定的。
        shbz:"1", //表示已通过。这里只获取已通过审核了的。
        viewcolumntitles:this.state.colsNameCn.join(','),
        successCall: (data)=>{
          let {colsNameEn} = this.state;
          let parseData = OAUtils.formatServerListData(colsNameEn, data.values);
          console.log("get 通知公告的list data:",data,parseData);
          this.setState({
            noticeListData:parseData,
          });
        },
        errorCall: (data)=>{
          this.setState({isLoading:false,isMoreLoading:false});
        }
      });
    }
    render() {
        let {localStoreKey4Modules, allModulesData} = this.state;
        let finalEle = this.state.isMobile ?
            (<ModulesMobileComp
              tokenunid={this.state.tokenunid}
              localStoreKey4Modules={localStoreKey4Modules}
              allModulesData={allModulesData}
              notShowModuleIdInMobile={notShow_moduleId_inMobile}
              noticeListData={this.state.noticeListData}
              handleGoMatter={this.handleGoMatter} />) :
            (<ModulesPcComp
              tokenunid={this.state.tokenunid}
              localStoreKey4Modules={localStoreKey4Modules}
              allModulesData={allModulesData}
              notShowModuleIdInMobile={notShow_moduleId_inMobile}
              notShowModuleIdInPC={notShow_moduleId_inPC}
              noticeListData={this.state.noticeListData}
              handleGoMatter={this.handleGoMatter}/>);
        return (
          <div className=''>
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
