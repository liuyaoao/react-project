//通知公告的详情页.
import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import * as OAUtils from 'pages/utils/OA_utils.jsx';

import { WingBlank, WhiteSpace, Button, InputItem, NavBar,
  TextareaItem,Flex,DatePicker,List} from 'antd-mobile';

import DetailContentComp from './detailContent_comp.jsx';
import CommonSendComp from '../common_send_comp.jsx';
import CommonVerifyComp from '../common_verify_comp.jsx';
import {Icon} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';


const zhNow = moment().locale('zh-cn').utcOffset(8);
class Notice_DetailComp extends React.Component {
  constructor(props) {
      super(props);
      this.onNavBarLeftClick = this.onNavBarLeftClick.bind(this);
      this.state = {
        hidden: false,
        selectedTab:'',
        curSubTab:'content',
      };
  }
  componentWillMount(){
  }
  onNavBarLeftClick = (e) => {
    this.props.backToTableListCall();
  }
  onBackDetailCall = ()=>{
    this.setState({curSubTab:'content'});
  }
  onClickAddSave = ()=>{ //点击了保存
    //TODO
    this.setState({
      selectedTab: 'saveTab',
    });
    this.props.backToTableListCall();
  }


  render() {
    return (
      <div className={"oa_detail_container ds_detail_container"}>
        <NavBar className="mobile_navbar_custom"
          style={{position:'fixed',height:'60px',zIndex:'13',width:'100%',top:0}}
          iconName = {false} onLeftClick={this.onNavBarLeftClick}
          leftContent={[
            <Icon type="arrow-left" className="back_arrow_icon" key={2}/>,
            <span key={1}>返回</span>
          ]} >
          车辆申请(修改)
        </NavBar>
        <div style={{marginTop:'60px'}}>
          {this.state.curSubTab == "content"?
            (<AddEditContentComp detailInfo={this.props.detailInfo}/>):null}
        </div>

        {this.state.curSubTab == "send"? (<CommonSendComp
          tokenunid={this.props.tokenunid}
          backDetailCall={this.onBackDetailCall} isShow={true}/>):null}
        {this.state.curSubTab == "verify"?
          (<CommonVerifyComp
            tokenunid={this.props.tokenunid}
            backDetailCall={this.onBackDetailCall}
            isShow={true}/>):
          null}
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
          hidden={this.state.hidden}
        >
          <TabBar.Item
            title="保存"
            key="保存"
            icon={ <Icon type="save" style={{fontSize:'0.4rem'}}/> }
            selectedIcon={<Icon type="save" style={{color:'blue',fontSize:'0.4rem'}}/>}
            selected={this.state.selectedTab === 'saveTab'}
            onPress={() => this.onClickAddSave()}
          >
          <div></div>
          </TabBar.Item>
          <TabBar.Item
            title="阅文意见"
            key="阅文意见"
            icon={ <Icon type="edit" style={{fontSize:'0.4rem'}} /> }
            selectedIcon={<Icon type="edit" style={{color:'blue', fontSize:'0.4rem'}}/>}
            selected={this.state.selectedTab === 'verifyTab'}
            onPress={() => {
              this.setState({
                curSubTab:'verify',
                selectedTab: 'verifyTab',
              });
            }}
          >
          <div></div>
          </TabBar.Item>
          <TabBar.Item
            title="发送"
            key="发送"
            icon={ <Icon type="export" style={{fontSize:'0.4rem'}} /> }
            selectedIcon={<Icon type="export" style={{color:'blue', fontSize:'0.4rem'}}/>}
            selected={this.state.selectedTab === 'sendTab'}
            onPress={() => {
              this.setState({
                curSubTab:'send',
                selectedTab: 'sendTab',
              });
            }}
          >
          <div></div>
          </TabBar.Item>
        </TabBar>
      </div>
    )
  }
}

Notice_DetailComp.defaultProps = {
};

Notice_DetailComp.propTypes = {
  backToTableListCall:React.PropTypes.func,
  // isShow:React.PropTypes.bool,
};

export default Notice_DetailComp;
