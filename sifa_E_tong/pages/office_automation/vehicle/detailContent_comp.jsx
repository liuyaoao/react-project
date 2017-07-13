import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import UserStore from 'stores/user_store.jsx';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import moment from 'moment';
import { createForm } from 'rc-form';

import myWebClient from 'client/my_web_client.jsx';
import { WingBlank, WhiteSpace,DatePicker, Button, InputItem, NavBar,
  TextareaItem,Flex,List,Picker} from 'antd-mobile';

import {Icon } from 'antd';
//签报管理的新增内容
class DetailContentComp extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        loginUser:{},
        loginUserName:'',
        nowDate:moment(new Date()).format('YYYY-MM-DD HH:MM'),
        startTime:moment(new Date()).format('YYYY-MM-DD HH:MM'),
        endTime:moment(new Date()).format('YYYY-MM-DD HH:MM'),
        tabName:"content",
      };
  }
  componentWillMount(){
    var me = UserStore.getCurrentUser() || {};
    console.log("me-----:",me,me.nickname,me.organizations);
    this.setState({loginUserName:me.username||'', loginUser:me});
  }
  componentWillReceiveProps(nextProps){
    let formData = nextProps.formData;
    if(nextProps.formData.ycrq && nextProps.formData.ycrq!=this.props.formData.ycrq){
      if(formData.ycrq){
        console.log("formData-----:",formData);
        this.setState({
          startTime : moment(formData.ycrq+" "+formData.ycsjHour+":"+formData.ycsjMinute),
          endTime : moment(formData.hcrq+" "+formData.hcsjHour+":"+formData.hcsjMinute)
        });
      }
    }
  }

  onStartUseTimeChange = (val)=>{  //开始--用车时间
    console.log("onStartUseTimeChange--:",val);
    this.setState({
      startTime:val,
    });
  }
  onEndUseTimeChange = (val)=>{ //结束--回车时间
    console.log("onEndUseTimeChange--:",val);
    this.setState({
      endTime:val,
    });
  }

  render() {
    const { getFieldProps } = this.props.form;
    let {formData,formDataRaw} = this.props;
    let {startTime,endTime} = this.state;
    if(formData.ycrq){
      // startTime = moment(formData.ycrq+" "+formData.ycsjHour+":"+formData.ycsjMinute);
      // endTime = moment(formData.ycrq+" "+formData.ycsjHour+":"+formData.ycsjMinute);
    }
    return (
      <div>
        <div className={'oa_detail_cnt'}>
          <div className={'oa_detail_title'} style={{width:'100%',textAlign:'center'}}>长沙市司法局用车申请表</div>
          <Flex>
            <Flex.Item><InputItem value={formData.ngr_show||'--'}
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
                {...getFieldProps('peopleNum',{initialValue:formData.sxrs||'-'})}
                editable={true}
                labelNumber={5}>随行人数：</InputItem>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <InputItem placeholder={'请输入...'}
                {...getFieldProps('useDays',{initialValue:formData.ycts||'-'})}
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
            <Flex.Item>
              <InputItem placeholder={'请输入...'}
                {...getFieldProps('carLicense',{initialValue:formData.cph||'-'})}
                editable={true}
                labelNumber={4}>车牌号：</InputItem>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <InputItem placeholder={'请输入...'}
                {...getFieldProps('driver',{initialValue:formData.jsy||'-'})}
                editable={true}
                labelNumber={4}>驾驶员：</InputItem>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <InputItem placeholder={'请输入...'}
                {...getFieldProps('driver',{initialValue:formData.ccdd||'-'})}
                editable={true}
                labelNumber={5}>用车地点：</InputItem>
            </Flex.Item>
          </Flex>

          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>用车事由：</div>
              <TextareaItem
                {...getFieldProps('reason',{initialValue:formData.ycsy||'-'})}
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

DetailContentComp.defaultProps = {
};
DetailContentComp.propTypes = {
};
export default createForm()(DetailContentComp);
