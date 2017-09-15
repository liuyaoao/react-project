import $ from 'jquery';
import React from 'react';
import moment from 'moment';
import * as Utils from 'utils/utils.jsx';
import MyWebClient from 'client/my_web_client.jsx';

import {WingBlank, WhiteSpace,NavBar,Button} from 'antd-mobile';
import { Row, Col, Form, Icon, Input, Radio, Table, Modal, DatePicker, notification, Select } from 'antd';
const { MonthPicker } = DatePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;

import signup_logo from 'images/signup_logo.png';

class DocDetailDefault extends React.Component {
  componentDidMount(){
  }
  componentWillReceiveProps(nextProps) {
    const {memberInfo} = this.props;
    if (nextProps.memberInfo.id !== memberInfo.id) {
    }
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
  onNavBarLeftClick = (e) => {
      this.props.backToListPageCall();
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const formItemLayout1 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    // let familyMembersTable = this.getFamilyMembers();
    const { memberInfo, departmentTypes } = this.props;
    // console.log(memberInfo);
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={'document_detail_container'}>
        <NavBar className="mobile_navbar_custom"
          style={{position:'fixed',height:'60px',zIndex:'13',width:'100%',top:'0'}}
          iconName = {false} onLeftClick={this.onNavBarLeftClick}
          leftContent={[
            <Icon type="arrow-left" className="back_arrow_icon" key={2}/>,
            <span key={1}>返回</span>
          ]}>
          <img width="35" height="35" src={signup_logo}/>司法E通
        </NavBar>
        <div style={{marginTop:'60px',width:'90%',margin:'0 auto'}}>
          <WhiteSpace size='md' />
          <Form className={'document_detail_body'}>
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
                  <Col span={24} id="editBirthDay">
                    <FormItem {...formItemLayout} label="出生年月">
                      {getFieldDecorator('birthDay', {initialValue: memberInfo.birthDay ? moment(memberInfo.birthDay, 'YYYY/MM') : null})(
                        <MonthPicker getCalendarContainer={() => document.getElementById('editBirthDay')} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="民族">
                      {getFieldDecorator('famousFamily', {initialValue: memberInfo.famousFamily || ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="籍贯">
                      {getFieldDecorator('nativePlace', {initialValue: memberInfo.nativePlace || ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  {/*<Col span={24} id="editDepartmentSelect">
                    <FormItem {...formItemLayout} label="部门">
                      {getFieldDecorator('department', {initialValue: memberInfo.department || ''})(
                        <Select
                          mode="combobox"
                          size="default"
                          onChange={this.handleChangeDepart}
                          getPopupContainer={() => document.getElementById('editDepartmentSelect')}
                        >
                          {departmentTypes.map((item, index) => {
                            return <Option key={item}>{item}</Option>
                          })}
                        </Select>
                      )}
                    </FormItem>
                  </Col>*/}
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="出生地">
                      {getFieldDecorator('createParty', {initialValue: memberInfo.createParty || ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="健康状况">
                      {getFieldDecorator('healthStatus', {initialValue: memberInfo.healthStatus || ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24} id="editJoinPartyTime">
                    <FormItem {...formItemLayout} label="入党时间:">
                      {getFieldDecorator('joinPartyTime', {initialValue: memberInfo.joinPartyTime ? moment(memberInfo.joinPartyTime, 'YYYY/MM') : null})(
                        <MonthPicker getCalendarContainer={() => document.getElementById('editJoinPartyTime')} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}  id="editJoinWorkerTime">
                    <FormItem {...formItemLayout} label="参加工作时间:">
                      {getFieldDecorator('joinWorkerTime', {initialValue: memberInfo.joinWorkerTime ? moment(memberInfo.joinWorkerTime, 'YYYY/MM') : null})(
                        <MonthPicker getCalendarContainer={() => document.getElementById('editJoinWorkerTime')} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="专业技术职务">
                      {getFieldDecorator('specializedJob', {initialValue: memberInfo.specializedJob || ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="熟悉专业有何专长">
                      {getFieldDecorator('expertise', {initialValue: memberInfo.expertise || ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="现任职务">
                      {getFieldDecorator('currentPosition', {initialValue: memberInfo.currentPosition || ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  {/*<Col span={24}>
                    <FormItem {...formItemLayout} label="拟任职务">
                      {getFieldDecorator('proposedOffice', {initialValue: memberInfo.proposedOffice || ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="拟免职务">
                      {getFieldDecorator('jobTitle', {initialValue: memberInfo.jobTitle || ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>*/}
                </Row>
              </Col>
              <Col span={24} className="tag-list">
                <p className="info-title">
                  <label>学历学位</label>
                  <a href="javascript:;" className="pull-right p-r-10" onClick={this.handleToggleTag}><Icon type="up" /></a>
                </p>
                <Row className="info-body">
                  <Col span={12}>
                    <FormItem {...formItemLayout1} label="全日制教育">
                      {getFieldDecorator('fullTimeEducation', {initialValue: memberInfo.fullTimeEducation || ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout1} label="毕业院校系及专业">
                      {getFieldDecorator('graduatesAddress', {initialValue: memberInfo.graduatesAddress || ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout1} label="在职教育">
                      {getFieldDecorator('inServiceEducation', {initialValue: memberInfo.inServiceEducation || ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout1} label="毕业院校系及专业">
                      {getFieldDecorator('inServiceAddress', {initialValue: memberInfo.inServiceAddress || ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </Col>
              <Col span={24} className="tag-list">
                <p className="info-title">
                  <label>简历</label>
                  <a href="javascript:;" className="pull-right p-r-10" onClick={this.handleToggleTag}><Icon type="up" /></a>
                </p>
                <div className="info-body">
                  <FormItem label="">
                    {getFieldDecorator('resume', {initialValue: memberInfo.resume || ''})(
                      <Input type="textarea" placeholder="简历" autosize={{ minRows: 2, maxRows: 10 }} />
                    )}
                  </FormItem>
                </div>
              </Col>
              {/*<Col span={24} className="tag-list">
                <p className="info-title">
                  <label>家庭主要成员及重要社会关系</label>
                  <a href="javascript:;" className="pull-right p-r-10" onClick={this.handleToggleTag}><Icon type="up" /></a>
                </p>
                <div className="info-body">
                  {familyMembersTable}
                </div>
              </Col>*/}
              <Col span={24} className="tag-list">
                <p className="info-title">
                  <label>其他信息</label>
                  <a href="javascript:;" className="pull-right p-r-10" onClick={this.handleToggleTag}><Icon type="up" /></a>
                </p>
                <div className="info-body">
                  <FormItem label="奖惩情况">
                    {getFieldDecorator('certificateOfMerit', {initialValue: memberInfo.certificateOfMerit || ''})(
                      <Input type="textarea" placeholder="" autosize={{ minRows: 2, maxRows: 10 }} />
                    )}
                  </FormItem>
                  <FormItem label="近三年年度考核结果">
                    {getFieldDecorator('annualAssessment', {initialValue: memberInfo.annualAssessment || ''})(
                      <Input type="textarea" placeholder="" autosize={{ minRows: 2, maxRows: 10 }} />
                    )}
                  </FormItem>
                  <FormItem label="任职日期">
                    {getFieldDecorator('reasonsForDismissal', {initialValue: memberInfo.reasonsForDismissal || ''})(
                      <Input type="textarea" placeholder="" autosize={{ minRows: 2, maxRows: 10 }} />
                    )}
                  </FormItem>
                  {/*
                  <div className="form-item" id="editReportingUnit">
                    <div className="item-label"><label>呈报单位:</label></div>
                    {getFieldDecorator('reportingTime', {initialValue: memberInfo.reportingTime ? moment(memberInfo.reportingTime, 'YYYY/MM') : null})(
                      <MonthPicker style={{float: "right"}} getCalendarContainer={() => document.getElementById('editReportingUnit')} />
                    )}
                    {getFieldDecorator('reportingUnit', {initialValue: memberInfo.reportingUnit || ''})(
                      <Input type="textarea" placeholder="" autosize={{ minRows: 2, maxRows: 10 }} />
                    )}
                  </div>
                  <div className="form-item" id="editApprovalOpinion">
                    <div className="item-label"><label>审批机关意见:</label></div>
                    {getFieldDecorator('approvalTime', {initialValue: memberInfo.approvalTime ? moment(memberInfo.approvalTime, 'YYYY/MM') : null})(
                      <MonthPicker style={{float: "right"}} getCalendarContainer={() => document.getElementById('editApprovalOpinion')} />
                    )}
                    {getFieldDecorator('approvalOpinion', {initialValue: memberInfo.approvalOpinion || ''})(
                      <Input type="textarea" placeholder="" autosize={{ minRows: 2, maxRows: 10 }} />
                    )}
                  </div>
                  <div className="form-item" id="editApprovalRemovalOpinion">
                    <div className="item-label"><label>行政机关任免意见:</label></div>
                    {getFieldDecorator('appointAndRemoveTime', {initialValue: memberInfo.appointAndRemoveTime ? moment(memberInfo.appointAndRemoveTime, 'YYYY/MM') : null})(
                      <MonthPicker style={{float: "right"}} getCalendarContainer={() => document.getElementById('editApprovalRemovalOpinion')} />
                    )}
                    {getFieldDecorator('appointAndRemoveOpinion', {initialValue: memberInfo.appointAndRemoveOpinion || ''})(
                      <Input type="textarea" placeholder="" autosize={{ minRows: 2, maxRows: 10 }} />
                    )}
                  </div>
                  */}
                </div>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    )
  }

}

export default Form.create()(DocDetailDefault);
