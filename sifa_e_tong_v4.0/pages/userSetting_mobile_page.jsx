
import $ from 'jquery';
import React from 'react';
import {browserHistory} from 'react-router/es6';
import UserStore from 'stores/user_store.jsx';
  import * as commonUtils from 'pages/utils/common_utils.jsx';
import * as Utils from 'utils/utils.jsx';

import myWebClient from 'client/my_web_client.jsx';
import signup_logo from 'images/signup_logo.png';
import {  NavBar,Button } from 'antd-mobile';
import { Layout, Menu, Row, Col, Form, Icon, Input, Button as ButtonPc ,notification,
  TreeSelect, Modal,message,Switch,Radio} from 'antd';
import {WingBlank, WhiteSpace} from 'antd-mobile';
const FormItem = Form.Item;
const { SubMenu } = Menu;
const { Sider } = Layout;
message.config({
  top: 75,
  duration: 2,
});
notification.config({
  top: 68,
  duration: 3
});
const defaultUserPassword = "qd06ueb3r9g7n4u";

class UserSettingMobilePage extends React.Component {
    constructor(props) {
        super(props);
        this.getStateFromStores = this.getStateFromStores.bind(this);
        this.onNavBarLeftClick = this.onNavBarLeftClick.bind(this);
        this.checkUserNameExist = this.checkUserNameExist.bind(this);
        this.state = this.getStateFromStores();
    }
    getStateFromStores() {
        return {
            loginUserName:'',
            loading: false,
            confirmDirty:false,
            menberInfo:{},
            donNeedParams : ['key','confirmPassword'],
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
      var me = UserStore.getCurrentUser() || {};
      this.setState({loginUserName:me.username || ''});
    }
    componentDidMount(){
        this.getServerUserInfo();
    }
    getServerUserInfo = ()=>{
      var me = UserStore.getCurrentUser() || {};
      myWebClient.getUserInfo(me.id,
        (data,res)=>{
          let parseData = JSON.parse(res.text);
          this.setState({
            menberInfo:parseData||{},
          });
        },(e, err, res)=>{
          console.log("request server userinfo error info:",err);
        });
    }
    onNavBarLeftClick = (e) => {
        this.handleCancel();
    }
    handleCancel = () => {
      browserHistory.push('/modules');
      this.setState({ loading:false });
    }
    onClickSaveBtn = () => { //点击了保存
      this.setState({ loading: true });
      let form = this.props.form;
      this.props.form.validateFieldsAndScroll((err, values) => {
          err ? this.setState({ loading: false}) : null;
          if (!err) {
            this.realSubmit();
          }
      });
    }
    realSubmit(){
      let submitInfo = this.props.form.getFieldsValue();
      // console.log("修改用户自己信息的submitInfo参数--：",submitInfo);
      submitInfo.id = this.state.menberInfo.id;
      // submitInfo.organizations = this.getOrganizationsStr();
      let params = Object.assign({}, this.state.initUserInfo, this.state.menberInfo,submitInfo);
      this.onlyUpdatePassword(submitInfo);
      params = this.parseSendServerParams(params);
      params = this.encryptOtherPassword(params);
      myWebClient.addOrEditUser("update",params,
        (data,res)=>{
          this.setState({
            confirmDirty:false,
            loading:false
          });
          notification.success({message: '修改成功！'});
        },(e,err,res)=>{
          this.setState({ confirmDirty: false,loading:false });
          notification.error({message: '修改失败！'});
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
      const { menberInfo } = this.state;
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
        <div className="userSetting_container">
          <NavBar className="mobile_navbar_custom"
          style={{position:'fixed',height:'60px',zIndex:'13',width:'100%',top:'0'}}
          iconName = {false} onLeftClick={this.onNavBarLeftClick}
          leftContent={[
            <Icon type="arrow-left" className="back_arrow_icon" key={2}/>,
            <span key={1}>返回</span>
          ]} >
            <img width="35" height="35" src={signup_logo}/>司法E通
          </NavBar>
          <div style={{marginTop:'60px',width:'90%',margin:'0 auto'}}>
            <WhiteSpace size='md' />
            <div className="userSetting_body doc-edit-form-mobile">
              <Form className="edit-form" style={{margin:0}}>
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
              <div className={'userSetting_footer'}>
                <WhiteSpace size='md'/>
                <ButtonPc key="submit" className={'userSetting_saveBtn'} type="primary" size="large" loading={this.state.loading} onClick={this.onClickSaveBtn}>
                  保存
                </ButtonPc>
                <ButtonPc key="back" size="large" onClick={this.handleCancel}>取消</ButtonPc>
              </div>
            </div>
          </div>
        </div>
      );
    }
}

UserSettingMobilePage.defaultProps = {
};

UserSettingMobilePage.propTypes = {
};

export default Form.create()(UserSettingMobilePage);
