//用户信息新增和编辑界面
import $ from 'jquery';
import React from 'react';
import myWebClient from 'client/my_web_client.jsx';
import { Row, Col, Form, Input, Button as ButtonPc ,notification,Modal,message } from 'antd';
  import * as commonUtils from '../utils/common_utils.jsx';
const FormItem = Form.Item;
message.config({
  top: 75,
  duration: 2,
});
notification.config({
  top: 68,
  duration: 3
});
const defaultUserPassword = "qd06ueb3r9g7n4u";

class EditUserInfoDialog extends React.Component {
  constructor(props) {
      super(props);
      this.showModal = this.showModal.bind(this);
      this.closeDialog = this.closeDialog.bind(this);
      this.checkUserNameExist = this.checkUserNameExist.bind(this);
      this.state = {
        loading: false,
        visible: false,
        confirmDirty:false,
        menberInfo:{},
        donNeedParams : ['key','confirmPassword'],
      };
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.visible && nextProps.menberInfo){
      this.setState({menberInfo:nextProps.menberInfo});
    }
    if(!nextProps.visible){
      this.props.form.resetFields();
      this.setState({menberInfo:{},treeSelectValue:[]});
    }
  }

  showModal = () => {
    this.setState({visible: true});
  }

  closeDialog = ()=>{
    this.setState({ loading: false});
    this.props.closeDialogCall();
  }

  handleCancel = () => {
    this.setState({ visible: false,loading:false });
    this.props.closeDialogCall();
  }
  handleAddOrEdit = () => {
    this.setState({ loading: true });
    let form = this.props.form;
    this.props.form.validateFieldsAndScroll((err, values) => {
        this.setState({ loading: false});
        if (!err) {
          this.realSubmit();
        }
    });
  }
  realSubmit(){
    let submitInfo = this.props.form.getFieldsValue();
    // console.log("修改用户自己信息的submitInfo参数--：",submitInfo);
    submitInfo.id=this.props.menberInfo.id;
    // submitInfo.organizations = this.getOrganizationsStr();
    let params = Object.assign({}, this.props.initUserInfo, this.props.menberInfo,submitInfo);
    this.onlyUpdatePassword(submitInfo);
    params = this.parseSendServerParams(params);
    params = this.encryptOtherPassword(params);
    myWebClient.addOrEditUser("update",params,
      (data,res)=>{
        this.handleAfterAddEditSucc();
        notification.success({message: '修改用户成功！'});
      },(e,err,res)=>{
        this.setState({ confirmDirty: false });
        this.closeDialog();
        notification.error({message: '修改用户失败！'});
        console.log("addNewUser e--res--: ",e,res);
      });
  }
  onlyUpdatePassword(params){// 仅修改密码
    if(params.password!=params.confirmPassword || params.password==defaultUserPassword){
      return;
    }
    let newPassword = {
      password:commonUtils.Base64Encode(params.password),
      userid:params.id
    };
    myWebClient.modifyUserPassword(newPassword,
      (data,res)=>{
      },(e,err,res)=>{
        this.setState({ confirmDirty: false });
      });
  }
  handleAfterAddEditSucc = ()=>{
    this.setState({ confirmDirty: false });
    this.props.afterAddEditUserCall && this.props.afterAddEditUserCall();
    this.closeDialog();
  }
  parseSendServerParams(params){
    let {menberInfo} = this.state;
    params.password = '';
    this.state.donNeedParams.map((val)=>{
      delete params[val];
      return '';
    });
    // console.log("新增or修改用户信息的参数--：",params);
    return params;
  }
  encryptOtherPassword(params){ //加密所有密码
    params.oaPassword ? (params.oaPassword = commonUtils.Base64Encode(params.oaPassword)) : null;
    params.redressPassword ? (params.redressPassword = commonUtils.Base64Encode(params.redressPassword)) : null;
    return params;
  }
  encryptSiFaPassword(params){ //加密司法E通系统的密码
    params.password ? (params.password = commonUtils.Base64Encode(params.password)) : null;
    params.confirmPassword ? (params.confirmPassword = commonUtils.Base64Encode(params.confirmPassword)) : null;
  }

  checkUserNameExist = (rule, value, callback)=>{ //检查用户名是否存在。
    if(!this.state.isAdd && value == this.state.menberInfo.username){
      callback();
      return;
    }
    myWebClient.getSearchUsersData({filter:value},(data,res)=>{
      let objArr = JSON.parse(res.text);
      if(objArr && objArr.length>0){
        let existUser = objArr.filter((userDt)=>{
          if(value == userDt.username){
            return true;
          }
        });
        (existUser && existUser.length>0) ? callback("改用户名已经存在，请换一个试试！") : callback();
      }else{
        callback();
      }
    },(e,err,res)=>{
      callback();
    });
  }
  checkPasswordConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirmPassword'], { force: true });
    }
    callback();
  }
  handlePasswordConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  checkPasswordLength = (rule, value, callback)=>{ //检查密码的长度
    const form = this.props.form;
    if (value && form.getFieldValue('password').length<=5) {
      callback('密码长度必须大于5!');
    } else {
      callback();
    }
  }
  checkSysPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('你输入的两个密码不一样!');
    } else {
      callback();
    }
  }
  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const { menberInfo } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    let oaPassword = commonUtils.Base64Decode(menberInfo.oaPassword || "");
    let redressPassword = commonUtils.Base64Decode(menberInfo.redressPassword || "");
    return (
      <div>
      <Modal className="doc-edit-form doc-edit-form-pc"
        visible={this.props.visible}
        title='编辑用户个人信息'
        onOk={this.handleAddOrEdit}
        onCancel={this.handleCancel}
        width="750px"
        maskClosable={false}
        footer={[
          <ButtonPc key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleAddOrEdit}>
            保存
          </ButtonPc>,
          <ButtonPc key="back" size="large" onClick={this.handleCancel}>取消</ButtonPc>,
        ]}
      >
        <div className="doc-edit">
          <Form  className="edit-form" style={{margin:0}}>
            <Row>
              <Col span={24}>
                <FormItem
                  {...formItemLayout}
                  label="用户名"
                  colon
                  hasFeedback
                >
                  {getFieldDecorator('username', {
                    initialValue:menberInfo.username,
                    validateTrigger:'onBlur',
                    rules: [{
                      required: true, message: '用户名为必填项！', whitespace: true
                    },{
                      validator: this.checkUserNameExist,
                    }],
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem {...formItemLayout} label="姓名">
                  {getFieldDecorator('nickname', {
                    initialValue:menberInfo.nickname,
                    rules: [{
                      required: true, message: '姓名为必填项！', whitespace: true
                    }],
                  })(
                    <Input/>
                  )}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem {...formItemLayout} label="电话">
                  {getFieldDecorator('phone', {
                    initialValue:menberInfo.phone,
                  })(
                    <Input/>
                  )}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem {...formItemLayout} label="邮箱">
                  {getFieldDecorator('email', {
                    initialValue:menberInfo.email,
                    rules: [{
                      type: 'email', message: '你填写的不是正确的邮箱格式！!',
                    }, {
                      required: true, message: '请填写邮箱!', whitespace: true
                    }],
                  })(
                    <Input/>
                  )}
                </FormItem>
              </Col>

              <Col span={24}>
                <FormItem {...formItemLayout} label="司法E通密码" hasFeedback>
                  {getFieldDecorator('password', {
                    initialValue:defaultUserPassword,
                    rules: [{
                      required: true, message: '密码为必填项！', whitespace: true
                    }, {
                      validator: this.checkPasswordConfirm,
                    }, {
                      validator: this.checkPasswordLength,
                    }],
                  })(
                    <Input type="password"/>
                  )}
                </FormItem>
              </Col>

              <Col span={24}>
                <FormItem {...formItemLayout} label="重新确认密码" hasFeedback>
                  {getFieldDecorator('confirmPassword', {
                    initialValue:defaultUserPassword,
                    rules: [{
                      required: true, message: '请填写确认密码!', whitespace: true
                    }, {
                    validator: this.checkSysPassword,
                  }],
                  })(
                    <Input type="password" onBlur={this.handlePasswordConfirmBlur} />
                  )}
                </FormItem>
              </Col>

              <Col span={24}>
                <FormItem {...formItemLayout} label="OA系统用户名">
                  {getFieldDecorator('oaUserName', {
                    initialValue:menberInfo.oaUserName,
                  })(
                    <Input/>
                  )}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem {...formItemLayout} label="OA系统密码">
                  {getFieldDecorator('oaPassword', {
                    initialValue:oaPassword?oaPassword:'',
                  })(
                    <Input type="password" />
                  )}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem {...formItemLayout} label="矫正系统用户名">
                  {getFieldDecorator('redressUserName', {
                    initialValue:menberInfo.redressUserName,
                  })(
                    <Input/>
                  )}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem {...formItemLayout} label="矫正系统密码">
                  {getFieldDecorator('redressPassword', {
                    initialValue:redressPassword?redressPassword:'',
                  })(
                    <Input type="password" />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
      </div>
    )
  }
}

EditUserInfoDialog.defaultProps = {
};

EditUserInfoDialog.propTypes = {
  visible:React.PropTypes.bool
};

export default Form.create()(EditUserInfoDialog);
