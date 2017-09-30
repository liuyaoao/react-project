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
      let hasOperaPermission = permissionData['document'] ? permissionData['document'].indexOf('action') != -1 : false;
      this.state = {
        isMobile: Utils.isMobile(),
        uploading:false,
        hasOperaPermission:hasOperaPermission, //是否有操作权限。
      };
  }
  componentDidMount() {
    // this.props.form.validateFields();
  }
  handleSubmit = (e) => { //点击查询
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        const params = {};
        Object.keys(values).forEach((key) => {
          if (values[key]) {
            params[key] = values[key];
          }
        });
        // console.log('Received search params: ', params);
        this.props.handleSearch(null,Object.assign({},{"from":0,"to":10},params));
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
    const {departmentFlatMap,currentFileId, currentFileSubId,curDepartmentId, departmentData } = this.props;

    let downloadTemplateLink = null, formItemInput = null,formItemInput2 = null, action_url = '', uploadDocName = ''; //导入时的提示信息。
    let fileTypeName = currentFileId ? (departmentFlatMap[currentFileId].resourceName||'') : '';
    let fileSubTypeName = currentFileSubId ? (departmentFlatMap[currentFileSubId].resourceName||'') : '';
    let departmentName = curDepartmentId ? (departmentFlatMap[curDepartmentId].resourceName||'') : '';
    let outputUrl = ':;';
    if ( (["市局机关","局属二级机构","公证员"]).indexOf(fileSubTypeName)!=-1 ) {
      formItemInput=(
        <FormItem label="姓名" className="p-r-10"> {getFieldDecorator('userName')( <Input placeholder="" /> )} </FormItem>
      );
      downloadTemplateLink = (
          <a type="button" className="btn btn-info" style={{ marginLeft: '10px' }}
            href={window.serverUrl+"/modle/personnelFiles.xls"}><Icon type="download" /> 下载干部简历模板
          </a>
        );
      action_url = MyWebClient.getfileInfoImportUrl();
      uploadDocName = fileSubTypeName+"人员";
      outputUrl = MyWebClient.getBaseRoute() + "/export/fileinformation/cadre?department="+ departmentName + "&fileInfoSubType=" + fileSubTypeName + "&fileInfoType=" + fileTypeName;
    }else if(fileSubTypeName == '区县司法局'){

      uploadDocName = "区县司法局人员";
    }else if(fileSubTypeName == '司法所'){
      formItemInput=(
        <FormItem label="姓名" className="p-r-10"> {getFieldDecorator('userName')( <Input placeholder="" /> )} </FormItem>
      );
      downloadTemplateLink = (
        <a type="button" className="btn btn-info" style={{ marginLeft: '10px' }}
          href={window.serverUrl+"/modle/sifa_director_template.xlsx"}><Icon type="download" /> 下载模板(司法所长)
        </a>
      );
      action_url = MyWebClient.getSifa_DirectorImportUrl();
      uploadDocName = "司法所人员";
      outputUrl = MyWebClient.getBaseRoute() + "/export/fileinformation/superintendent?department="+ departmentName + "&fileInfoSubType=" + fileSubTypeName + "&fileInfoType=" + fileTypeName;
    }else if(fileSubTypeName == '法律援助中心'){

      uploadDocName = "法律援助中心人员";
    }else if(fileSubTypeName == '法律援助律师'){

      uploadDocName = "法律援助律师人员";
    }else if(fileSubTypeName == '公证处'){

      uploadDocName = "公证处人员";
    }else if ( fileSubTypeName == '律师事务所' ) {
      formItemInput=(
        <FormItem label="律所名称" className="p-r-10"> {getFieldDecorator('lawOfficeName')( <Input placeholder="" /> )} </FormItem>
      );
      formItemInput2=(
        <FormItem label="律所责任人" className="p-r-10"> {getFieldDecorator('lawOfficePrincipal')( <Input placeholder="" /> )} </FormItem>
      );
      downloadTemplateLink = (
        <a type="button" className="btn btn-info" style={{ marginLeft: '10px' }}
          href={window.serverUrl+"/modle/layfirm.xlsx"}><Icon type="download" /> 下载模板(律所)
        </a>
      );
      action_url = MyWebClient.getlawfirmfileInfoImportUrl();
      uploadDocName = "律师事务所人员";
      outputUrl = MyWebClient.getBaseRoute() + "/export/fileinformation/lawfirm?department="+ departmentName + "&fileInfoSubType=" + fileSubTypeName + "&fileInfoType=" + fileTypeName;

    }else if ( fileSubTypeName == '律师' ){
      downloadTemplateLink = <a type="button" className="btn btn-info" style={{ marginLeft: '10px' }}
      href={window.serverUrl+"/modle/lawyerFile.xlsx"}><Icon type="download" /> 下载模板(律师) </a>;
      action_url = MyWebClient.getLawyerfileInfoImportUrl();
      uploadDocName = "律师人员";
      outputUrl = MyWebClient.getBaseRoute() + "/export/fileinformation/lawyer?department="+ departmentName + "&fileInfoSubType=" + fileSubTypeName + "&fileInfoType=" + fileTypeName;
    }else if ( fileSubTypeName == '基层法律服务所' ){
      uploadDocName = "基层法律服务所人员";
    }else if ( fileSubTypeName == '基层法律工作者' ){
      downloadTemplateLink = (
        <a type="button" className="btn btn-info" style={{ marginLeft: '10px' }}
          href={window.serverUrl+"/modle/legal_workers_template.xls"}><Icon type="download" /> 下载模板(基层法律工作者)
        </a>
      );
      action_url = MyWebClient.getLegalWorkerImportUrl();
      uploadDocName = "基层法律工作者";
      outputUrl = MyWebClient.getBaseRoute() + "/export/fileinformation/grassroots?department="+ departmentName + "&fileInfoSubType=" + fileSubTypeName + "&fileInfoType=" + fileTypeName;
    }else if(fileSubTypeName == '司法鉴定所'){

      uploadDocName = "司法鉴定所人员";
    }else if(fileSubTypeName == '司法鉴定人员'){

      uploadDocName = "司法鉴定人员";
    }else if ( fileTypeName == '司考通过人员' ){
      downloadTemplateLink = (
        <a type="button" className="btn btn-info" style={{ marginLeft: '10px' }}
          href={window.serverUrl+"/modle/judexam.xlsx"}><Icon type="download" /> 下载模板(司法考试处)
        </a>
      );
      action_url = MyWebClient.getjudicialexamInfoImportUrl();
      uploadDocName = "司考通过人员";
      outputUrl = MyWebClient.getBaseRoute() + "/export/fileinformation/judicialExamination?department="+ departmentName + "&fileInfoSubType=" + fileSubTypeName + "&fileInfoType=" + fileTypeName;
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

    return (
      <div>
        <Form layout="inline"
          className="ant-advanced-search-form"
          onSubmit={this.handleSubmit}
          >
          {formItemInput?formItemInput:(
            <FormItem label="姓名" className="p-r-10"> {getFieldDecorator('userName')( <Input placeholder="" /> )} </FormItem>
          )}
          {formItemInput2?formItemInput2:(
            <FormItem label="性别">
              {getFieldDecorator('gender')(
                <RadioGroup>
                  <RadioButton value="男" onClick={this.handleGenderChange.bind(this)}>男</RadioButton>
                  <RadioButton value="女" onClick={this.handleGenderChange.bind(this)}>女</RadioButton>
                </RadioGroup>
              )}
            </FormItem>
          )}
          <FormItem label="">
            <button type="submit" className="btn btn-primary comment-btn"><Icon type="search" /> 搜索</button>
          </FormItem>
          {this.state.hasOperaPermission ? (<FormItem label="" className="" style={{marginRight: 0}}>
            <Upload {...uploadField}>
              <button type="button" className="btn btn-default"><Icon type="upload" /> 导入</button>
            </Upload>
            { downloadTemplateLink }
            <a style={{ marginLeft: '10px' }} href={outputUrl} className="btn btn-default" target="_blank">导出</a>
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
