//通知公告的详情页.
import $ from 'jquery';
import React from 'react';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import { WingBlank, WhiteSpace, Button, InputItem, NavBar,
  TextareaItem,Flex,DatePicker,List} from 'antd-mobile';

import {Icon} from 'antd';
import moment from 'moment';

class Notice_DetailComp extends React.Component {
  constructor(props) {
      super(props);
      this.onNavBarLeftClick = this.onNavBarLeftClick.bind(this);
      this.state = {
        moduleNameCn:'信息发布',
        modulename:'xxfb', //模块名
        formParams:{
          lrrq:"",  //录入时间
          lrrName:"",  //录入人。
          fbsj:"",  //发布日期
          wzrq:"",  //文章日期
          gqsj:"",  //有效日期
          bt:"",  //标题
          fbt:"",  //副标题
          wzly:"",  //文章来源。
          lbName:"",  //所属类别。
          gjz:"",  //关键字。
          nr:"",  //内容
          fbfw_fbtoall:"",  //发布范围
          autoshowfj:"",  //是否自动显示附件
          shbz:"",  //审核情况，有列表。
          candownloadfj:"",  //是否允许下载附件

        },
        customAttachmentList:[], //自定义附件列表
        formData:{},
        formDataRaw:{},
      };
  }
  componentWillMount(){
    this.getFormCustomAttachmentList();
  }
  getFormCustomAttachmentList = ()=>{  //获取自定义附件列表
    OAUtils.getFormCustomAttachmentList({
      tokenunid: this.props.tokenunid,
      moduleName:this.state.moduleNameCn,
      docunid:this.props.detailInfo.unid,
      successCall: (data)=>{
        console.log("get 通知公告的自定义附件列表 data:",data);
        this.setState({
          customAttachmentList:data.values.filelist || [],
        });
        if(!data.values.filelist || data.values.filelist.length<=0){
          this.getServerFormData();
        }
      }
    });
  }
  getServerFormData = ()=>{  //获取表单数据
    OAUtils.getModuleFormData({
      moduleName:this.state.moduleNameCn,
      tokenunid:this.props.tokenunid,
      unid:this.props.detailInfo.unid,
      formParams:this.state.formParams,
      successCall: (data)=>{
        let formDataRaw = data.values;
        let formData = OAUtils.formatFormData(data.values);
        this.setState({
          formData,
          formDataRaw
        });
        console.log("get 通知公告的表单数据:",data,formData);
      }
    });
  }
  onNavBarLeftClick = (e) => {
    this.props.backToTableListCall();
  }

  render() {
    let {detailInfo} = this.props;
    let { formData, formDataRaw, customAttachmentList} = this.state;
    let customAttachment = customAttachmentList.map((item,index)=>{
      let downloadUrl = OAUtils.getCustomAttachmentUrl({
        moduleName:"信息发布",
        fileunid:item.unid
      });
      return (
        <div key={index} style={{margin:'0.1rem auto', width:'90%'}}>
          <a style={{ marginLeft: '20px',width:'100%',textDecoration:'underline' }}
          href={downloadUrl}>{item.attachname}</a>
        </div>
      );
    });

    return (
      <div className={'oa_detail_container ds_detail_container'}>
        <NavBar className="mobile_navbar_custom"
          style={{position:'fixed',height:'60px',zIndex:'13',width:'100%',top:0}}
          iconName = {false} onLeftClick={this.onNavBarLeftClick}
          leftContent={[
            <Icon type="arrow-left" className="back_arrow_icon" key={2}/>,
            <span key={1}>返回</span>
          ]} >
          信息详情
        </NavBar>
        <div style={{marginTop:'60px'}}>
          <div className={'oa_detail_cnt'}>
            <div>
              {customAttachmentList.length<=0 ?
                (<div>
                  <Flex>
                    <Flex.Item><InputItem
                      editable={false}
                      labelNumber={4}
                      value={formData.lrrName}>录入人：</InputItem></Flex.Item>
                  </Flex>
                  <Flex>
                    <Flex.Item><InputItem
                      editable={false}
                      labelNumber={5}
                      value={formData.lrrq}>录入时间：</InputItem></Flex.Item>
                  </Flex>
                    <Flex>
                      <Flex.Item>
                        <div className="select_container">
                          <DatePicker className="forss"
                            mode="date"
                            disabled={true}
                            value={moment(formData.fbsj)}
                          >
                          <List.Item arrow="horizontal">发布日期：</List.Item>
                          </DatePicker>
                        </div>
                      </Flex.Item>
                    </Flex>
                    <Flex>
                      <Flex.Item><InputItem
                        editable={false}
                        labelNumber={5}
                        value={formData.gqsj}>有效日期：</InputItem></Flex.Item>
                    </Flex>
                    <Flex>
                      <Flex.Item><InputItem
                        editable={false}
                        labelNumber={2}
                        value={formData.bt||'-'}>标题</InputItem></Flex.Item>
                    </Flex>
                    <Flex>
                      <Flex.Item>
                        <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>副标题：</div>
                        <TextareaItem
                          editable={false}
                          rows={3}
                          value={formData.fbt||'-'} />
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
                    <Flex>
                      <Flex.Item>
                        <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>内容：</div>
                        <div style={{width:'96%',border:'1px solid gray',height:'4rem',margin:'0 auto'}}
                          dangerouslySetInnerHTML={{__html:formData.nr}}></div>
                      </Flex.Item>
                    </Flex>
                </div>) :
                (<div>
                  <Flex>
                    <Flex.Item><InputItem
                      editable={false}
                      labelNumber={3}
                      value={detailInfo.fileTitle||'-'}>标题:</InputItem></Flex.Item>
                  </Flex>
                  <Flex>
                    <Flex.Item><InputItem
                      editable={false}
                      labelNumber={5}
                      value={detailInfo.publishTime||'-'}>发布日期：</InputItem></Flex.Item>
                  </Flex>
                  <Flex>
                    <Flex.Item><InputItem
                      editable={false}
                      labelNumber={5}
                      value={detailInfo.type||'-'}>所属类别：</InputItem></Flex.Item>
                  </Flex>
                  <Flex>
                    <Flex.Item><InputItem
                      editable={false}
                      labelNumber={5}
                      value={detailInfo.unit||'-'}>所属单位：</InputItem></Flex.Item>
                  </Flex>
                  <Flex>
                    <Flex.Item>
                      <div style={{margin:'0.2rem 0 0 0.3rem',color:'black'}}>通知公告的附件：{customAttachmentList.length<=0?(<span>无附件</span>):null}</div>
                        { customAttachmentList.length>0?
                          (<div>{customAttachment}</div>):null
                        }
                    </Flex.Item>
                  </Flex>
                </div>)
              }
            </div>

          </div>
        </div>
      </div>
    )
  }
}

Notice_DetailComp.defaultProps = {
};

Notice_DetailComp.propTypes = {
  backToTableListCall:React.PropTypes.func,
  // isShow:React.PropTypes.bool,
};

export default Notice_DetailComp;
