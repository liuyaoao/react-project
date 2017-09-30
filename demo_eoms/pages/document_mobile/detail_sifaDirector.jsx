import $ from 'jquery';
import React from 'react';
import moment from 'moment';
import { WhiteSpace,NavBar,Button} from 'antd-mobile';
import { Row, Col, Form, Icon, Input, DatePicker } from 'antd';
const { MonthPicker } = DatePicker;
const FormItem = Form.Item;

import signup_logo from 'images/signup_logo.png';
//司法所长档案的编辑窗口
class DocDetailSifaDirector extends React.Component {
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
    const formTailLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 8, offset: 4 },
    };
    const { memberInfo } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="document_detail_container">
        <NavBar className="mobile_navbar_custom"
          style={{position:'fixed',height:'60px',zIndex:'13',width:'100%',top:'0'}}
          iconName = {false} onLeftClick={this.onNavBarLeftClick}
          leftContent={[
            <Icon type="arrow-left" className="back_arrow_icon" key={2}/>,
            <span key={1}>返回</span>
          ]}>
          <img width="35" height="35" src={signup_logo}/>吉视E通
        </NavBar>
        <div className='doc-edit-form-mobile'>
          <WhiteSpace size='md' />
          <Form className='document_detail_body'>
            <Row>
              <Col span={24} className="tag-list">
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
                        <Input type="text" placeholder="" />
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
                    <FormItem {...formItemLayout} label="何时开始从事司法行政工作">
                      {getFieldDecorator('joinWorkerTime',
                        {
                          initialValue: (memberInfo.joinWorkerTime && memberInfo.joinWorkerTime!='null') ? moment(memberInfo.joinWorkerTime, 'YYYY/MM') : null
                        })(
                        <MonthPicker getCalendarContainer={() => document.getElementById('addjoinWorkerTime')} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24} id="addbirthDayTime">
                    <FormItem {...formItemLayout} label="出生年月">
                      {getFieldDecorator('birthDay',
                        {
                          initialValue: (memberInfo.birthDay && memberInfo.birthDay!='null') ? moment(memberInfo.birthDay, 'YYYY/MM') : null
                        })(
                        <MonthPicker getCalendarContainer={() => document.getElementById('addbirthDayTime')} />
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
                    <FormItem {...formItemLayout} label="是否落实司法员岗位补贴">
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
      </div>
    )
  }

}

export default Form.create()(DocDetailSifaDirector);
