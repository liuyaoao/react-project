import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import UserStore from 'stores/user_store.jsx';
import moment from 'moment';
import { createForm } from 'rc-form';

import myWebClient from 'client/my_web_client.jsx';
import { WingBlank, WhiteSpace, Button, InputItem, NavBar,
  TextareaItem,Flex,List,Picker} from 'antd-mobile';

import {Icon } from 'antd';

class DetailContentCompRaw extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        loginUserName:'',
        nowDate:moment(new Date()).format('YYYY-MM-DD'),
        tabName:"content",
      };
  }
  componentWillMount(){
    var me = UserStore.getCurrentUser() || {};
    this.setState({loginUserName:me.username||''});
  }

  render() {
    const { getFieldProps } = this.props.form;
    const {detailInfo} = this.props;
    let owerPleaTypes = [
      {
        label:"其他请示事项（新）",
        value:"其他请示事项（新）"
      },{
        label:"资金类请示事项（新）",
        value:"资金类请示事项（新）"
      },{
        label:"文电分办",
        value:"文电分办"
      },{
        label:"会议、活动（新）",
        value:"会议、活动（新）"
      },{
        label:"需报送上级机关或平级机关的公文（新）",
        value:"需报送上级机关或平级机关的公文（新）"
      }
    ];
    return (
      <div>
        <div className={'oa_detail_cnt'}>
          <div className={'oa_detail_title'} style={{width:'100%',textAlign:'center'}}>长沙司法局工作(报告)单</div>
          <Flex>
            <Flex.Item><InputItem value={detailInfo.createUser} editable={false} labelNumber={4}>拟稿人：</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem value={detailInfo.createDepartment||"148中心"} editable={false} labelNumber={5}>拟稿单位：</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem value={detailInfo.createTime} editable={false} labelNumber={5}>拟稿日期：</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>标题：</div>
              <TextareaItem
                {...getFieldProps('subjectTitle',{
                  initialValue: detailInfo.subjectTitle,
                })}
                title=""
                rows={4}
                labelNumber={0}
              />
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <List style={{ backgroundColor: 'white' }} className={'picker_list'}>
                <Picker data={owerPleaTypes} cols={1} {...getFieldProps('pleaType',{
                    initialValue:detailInfo.pleaType
                  })}
                  disabled={true}
                  onOk={this.onPickerOk}>
                  <List.Item arrow="horizontal">请示类别：</List.Item>
                </Picker>
              </List>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>领导批示：</div>
              <TextareaItem
              title=''
              value={detailInfo.leaderAdvice}
              editable={false}
              labelNumber={0}/>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>主管财务领导：</div>
              <TextareaItem
              title=''
              value={detailInfo.fanancialLeaderAdvice}
              editable={false}
              labelNumber={0}/>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>分管领导意见：</div>
              <TextareaItem
              title=''
              value={detailInfo.divideLeaderAdvice}
              editable={false}
              labelNumber={0}/>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>处室负责人：</div>
              <TextareaItem
              title=''
              value={detailInfo.roomLeaderAdvice}
              editable={false}
              labelNumber={0}/>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>核稿：</div>
              <TextareaItem
              title=''
              value={detailInfo.verifyText}
              editable={false}
              labelNumber={0}/>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>事由：</div>
              <TextareaItem
                {...getFieldProps('reason',{ initialValue:detailInfo.reason })}
                title=""
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

DetailContentCompRaw.defaultProps = {
};

DetailContentCompRaw.propTypes = {
};
const DetailContentComp = createForm()(DetailContentCompRaw);
export default DetailContentComp;
