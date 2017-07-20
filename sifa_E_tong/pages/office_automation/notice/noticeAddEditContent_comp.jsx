
import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import { createForm } from 'rc-form';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import Notice_SendShareComp from './noticeSendShare_comp.jsx';
import { WingBlank, WhiteSpace, Button, InputItem,
  TextareaItem,Flex,DatePicker,List, Picker,Switch,TabBar,Toast} from 'antd-mobile';
import {Icon} from 'antd';
import moment from 'moment';
const data = [{
  url: 'https://zos.alipayobjects.com/rmsportal/PZUUCKTRIHWiZSY.jpeg',
  id: '2121',
}, {
  url: 'https://zos.alipayobjects.com/rmsportal/hqQWgTXdrlmVVYi.jpeg',
  id: '2122',
}];

class Notice_AddEditContentComp extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        isHide:false,
        verifyTypes : [
            [{label: '未审核',value: '0'},
              {label: '已通过',value: '1'},
              {label: '未通过',value: '-1'} ],
        ],
        lrrq: moment(new Date()).format('YYYY-MM-DD'), // 录入日期。
        fbsj: moment(new Date()).format('YYYY-MM-DD'),  //发布时间
        gqsj: moment(new Date()).format('YYYY-MM-DD'),  //过期时间
        shbz:'-1', //审核情况，初始为：未审核
        fbfw_fbtoall:false, //是否指定发布范围。 默认为false.表示全部。
        uploadAttachmentUrl:'',
        customAttachmentList:[],
        files: data,
      };
  }
  componentWillMount(){
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.newAdding && !this.props.newAdding){ //点击了保存按钮了。
      this.addNewSave();
    }
  }
  addNewSave = ()=>{  //新增保存
    let tempFormData = this.props.form.getFieldsValue();
    tempFormData['lrrq'] = this.state.lrrq;
    tempFormData['fbsj'] = this.state.fbsj;
    tempFormData['gqsj'] = this.state.gqsj;
    tempFormData['shbz'] = this.state.shbz;
    tempFormData['fbfw_fbtoall'] = tempFormData.fbfw_fbtoall ? "1" :"0";
    tempFormData['autoshowfj'] = tempFormData.autoshowfj ? "1" :"0";
    tempFormData['candownloadfj'] = tempFormData.candownloadfj ? "1" :"0";
    OAUtils.saveModuleFormData({
      moduleName:this.props.moduleNameCn,
      tokenunid:this.props.tokenunid,
      unid:this.props.formData.unid,
      formParams:Object.assign({},this.props.formParams,this.props.formData,tempFormData), //特有的表单参数数据。
      successCall: (data)=>{
        console.log("新建-签报管理的返回数据:",data);
        let formData = OAUtils.formatFormData(data.values);
        this.props.afterAddNewCall(formData);
        Toast.info('新建保存成功!!', 2);
      },
      errorCall:(res)=>{
        Toast.info('新建保存失败!!', 1);
      }
    });
  }
  onImageChange = (files, type, index) => {
    console.log(files, type, index);
    this.setState({
      files,
    });
  }

  onLrrqChange = (val) => { //录入日期。
    this.setState({
      lrrq:val.format('YYYY-MM-DD'),
    });
  }
  onFbsjChange = (val) => { //发布时间
    this.setState({
      fbsj:val.format('YYYY-MM-DD'),
    });
  }
  onGqsjChange = (val) => { //过期时间，有效日期。
    this.setState({
      gqsj:val.format('YYYY-MM-DD'),
    });
  }
  onFileUploadChange = (file)=>{ //获取上传附件的地址。
    this.setState({
      uploadAttachmentUrl:OAUtils.getUploadCustomUrl({
        docunid:this.props.formData.unid,
        filename:file.name,
        moduleName:this.props.moduleNameCn
      })
    });
  }
  getFormAttachmentList = ()=>{ //获取附件列表
    OAUtils.getFormCustomAttachmentList({
      tokenunid: this.props.tokenunid,
      moduleName:this.props.moduleNameCn,
      docunid:this.props.formData.unid,
      successCall: (data)=>{
        console.log("get 通知公告的自定义附件列表 data:",data);
        this.setState({
          customAttachmentList:data.values.filelist || [],
        });
      }
    });
  }
  render() {
    const { getFieldProps } = this.props.form;
    const { files,customAttachmentList,verifyTypes } = this.state;
    let customAttachment = customAttachmentList.filter((item)=>{ //文件附件。
      if(item.attachname.indexOf('.png')!=-1 ||item.attachname.indexOf('.jpeg')!=-1||item.attachname.indexOf('.jpg')!=-1||item.attachname.indexOf('.gif')!=-1){
        return false; //如果是图片则返回false，过滤出去。
      }else{
        return true;  //
      }
    }).map((item,index)=>{
      let downloadUrl = OAUtils.getCustomAttachmentUrl({
        moduleName:"信息发布",
        fileunid:item.unid
      });
    });
    let customImages = customAttachmentList.filter((item)=>{ //图片附件
      if(item.attachname.indexOf('.png')!=-1 ||item.attachname.indexOf('.jpeg')!=-1||item.attachname.indexOf('.jpg')!=-1||item.attachname.indexOf('.gif')!=-1){
        return true; //如果是图片则返回true
      }else{
        return false;  //过滤掉非图片文件。
      }
    }).map((item,index)=>{
      let downloadUrl = OAUtils.getCustomAttachmentUrl({
        moduleName:"信息发布",
        fileunid:item.unid
      });
    });
    let uploadAttachProps = { //上传附件的配置。
      name: 'inputName',
      action: this.state.uploadAttachmentUrl,
      showUploadList:false, //是否展示上传文件列表。
      headers: {
        authorization: 'authorization-text',
      },
      beforeUpload:(file,fileList)=>{
        this.onFileUploadChange(file);
        return true;
      },
      onChange:(info)=>{
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          Toast.info(`${info.file.name} 上传成功！`);
          this.getFormAttachmentList();
        } else if (info.file.status === 'error') {
          Toast.info(`${info.file.name} 上传失败！`);
        }
      }
    };

    return (
          <div className="oa_detail_cnt">
            <div>
                <Flex>
                  <Flex.Item>
                    <div className="select_container">
                      <DatePicker className="forss"
                        mode="date"
                        disabled={true}
                        onChange={this.onLrrqChange}
                        value={moment(this.state.lrrq)}
                      >
                      <List.Item arrow="horizontal">录入时间:</List.Item>
                      </DatePicker>
                    </div>
                  </Flex.Item>
                </Flex>
                <Flex>
                  <Flex.Item>
                    <div className="select_container">
                      <DatePicker className="forss"
                        mode="date"
                        onChange={this.onFbsjChange}
                        value={moment(this.state.fbsj)}
                      >
                      <List.Item arrow="horizontal">发布日期:</List.Item>
                      </DatePicker>
                    </div>
                  </Flex.Item>
                </Flex>
                <Flex>
                  <Flex.Item>
                    <div className="select_container">
                      <DatePicker className="forss"
                        mode="date"
                        onChange={this.onGqsjChange}
                        value={this.state.gqsj}
                      >
                      <List.Item arrow="horizontal">有效期</List.Item>
                      </DatePicker>
                    </div>
                  </Flex.Item>
                </Flex>
                <Flex>
                  <Flex.Item>
                    <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>标题：</div>
                    <TextareaItem
                      {...getFieldProps('bt')}
                      placeholder={'请输入...'}
                      rows={2}
                    />
                  </Flex.Item>
                </Flex>
                <Flex>
                  <Flex.Item>
                    <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>副标题：</div>
                    <TextareaItem
                      {...getFieldProps('fbt')}
                      placeholder={'请输入...'}
                      rows={3}
                    />
                  </Flex.Item>
                </Flex>
                <Flex>
                  <Flex.Item>
                    <InputItem {...getFieldProps('wzly')} labelNumber={5} placeholder="请输入...">文章来源：</InputItem>
                  </Flex.Item>
                </Flex>
                <Flex>
                  <Flex.Item>
                    <InputItem {...getFieldProps('lbName')} labelNumber={5} placeholder="请输入...">通知类别：</InputItem>
                  </Flex.Item>
                </Flex>
                <Flex>
                  <Flex.Item>
                    <InputItem editable={false} value={formData.lrrName} labelNumber={4}>录入人：</InputItem>
                  </Flex.Item>
                </Flex>
                <Flex>
                  <Flex.Item>
                    <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>内容：</div>
                    <TextareaItem
                      {...getFieldProps('nr')}
                      placeholder={'请输入...'}
                      rows={4}
                    />
                  </Flex.Item>
                </Flex>
                <Flex>
                  <Flex.Item>
                    <div className="select_container">
                      <List.Item
                      extra={<Switch
                          {...getFieldProps('fbfw_fbtoall', {
                            initialValue: false,
                            valuePropName: 'checked',
                          })}
                        onClick={(checked) => { this.setState({fbfw_fbtoall:checked}); }}
                      />}>
                        是否指定发布范围：
                      </List.Item>
                    </div>
                  </Flex.Item>
                </Flex>

                {this.state.fbfw_fbtoall?(
                  <div>
                    <Flex>
                      <Flex.Item>
                        <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>发布部门：</div>
                        <TextareaItem
                          {...getFieldProps('fbfw_org')}
                          placeholder={'请输入...'}
                          rows={3}
                        />
                      </Flex.Item>
                    </Flex>
                    <Flex>
                      <Flex.Item>
                        <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>发布群组：</div>
                        <TextareaItem
                          {...getFieldProps('fbfw_group')}
                          placeholder={'请输入...'}
                          rows={3}
                        />
                      </Flex.Item>
                    </Flex>
                    <Flex>
                      <Flex.Item>
                        <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>发布人员：</div>
                        <TextareaItem
                          {...getFieldProps('fbfw_person')}
                          placeholder={'请输入...'}
                          rows={3}
                        />
                      </Flex.Item>
                    </Flex>
                  </div>
                ):null}

                <Flex>
                  <Flex.Item>
                    <div className="select_container">
                      <List.Item
                      extra={<Switch
                          {...getFieldProps('autoshowfj', {
                            initialValue: false,
                            valuePropName: 'checked',
                          })}
                        onClick={(checked) => { console.log(checked); }}
                      />}>
                        是否自动显示附件:
                      </List.Item>
                    </div>
                  </Flex.Item>
                </Flex>
                <Flex>
                  <Flex.Item>
                    <div className="select_container">
                        <Picker cols={1}
                              data={verifyTypes}
                              extra="请选择"
                              value={[this.state.shbz]}
                              onOk={v => this.setState({ shbz: v[0] })}
                        >
                        <List.Item arrow="horizontal">审核情况</List.Item>
                        </Picker>
                      </div>
                  </Flex.Item>
                </Flex>
                <Flex>
                  <Flex.Item>
                    <Upload {...uploadAttachProps}>
                      <Button type="primary" style={{width:'100%'}}>
                        <Icon type="upload" /> 上传图片
                      </Button>
                    </Upload>
                  </Flex.Item>
              </Flex>
              <Flex>
                <Flex.Item>
                  <div style={{margin:'0.2rem 0 0 0.3rem',color:'black'}}>已上传图片列表：{customAttachmentList.length<=0?(<span>无图片</span>):null}</div>
                    { customAttachmentList.length>0?
                      (<div>{customImages}</div>):null
                    }
                </Flex.Item>
              </Flex>
              <Flex>
                <Flex.Item>
                  <div className="select_container">
                    <List.Item
                    extra={<Switch
                        {...getFieldProps('candownloadfj', {
                          initialValue: true,
                          valuePropName: 'checked',
                        })}
                      onClick={(checked) => { console.log(checked); }}
                    />}>
                      是否允许下载附件:
                    </List.Item>
                  </div>
                </Flex.Item>
              </Flex>
              <Flex>
                <Flex.Item className={'uploadContainer'}>
                  <Upload {...uploadAttachProps}>
                    <Button type="primary" style={{width:'100%'}}>
                      <Icon type="upload" /> 上传附件
                    </Button>
                  </Upload>
                </Flex.Item>
              </Flex>
              <Flex>
                <Flex.Item>
                  <div style={{margin:'0.2rem 0 0 0.3rem',color:'black'}}>通知公告的附件：{customAttachmentList.length<=0?(<span>无附件</span>):null}</div>
                    { customAttachmentList.length>0?
                      (<div>{customAttachment}</div>):null
                    }
                </Flex.Item>
              </Flex>
            </div>
          </div>
    )
  }
}

Notice_AddEditContentComp.defaultProps = {
};

Notice_AddEditContentComp.propTypes = {
  backToTableListCall:React.PropTypes.func,
  afterChangeTabCall:React.PropTypes.func,

  // isShow:React.PropTypes.bool,
};

export default createForm()(Notice_AddEditContentComp);
