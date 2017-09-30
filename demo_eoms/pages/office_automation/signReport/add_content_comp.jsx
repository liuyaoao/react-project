import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import moment from 'moment';
import { createForm } from 'rc-form';

import myWebClient from 'client/my_web_client.jsx';
import { Toast, WingBlank, WhiteSpace, InputItem,
  TextareaItem,Flex,List,Picker} from 'antd-mobile';

import {Icon } from 'antd';
//签报管理的新增内容
class AddContentCompRaw extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        // nowDate:moment(new Date()).format('YYYY-MM-DD'),
        gwlc_value:'', //公文流程--请示类别。
      };
  }
  componentWillMount(){
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.newAdding && !this.props.newAdding){ //点击了保存按钮了。
      this.addNewSave();
    }
    if(nextProps.formData.gwlc != this.props.formData.gwlc){
      this.setState({
        gwlc_value:nextProps.formData.gwlc
      });
    }
  }
  addNewSave = ()=>{  //编辑保存
    let tempFormData = this.props.form.getFieldsValue();
    tempFormData['gwlc'] = this.state.gwlc_value;
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
  onPleaTypesPickerOk = (val)=>{
    this.setState({gwlc_value:val[0]});
  }

  render() {
    const { getFieldProps } = this.props.form;
    let {formData,formDataRaw} = this.props;
    let items = formDataRaw.gwlc?formDataRaw.gwlc.items:[];
    //请示类别当前值就是gwlc字段的值。--公文流程。
    let owerPleaTypes = items.map((item)=>{ //请示类别。
      return {
        label:item.text,
        value:item.value
      }
    });
    return (
      <div>
        <div className={'oa_detail_cnt'}>
          <div className={'oa_detail_title'} style={{width:'100%',textAlign:'center'}}>长沙司法局工作(报告)单</div>
          <Flex>
            <Flex.Item><InputItem value={formData.ngr_show}
              placeholder={'请输入...'}
              editable={false}
              labelNumber={4}>拟稿人：</InputItem>
          </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem value={formData.zbbm_show}
              placeholder={'请输入...'}
              editable={false}
              labelNumber={5}>拟稿单位：</InputItem>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem value={formData.ngrq_show}
              placeholder={'请输入...'}
              editable={false}
              labelNumber={5}>拟稿日期：</InputItem>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black',fontSize: '0.34rem'}}>标题：</div>
              <TextareaItem
                {...getFieldProps('bt')}
                title=""
                placeholder={'请输入...'}
                rows={4}
                labelNumber={0}
              />
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <List style={{ backgroundColor: 'white' }} className={'picker_list'}>
                <Picker data={owerPleaTypes} cols={1}
                  value={[this.state.gwlc_value]}
                   onOk={this.onPleaTypesPickerOk}>
                  <List.Item arrow="horizontal">请示类别：</List.Item>
                </Picker>
              </List>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem value="--" editable={false} labelNumber={5}>领导批示：</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem value="--" editable={false} labelNumber={7}>主管财务领导：</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem value="--" editable={false} labelNumber={7}>分管领导意见：</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem value="--" editable={false} labelNumber={6}>处室负责人：</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem value="--" editable={false} labelNumber={3}>核稿：</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>事由：</div>
              <TextareaItem
                {...getFieldProps('nr')}
                title=""
                placeholder={'请输入...'}
                rows={5}
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
