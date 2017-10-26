import $ from 'jquery';
import React from 'react';
import moment from 'moment';
import * as Utils from 'utils/utils.jsx';
import MyWebClient from 'client/my_web_client.jsx';

import { Row, Col, Form, Icon, Input, Button, Radio, Table, Modal, DatePicker, notification, Select } from 'antd';
const { MonthPicker } = DatePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;

import head_boy from 'images/head_boy.png';
import head_girl from 'images/head_girl.png';

// import EditableFamilyTable from './family_table.jsx';

class DocumentEditModalPC extends React.Component {
  state = {
    loading: false,
    familyData: [],
    isMobile: Utils.isMobile()
  }
  componentDidMount(){
    // if(this.props.memberInfo.id){
    //   MyWebClient.getDocumentInfoById(this.props.memberInfo.id,(res)=>{
    //     console.log("getDocumentInfoById--:",res);
    //   });
    // }
  }
  componentWillReceiveProps(nextProps) {
    const {memberInfo} = this.props;
    if (nextProps.memberInfo.id !== memberInfo.id) {
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
    // console.log('memberInfo', memberInfo);
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.id = memberInfo.id;
        Object.keys(values).forEach((key) => {
          if (key == 'birthDay' || key == 'joinPartyTime' || key == 'joinWorkerTime'
            || key == 'reportingTime' || key == 'approvalTime' || key == 'appointAndRemoveTime' ) {
            values[key] = values[key] ? moment(values[key]).format('YYYY/MM') : '';
          }
        });
        // console.log(values);
        this.handleEditDocument({
          ...values
        });
      }
    });
  }
  handleCancel = () => {
    // this.setState({ visible: false });
    this.props.form.resetFields();
    this.props.handleCancelModal();
  }
  // getFamilyMembers() {
  //   const { familyData } = this.state;
  //   const {memberInfo} = this.props;
  //   // console.log(familyData);
  //   return <EditableFamilyTable operate="edit" data={familyData} memberInfo={memberInfo} setFamilyData={this.setFamilyData.bind(this)} handleGetFamilyMembers={this.handleGetFamilyMembers.bind(this)}></EditableFamilyTable>
  // }
  setFamilyData(familyData) {
    this.setState({ familyData });
  }
  handleEditDocument(param) {
    let _this = this;
    let {memberInfo} = this.props;
    param.fileInfoType = memberInfo.fileInfoType;
    param.fileInfoSubType = memberInfo.fileInfoSubType;

    param.department = memberInfo.department;
    param.department = param.department ? param.department : this.getDefaultDepartment(param.fileInfoSubType);
    !param.department? delete param.department:null;

    // console.log("编辑档案--param:",param);
    delete param['key']; delete param['familyMember'];
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
          this.props.handleCancelModal();
        }
      },
      (e, err, res) => {
        _this.openNotification('error', '编辑档案失败');
        // console.log('get error:', res ? res.text : '');
        _this.setState({ loading: false});
        _this.handleCancel();
      }
    );
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
    const { memberInfo, departmentTypes } = this.props;
    // console.log(memberInfo);
    let defaultGender = null, head_img = null;
    if (memberInfo.gender == '男') {
      head_img = head_boy;
    } else if (memberInfo.gender == '女') {
      head_img = head_girl;
    }
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
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
                    <FormItem {...formItemLayout} label="序号">
                      {getFieldDecorator('code', {initialValue: memberInfo.code || ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
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
                    <FormItem {...formItemLayout} label="现任职务">
                      {getFieldDecorator('currentPosition', {initialValue: memberInfo.currentPosition || ''})(
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
                  <Col span={24} id="editBirthDay">
                    <FormItem {...formItemLayout} label="出生年月">
                      {getFieldDecorator('birthDay', {initialValue: memberInfo.birthDay ? moment(memberInfo.birthDay, 'YYYY/MM') : null})(
                        <MonthPicker getCalendarContainer={() => document.getElementById('editBirthDay')} />
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
                  <Col span={24} id="editJoinPartyTime">
                    <FormItem {...formItemLayout} label="入党时间:">
                      {getFieldDecorator('joinPartyTime', {initialValue: memberInfo.joinPartyTime ? moment(memberInfo.joinPartyTime, 'YYYY/MM') : null})(
                        <MonthPicker getCalendarContainer={() => document.getElementById('editJoinPartyTime')} />
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
                          {getFieldDecorator('fullTimeEducation', {initialValue: memberInfo.fullTimeEducation || ''})(
                            <Input type="text" placeholder="" />
                          )}
                        </FormItem>
                      </Col>
                      <Col span={24}>
                        <FormItem {...formItemLayout} label="在职学历学位">
                          {getFieldDecorator('inServiceEducation', {initialValue: memberInfo.inServiceEducation || ''})(
                            <Input type="text" placeholder="" />
                          )}
                        </FormItem>
                      </Col>
                      <Col span={24}>
                        <FormItem {...formItemLayout} label="所学专业">
                          {getFieldDecorator('graduatesAddress', {initialValue: memberInfo.graduatesAddress || ''})(
                            <Input type="text" placeholder="" />
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                  </Col>

                  <Col span={24} className="tag-list">
                    <p className="info-title"></p>
                    <div className="info-body">
                      <Col span={12}  id="edit_reportingTime">
                        <FormItem {...formItemLayout1} label="任现职务时间:">
                          {getFieldDecorator('reportingTime', {initialValue: memberInfo.reportingTime ? moment(memberInfo.reportingTime, 'YYYY/MM') : null})(
                            <MonthPicker getCalendarContainer={() => document.getElementById('edit_reportingTime')} />
                          )}
                        </FormItem>
                      </Col>
                      <Col span={12}  id="edit_approvalTime">
                        <FormItem {...formItemLayout1} label="任现职级时间:">
                          {getFieldDecorator('approvalTime', {initialValue: memberInfo.approvalTime ? moment(memberInfo.approvalTime, 'YYYY/MM') : null})(
                            <MonthPicker getCalendarContainer={() => document.getElementById('edit_approvalTime')} />
                          )}
                        </FormItem>
                      </Col>
                      <Col span={24} >
                        <FormItem label="说明">
                          {getFieldDecorator('approvalOpinion', {initialValue:memberInfo.approvalOpinion || ''})(
                            <Input type="textarea" placeholder="" autosize={{ minRows: 2, maxRows: 10 }} />
                          )}
                        </FormItem>
                      </Col>
                      <Col span={24}>
                        <FormItem label="出生地">
                          {getFieldDecorator('createParty', {initialValue: memberInfo.createParty || ''})(
                            <Input type="text" placeholder="" />
                          )}
                        </FormItem>
                      </Col>
                      <Col span={24}>
                        <FormItem label="健康状况">
                          {getFieldDecorator('healthStatus', {initialValue: memberInfo.healthStatus || ''})(
                            <Input type="text" placeholder="" />
                          )}
                        </FormItem>
                      </Col>
                    </div>
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
                  <FormItem label="家庭主要成员情况">
                    {getFieldDecorator('family', {initialValue: memberInfo.family || ''})(
                      <Input type="textarea" placeholder="" autosize={{ minRows: 2, maxRows: 10 }} />
                    )}
                  </FormItem>
                  <FormItem label="主要社会关系">
                    {getFieldDecorator('appointAndRemoveOpinion', {initialValue: memberInfo.appointAndRemoveOpinion || ''})(
                      <Input type="textarea" placeholder="" autosize={{ minRows: 2, maxRows: 10 }} />
                    )}
                  </FormItem>
                </div>
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

export default Form.create()(DocumentEditModalPC);
