import React from 'react';
import UserStore from 'stores/user_store.jsx';

import { Form, Icon, Input, Button, Radio, Upload, message, Spin, Alert } from 'antd';
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

import * as Utils from 'utils/utils.jsx';
import MyWebClient from 'client/my_web_client.jsx';

message.config({
  top: 75,
  duration: 2,
});

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class SearchFormPC extends React.Component {
  constructor(props) {
      super(props);
      this.beforeUploadCall = this.beforeUploadCall.bind(this);
      this.fileUploadChange = this.fileUploadChange.bind(this);
      let permissionData = UserStore.getPermissionData();
      let hasOperaPermission = permissionData['sys_config'].indexOf('action') != -1;
      this.state = {
        isMobile: Utils.isMobile(),
        uploading:false,
        hasOperaPermission:hasOperaPermission, //是否有操作权限。
      };
  }
  componentDidMount() {
    // this.props.form.validateFields();
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        const param = {};
        Object.keys(values).forEach((key) => {
          if (values[key]) {
            param[key] = values[key];
          }
        });
        // console.log('Received search params: ', param);
        this.props.handleSearch(param);
      }
    });
  }
  handleGenderChange(e) {
    if (e.target.checked) {
      const searchFormPC = this.props.form;
      searchFormPC.setFieldsValue({
        gender: ''
      });
    }
  }
  beforeUploadCall(file) {
    // console.log('file beforeUploadCall :',file);
    let fileNameSplit = file.name.split('.');
    if(fileNameSplit[fileNameSplit.length-1] != "xlsx" && fileNameSplit[fileNameSplit.length-1] != "xls"){
      this.props.openNotification('info', '只能上传excel文档');
      return false;
    }
    this.setState({
      uploading:true,
    });
    return true;
  }
  fileUploadChange(obj) {
    // console.log('file upload change', obj);
    if(obj.file.status == "done" && obj.file.response == "success"){
      this.setState({
        uploading:false,
      });
      console.log('success');
      this.props.openNotification('success', '档案导入成功');
      this.props.handleSearch();
    } else if (obj.file.status == "error") {
      console.log('faiel');
      this.setState({
        uploading:false,
      });
      this.props.openNotification('error', '档案导入失败');
    }
  }

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

    let downloadTemplateLink = '',action_url = '';
    if ( this.props.currentFileSubType == '律师' ) {
      downloadTemplateLink = <a type="button" className="btn btn-info" style={{ marginLeft: '10px' }}
        href={window.serverUrl+"/modle/LawyerFile.xlsx"}><Icon type="download" /> 下载模板(律师)</a>;
      action_url = MyWebClient.getLawyerfileInfoImportUrl();
    } else if ( this.props.currentDepartment == '律所' ) {
      downloadTemplateLink = (
        <a type="button" className="btn btn-info" style={{ marginLeft: '10px' }}
          href={window.serverUrl+"/modle/layfirm.xlsx"}><Icon type="download" /> 下载模板(律所)
        </a>
      );
      action_url = MyWebClient.getlawfirmfileInfoImportUrl();
    } else if ( this.props.currentDepartment == '司法考试处' ){
      downloadTemplateLink = (
        <a type="button" className="btn btn-info" style={{ marginLeft: '10px' }}
          href={window.serverUrl+"/modle/judexam.xlsx"}><Icon type="download" /> 下载模板(司法考试处)
        </a>
      );
      action_url = MyWebClient.getjudicialexamInfoImportUrl();
    } else if ( this.props.currentDepartment == '基层法律工作者' ){
      downloadTemplateLink = (
        <a type="button" className="btn btn-info" style={{ marginLeft: '10px' }}
          href={window.serverUrl+"/modle/legal_workers_template.xls"}><Icon type="download" /> 下载模板(基层法律工作者)
        </a>
      );
      action_url = MyWebClient.getLegalWorkerImportUrl();
    } else if ( this.props.currentFileSubType == '司法所长' ){
      downloadTemplateLink = (
        <a type="button" className="btn btn-info" style={{ marginLeft: '10px' }}
          href={window.serverUrl+"/modle/sifa_director_template.xlsx"}><Icon type="download" /> 下载模板(司法所长)
        </a>
      );
      action_url = MyWebClient.getSifa_DirectorImportUrl();
    } else {
      downloadTemplateLink = (
          <a type="button" className="btn btn-info" style={{ marginLeft: '10px' }}
            href={window.serverUrl+"/modle/personnelFiles.xlsx"}><Icon type="download" /> 下载模板(人事)
          </a>
        );
      action_url = MyWebClient.getfileInfoImportUrl();
    }

    const uploadField = {
      name: 'file',
      action: action_url,
      headers:MyWebClient.defaultHeaders,
      showUploadList:false,
      accept: 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      beforeUpload: this.beforeUploadCall,
      onChange: this.fileUploadChange
    }
    // console.log('搜索栏',this.props.currentFileSubType);
    // "/static/template/" + (this.props.currentFileSubType == '律师' ? '律师人事档案模板' : '其他人事档案模板') + ".xlsx"
    let uploadDocName = '';
    if((["律所","司法考试处","基层法律工作者"]).indexOf(this.props.currentDepartment) != -1){
      uploadDocName = this.props.currentDepartment;
    }else{
      uploadDocName = this.props.currentFileSubType;
    }

    return (
      <div>
        <Form layout="inline"
          className="ant-advanced-search-form"
          onSubmit={this.handleSubmit}
          >
          {/*<FormItem label="部门" className="p-r-10">
            {getFieldDecorator('department')(
              <Input placeholder="" />
            )}
          </FormItem>*/}
          {
            this.props.currentDepartment == '律所'?
            <FormItem label="律所名称" className="p-r-10">
              {
                getFieldDecorator('lawOfficeName')(
                  <Input placeholder="" />
                )
              }
            </FormItem>:
            <FormItem label="姓名" className="p-r-10">
              {
                getFieldDecorator('userName')(
                  <Input placeholder="" />
                )
              }
            </FormItem>
          }

          {
            this.props.currentDepartment == '律所'?
            <FormItem label="律所责任人" className="p-r-10">
              {
                getFieldDecorator('lawOfficePrincipal')(
                  <Input placeholder="" />
                )
              }
            </FormItem>:
            <FormItem label="性别">
              {getFieldDecorator('gender')(
                <RadioGroup>
                  <RadioButton value="男" onClick={this.handleGenderChange.bind(this)}>男</RadioButton>
                  <RadioButton value="女" onClick={this.handleGenderChange.bind(this)}>女</RadioButton>
                </RadioGroup>
              )}
            </FormItem>
          }

          <FormItem label="">
            <button type="submit" className="btn btn-primary comment-btn"><Icon type="search" /> 搜索</button>
          </FormItem>
          {this.state.hasOperaPermission ? (<FormItem label="" className="" style={{marginRight: 0}}>
            <Upload {...uploadField}>
              <button type="button" className="btn btn-default"><Icon type="upload" /> 导入</button>
            </Upload>
            { downloadTemplateLink }
          </FormItem>) : null}
        </Form>
        <div className={this.state.uploading?'visibleCls':'notVisibleCls'}>
          <Spin spinning={this.state.uploading} tip="Loading...">
            <Alert style={{textAlign:'center',lineHeight: '40px'}}
              message={"正在导入"+uploadDocName+"档案!"}
              description=""
              type="info"
              />
          </Spin>
        </div>
      </div>
    );
  }
}
const WrappedSearchFormPC = Form.create()(SearchFormPC);

export default WrappedSearchFormPC;
