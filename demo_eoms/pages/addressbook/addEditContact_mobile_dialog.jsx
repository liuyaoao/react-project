import $ from 'jquery';
import React from 'react';
import myWebClient from 'client/my_web_client.jsx';
import * as Utils from 'utils/utils.jsx';

import { Row, Col, Form,Button, Icon, Input,notification, Select, message,Modal } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

message.config({
  top: 75,
  duration: 2,
});
notification.config({
  top: 68,
  duration: 3
});
const initContactInfo = {
  id:"",
  userName:'',
  groupShortCode:'',
  organization:'',
  secondaryDirectory:'',
  level3Catalog:'',
  telephoneNumber:'',
  landline:''
}
const donNeedParams = ['key'];

class AddEditContactMobileDialog extends React.Component {
  constructor(props) {
      super(props);
      this.showModal = this.showModal.bind(this);
      this.closeDialog = this.closeDialog.bind(this);
      this.handleAddOrEdit = this.handleAddOrEdit.bind(this);
      this.handleCancel = this.handleCancel.bind(this);
      this.state = {
        loading: false,
        selectOrganization:'', //一级目录
        selectSecondaryDirectory:'', //二级目录
        selectLevel3Catalog:'', //已选的三级目录
        confirmDirty:false,
        contactInfo:{},
        isAdd:true, //判断是否是新增弹窗
        visible: false
      };
  }

  componentWillMount(){
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.visible
       && nextProps.contactInfo.id != this.props.contactInfo.id){
      this.setState({
        contactInfo:nextProps.contactInfo || {},
        selectOrganization:nextProps.contactInfo.organization||'',
        selectSecondaryDirectory:nextProps.contactInfo.secondaryDirectory||'',
        selectLevel3Catalog:nextProps.contactInfo.level3Catalog||''
      });
    }
    if(nextProps.visible && nextProps.contactInfo.id){
      let isAdd = !!nextProps.contactInfo.id ? false : true;
      this.setState({
        contactInfo:nextProps.contactInfo || {},
        selectOrganization:nextProps.contactInfo.organization||'',
        selectSecondaryDirectory:nextProps.contactInfo.secondaryDirectory||'',
        selectLevel3Catalog:nextProps.contactInfo.level3Catalog||'',
        isAdd:isAdd});
    }
    if(this.props.organizationsFlatData.length != nextProps.organizationsFlatData.length){
    }

