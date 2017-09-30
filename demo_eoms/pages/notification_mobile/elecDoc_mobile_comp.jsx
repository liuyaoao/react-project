import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
// import myWebClient from 'client/my_web_client.jsx';
import { createForm } from 'rc-form';
import avator_man from 'images/avator_icon/avator_man.png';
import avator_woman from 'images/avator_icon/avator_woman.png';
import { Toast,Modal, Flex,Button
   , ListView,Picker,List,InputItem,Popup} from 'antd-mobile';
import { Icon,Table} from 'antd';
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let maskProps;
if (isIPhone) {
  // Note: the popup content will not scroll.
  maskProps = {
    onTouchStart: e => e.preventDefault(),
  };
}
// import ERecordisMobileComp from 'pages/notification_mobile/eRecord_mobile_comp.jsx';
const urlPrefix = 'http://218.77.44.11:10080/CS_JrlService';

//矫正系统的统计分析。
class ElecDocMobileComp extends React.Component {
  constructor(props) {
      super(props);
      this.onOrganSelectChange = this.onOrganSelectChange.bind(this);
      const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      });
      this.state = {
        dataSource: dataSource.cloneWithRows([]),
        refreshing: true,
        columns:[],
        sel: '',
        organListData:[], //矫正的组织结构列表数据。
        selectOrganId:1,//选中的组织结构的ID数组
        curPageNum:1,
        totalCount:0,
        eRecordListData:[], //电子档案列表数据
        searchParams:{}, //查询参数。
      };
  }
  componentWillMount(){
    const columns = [{
      title: '联系人',
      dataIndex: 'Contacts',
      render:(text,record,index) => (
            <div key={record.identity+123456} className={'custom_listView_item'}>
              <div className={'list_item_container'}>
                  <div className={'list_item_middle'}>
                    <div style={{color:'black',fontSize:'0.30rem',fontWeight:'bold'}}>{record.name+'('+record.telephone+')'}
                    </div>
                    <div style={{color:'black',fontSize:'0.30rem',marginTop:'0.3rem'}}>{record.organ}
                    </div>
                  </div>
                  <div className={'list_item_left'}>
                      {record.sex=="男"?
                      (<img width="54" height="54" src={avator_man}/>):
                      (<img width="54" height="54" src={avator_woman}/>)}
                  </div>
                  <div className={'list_item_right'}>
                      <a href="javascript:;" style={{position:'absolute',bottom:'-1.1rem',right:'0'}} onClick={()=>this.onClickOnRow(record)}>查看</a>
                  </div>
              </div>
            </div>
          )
    }];
    this.setState({columns:columns});
  }
  componentDidMount(){
    let curOrganId = this.props.location.query.organId;
    if(this.props.location.query.organId){
      this.getServereRecordListData({
        organId:curOrganId,
        currentIndex:this.state.curPageNum
      });
      this.getServerOrganData(curOrganId);
      this.setState({
        selectOrganId:+curOrganId,
      });
    }
  }
  componentWillReceiveProps(nextProps){
    // console.log('nextProps.location.query.organId--:',nextProps.location.query.organId);
    let curOrganId = nextProps.location.query.organId;
    if(curOrganId && curOrganId != this.state.organId){
      this.getServereRecordListData({
        organId:curOrganId,
        currentIndex:this.state.curPageNum
      });
      this.getServerOrganData(curOrganId);
      this.setState({
        selectOrganId:+curOrganId,
      });
    }
  }
  getServereRecordListData = (params,searchParams)=>{
    $.post(`${urlPrefix}/android/manager/getRymcList.action`,
      Object.assign({},this.state.searchParams, searchParams || {}, params),(data,state)=>{
        let res = decodeURIComponent(data);
        try{
           res = JSON.parse(res);
        }catch(e){
        }
        // console.log("矫正系统的获取电子档案的返回---：",res,state);
        if(res.respCode != "0"){
            Toast.info(res.respMsg, 2, null, false);
        }else{
          let values = this.parseServerListData(res.values);
          this.setState({
            eRecordListData:values || [],
            curPageNum:res.currentIndex,
            totalCount:res.totalRowsCount
          });
        }
    });
  }
  //获取组织机构数据
  getServerOrganData = (organId,callback)=>{
    let params = {organId:organId};
    $.post(`${urlPrefix}/android/datb/getAndroidOrgan.action`,
      params,(data,state)=>{
        let res = decodeURIComponent(data);
        try{
           res = JSON.parse(res);
        }catch(e){
        }
        if(res.respCode == "0"){
            let organList = res.values;
            this.setState({ organListData:organList });
            callback && callback();
        }
    });
  }
  parseServerListData = (values)=>{
    for(let i=0;i<values.length;i++){
      values[i]['key'] = values[i].id || values[i].identity;
    }
    return values;
  }
  onClose = (sel) => {
   this.setState({ sel });
   Popup.hide();
  }
  onClickSearchSubmit = ()=>{
    this.props.form.validateFields((error, value) => {
      let params = value || {};
      params.organId = this.state.selectOrganId;
      !params.name ? delete params.name : null;
      !params.telephone ? delete params.telephone : null;
      // console.log("document search form validateFields", error, params);
      this.setState({
        searchParams:params
      });
      this.getServereRecordListData({organId:this.state.selectOrganId,currentIndex:1},params);
    });
  }
  onClickOnRow = (data)=>{ //显示新增编辑弹窗。
    // console.log(data);
    Popup.show(<div className='popList'>
     <List renderHeader={() => (
       <div style={{ position: 'relative',color:'black',fontSize:'0.4rem'}}>
         详细档案
         <span
           style={{
             position: 'absolute', right: 3, top: -5,
           }}
           onClick={() => this.onClose('cancel')}
         >
           <Icon type="cross" />
         </span>
       </div>)}
       className="popup-list"
     >

     <List.Item key='0'><span>姓名</span><span>{data.name}</span></List.Item>
     {data.sex=="男"?
     (<List.Item key='1'><span>图像</span><img src={avator_man}/></List.Item>):
     (<List.Item key='1'><span>图像</span><img src={avator_woman}/></List.Item>)}
     <List.Item key='2'><span>性别</span><span>{data.sex}</span></List.Item>
     <List.Item key='11'><span>出生日期</span><span>{data.csrq}</span></List.Item>
     <List.Item key='3'><span>机构名称</span><span>{data.organ}</span></List.Item>
     <List.Item key='4'><span>身份证号码</span><span>{data.identity}</span></List.Item>
     <List.Item key='5'><span>矫正开始时间</span><span>{data.startTime}</span></List.Item>
     <List.Item key='6'><span>矫正结束时间</span><span>{data.endTime}</span></List.Item>
     {data.manageLevel!=='' ? (
        <List.Item key='7'><span>管理等级</span><span>{data.manageLevel}</span></List.Item>
     ):null}
     <List.Item key='8'><span>人员编号</span><span>{data.rymcId}</span></List.Item>
     <List.Item key='9'><span>手机号码</span><span>{data.telephone}</span></List.Item>
     {data.criminal!=='' ? (
        <List.Item key='10'><span>罪名</span><span>{data.criminal}</span></List.Item>
     ):null}
     {data.status!=='' ? (
        <List.Item key='12'><span>状态</span><span>{data.status}</span></List.Item>
     ):null}
     <List.Item key='13'><span>矫正类型</span><span>{data.type}</span></List.Item>
     <List.Item key='14'><span>解矫文书</span><img src={'http://211.138.238.83:9000/'+data.relieveCorrectionUrl}/></List.Item>
     <List.Item key='15'><span>档案号</span><span>{data.fileNumber}</span></List.Item>
     </List>
   </div>, { animationType: 'slide-up', maskProps, maskClosable: false });
  }

  onOrganSelectChange(val){
    this.setState({
      selectOrganId:val[0]
    });
  }
  onPaginationChange = (current,pageSize)=>{
    this.getServereRecordListData({organId:this.state.selectOrganId,currentIndex:current});
  }

  render(){
    let selectOrganId = this.state.selectOrganId || '';
    // console.log("selectOrganId--:",selectOrganId);
    const { columns } = this.state;
    const { getFieldProps, getFieldError } = this.props.form;

    let organData = [];
    for(let i in this.state.organListData){
      organData.push({label:this.state.organListData[i].organName+'('+this.state.organListData[i].count+')',
         value: this.state.organListData[i].organId});
    }

    let sponsorDepartmentSource=(
      <div className={'oa_detail_cnt'}>
        <div style={{marginLeft:'-0.1rem',marginRight:'-0.2rem'}}>
          <Flex>
            <Flex.Item>
              <div style={{borderBottom: '1px solid #ddd',borderTop: '1px solid #ddd'}}>
                <Picker data={organData} cols={1} value={[selectOrganId]}
                  onOk={this.onOrganSelectChange}
                  >
                  <List.Item arrow="horizontal">组织机构</List.Item>
                </Picker>
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{borderBottom: '1px solid #ddd'}}>
                  <InputItem clear {...getFieldProps('name')}
                  editable={true} labelNumber={2} placeholder="请输入姓名"><Icon type="user"
                  style={{color: '#278197',fontSize:'0.6rem'}}/>姓名：</InputItem>
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{borderBottom: '1px solid #ddd'}}>
                  <InputItem clear {...getFieldProps('telephone')}
                  editable={true} labelNumber={2} placeholder="请输入手机号"><Icon type="phone"
                  style={{color: '#EF9F2E',fontSize:'0.6rem'}}/>手机号：</InputItem>
              </div>
            </Flex.Item>
          </Flex>
        </div>
        <Button type="primary"
        onClick={this.onClickSearchSubmit}
        style={{margin:'0 auto',marginTop:'0.1rem',width:'90%',marginBottom:'0.1rem'}}
        ><Icon type="search" />查询</Button>
      </div>
    );
    let pagination = { //分页组件参数配置。
      pageSize:15,
      current:this.state.curPageNum,
      total:this.state.totalCount,
      onChange:this.onPaginationChange,
    };
    return (
      <div className="notificationdetai_container">
        <div className="eRecordStyle">
          {sponsorDepartmentSource}
          <div style={{width:'100%'}}>
            <Table
              columns={columns}
              showHeader={false}
              dataSource={this.state.eRecordListData||[]}
              pagination={pagination}/>
          </div>
        </div>
      </div>
    )
  }
}

export default createForm()(ElecDocMobileComp);
