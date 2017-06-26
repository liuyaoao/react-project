import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import myWebClient from 'client/my_web_client.jsx';
import { WingBlank, WhiteSpace, Button, InputItem, NavBar,
  TextareaItem,Flex,Steps, TabBar, Picker, List, Toast } from 'antd-mobile';

import { Icon, Select } from 'antd';
import { createForm } from 'rc-form';
const Step = Steps.Step;

class DS_DetailContentComp extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        tabName:"content",
        flow: [{label: '发文',value: '发文'},{label: '司法局发文流程',value: '司法局发文流程'}],
        showMainContent: false,
        showUploadContent: false,
        showSendContent: false,
        showFlowContent: false,
        dzTitle:"长沙市司法局文件"
      };
  }
  componentWillMount(){

  }
  onClickSubTab = (data)=>{
    // console.log("onClickSubTab-target:",e.target);
    let tabNameCn = data.replace(/\s+/g,"");
    let tabNameCn2En = {"发送":"send", "上传附件":"upload", "正文":"article", "查阅附件":"referto"}
    this.props.afterChangeTabCall(tabNameCn2En[tabNameCn]);
  }

  handleChange = (value)=> {
    if(value === "1"){
      //发文
      this.setState({dzTitle: "长沙市司法局文件", flow: [{label: '发文',value: '发文'},{label: '司法局发文流程',value: '司法局发文流程'}]});
      $("#FGYJ").show();
      $("#HG").show();
      $("#JZYJ").show();
      $("#FW").show();
      $("#LDFW").hide();
    }else if(value === "2"){
      //领导小组发文
      this.setState({dzTitle: "领导小组文件(稿纸)", flow: [{label: '领导小组发文',value: '领导小组发文'},{label: '司法局发文流程',value: '司法局发文流程'}]});
      $("#FGYJ").hide();
      $("#HG").hide();
      $("#JZYJ").show();
      $("#FW").hide();
      $("#LDFW").show();
    }else if(value === "3"){
      //领导小组办公室发文
      this.setState({dzTitle: "领导小组办公室文件(稿纸)", flow: [{label: '领导小组办公室发文',value: '领导小组办公室发文'},{label: '司法局发文流程',value: '司法局发文流程'}]});
      $("#FGYJ").hide();
      $("#HG").hide();
      $("#JZYJ").hide();
      $("#FW").hide();
      $("#LDFW").show();
    }
  }

  renderContent = (pageText)=> {
    return (
      <div style={{ backgroundColor: 'white', height: '100%', textAlign: 'center' }}>
        <div style={{ paddingTop: 60 }}>你已点击“{pageText}” tab， 当前展示“{pageText}”信息</div>
        <a style={{ display: 'block', marginTop: 40, marginBottom: 600, color: '#108ee9' }}
          onClick={(e) => {
            e.preventDefault();
            this.setState({
              hidden: !this.state.hidden,
            });
          }}
        >
          点击切换 tab-bar 显示/隐藏
        </a>
      </div>
    );
  }

  onClickSave = ()=> {
    Toast.info('保存成功!', 1);
    this.props.backToTableListCall();
  }

  render() {

    const { getFieldProps, getFieldError } = this.props.form;
     const steps = [{
        title: 'Finished',
        description: 'This is description',
      }, {
        title: 'In Progress',
        description: 'This is description',
      }, {
        title: 'Waiting',
        description: 'This is description',
      }].map((s, i) => <Step key={i} title={s.title} description={s.description} icon={<Icon type='check-circle' />} />);

      const secrecy = [{label: '秘密',value: '秘密'},{label: '机密',value: '机密'}];
      const urgency = [{label: '急',value: '急'},{label: '紧急',value: '紧急'},{label: '特急',value: '特急'},{label: '特提',value: '特提'}];

    return (
      <div>
        <Select defaultValue="请选择您要起草的发文类型" onChange={this.handleChange} style={{margin:"0.16rem"}}>
          <Select.Option value="1">发文</Select.Option>
          <Select.Option value="2">领导小组发文</Select.Option>
          <Select.Option value="3">领导小组办公室发文</Select.Option>
        </Select>
        <div className={'oa_detail_cnt'}>
          <div className={'oa_detail_title'} style={{width:'100%',textAlign:'center'}}>{this.state.dzTitle}</div>
          <Flex>
            <Flex.Item><InputItem placeholder="2017" labelNumber={2}>文号</InputItem></Flex.Item>
            <Flex.Item><InputItem placeholder="2017" labelNumber={2} type="Number">份数</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className="select_container">
                <Picker data={secrecy} cols={1} {...getFieldProps('secrecy')}>
                  <List.Item arrow="horizontal">密级</List.Item>
                </Picker>
              </div>
            </Flex.Item>
            <Flex.Item>
              <div className="select_container">
                <Picker data={urgency} cols={1} {...getFieldProps('urgency')}>
                  <List.Item arrow="horizontal">缓急</List.Item>
                </Picker>
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem placeholder="局长办公室纪要" labelNumber={2}>标题</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <InputItem placeholder="张三，李四" labelNumber={2}>主送</InputItem>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem placeholder="张五，李六" labelNumber={2}>抄送</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className="select_container">
                <Picker data={this.state.flow} cols={1} {...getFieldProps('flow')}>
                  <List.Item arrow="horizontal">公文流程</List.Item>
                </Picker>
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem placeholder="xxxxx" labelNumber={4}>领导签发</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className={'detail_textarea_title'}>传批意见</div>
              <div className="textarea_container">
                <TextareaItem
                  title=""
                  autoHeight
                  labelNumber={0}
                  />
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div id="JZYJ">
                <div className={'detail_textarea_title'}>局长审核意见</div>
                <div className="textarea_container">
                  <TextareaItem
                    title=""
                    autoHeight
                    labelNumber={0}
                  />
                </div>
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div id="FGYJ">
                <div className={'detail_textarea_title'}>分管领导意见</div>
                <div className="textarea_container">
                  <TextareaItem title="" autoHeight labelNumber={0} />
                </div>
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className={'detail_textarea_title'}>处室负责人意见</div>
                <div className="textarea_container">
                  <TextareaItem
                    title=""
                    autoHeight
                    labelNumber={0}
                  />
                </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div id="HG">
                <div className={'detail_textarea_title'}>核稿</div>
                <div className="textarea_container">
                  <TextareaItem
                    title=""
                    autoHeight
                    labelNumber={0}
                  />
                </div>
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem placeholder="xxxxx" labelNumber={4}>拟稿单位</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem placeholder="xxxxx" labelNumber={4}>拟稿人</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem placeholder="xxxxx" labelNumber={4}>日期</InputItem></Flex.Item>
          </Flex>
          <div style={{height:'0.5rem',width:'100%',margin:'1em 0',background:'#efe9e9'}}></div>
          <div style={{height:'2.5em',lineHeight:'2.5em',marginLeft:'0.2rem',borderBottom:'1px solid #d6d1d1'}}>
            <span style={{width:'0.1rem',height:'1em',lineHeight:'2.5em',verticalAlign: 'middle',background:'red',display:'inline-block'}}></span>
            <span style={{marginLeft:'0.2rem',color:'black',fontWeight:'bold'}}>办公追踪-流转记录</span>
          </div>
          <WingBlank>
            <WhiteSpace />
            <div style={{overflowX:'auto'}}>
              <Steps current={1} direction="horizontal" size="small" style={{minWidth:'500px',marginTop:'10px'}}>{steps}</Steps>
            </div>
          </WingBlank>
          <WhiteSpace />
        </div>
        <div className="custom_tabBar" id="FW">
          <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
          hidden={this.state.hidden}
          >
            <TabBar.Item
              icon={<Icon type="save" size="lg" />}
              selectedIcon={<Icon type="save" size="lg" style={{color:"rgb(51, 163, 244)"}} />}
              title="保存"
              key="保存"
              selected={this.state.selectedTab === 'redTab'}
              onPress={() => this.onClickSave()}
              data-seed="logId1"
            >
              {this.renderContent('保存')}
            </TabBar.Item>
            <TabBar.Item
              title="正文"
              key="正文"
              icon={
                <Icon type="left-circle" size="lg" />
              }
              selectedIcon={
                <Icon type="left-circle" size="lg" style={{color:"rgb(51, 163, 244)"}} />
              }
              selected={this.state.selectedTab === 'blueTab'}
              onPress={() => this.onClickSubTab("正文")}
              data-seed="logId"
            >
              {this.renderContent('正文')}
            </TabBar.Item>
            <TabBar.Item
              icon={<Icon type="upload" size="lg" />}
              selectedIcon={<Icon type="upload" size="lg" style={{color:"rgb(51, 163, 244)"}} />}
              title="上传附件"
              key="上传附件"
              selected={this.state.selectedTab === 'greenTab'}
              onPress={() => this.onClickSubTab("上传附件")}
            >
              {this.renderContent('上传附件')}
            </TabBar.Item>
            <TabBar.Item
              icon={<Icon type="export" size="lg" />}
              selectedIcon={<Icon type="export" size="lg" style={{color:"rgb(51, 163, 244)"}} />}
              title="发送"
              key="发送"
              selected={this.state.selectedTab === 'yellowTab'}
              onPress={() => this.onClickSubTab("发送")}
            >
              {this.renderContent('发送')}
            </TabBar.Item>
          </TabBar>
        </div>

        <div className="custom_tabBar" id="LDFW">
          <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
          hidden={this.state.hidden}
          >
            <TabBar.Item
              icon={<Icon type="save" size="lg" />}
              selectedIcon={<Icon type="save" size="lg" style={{color:"rgb(51, 163, 244)"}} />}
              title="保存"
              key="保存"
              selected={this.state.selectedTab === 'redTab'}
              onPress={() => this.onClickSave()}
              data-seed="logId1"
            >
              {this.renderContent('保存')}
            </TabBar.Item>
            <TabBar.Item
              title="正文"
              key="正文"
              icon={
                <Icon type="left-circle" size="lg" />
              }
              selectedIcon={
                <Icon type="left-circle" size="lg" style={{color:"rgb(51, 163, 244)"}} />
              }
              selected={this.state.selectedTab === 'blueTab'}
              onPress={() => this.onClickSubTab("正文")}
              data-seed="logId"
            >
              {this.renderContent('正文')}
            </TabBar.Item>
            <TabBar.Item
              icon={<Icon type="upload" size="lg" />}
              selectedIcon={<Icon type="upload" size="lg" style={{color:"rgb(51, 163, 244)"}} />}
              title="上传附件"
              key="上传附件"
              selected={this.state.selectedTab === 'greenTab'}
              onPress={() => this.onClickSubTab("上传附件")}
            >
              {this.renderContent('上传附件')}
            </TabBar.Item>
            <TabBar.Item
              icon={<Icon type="export" size="lg" />}
              selectedIcon={<Icon type="export" size="lg" style={{color:"rgb(51, 163, 244)"}} />}
              title="发送"
              key="发送"
              selected={this.state.selectedTab === 'yellowTab'}
              onPress={() => this.onClickSubTab("发送")}
            >
              {this.renderContent('发送')}
            </TabBar.Item>
            <TabBar.Item
              icon={<Icon type="export" size="lg" />}
              selectedIcon={<Icon type="export" size="lg" style={{color:"rgb(51, 163, 244)"}} />}
              title="办结"
              key="办结"
              selected={this.state.selectedTab === 'yellowTab'}
              onPress={() => this.onClickSubTab("办结")}
            >
              {this.renderContent('办结')}
            </TabBar.Item>
          </TabBar>
        </div>


      </div>
    )
  }
}

DS_DetailContentComp.defaultProps = {
};

DS_DetailContentComp.propTypes = {
};



export default createForm()(DS_DetailContentComp);
