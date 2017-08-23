//添加律师档案的弹窗
import $ from 'jquery';
import React from 'react';
import moment from 'moment';
import * as Utils from 'utils/utils.jsx';

import { Row, Col, Form, Icon, Input, Button, Radio, Table, Modal, DatePicker, notification, Select } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;

import head_boy from 'images/head_boy.png';
import head_girl from 'images/head_girl.png';

import MyWebClient from 'client/my_web_client.jsx';
import EditableFamilyTable from './family_table.jsx';

//司法所长的档案新增窗口
class DocumentAddSifaDirectorModalPC extends React.Component {
  state = {
    loading: false,
    visible: false,
    isMobile: Utils.isMobile(),
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleCancel = () => {
    this.setState({ visible: false });
    this.props.form.resetFields();
  }
  handleOk = () => {
    this.setState({ loading: true });
    const {memberInfo} = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values['joinWorkerTime'] =  values['joinWorkerTime'] ? values['joinWorkerTime'].format('YYYY-MM-DD') : '';
        values['birthDay'] =  values['birthDay'] ? values['birthDay'].format('YYYY-MM-DD') : '';
        const param = {
          ...values,
        }
        this.handleAddDocument(param);
      }
    });
  }
  handleAddDocument(param) {
    let _this = this;
    param.fileInfoType = this.props.currentFileType;
    param.fileInfoSubType = this.props.currentFileSubType;
    param.fileInfoSubType = this.props.currentFileSubType;
    if(this.props.currentDepartment){
      param.department = this.props.currentDepartment;
    }else{
      this.props.departmentData.map((parent) => {
        if(parent.resourceName == param.fileInfoSubType){
          param.department = parent.sub[0]["resourceName"];
        }
      });
    }

    MyWebClient.createFileInfo(param,
      (data, res) => {
        if (res && res.ok) {
          console.log(res.text);
          if (res.text === 'true') {
            _this.openNotification('success', '添加档案成功');
            _this.props.handleSearch();
          } else {
            _this.openNotification('error', '添加档案失败');
          }
          _this.setState({ loading: false});
          _this.handleCancel();
        }
      },
      (e, err, res) => {
        _this.openNotification('error', '添加档案失败');
        console.log('get error:', res ? res.text : '');
        _this.setState({ loading: false});
        _this.handleCancel();
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
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const formItemLayout1 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const { memberInfo } = this.props;
    // console.log(memberInfo);
    let defaultGender = null, head_img = head_boy;
    if (memberInfo.gender == '男') {
      head_img = head_boy;
    } else if (memberInfo.gender == '女') {
      head_img = head_girl;
    }
    const { children, departmentTypes } = this.props;
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    let clsname = this.state.isMobile ? "doc-edit-form doc-edit-form-mobile" :"doc-edit-form doc-edit-form-pc";
    return (
      <span>
        <span onClick={this.showModal}>
          { children }
        </span>
      <Modal className={clsname}
        visible={this.state.visible}
        title="添加档案"
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        width="880px"
        footer={[
          <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>
            添加
          </Button>,
          <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
        ]}
      >
        <div className="doc-edit">
          <div className="head-img"><img src={head_img} style={{width: "108px", paddingTop: "2px"}} /></div>
          <Form className="edit-form">
            <Row>
              <Col span={24} className="tag-list">
                <p className="info-title">
                  <label>基本资料</label>
                  <a href="javascript:;" className="pull-right p-r-10" onClick={this.handleToggleTag}><Icon type="up" /></a>
                </p>
                <Row className="info-body">
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="姓名">
                      {getFieldDecorator('userName', {
                        initialValue: memberInfo.userName||'',
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
                      {getFieldDecorator('gender', {initialValue: memberInfo.gender||''})(
                        <RadioGroup>
                          <RadioButton value="男">男</RadioButton>
                          <RadioButton value="女">女</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="单位">
                      {getFieldDecorator('reportingUnit', {initialValue: memberInfo.reportingUnit || ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="职务">
                      {getFieldDecorator('currentPosition', {initialValue: memberInfo.currentPosition||''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="文化程度">
                      {getFieldDecorator('fullTimeEducation', {initialValue: memberInfo.fullTimeEducation||''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="政治面貌">
                      {getFieldDecorator('proposedOffice', {initialValue: memberInfo.proposedOffice||''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24} id="addjoinWorkerTime">
                    <FormItem {...formItemLayout1} label="何时开始从事司法行政工作">
                      {getFieldDecorator('joinWorkerTime',
                        {
                          initialValue: (memberInfo.joinWorkerTime && memberInfo.joinWorkerTime!='null') ? moment(memberInfo.joinWorkerTime, 'YYYY-MM-DD') : null
                        })(
                        <DatePicker getCalendarContainer={() => document.getElementById('addjoinWorkerTime')} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24} id="addBirthdayTime">
                    <FormItem {...formItemLayout} label="出生年月">
                      {getFieldDecorator('birthDay',
                        {
                          initialValue: (memberInfo.birthDay && memberInfo.birthDay!='null') ? moment(memberInfo.birthDay, 'YYYY-MM-DD') : null
                        })(
                        <DatePicker getCalendarContainer={() => document.getElementById('addBirthdayTime')} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="编制情况">
                      {getFieldDecorator('certificateOfMerit', {initialValue: memberInfo.certificateOfMerit||''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="现任职级">
                      {getFieldDecorator('jobTitle', {initialValue: memberInfo.jobTitle||''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout1} label="是否落实司法员岗位补贴">
                      {getFieldDecorator('healthStatus', {initialValue: memberInfo.healthStatus||''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="联系电话">
                      {getFieldDecorator('inServiceEducation', {initialValue: memberInfo.inServiceEducation||''})(
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
    </span>
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

export default Form.create()(DocumentAddSifaDirectorModalPC);
