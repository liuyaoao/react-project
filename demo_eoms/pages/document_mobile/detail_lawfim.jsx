import $ from 'jquery';
import React from 'react';
import moment from 'moment';
import {WingBlank, WhiteSpace,NavBar,Button} from 'antd-mobile';
import { Row, Col, Form, Icon, Input, DatePicker } from 'antd';
const { MonthPicker } = DatePicker;
const FormItem = Form.Item;

import signup_logo from 'images/signup_logo.png';

class DocDetailLawfirm extends React.Component {
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
      <div className={'document_detail_container'}>
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
          <Form className={'document_detail_body'}>
            <Row>
              <Col span={24} className="tag-list">
                <Row className="info-body">
                  <FormItem label="id" style={{display: "none"}}>
                    {getFieldDecorator('id', {initialValue: memberInfo.id || ''})(
                      <Input type="text" placeholder="" />
                    )}
                  </FormItem>

                  <Col span={24}>
                    <FormItem {...formItemLayout} label="律所名称">
                      {getFieldDecorator('lawOfficeName', {initialValue: memberInfo.lawOfficeName || ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="律所负责人">
                      {getFieldDecorator('lawOfficePrincipal', {initialValue: memberInfo.lawOfficePrincipal || ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="律所地址">
                      {getFieldDecorator('lawOfficeAddress', {initialValue: memberInfo.lawOfficeAddress || ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>

                  <Col span={24}>
                    <FormItem {...formItemLayout} label="组织形式">
                      {getFieldDecorator('specializedJob', {initialValue: memberInfo.specializedJob||''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>

                  <Col span={24}>
                    <FormItem {...formItemLayout} label="执业证号">
                      {getFieldDecorator('lawyerLicenseNo', {initialValue: memberInfo.lawyerLicenseNo||''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="执业状态">
                      {getFieldDecorator('lawyerStatus', {initialValue: memberInfo.lawyerStatus||''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>



                  <Col span={24}>
                    <FormItem {...formItemLayout} label="是否受过行政处罚或行业处分">
                      {getFieldDecorator('lawyerIsPunish', {initialValue: memberInfo.lawyerIsPunish || ''})(
                        <Input />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="惩罚日期">
                      {getFieldDecorator('lawyerIsPunish', {initialValue: memberInfo.lawyerPunishTime || ''})(
                        <Input />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="处理单位">
                      {getFieldDecorator('lawyerPunishUnit', {initialValue: memberInfo.lawyerPunishUnit||''})(
                        <Input />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="惩罚结果">
                      {getFieldDecorator('lawyerPunishResult', {initialValue: memberInfo.lawyerPunishResult||''})(
                        <Input />
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

export default Form.create()(DocDetailLawfirm);
