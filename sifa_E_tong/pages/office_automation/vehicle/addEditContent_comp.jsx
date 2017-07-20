import $ from 'jquery';
import React from 'react';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import moment from 'moment';
import { createForm } from 'rc-form';

import myWebClient from 'client/my_web_client.jsx';
import { Toast,WingBlank, WhiteSpace,DatePicker, Button, InputItem,
  TextareaItem,Flex,List,Picker} from 'antd-mobile';

import {Icon } from 'antd';
//车辆管理的新增内容
class AddEditContentComp extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        nowDate:moment(new Date()).format('YYYY-MM-DD HH:MM'),
        startTime:moment(new Date()).format('YYYY-MM-DD HH:MM'),
        endTime:moment(new Date()).format('YYYY-MM-DD HH:MM'),
      };
  }
  componentWillMount(){
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.newAdding && !this.props.newAdding){ //点击了保存按钮了。
      this.addNewSave();
    }
  }
  addNewSave = ()=>{  //编辑保存
    let {startTime, endTime} = this.state;
    let tempFormData = this.props.form.getFieldsValue();
    tempFormData['ycrq'] = startTime.split(' ')[0]; //用车日期。
    tempFormData['ycsjHour'] = startTime.split(' ')[1].split(':')[0];
    tempFormData['ycsjMinute'] = startTime.split(' ')[1].split(':')[1];
    tempFormData['hcrq'] = endTime.split(' ')[0];  //回车日期。
    tempFormData['hcsjHour'] = endTime.split(' ')[1].split(':')[0];
    tempFormData['hcsjMinute'] = endTime.split(' ')[1].split(':')[1];
    OAUtils.saveModuleFormData({
      moduleName:this.props.moduleNameCn,
      tokenunid:this.props.tokenunid,
      unid:this.props.formData.unid,
      formParams:Object.assign({},this.props.formParams,this.props.formData,tempFormData), //特有的表单参数数据。
      successCall: (data)=>{
        console.log("新建-车辆管理的返回数据:",data);
        let formData = OAUtils.formatFormData(data.values);
        this.props.afterAddNewCall(formData);
        Toast.info('新建保存成功!!', 2);
      },
      errorCall:(res)=>{
        Toast.info('新建保存失败!!', 1);
      }
    });
  }
  onStartUseTimeChange = (val)=>{  //开始--用车时间
    console.log("onStartUseTimeChange--:",val);
    this.setState({
      startTime:val.format('YYYY-MM-DD HH:MM'),
    });
  }
  onEndUseTimeChange = (val)=>{ //结束--回车时间
    console.log("onEndUseTimeChange--:",val);
    this.setState({
      endTime:val.format('YYYY-MM-DD HH:MM'),
    });
  }
  onClickApplyCar = ()=>{ //申请车辆
    //TODO
  }

  render() {
    const { getFieldProps } = this.props.form;
    const { formData, formDataRaw} = this.props;
    return (
      <div>
        <div className={'oa_detail_cnt'}>
          <div className={'oa_detail_title'} style={{width:'100%',textAlign:'center'}}>长沙市司法局用车申请表</div>
          <Flex>
            <Flex.Item><InputItem value={formData.ngr_show||''}
              editable={false}
              labelNumber={4}>申请人：</InputItem>
          </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem value="148中心"
              placeholder={'请输入...'}
              editable={false}
              labelNumber={5}>申请部门：</InputItem>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem value={formData.ngrq_show||'-'}
              editable={false}
              labelNumber={5}>申请日期：</InputItem>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <InputItem placeholder={'请输入...'}
                {...getFieldProps('sxrs')}
                editable={true}
                labelNumber={5}>随行人数：</InputItem>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <InputItem placeholder={'请输入...'}
                {...getFieldProps('ycts')}
                editable={true}
                labelNumber={5}>用车天数：</InputItem>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className="select_container">
                <DatePicker className=""
                  mode="datetime"
                  onChange={this.onStartUseTimeChange}
                  value={moment(this.state.startTime)}
                >
                <List.Item arrow="horizontal">用车时间：</List.Item>
                </DatePicker>
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className="select_container">
                <DatePicker className=""
                  mode="datetime"
                  onChange={this.onEndUseTimeChange}
                  value={moment(this.state.endTime)}
                >
                <List.Item arrow="horizontal">回车时间：</List.Item>
                </DatePicker>
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item style={{flex:'2',marginRight:'0.2rem'}}>
              <InputItem placeholder={'请输入...'}
                {...getFieldProps('cph')}
                editable={true}
                labelNumber={4}>车牌号：</InputItem>
            </Flex.Item>
            <Flex.Item>
              <Button type="primary" style={{margin:'0 auto',display:'inline-block',height:'0.7rem',lineHeight:'0.7rem'}}
                onClick={()=>this.onClickApplyCar()}>申请车辆</Button>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <InputItem placeholder={'请输入...'}
                {...getFieldProps('jsy')}
                editable={true}
                labelNumber={4}>驾驶员：</InputItem>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <InputItem placeholder={'请输入...'}
                {...getFieldProps('ccdd')}
                editable={true}
                labelNumber={5}>用车地点：</InputItem>
            </Flex.Item>
          </Flex>

          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>用车事由：</div>
              <TextareaItem
                {...getFieldProps('ycsy')}
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

AddEditContentComp.defaultProps = {
};

AddEditContentComp.propTypes = {
};
export default createForm()(AddEditContentComp);