    if(!nextProps.visible){
      this.props.form.resetFields();
      this.setState({isAdd:true,contactInfo:{},selectOrganization:'',selectSecondaryDirectory:'',selectLevel3Catalog:''});
    }
  }
  showModal = () => {
    this.setState({visible: true});
  }
  closeDialog = ()=>{
    this.setState({ loading: false});
    this.props.closeAddEditDialog();
  }
  handleAddOrEdit = (data) => {
    // console.log("handleAddOrEdit:",data);
    this.setState({ loading: true });
    let form = this.props.form;
    this.props.form.validateFields((err, values) => {
        this.setState({ loading: false});
        if (!err) {
          this.realSubmit();
        }
    });
  }
  realSubmit(){
    let submitInfo = this.props.form.getFieldsValue();
    // console.log("新增or修改联系人信息的submitInfo参数--：",submitInfo);
    let params = Object.assign({},initContactInfo,this.state.contactInfo,submitInfo);
    params = this.parseSendServerParams(params);

    let actionName = this.state.isAdd ? "add" : "update"; //获取接口名字
    let desc = this.props.contactInfo.id ? "修改" : "新增"; //
    myWebClient.addOrEditContacts(actionName,params,
      (data,res)=>{
        this.props.afterAddEditContactsCall();
        this.closeDialog();
        notification.success({message: desc+'联系人成功！'});
        console.log("addNewContacts success: ",data,res);
      },(e,err,res)=>{
        this.closeDialog();
        notification.error({message: desc+'联系人失败！'});
        console.log("addNewContacts error: ",err);
      });
  }

  parseSendServerParams(params){
    let {contactInfo} = this.state;
    donNeedParams.map((val)=>{
      delete params[val];
      return '';
    });
    params['organization'] = this.state.selectOrganization.split("_")[0];
    params['secondaryDirectory'] = this.state.selectSecondaryDirectory.split("_")[0];
    params['level3Catalog'] = this.state.selectLevel3Catalog.split("_")[0];
    // console.log("新增or修改用户信息的参数--：",params);
    return params;
  }

  handleCancel = () => {
    this.setState({ visible: false,loading:false });
    this.props.closeAddEditDialog();
  }

  getOrganiTreeOptions(){ //得到一级目录的options下拉选项。
    let optionsArr = [];
    $.each(this.props.organizationsData, (k, obj)=>{
      if(obj.id != "-1"){
        optionsArr.push(<Option key={k} value={obj.id}>{obj.name}</Option>);
      }
    });
    return optionsArr;
  }
  getSecondaryDirectoryTreeOptions(){ //得到二级目录的options下拉选项。
    let optionsArr = [];
    let {selectOrganization} = this.state;
    $.each(this.props.organizationsData, (k, obj)=>{
      if(obj.name == selectOrganization.split("_")[0]){
        $.each(obj.subtrees||[], (index,item)=>{
          optionsArr.push(<Option key={index} value={item.id}>{item.name}</Option>);
        });
      }
    });
    return optionsArr;
  }
  getLevel3CatalogTreeOptions(){ //得到3级目录的options下拉选项。
    let optionsArr = [];
    let {selectOrganization} = this.state;
    let {selectSecondaryDirectory} = this.state;
    $.each(this.props.organizationsData, (k, obj)=>{
      if(obj.name == selectOrganization.split("_")[0]){
        $.each(obj.subtrees||[], (i,temp)=>{
          if(temp.name == selectSecondaryDirectory.split("_")[0]){
            $.each(temp.subtrees||[], (index,item)=>{
              optionsArr.push(<Option key={index} value={item.id}>{item.name}</Option>);
            });
          }
        });
      }
    });
    return optionsArr;
  }
  handleOrganiSelected = (val)=>{ //一级目录的下拉选中时
    this.setState({
      selectOrganization:val
    });
  }
  handleSecondaryDirectorySelected = (val)=>{ //二级目录下拉选中时
    this.setState({
      selectSecondaryDirectory:val
    });
  }
  handleLevel3CatalogSelected = (val)=>{ //三级目录下拉选中时
    this.setState({
      selectLevel3Catalog:val
    });
  }

  handleOrganiChanged = (evt)=>{ //一级目录的手动输入改变
    this.setState({
      selectOrganization:evt.target.value
    });
  }
  handleSecondaryDirectoryChanged = (evt)=>{
    this.setState({
      selectSecondaryDirectory:evt.target.value
    });
  }
  handleLevel3CatalogChanged = (evt)=>{
    this.setState({
      selectLevel3Catalog:evt.target.value
    });
  }

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const { contactInfo } = this.state;

    return (<div>
      <Modal className={this.props.visible?"contact-edit-mobile doc-edit-form-mobile":""}
        visible={this.props.visible}
        title={this.state.isAdd?'新增联系人':'编辑联系人'}
        onClose={this.handleCancel}
        width="96%"
        footer={[
          // <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleAddOrEdit}>保存</Button>,
          <Button key="back" type="primary" size="large" onClick={this.handleCancel}>关闭</Button>,
        ]}
      >
        <div className="" style={{padding:'1em 0'}}>
          <Form  className="" style={{margin:0}}>
            <Row>
              <Col span={24} className="tag-list">
                <Row className="info-body">
                  <Col span={24}>
                    <FormItem
                      {...formItemLayout}
                      label="用户名："
                    >
                      {getFieldDecorator('userName', {
                        initialValue:contactInfo.userName,
                        rules: [{
                          required: true, message: '用户名为必填项！', whitespace: true
                        }],
                      })(
                        <Input type="text"/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="集团短码：">
                      {getFieldDecorator('groupShortCode', {
                        initialValue:contactInfo.groupShortCode,
                        rules: [{
                          required: true, message: '集团短码为必填项！', whitespace: true
                        }],
                      })(
                        <Input type="text"/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="手机号码：">
                      {getFieldDecorator('telephoneNumber', {
                        initialValue:contactInfo.telephoneNumber,
                      })(
                        <Input type="text"/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="座机号码：">
                      {getFieldDecorator('landline', {
                        initialValue:contactInfo.landline,
                      })(
                        <Input type="text"/>
                      )}
                    </FormItem>
                  </Col>

                  <Col span={24}>
                    <FormItem {...formItemLayout} label="一级目录：">
                      <Select showSearch style={{ width: '49%' }}
                        placeholder="请选择一级目录"
                        optionFilterProp="children"
                        value={this.state.selectOrganization}
                        onSelect={this.handleOrganiSelected}
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                        {this.getOrganiTreeOptions()}
                      </Select>
                      <Input value={this.state.selectOrganization.split("_")[0]}
                        onChange={this.handleOrganiChanged}
                        placeholder="手动填写"
                        style={{width:'48%',display:'inline-block',marginLeft:'1%'}}/>
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="二级目录：">
                      <Select showSearch style={{ width: '49%' }}
                        placeholder="请选择二级目录"
                        optionFilterProp="children"
                        value={this.state.selectSecondaryDirectory}
                        onSelect={this.handleSecondaryDirectorySelected}
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                        {this.getSecondaryDirectoryTreeOptions()}
                      </Select>
                      <Input value={this.state.selectSecondaryDirectory.split("_")[0]}
                        onChange={this.handleSecondaryDirectoryChanged}
                        placeholder="手动填写"
                        style={{width:'48%',display:'inline-block',marginLeft:'1%'}}/>
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="三级目录：">
                      <Select showSearch style={{ width: '49%' }}
                        placeholder="请选择三级目录"
                        optionFilterProp="children"
                        value={this.state.selectLevel3Catalog}
                        onSelect={this.handleLevel3CatalogSelected}
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                        {this.getLevel3CatalogTreeOptions()}
                      </Select>
                      <Input value={this.state.selectLevel3Catalog.split("_")[0]}
                        onChange={this.handleLevel3CatalogChanged}
                        placeholder="手动填写"
                        style={{width:'48%',display:'inline-block',marginLeft:'1%'}}/>
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
    </div>
    )
  }
}

AddEditContactMobileDialog.defaultProps = {
};

AddEditContactMobileDialog.propTypes = {
  visible:React.PropTypes.bool,
  contactInfo:React.PropTypes.object,
  organizationsData:React.PropTypes.array,
  organizationsFlatData:React.PropTypes.array,
  organizationsFlatDataMap:React.PropTypes.object,
  closeAddEditDialog:React.PropTypes.func,
  afterAddEditContactsCall:React.PropTypes.func
};

export default Form.create()(AddEditContactMobileDialog);
