import $ from 'jquery';
import React from 'react';
import moment from 'moment';
import * as Utils from 'utils/utils.jsx';
import {WingBlank, WhiteSpace,NavBar,Button} from 'antd-mobile';
import { Row, Col, Form, Icon, Input,  Radio, Table, Modal, DatePicker, notification, Select, Checkbox } from 'antd';
const { MonthPicker } = DatePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;

import signup_logo from 'images/signup_logo.png';
//基层法律工作者 编辑窗口
class DocDetailLegalWorker extends React.Component {
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
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
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
        <div className='doc-edit-form-mobile' style={{marginTop:'60px',width:'90%',margin:'0 auto'}}>
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

                  {/*<Col span={24}>
                    <FormItem {...formItemLayout} label="律所名称">
                      {getFieldDecorator('lawOfficeName', {initialValue: memberInfo.lawOfficeName || ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>*/}

                  {/*<Col span={24}>
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
                    <FormItem {...formItemLayout} label="性别">
                      {getFieldDecorator('gender', {initialValue: memberInfo.gender || ''})(
                        <RadioGroup>
                          <RadioButton value="男">男</RadioButton>
                          <RadioButton value="女">女</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </Col>*/}
                  {/*<Col span={24} id="editDepartmentSelect">
                    <FormItem {...formItemLayout} label="部门">
                      {getFieldDecorator('department', {initialValue: memberInfo.department || ''})(
                        <Select
                          mode="combobox"
                          size="default"
                          onChange={this.handleChangeDepart}
                          getPopupContainer={() => document.getElementById('editDepartmentSelect')}
                        >
                          {departmentTypes ? departmentTypes.map((item, index) => {
                            return <Option key={item}>{item}</Option>
                          }) : null}
                        </Select>
                      )}
                    </FormItem>
                  </Col>*/}
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="执业机构">
                      {getFieldDecorator('lawOfficeAddress', {initialValue: memberInfo.lawOfficeAddress||''})(
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
                    <FormItem {...formItemLayout} label="联系方式">
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

export default Form.create()(DocDetailLegalWorker);