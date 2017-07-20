import $ from 'jquery';
import React from 'react';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import moment from 'moment';
import { createForm } from 'rc-form';

import myWebClient from 'client/my_web_client.jsx';
import { Toast, WingBlank, WhiteSpace, Button, InputItem,
  TextareaItem,Flex,List,Picker,DatePicker} from 'antd-mobile';

import {Icon,Upload } from 'antd';
//督办管理的新增内容
class AddContentCompRaw extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        nowDate:moment(new Date()).format('YYYY-MM-DD'),
        dblx:"", //督办类型
        swrq:moment(new Date()).format('YYYY-MM-DD'), //收文日期
        blsx:moment(new Date()).format('YYYY-MM-DD'), //截至日期
      };
  }
  componentWillMount(){
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.formData.dblx!=this.props.formData.dblx){
      this.setState({
        dblx :nextProps.formData.dblx
      });
    }
    if(nextProps.newAdding && !this.props.newAdding){ //点击了保存按钮了。
      this.addNewSave();
    }
  }
  addNewSave = ()=>{  //编辑保存
    let tempFormData = this.props.form.getFieldsValue();
    tempFormData['dblx'] = this.state.dblx;
    tempFormData['swrq'] = this.state.swrq;
    tempFormData['blsx'] = this.state.blsx;
    OAUtils.saveModuleFormData({
      moduleName:this.props.moduleNameCn,
      tokenunid:this.props.tokenunid,
      unid:this.props.formData.unid,
      formParams:Object.assign({},this.props.formParams,this.props.formData,tempFormData), //特有的表单参数数据。
      successCall: (data)=>{
        console.log("新建-督办管理的返回数据:",data);
        let formData = OAUtils.formatFormData(data.values);
        this.props.afterAddNewCall(formData);
        Toast.info('新建保存成功!!', 2);
      },
      errorCall:(res)=>{
        Toast.info('新建保存失败!!', 1);
      }
    });
  }

  beforeUploadCall(file) {
    return true;
  }
  fileUploadChange(obj) {
    if(obj.file.status == "done" && obj.file.response == "success"){
    } else if (obj.file.status == "error") {
    }
  }
  onDblxPickerOk = (val)=>{
    this.setState({
      dblx:val[0],
    });
  }
  onSwrqDateChange = (val)=>{  //收文日期
    console.log("onSwrqDateChange-收文日期--:",val);
    this.setState({
      swrq:val.format('YYYY-MM-DD'),
    });
  }
  onBlsxDateChange = (val)=>{ //截止日期
    this.setState({
      blsx:val.format('YYYY-MM-DD'),
    });
  }

  render() {
    const { getFieldProps } = this.props.form;
    const { formData, formDataRaw} = this.props;
    let items = formDataRaw.dblx?formDataRaw.dblx.items:[];
    //督办类别当前值就是dblx字段的值。
    let superviseTypes = items.map((item)=>{ //督办类别
      return {
        label:item.text,
        value:item.value
      }
    });
    const uploadField = {
      name: 'inputName',
      action: '',
      headers:myWebClient.defaultHeaders,
      showUploadList:false,
      accept: 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      beforeUpload: this.beforeUploadCall,
      onChange: this.fileUploadChange
    }
    return (
      <div>
        <div className={'oa_detail_cnt'}>
          <div className={'oa_detail_title'} style={{width:'100%',textAlign:'center'}}>长沙司法局督办处理单</div>
          <WhiteSpace size='md' />
        <Flex>
            <Flex.Item>
              <List style={{ backgroundColor: 'white' }}>
                <Picker data={superviseTypes} cols={1}
                  value={[this.state.dblx||'']}
                  onOk={this.onDblxPickerOk}>
                  <List.Item arrow="horizontal">督办类型：</List.Item>
                </Picker>
              </List>
            </Flex.Item>
          </Flex>
          <WhiteSpace size='md' style={{borderBottom:'1px solid #c7c3c3',marginBottom:'0.1rem'}}/>
          <Flex>
            <Flex.Item>
              <InputItem {...getFieldProps('lsh')}
                editable={true}
                placeholder={'请输入...'}
                labelNumber={4}>收文号：</InputItem>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className="select_container">
                <DatePicker className=""
                  mode="date"
                  onChange={this.onSwrqDateChange}
                  value={moment(this.state.swrq)}
                >
                <List.Item arrow="horizontal">收文日期：</List.Item>
                </DatePicker>
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>来文单位：</div>
              <TextareaItem
                {...getFieldProps('lwdw')}
                placeholder={'请输入...'}
                rows={3}
                labelNumber={0}
              />
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className="select_container">
                <DatePicker className=""
                  mode="date"
                  onChange={this.onBlsxDateChange}
                  value={moment(this.state.blsx)}
                >
                <List.Item arrow="horizontal">截止日期：</List.Item>
                </DatePicker>
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <InputItem {...getFieldProps('cb')}
                editable={true}
                placeholder={'请输入...'}
                labelNumber={4}>催办：</InputItem>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <InputItem {...getFieldProps('yh')}
                editable={true}
                placeholder={'请输入...'}
                labelNumber={4}>原号：</InputItem>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>文件标题：</div>
              <TextareaItem
                placeholder={'请输入...'}
                {...getFieldProps('bt')}
                title=""
                rows={4}
                labelNumber={0}
              />
            </Flex.Item>
          </Flex>
          <WhiteSpace size='md' style={{borderBottom:'1px solid #c7c3c3',marginBottom:'0.1rem'}}/>
          <Flex>
            <Flex.Item>
              <Upload {...uploadField} className={'uploadContainer'} style={{width:'80%',margin:'0 auto'}}>
               <Button>
                 <Icon type="upload" /> 上传正文
               </Button>
              </Upload>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>正文列表：</div>
            </Flex.Item>
          </Flex>
          <WhiteSpace size='md' style={{borderBottom:'1px solid #c7c3c3',marginBottom:'0.1rem'}}/>
          <Flex>
            <Flex.Item>
              <Upload {...uploadField} className={'uploadContainer'} style={{width:'80%',margin:'0 auto'}}>
               <Button>
                 <Icon type="upload" /> 上传附件
               </Button>
              </Upload>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>附件列表：</div>
            </Flex.Item>
          </Flex>
          <WhiteSpace size='md' style={{borderBottom:'1px solid #c7c3c3',marginBottom:'0.1rem'}}/>
          <Flex>
            <Flex.Item><InputItem value="--" editable={false} labelNumber={5}>拟办意见：</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem value="--" editable={false} labelNumber={5}>领导意见：</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>办理情况：<span style={{color:'red'}}>(承办意见请上传在附件中)</span></div>
              <TextareaItem
                {...getFieldProps('reason')}
                title=""
                rows={3}
                editable={false}
                labelNumber={0}
              />
            </Flex.Item>
          </Flex>
          <WhiteSpace size='md' style={{height:'1rem'}}/>
        </div>
      </div>
    )
  }
}

AddContentCompRaw.defaultProps = {
};

AddContentCompRaw.propTypes = {
};
const AddContentComp = createForm()(AddContentCompRaw);
export default AddContentComp;
