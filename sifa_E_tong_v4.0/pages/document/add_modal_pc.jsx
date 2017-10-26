//添加其他人事档案的弹窗
import $ from 'jquery';
import React from 'react';
import moment from 'moment';
import * as Utils from 'utils/utils.jsx';

import { Row, Col, Form, Icon, Input, Button, Radio, Table, Modal, DatePicker, notification, Select } from 'antd';
const { MonthPicker } = DatePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;

import head_boy from 'images/head_boy.png';
import head_girl from 'images/head_girl.png';

import MyWebClient from 'client/my_web_client.jsx';
// import EditableFamilyTable from './family_table.jsx';

class DocumentAddModalPC extends React.Component {
  state = {
    loading: false,
    familyData: [],
    member: {},
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
        console.log('Received values of form: ', values);
        // console.log(values);
        Object.keys(values).forEach((key) => {
          if (key == 'birthDay' || key == 'joinPartyTime' || key == 'joinWorkerTime'
            || key == 'reportingTime' || key == 'approvalTime' || key == 'appointAndRemoveTime' ) {
            values[key] = values[key] ? moment(values[key]).format('YYYY/MM') : '';
          }
        });
        const info = {
          ...values,
          familyMember: []
        }
        const {familyData} = this.state;
        const fdata = familyData.map((item) => {
          const obj = {};
          Object.keys(item).forEach((key) => {
            if (key !== 'key') {
              obj[key] = item[key].value;
            }
          });
          return obj;
        });
        // console.log(fdata);
        info.familyMember = fdata;
        // console.log(info);
        this.handleAddDocument(info);
      }
    });
  }
  // getFamilyMembers() {
  //   const { familyData } = this.state;
  //   // console.log(familyData);
  //   return <EditableFamilyTable operate="add" data={familyData} setFamilyData={this.setFamilyData.bind(this)}></EditableFamilyTable>
  // }
  setFamilyData(familyData) {
    this.setState({ familyData });
    // console.log(familyData);
  }
  getDefaultDepartment = (currentFileSubId)=>{
    let departmentName = '',departmentFlatMap=this.props.departmentFlatMap;
    if(departmentFlatMap[currentFileSubId].sub && departmentFlatMap[currentFileSubId].sub.length>0){
      departmentName = departmentFlatMap[currentFileSubId].sub[0].resourceName;
    }
    return departmentName;
  }
  handleAddDocument(param) {
    let _this = this;
    const {departmentFlatMap, currentFileId,currentFileSubId, curDepartmentId} = this.props;
    let fileTypeName = currentFileId ? (departmentFlatMap[currentFileId].resourceName||'') : '';
    let fileSubTypeName = currentFileSubId ? (departmentFlatMap[currentFileSubId].resourceName||'') : '';
    let departmentName = curDepartmentId ? (departmentFlatMap[curDepartmentId].resourceName||'') : '';

    param.fileInfoType = fileTypeName;
    param.fileInfoSubType = fileSubTypeName;
    if(departmentName){
      param.department = departmentName;
    }else{
      param.department = this.getDefaultDepartment(currentFileSubId);
    }

    // console.log(param);
    MyWebClient.createFileInfo(param,
      (data, res) => {
        if (res && res.ok) {
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
        _this.setState({ loading: false});
        _this.handleCancel();
      }
    );
  }
  // handleGetFamilyMembers(id) {
  //   let _this = this;
  //   MyWebClient.getSearchFileFamilyMember(id,
  //     (data, res) => {
  //       if (res && res.ok) {
  //         const data = JSON.parse(res.text);
  //        //  console.log(data);
  //         const familyData = []
  //         for (var i = 0; i < data.length; i++) {
  //           const member = data[i];
  //           const memberObj = {};
  //           memberObj.key = member.id;
  //           Object.keys(member).forEach((key) => {
  //             memberObj[key] = {
  //               editable: false,
  //               value: member[key],
  //             }
  //           });
  //           familyData.push(memberObj);
  //         }
  //         _this.setState({ familyData });
  //       }
  //     },
  //     (e, err, res) => {
  //       console.log('get error:', res ? res.text : '');
  //     }
  //   );
  // }
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
        sm: { span: 18 },
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
      }
    };
    // let familyMembersTable = this.getFamilyMembers();
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
                    <FormItem {...formItemLayout} label="序号">
                      {getFieldDecorator('code', {initialValue: ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="姓名">
                      {getFieldDecorator('userName', {
                        initialValue: '',
                        rules: [{
                          required: true, message: '请输入姓名',
                        }],
                      })(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="现任职务">
                      {getFieldDecorator('currentPosition', {initialValue: ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="性别">
                      {getFieldDecorator('gender', {initialValue: ''})(
                        <RadioGroup>
                          <RadioButton value="男">男</RadioButton>
                          <RadioButton value="女">女</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="民族">
                      {getFieldDecorator('famousFamily', {initialValue: ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="籍贯">
                      {getFieldDecorator('nativePlace', {initialValue: ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24} id="addBirthDay">
                    <FormItem {...formItemLayout} label="出生年月">
                      {getFieldDecorator('birthDay', {initialValue: null})(
                        <MonthPicker getCalendarContainer={() => document.getElementById('addBirthDay')} />
                      )}
                    </FormItem>
                  </Col>
                  {/*<Col span={24} id="addDepartmentSelect">
                    <FormItem {...formItemLayout} label="部门">
                      {getFieldDecorator('department', {initialValue: ''})(
                          <Select
                            mode="combobox"
                            size="default"
                            onChange={this.handleChangeDepart}
                            getPopupContainer={() => document.getElementById('addDepartmentSelect')}
                          >
                            {departmentTypes.map((item, index) => {
                              return <Option key={item}>{item}</Option>
                            })}
                          </Select>
                      )}
                    </FormItem>
                  </Col>*/}
                  <Col span={24} id="addJoinWorkerTime">
                    <FormItem {...formItemLayout} label="参加工作时间">
                      {getFieldDecorator('joinWorkerTime', {initialValue: null})(
                        <MonthPicker getCalendarContainer={() => document.getElementById('addJoinWorkerTime')} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24} id="addJoinPartyTime">
                    <FormItem {...formItemLayout} label="入党时间">
                      {getFieldDecorator('joinPartyTime', {initialValue: null})(
                        <MonthPicker getCalendarContainer={() => document.getElementById('addJoinPartyTime')} />
                      )}
                    </FormItem>
                  </Col>

                  <Col span={24} className="tag-list">
                    <p className="info-title">
                      <label>学历学位</label>
                      <a href="javascript:;" className="pull-right p-r-10" onClick={this.handleToggleTag}><Icon type="up" /></a>
                    </p>
                    <Row className="info-body">
                      <Col span={24}>
                        <FormItem {...formItemLayout} label="全日制学历学位">
                          {getFieldDecorator('fullTimeEducation', {initialValue: ''})(
                            <Input type="text" placeholder="" />
                          )}
                        </FormItem>
                      </Col>
                      <Col span={24}>
                      <FormItem {...formItemLayout} label="在职学历学位">
                      {getFieldDecorator('inServiceEducation', {initialValue: ''})(
                        <Input type="text" placeholder="" />
                      )}
                      </FormItem>
                      </Col>
                      <Col span={24}>
                        <FormItem {...formItemLayout} label="所学专业">
                          {getFieldDecorator('graduatesAddress', {initialValue: ''})(
                            <Input type="text" placeholder="" />
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                  </Col>

                  <Col span={24} className="tag-list">
                    <p className="info-title"> </p>
                    <div className="info-body">
                      <Col span={12}  id="reportingTime">
                        <FormItem {...formItemLayout1} label="任现职务时间:">
                          {getFieldDecorator('reportingTime', {initialValue: null})(
                            <MonthPicker getCalendarContainer={() => document.getElementById('reportingTime')} />
                          )}
                        </FormItem>
                      </Col>
                      <Col span={12}  id="approvalTime">
                        <FormItem {...formItemLayout1} label="任现职级时间:">
                          {getFieldDecorator('approvalTime', {initialValue: null})(
                            <MonthPicker getCalendarContainer={() => document.getElementById('approvalTime')} />
                          )}
                        </FormItem>
                      </Col>
                      <Col span={24} >
                        <FormItem label="说明">
                          {getFieldDecorator('approvalOpinion', {initialValue: ''})(
                            <Input type="textarea" placeholder="" autosize={{ minRows: 2, maxRows: 10 }} />
                          )}
                        </FormItem>
                      </Col>
                      <Col span={24}>
                        <FormItem label="出生地">
                          {getFieldDecorator('createParty', {initialValue: ''})(
                            <Input type="text" placeholder="" />
                          )}
                        </FormItem>
                      </Col>
                      <Col span={24}>
                        <FormItem  label="健康状况">
                          {getFieldDecorator('healthStatus', {initialValue: ''})(
                            <Input type="text" placeholder="" />
                          )}
                        </FormItem>
                      </Col>
                      <Col span={24}>
                        <FormItem label="简历">
                          {getFieldDecorator('resume', {initialValue: ''})(
                            <Input type="textarea" placeholder="简历" autosize={{ minRows: 2, maxRows: 10 }} />
                          )}
                        </FormItem>
                      </Col>
                    </div>
                  </Col>
                </Row>
              </Col>

              <Col span={24} className="tag-list">
                <p className="info-title">
                  <label>其他信息</label>
                  <a href="javascript:;" className="pull-right p-r-10" onClick={this.handleToggleTag}><Icon type="up" /></a>
                </p>
                <div className="info-body">
                  <FormItem label="奖惩情况">
                    {getFieldDecorator('certificateOfMerit', {initialValue: ''})(
                      <Input type="textarea" placeholder="" autosize={{ minRows: 2, maxRows: 10 }} />
                    )}
                  </FormItem>
                  <FormItem label="近三年年度考核结果">
                    {getFieldDecorator('annualAssessment', {initialValue: ''})(
                      <Input type="textarea" placeholder="" autosize={{ minRows: 2, maxRows: 10 }} />
                    )}
                  </FormItem>
                  <FormItem label="家庭主要成员情况">
                    {getFieldDecorator('family', {initialValue: ''})(
                      <Input type="textarea" placeholder="" autosize={{ minRows: 2, maxRows: 10 }} />
                    )}
                  </FormItem>
                  <FormItem label="主要社会关系">
                    {getFieldDecorator('appointAndRemoveOpinion', {initialValue: ''})(
                      <Input type="textarea" placeholder="" autosize={{ minRows: 2, maxRows: 10 }} />
                    )}
                  </FormItem>
                </div>
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

export default Form.create()(DocumentAddModalPC);
