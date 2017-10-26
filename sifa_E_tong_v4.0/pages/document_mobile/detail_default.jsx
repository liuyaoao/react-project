import $ from 'jquery';
import React from 'react';
import moment from 'moment';
import MyWebClient from 'client/my_web_client.jsx';

import {WingBlank, WhiteSpace,NavBar,Button} from 'antd-mobile';
import { Row, Col, Form, Icon, Input, DatePicker } from 'antd';
const { MonthPicker } = DatePicker;
const FormItem = Form.Item;

import signup_logo from 'images/signup_logo.png';

class DocDetailDefault extends React.Component {
  // componentWillReceiveProps(nextProps) {
  //   const {memberInfo} = this.props;
  //   if (nextProps.memberInfo.id !== memberInfo.id) {
  //   }
  // }
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
  onNavBarLeftClick = (e) => {
      this.props.backToListPageCall();
  }
  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 18 },
        sm: { span: 18 },
      },
    };
    const formItemLayout1 = {
      labelCol: {
        xs: { span: 15 },
        sm: { span: 15 },
      },
      wrapperCol: {
        xs: { span: 9 },
        sm: { span: 9 },
      },
    };
    const { memberInfo } = this.props;
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
        <div className='doc-edit-form-mobile'>
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
                      <Input type="text" placeholder="" disabled/>
                    )}
                  </FormItem>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="姓名">
                      {getFieldDecorator('userName', {
                        initialValue: memberInfo.userName || '-',
                        rules: [{
                          required: true, message: '请输入姓名',
                        }],
                      })(
                        <Input type="text" disabled/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="职务">
                      {getFieldDecorator('currentPosition', {initialValue: memberInfo.currentPosition || '-'})(
                        <Input type="text" disabled/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="性别">
                      {getFieldDecorator('gender', {initialValue: memberInfo.gender || '-'})(
                        <Input type="text" disabled/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="民族">
                      {getFieldDecorator('famousFamily', {initialValue: memberInfo.famousFamily || '-'})(
                        <Input type="text" disabled />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="籍贯">
                      {getFieldDecorator('nativePlace', {initialValue: memberInfo.nativePlace || '-'})(
                        <Input type="text" disabled />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24} id="editBirthDay">
                    <FormItem {...formItemLayout} label="出生年月">
                      {getFieldDecorator('birthDay', {initialValue: memberInfo.birthDay ? memberInfo.birthDay : "-"})(
                        <Input type="text" disabled/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="出生地">
                      {getFieldDecorator('createParty', {initialValue: memberInfo.createParty || '-'})(
                        <Input type="text" disabled />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}  id="editJoinWorkerTime">
                    <FormItem {...formItemLayout1} label="参加工作时间:">
                      {getFieldDecorator('joinWorkerTime', {initialValue: memberInfo.joinWorkerTime ? memberInfo.joinWorkerTime : '-'})(
                        <Input type="text" disabled />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24} id="editJoinPartyTime">
                    <FormItem {...formItemLayout} label="入党时间:">
                      {getFieldDecorator('joinPartyTime', {initialValue: memberInfo.joinPartyTime ? memberInfo.joinPartyTime : '-'})(
                        <Input type="text" disabled />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}  id="show_reportingTime">
                    <FormItem {...formItemLayout1} label="任现职务时间:">
                      {getFieldDecorator('reportingTime', {initialValue: memberInfo.reportingTime ? memberInfo.reportingTime : '-'})(
                        <Input type="text" disabled />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}  id="edit_approvalTime">
                    <FormItem {...formItemLayout1} label="任现职级时间:">
                      {getFieldDecorator('approvalTime', {initialValue: memberInfo.approvalTime ? memberInfo.approvalTime : '-'})(
                        <Input type="text" disabled />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem label="出生地">
                      {getFieldDecorator('createParty', {initialValue: memberInfo.createParty || '-'})(
                        <Input type="text" placeholder="" disabled/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem label="健康状况">
                      {getFieldDecorator('healthStatus', {initialValue: memberInfo.healthStatus || '-'})(
                        <Input type="text" placeholder="" disabled/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </Col>
              <Col span={24} className="tag-list">
                <p className="info-title">
                  <label>学历学位</label>
                  <a href="javascript:;" className="pull-right p-r-10" onClick={this.handleToggleTag}><Icon type="up" /></a>
                </p>
                <Row className="info-body">
                  <Col span={24}>
                    <FormItem {...formItemLayout1} label="全日制学历学位">
                      {getFieldDecorator('fullTimeEducation', {initialValue: memberInfo.fullTimeEducation || '-'})(
                        <Input type="text" disabled />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout1} label="在职学历学位">
                      {getFieldDecorator('inServiceEducation', {initialValue: memberInfo.inServiceEducation || '-'})(
                        <Input type="text" disabled />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout1} label="所学专业">
                      {getFieldDecorator('graduatesAddress', {initialValue: memberInfo.graduatesAddress || '-'})(
                        <Input type="text" disabled />
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </Col>

              <Col span={24} className="tag-list">
                <p className="info-title">
                  <label>说明:</label>
                  <a href="javascript:;" className="pull-right p-r-10" onClick={this.handleToggleTag}><Icon type="up" /></a>
                </p>
                <div className="info-body">
                  <FormItem label="">
                    {getFieldDecorator('approvalOpinion', {initialValue:memberInfo.approvalOpinion || '-'})(
                      <Input type="textarea" placeholder="" autosize disabled/>
                    )}
                  </FormItem>
                </div>
              </Col>

              <Col span={24} className="tag-list">
                <p className="info-title">
                  <label>简历:</label>
                  <a href="javascript:;" className="pull-right p-r-10" onClick={this.handleToggleTag}><Icon type="up" /></a>
                </p>
                <div className="info-body">
                  <FormItem label="">
                    {getFieldDecorator('resume', {initialValue: memberInfo.resume || '-'})(
                      <Input type="textarea" autosize disabled/>
                    )}
                  </FormItem>
                </div>
              </Col>
              <Col span={24} className="tag-list">
                <p className="info-title">
                  <label>其他信息</label>
                  <a href="javascript:;" className="pull-right p-r-10" onClick={this.handleToggleTag}><Icon type="up" /></a>
                </p>
                <div className="info-body">
                  <FormItem label="奖惩情况">
                    {getFieldDecorator('certificateOfMerit', {initialValue: memberInfo.certificateOfMerit || '-'})(
                      <Input type="textarea" autosize disabled/>
                    )}
                  </FormItem>
                  <FormItem label="近三年年度考核结果">
                    {getFieldDecorator('annualAssessment', {initialValue: memberInfo.annualAssessment || '-'})(
                      <Input type="textarea" disabled autosize />
                    )}
                  </FormItem>
                  <FormItem label="家庭主要成员情况">
                    {getFieldDecorator('family', {initialValue: memberInfo.family || '-'})(
                      <Input type="textarea" placeholder="" autosize disabled/>
                    )}
                  </FormItem>
                  <FormItem label="主要社会关系">
                    {getFieldDecorator('appointAndRemoveOpinion', {initialValue: memberInfo.appointAndRemoveOpinion || '-'})(
                      <Input type="textarea" placeholder="" autosize disabled/>
                    )}
                  </FormItem>

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
