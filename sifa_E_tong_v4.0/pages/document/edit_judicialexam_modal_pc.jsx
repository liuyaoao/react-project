import $ from 'jquery';
import React from 'react';
import moment from 'moment';
import * as Utils from 'utils/utils.jsx';

import { Row, Col, Form, Icon, Input, Button, Radio, Table, Modal, DatePicker, notification, Select, Checkbox } from 'antd';
const { MonthPicker } = DatePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;

import head_boy from 'images/head_boy.png';
import head_girl from 'images/head_girl.png';

import MyWebClient from 'client/my_web_client.jsx';
import EditableFamilyTable from './family_table.jsx';

class DocumentEditJudExamModalPC extends React.Component {
  state = {
    loading: false,
    familyData: [],
    member: {},
    isMobile: Utils.isMobile(),
  }
  componentWillReceiveProps(nextProps) {
    const {memberInfo} = this.props;
    if (nextProps.memberInfo.id !== memberInfo.id) {
      console.log(nextProps.memberInfo.id, nextProps.memberInfo.userName);
      this.handleGetFamilyMembers(nextProps.memberInfo.id);
    }
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = () => {
    this.setState({ loading: true });
    const {memberInfo} = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values['lawyerFirstPracticeTime'] =  values['lawyerFirstPracticeTime'] ? values['lawyerFirstPracticeTime'].format('YYYY/MM') : '';
        values['lawyerPunishTime'] = values['lawyerPunishTime'] ? values['lawyerPunishTime'].format('YYYY/MM') : '';
        console.log('Received values of form: ', values);
        values.id = memberInfo.id;
        // console.log(values);
        const info = Object.assign({}, memberInfo, values);
        delete info['key'];
        info['familyMember']=[];
        // console.log(info);
        this.handleEditDocument(info);
      }
    });
  }
  handleCancel = () => {
    this.props.form.resetFields();
    this.props.handleCancelModal();
  }
  getDefaultDepartment = (fileInfoSubType)=>{
    let department = '';
    for(let i=0;i<this.props.departmentData.length;i++){
      let deparDt = this.props.departmentData[i];
      if(deparDt.resourceName == fileInfoSubType && deparDt.sub.length>0){
        department = deparDt.sub[0].resourceName;
      }
    }
    return department;
  }
  handleEditDocument(param) {
    let _this = this;
    let {memberInfo} = this.props;
    param.fileInfoType = memberInfo.fileInfoType;
    memberInfo.fileInfoSubType?param.fileInfoSubType = memberInfo.fileInfoSubType:null;

    param.department = memberInfo.department;
    param.department = param.department ? param.department : this.getDefaultDepartment(param.fileInfoSubType);
    !param.department? delete param.department:null;
    // console.log(param);
    MyWebClient.updateFileInfo(param,
      (data, res) => {
        if (res && res.ok) {
          if (res.text === 'true') {
            _this.openNotification('success', '编辑档案成功');
            _this.props.handleSearch();
          } else {
            _this.openNotification('error', '编辑档案失败');
          }
          _this.setState({ loading: false});
          _this.handleCancel();
        }
      },
      (e, err, res) => {
        _this.openNotification('error', '编辑档案失败');
        console.log('get error:', res ? res.text : '');
        _this.setState({ loading: false});
        _this.handleCancel();
      }
    );
  }
  handleGetFamilyMembers(id) {
    let _this = this;
    MyWebClient.getSearchFileFamilyMember(id.toUpperCase(),
      (data, res) => {
        if (res && res.ok) {
          const data = JSON.parse(res.text);
         //  console.log(data);
          const familyData = data.map((item) => {
            const obj = {};
            obj.key = item.id;
            Object.keys(item).forEach((key) => {
              obj[key] = {
                editable: false,
                value: item[key]
              }
            });
            return obj;
          });
          _this.setState({ familyData });
        }
      },
      (e, err, res) => {
        console.log('get error:', res ? res.text : '');
      }
    );
  }
  openNotification(type, message) {
    notification.config({
      top: 68,
      duration: 3
    });
    notification[type]({
      message: message,
      // description: ''
    });
  }
  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const formTailLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 8, offset: 4 },
    };
    // let familyMembersTable = this.getFamilyMembers();
    const { memberInfo, departmentTypes } = this.props;
    // console.log(memberInfo);
    let defaultGender = null, head_img = null;
    if (memberInfo.gender == '男') {
      head_img = head_boy;
    } else if (memberInfo.gender == '女') {
      head_img = head_girl;
    }
    const { getFieldDecorator } = this.props.form;
    let clsname = this.state.isMobile ? "doc-edit-form doc-edit-form-mobile" :"doc-edit-form doc-edit-form-pc";
    return (
      <Modal className={clsname}
        visible={this.props.visible}
        title="编辑档案"
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        width="880px"
        footer={this.state.isMobile?[
              <Button key="back" type="primary" size="large" onClick={this.handleCancel}>关闭</Button>
            ]:[
              <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>
              修改
              </Button>,
              <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>
            ]
        }>
        <div className="doc-edit">
          {this.state.isMobile?null:(<div className="head-img"><img src={head_img} style={{width: "108px", paddingTop: "2px"}} /></div>)}
          <Form className={this.state.isMobile?"":"edit-form"}>
            <Row>
              <Col span={24} className="tag-list">
                <p className="info-title">
                  <label>基本资料</label>
                  <a href="javascript:;" className="pull-right p-r-10" onClick={this.handleToggleTag}><Icon type="up" /></a>
                </p>
                <Row className="info-body">
                  <FormItem label="id" style={{display: "none"}}>
                    {getFieldDecorator('id', {initialValue: memberInfo.id || ''})(
                      <Input type="text" placeholder="" />
                    )}
                  </FormItem>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="姓名">
                      {getFieldDecorator('userName', {
                        initialValue: memberInfo.userName || '',
                        rules: [{
                          required: true, message: '请输入姓名',
                        }],
                      })(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>

                  <Col span={24}>
                    <FormItem {...formItemLayout} label="性别">
                      {getFieldDecorator('gender', {initialValue: memberInfo.gender || ''})(
                        <RadioGroup>
                          <RadioButton value="男">男</RadioButton>
                          <RadioButton value="女">女</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </Col>

                  <Col span={24}>
                    <FormItem {...formItemLayout} label="身份证号码">
                      {getFieldDecorator('lawyerLicenseNo', {initialValue: memberInfo.lawyerLicenseNo||''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="证书编号">
                      {getFieldDecorator('lawyerQualificationCode', {initialValue: memberInfo.lawyerQualificationCode||''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>






                  <Col span={24}>
                    <FormItem {...formItemLayout} label="学历">
                      {getFieldDecorator('fullTimeEducation', {initialValue: memberInfo.fullTimeEducation||''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="专业">
                      {getFieldDecorator('specializedJob', {initialValue: memberInfo.specializedJob||''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>

                  <Col span={24}>
                    <FormItem {...formItemLayout} label="职业">
                      {getFieldDecorator('currentPosition', {initialValue: memberInfo.currentPosition||''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>

                  <Col span={24}>
                    <FormItem {...formItemLayout} label="通讯地址">
                      {getFieldDecorator('createParty', {initialValue: memberInfo.createParty||''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="电话号码">
                      {getFieldDecorator('inServiceEducation', {initialValue: memberInfo.inServiceEducation||''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="email">
                      {getFieldDecorator('expertise', {initialValue: memberInfo.expertise||''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>



                </Row>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
    )
  }
  handleToggleTag(e) {
    var target = e.target;
    var checks = 5;
    var attr = target.className;
    while (checks && attr.indexOf('tag-list') == -1) {
      target = target.parentElement;
      attr = target.className;
      checks--;
    }
    if (checks) {
      $(target).toggleClass('list-closed');
      var arrow = target.querySelector('.anticon');
      if (arrow.className.indexOf('anticon-down') > -1) {
        arrow.className = 'anticon anticon-up';
      } else {
        arrow.className = 'anticon anticon-down';
      }
    }
  }
  handleChangeDepart(value) {
    // console.log(`Selected: ${value}`);
  }
}

export default Form.create()(DocumentEditJudExamModalPC);
