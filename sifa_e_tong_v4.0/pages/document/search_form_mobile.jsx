import React from 'react';
// import UserStore from 'stores/user_store.jsx';

import { Icon } from 'antd';
import {Popup, List, InputItem, Button} from 'antd-mobile';
import { createForm } from 'rc-form';
import MyWebClient from 'client/my_web_client.jsx';


class SearchFormMobile extends React.Component {
  constructor(props) {
      super(props);
      // let permissionData = UserStore.getPermissionData();
      // let hasOperaPermission = permissionData['document'] ? permissionData['document'].indexOf('action') != -1 : false;
      this.state = {
        hasOperaPermission:true//hasOperaPermission, //是否有操作权限。查询权限应该总是有的
      };
  }
  componentDidMount() {
    this.props.form.resetFields();
  }
  onClickSubmit = ()=>{
    this.props.form.validateFields((error, value) => {
      let params = value || {};
      !params.userName ? delete params.userName : null;
      !params.gender ? delete params.gender : null;
      // console.log("document search form validateFields", error, params);
      this.props.handleSearch(null,Object.assign({},{"from":0,"to":10},param||{}) );
    });
  }

  showSelectGender = (e)=> {
    e.preventDefault();
    const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
    let maskProps;
    if (isIPhone) {
      // Note: the popup content will not scroll.
      maskProps = {
        onTouchStart: e => e.preventDefault(),
      };
    }
    const onMaskClose = () => {
      // console.log('onMaskClose');
    }
    Popup.show( <GenderSelectPopup onClose={this.onPoClose} gender="男"></GenderSelectPopup>, { animationType: 'slide-up', onMaskClose });
  }
  onPoClose = (sel) => {
    this.props.form.setFieldsValue({
      gender:sel
    });
    Popup.hide();
  }
  // onClickDeleteAll = ()=>{ //全部删除
  //   this.props.showDeleteAllConfirm();
  // }
  render() {
    const { getFieldProps } = this.props.form;
    const {departmentFlatMap,currentFileId, currentFileSubId,curDepartmentId} = this.props;
    let fileTypeName = currentFileId&&departmentFlatMap[currentFileId] ? (departmentFlatMap[currentFileId].resourceName||'') : '';
    let fileSubTypeName = currentFileSubId&&departmentFlatMap[currentFileSubId] ? (departmentFlatMap[currentFileSubId].resourceName||'') : '';
    let departmentName = curDepartmentId&&departmentFlatMap[curDepartmentId] ? (departmentFlatMap[curDepartmentId].resourceName||'') : '';

    return (
      <div className="am-doc-list">
        <List>
          {
            fileSubTypeName == '律师事务所'?
            <InputItem clear autoFocus placeholder="请输入律所名称" {...getFieldProps('lawOfficeName')}>律所名称</InputItem>:
            <InputItem clear autoFocus placeholder="请输入姓名" {...getFieldProps('userName')}>姓名</InputItem>
          }
          {
            fileSubTypeName == '律师事务所'?
            <InputItem clear autoFocus placeholder="请输入律所责任人" {...getFieldProps('lawOfficePrincipal')}>律所负责人</InputItem>:
            null
          }
        </List>
        <div style={{ margin: '0.16rem' }}>
          {
            this.state.hasOperaPermission ?
            (<Button type="primary" onClick={this.onClickSubmit}><Icon type="search" /> 搜索</Button>):
            (<span style={{textAlign:'center'}}>没有权限</span>)
          }
        </div>
      </div>
    );
  }
}

class GenderSelectPopup extends React.Component {
  onSel(sel) {
    this.props.onClose(sel);
  }
  render() {
    const genders = ['男', '女'];
    return (
      <div>
        <List className="popup-list" renderHeader={() => (
         <div style={{ position: 'relative' }}>
           选择性别
           <span style={{ position: 'absolute', right: 3, top: -5 }} onClick={() => this.onSel()}>
             <Icon type="cross" />
           </span>
         </div>)}
        >
        {genders.map((i, index) => (
          <List.Item key={index} onClick={() => { this.onSel(i) }}>
            <span>{i} {this.props.gender === i ?
                  <Icon type="check" className="pull-right" style={{ color: "#108ee9", paddingTop: "5px"}} /> :
                  null
                }</span>
          </List.Item>
        ))}
        </List>
      </div>
    )
  }
}

const WrappedSearchFormMobile = createForm()(SearchFormMobile);

export default WrappedSearchFormMobile;
