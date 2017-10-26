import $ from 'jquery';
import React from 'react';

import UserStore from 'stores/user_store.jsx';
import * as Utils from 'utils/utils.jsx';
import myWebClient from 'client/my_web_client.jsx';
import {removeValueFromArr} from 'pages/utils/common_utils.jsx';

import { Modal,SwipeAction,List,Button,Popup } from 'antd-mobile';
import { Row, Col, Icon,notification, Input, Tooltip,message } from 'antd';
const alert = Modal.alert;
import avatorIcon_man from 'images/avator_icon/contact_avator.png';
// import avatorIcon_woman from 'images/avator_icon/avator_woman.png';
notification.config({
  top: 68,
  duration: 3
});

class AddressListMobileComp extends React.Component {
  constructor(props) {
      super(props);
      let permissionData = UserStore.getPermissionData();
      let hasOperaPermission = permissionData['address_book'] ? permissionData['address_book'].indexOf('action') != -1 : false;
      this.state = {
        permissionData:permissionData,
        userId:UserStore.getCurrentUser().id,
        hasOperaPermission:hasOperaPermission, //是否有操作权限。
      };
  }

  componentWillMount(){
  }
  componentDidMount(){
    window.addEventListener("popstate", this.hidePopup);
    // console.log(this.state.userId);
  }
  componentWillReceiveProps(nextProps){
  }
  onClickPrePage = ()=>{ //上一页
    let currentPage = this.props.curPageNum;
    if(currentPage > 1){
      let otherParams = {
        "from":(currentPage-2)*10,
        "to":(currentPage-1)*10,
      };
      this.props.getAddressBookCnt({
        organization:this.props.organization,
        secondaryDirectory:this.props.secondaryDirectory,
        level3Catalog:this.props.level3Catalog,
      },otherParams);
    }
  }
  onClickNextPage = ()=>{ //下一页
    let currentPage = this.props.curPageNum;
    const pageCount = Math.ceil(this.props.totalCount/10);
    if(currentPage < pageCount){
      let otherParams = {
        "from":(currentPage)*10,
        "to":(currentPage+1)*10,
      };
      this.props.getAddressBookCnt({
        organization:this.props.organization,
        secondaryDirectory:this.props.secondaryDirectory,
        level3Catalog:this.props.level3Catalog,
      },otherParams);
    }
  }
  onClickEditItem = (evt,record,index)=>{
    let {groupShortCode, telephoneNumber, landline} = record;
    let teleStr = '';
    if(!groupShortCode && !telephoneNumber &&!landline){
      return;
    }else{
      if($.trim(groupShortCode)){
        if(teleStr){
          teleStr += ',' + $.trim(groupShortCode);
        }else{
          teleStr = $.trim(groupShortCode);
        }
      }

      if($.trim(telephoneNumber)){
        if(teleStr){
          teleStr += ',' + $.trim(telephoneNumber);
        }else{
          teleStr = $.trim(telephoneNumber);
        }
      }
      if($.trim(landline)){
        if(teleStr){
          teleStr += ',' + $.trim(landline);
        }else{
          teleStr = $.trim(landline);
        }
      }
    }
    let teleArr = removeValueFromArr( (teleStr||'').split(",") );
    this.showPopupDialTele(teleArr);
  }
  showPopupDialTele = (teleArr)=>{
    Popup.show(<div>
      <List className="popup-modules_mobile-list">
        {teleArr.map((telenum, index) => (
          <List.Item key={index} style={{margin:'0.6em 0'}}>
            <a href={"tel:"+telenum} style={{textAlign:'center',display:'block'}}>{telenum}</a>
          </List.Item>
        ))}
      </List>
    </div>, { animationType: 'slide-up', maskClosable: true });
  }
  hidePopup = ()=>{
    Popup.hide();
  }
  getCanDialTelephone = (teleStr)=>{
    let teleArr = removeValueFromArr( $.trim(teleStr||'').split(",") );
    let arrLen = teleArr.length;
    return teleArr.map((telenum, index) => (
      <span key={index}>
        <a href={"tel:"+telenum}>{telenum}</a>
        {(index<arrLen-1)?",":""}
      </span>
    ));
  }

  render() {
    const { addressListData } = this.props;

    let cls_name = "addressTableList " + this.props.className;
    return (
      <div className={cls_name}>
        <div style={{ marginBottom: 12 }}>
          {/*this.state.hasOperaPermission ? (
            <div style={{margin:'0.16rem'}}>
                <Button type="primary" onClick={()=>{this.showAddEditDialog('',null,null)}}><Icon type="plus" /> 新增</Button>
            </div>
          ):null*/}
        </div>
        <div className='addressbook_list mobile_addressbook_list' style={{width:'100%'}}>
          <List style={{ margin: '0.1rem 0', backgroundColor: 'white' }}>
            {addressListData.map((record, index) => (
              <List.Item key={index} multipleLine
                onClick={ (evt)=>{this.state.hasOperaPermission ? this.onClickEditItem(evt,record,index) : ''} }>
                <div className="addressbook_row">
                  <span className="addressbook_avator">
                    <img className="member_icon" width="54" height="54" src={this.props.iconArr[index]}/>
                  </span>
                  <div className="addressbook_detail">
                    <div className="member_name">
                      <span>{record.userName}</span>
                      </div>
                      <div className="member_email"><span>集团短码：</span>{this.getCanDialTelephone(record.groupShortCode)}</div>
                      <div className="member_phone"><span>手机号码：</span>{this.getCanDialTelephone(record.telephoneNumber)}</div>
                      <div className="member_phone"><span>座机号码：</span>{this.getCanDialTelephone(record.landline)}</div>
                    </div>
                    <div className="addressbook_right">
                    </div>
                  </div>
                </List.Item>
              )
            )}
          </List>
        </div>
        <div className="mobile_page_cnt">
          <div className="pre_page">
            <Button type="default" onClick={this.onClickPrePage}><Icon type="double-left" /> 上一页</Button>
          </div>
          <div className="page_num">
            <span>{this.props.totalCount>0?this.props.curPageNum:0}</span>/<span>{Math.ceil(this.props.totalCount/10)}</span>
          </div>
          <div className="next_page">
            <Button type="default" onClick={this.onClickNextPage}>下一页<Icon type="double-right" /></Button>
          </div>
        </div>
      </div>
    );
  }
}

AddressListMobileComp.defaultProps = {
  iconArr : [avatorIcon_man,avatorIcon_man,avatorIcon_man,avatorIcon_man, avatorIcon_man, avatorIcon_man,avatorIcon_man,avatorIcon_man,avatorIcon_man,avatorIcon_man, avatorIcon_man,avatorIcon_man,avatorIcon_man,avatorIcon_man]
};

AddressListMobileComp.propTypes = {
  addressListData:React.PropTypes.array,
  showAddEditDialog:React.PropTypes.func,
  afterDeleteContactsCall:React.PropTypes.func,
  className: React.PropTypes.string
};

export default AddressListMobileComp;
