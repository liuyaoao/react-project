import $ from 'jquery';
import React from 'react';

import UserStore from 'stores/user_store.jsx';
import * as Utils from 'utils/utils.jsx';
import myWebClient from 'client/my_web_client.jsx';

import { Modal,SwipeAction,List,Button,Popup } from 'antd-mobile';
import { Row, Col, Icon,notification, Input, Tooltip,message } from 'antd';
const alert = Modal.alert;
import avatorIcon_man from 'images/avator_icon/avator_man.png';
import avatorIcon_woman from 'images/avator_icon/avator_woman.png';
notification.config({
  top: 68,
  duration: 3
});

class AddressListMobileComp extends React.Component {
  constructor(props) {
      super(props);
      this.showAddEditDialog = this.showAddEditDialog.bind(this);
      this.showDeleteConfirmDialog = this.showDeleteConfirmDialog.bind(this);
      this.confirmDeleteContacts = this.confirmDeleteContacts.bind(this);
      let permissionData = UserStore.getPermissionData();
      let hasOperaPermission = permissionData['address_book'].indexOf('action') != -1;
      this.state = {
        isModalOpen:false,
        permissionData:permissionData,
        hasOperaPermission:hasOperaPermission, //是否有操作权限。
        currentPage:1, //当前页。
      };
  }

  componentWillMount(){
  }
  componentDidMount(){
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.addressListData.length != this.props.addressListData.length){
      this.setState({currentPage:1});
    }
  }
  onClickDeleteContact = (text,record)=>{
  }
  onClickEditItem = (evt,record,index)=>{
    // console.log("点击编辑通讯录的事件--evt-：",evt,$(evt.target));
    if($(evt.target).closest(".addressbook_right").length>0){
      evt.stopPropagation();
      return false;
    }
    this.showAddEditDialog('',record,index);
  }
  showAddEditDialog(text,record,index){
    // console.log("text:"+text+"index:"+index);
    let data = record || {};
    this.props.showAddEditDialog(data);
  }
  showDeleteConfirmDialog = (record)=>{
    let selectedIds = record.id ? [record.id] : [];
    alert('删除', '确定删除么?', [
      { text: '取消', onPress: () => console.log('cancel') },
      { text: '确定', onPress: () => this.confirmDeleteContacts(selectedIds) },
    ]);
  }
  confirmDeleteContacts(contactsIds){ //删除用户
    if(!contactsIds || contactsIds.length<=0){ return; }
    contactsIds = contactsIds.join(',');
    console.log('ok',contactsIds);
    myWebClient.deleteContacts(contactsIds,
      (data,res)=>{
        notification.success({message: '联系人删除成功！'});
        console.log("联系人删除成功：",data);
        this.props.afterDeleteContactsCall();
      },(e,err,res)=>{
        notification.error({message: '联系人删除失败！'});
        console.log("delete 联系人 fialed!", err);
      }
    );
  }

  // onClickDeleteAll = ()=>{
  //   alert('删除', '确定全部删除吗?', [
  //     { text: '取消', onPress: () => console.log('cancel') },
  //     { text: '确定', onPress: () => this.confirmDeleteAllContacts() },
  //   ]);
  // }
  // confirmDeleteAllContacts(){ //删除所有用户
  //   myWebClient.deleteAllContacts(
  //     (data,res)=>{
  //       notification.success({message: '全部联系人删除成功！'});
  //       console.log("联系人删除成功：",data);
  //       this.props.afterDeleteContactsCall();
  //     },(e,err,res)=>{
  //       notification.error({message: '全部联系人删除失败！'});
  //     }
  //   );
  // }
  onClickPrePage = ()=>{ //上一页
    let currentPage = this.state.currentPage;
    if(currentPage > 1){
      this.setState({
        currentPage:currentPage-1,
      });
    }
  }
  onClickNextPage = ()=>{ //下一页
    let currentPage = this.state.currentPage;
    const pageCount = Math.ceil(this.props.addressListData.length/10);
    if(currentPage < pageCount){
      this.setState({
        currentPage:currentPage+1,
      });
    }
  }
  getTelephoneDialEles= (telephoneNumber)=>{ //构造可直接拨号的视图。
    if(!telephoneNumber){ return; }
    let teleArr = (telephoneNumber||'').split(",");
    if(teleArr.length==1){
      return (<a href={"tel:"+telephoneNumber}>
                <Icon type="phone" style={{fontSize:'0.6rem',fontWeight:'bold',color:'#189A09'}}/>
              </a>);
    }else if(teleArr.length>1){
      return (<a href="#" onClick={()=>{this.showPopupDialTele(teleArr)}}>
                <Icon type="phone" style={{fontSize:'0.6rem',fontWeight:'bold',color:'#189A09'}}/>
              </a>);
    }
    return null;
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

  handleDialTeleMenuClick = (item,key,keyPath)=>{

  }

  render() {
    const { currentPage } = this.state;
    const { addressListData } = this.props;
    const totalCount = addressListData.length;
    const pageCount = Math.ceil(addressListData.length/10);
    let curPageData = addressListData.slice(10*(currentPage-1), 10*currentPage);

    let cls_name = "addressTableList " + this.props.className;
    return (
      <div className={cls_name}>
        <div style={{ marginBottom: 12 }}>
          {this.state.hasOperaPermission ? (
            <div style={{margin:'0.16rem'}}>
                <Button type="primary" onClick={()=>{this.showAddEditDialog('',null,null)}}><Icon type="plus" /> 新增</Button>
            </div>
          ):null}
        </div>
        <div className='addressbook_list mobile_addressbook_list' style={{width:'100%'}}>
          <List style={{ margin: '0.1rem 0', backgroundColor: 'white' }}>
            {curPageData.map((record, index) => (
              <SwipeAction key={index} style={{ backgroundColor: '#f3f3f3' }}
                autoClose
                disabled={this.state.hasOperaPermission ? false : true}
                right={[
                  {
                    text: '取消',
                    onPress: () => console.log('cancel'),
                    style: { backgroundColor: '#ddd', color: 'white' },
                  },
                  {
                    text: '删除',
                    onPress: ()=>{this.showDeleteConfirmDialog(record)},
                    style: { backgroundColor: '#F4333C', color: 'white' },
                  },
                ]}
                onOpen={() => console.log('global open')}
                onClose={() => console.log('global close')}
                >
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
                        <div className="member_email"><span>电话短号：</span>{record.groupShortCode}</div>
                        <div className="member_phone"><span>电话号码：</span>{record.telephoneNumber}</div>
                      </div>
                      <div className="addressbook_right">
                        {this.getTelephoneDialEles(record.telephoneNumber)}
                      </div>
                    </div>
                </List.Item>
              </SwipeAction>
              )
            )}
          </List>
        </div>
        <div className="mobile_page_cnt">
          <div className="pre_page">
            <Button type="default" onClick={this.onClickPrePage}><Icon type="double-left" /> 上一页</Button>
          </div>
          <div className="page_num">
            <span>{pageCount>0?currentPage:0}</span>/<span>{pageCount}</span>
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
  iconArr : [avatorIcon_man,avatorIcon_woman, avatorIcon_man, avatorIcon_man,avatorIcon_man,avatorIcon_woman,avatorIcon_man,avatorIcon_man, avatorIcon_man,avatorIcon_man,avatorIcon_man,avatorIcon_man]
};

AddressListMobileComp.propTypes = {
  addressListData:React.PropTypes.array,
  showAddEditDialog:React.PropTypes.func,
  afterDeleteContactsCall:React.PropTypes.func,
  className: React.PropTypes.string
};

export default AddressListMobileComp;
