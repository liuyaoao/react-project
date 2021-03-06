//电子档案手机界面
import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import avator_man from 'images/avator_icon/avator_man.png';
import avator_woman from 'images/avator_icon/avator_woman.png';
import { createForm } from 'rc-form';
import { Modal,Flex
   , ListView,List,InputItem} from 'antd-mobile';
import { Icon,Table,Select,Button as ButtonPc,notification} from 'antd';

const urlPrefix = 'http://218.77.44.11:10080/CS_JrlService';

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
const Option = Select.Option;
let maskProps;
if (isIPhone) {
  maskProps = {
    onTouchStart: e => e.preventDefault(),
  };
}
notification.config({
  top: 68,
  duration: 3
});

class ERecordisPcComp extends React.Component {
  constructor(props) {
      super(props);
      this.onOrganSelectChange = this.onOrganSelectChange.bind(this);
      const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      });
      this.state = {
        dataSource: dataSource.cloneWithRows([]),
        refreshing: true,
        selectOrganId:'1',//选中的组织结构的ID数组
        columns:[],
        sel: '',
        visible: false,
        contactInfo:{},
        curPageNum:1,
        totalCount:0,
        eRecordListData:[], //电子档案列表数据
        searchParams:{}, //查询参数。
      };
  }
  componentDidMount(){
    if(this.state.selectOrganId){
      this.getServereRecordListData({organId:this.state.selectOrganId,currentIndex:this.state.curPageNum});
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.redressOrganId && nextProps.redressOrganId!=this.props.redressOrganId){
      this.setState({
        selectOrganId:nextProps.redressOrganId
      });
      this.getServereRecordListData({organId:nextProps.redressOrganId,currentIndex:this.state.curPageNum});
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
            notification.error({message: '矫正系统获取电子档案失败，'+res.respMsg});
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
  parseServerListData = (values)=>{
    for(let i=0;i<values.length;i++){
      values[i]['key'] = values[i].id || values[i].identity;
    }
    return values;
  }
  onPaginationChange = (current,pageSize)=>{
    this.getServereRecordListData({organId:this.state.selectOrganId,currentIndex:current});
  }
  onClickSearchSubmit = ()=>{
    this.props.form.validateFields((error, value) => {
      let params = value || {};
      params.organId = this.state.selectOrganId;
      !params.name ? delete params.name : null;
      !params.telephone ? delete params.telephone : null;
      this.setState({
        searchParams:params
      });
      this.getServereRecordListData({organId:this.state.selectOrganId,currentIndex:1},params);
    });
  }
  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  handleCancel = (e) => {
    //console.log(e);
    this.setState({
      visible: false,
    });
  }
  onClickOnRow = (data)=>{ //显示新增编辑弹窗。
    let info = data || {};
    this.setState({
       contactInfo:info,
       visible: true,
     });
   }
  componentWillMount(){
    const columns = [{
      title: '联系人',
      dataIndex: 'Contacts',
      render:(text,record,index) => (


            <div key={record.identity+123456}>
              <div className={'list_item_container'}>
                  <div className={'list_item_middle'}>
                    <div style={{color:'black',fontSize:'0.30rem',fontWeight:'bold'}}>{record.name+'('+record.telephone+')'}
                    </div>
                    <div style={{color:'black',fontSize:'0.30rem',marginTop:'0.3rem'}}>{record.organ}
                    </div>
                  </div>
                  <div className={'list_item_left'}>
                    {
                      record.sex=="男"?
                      (<img width="54" height="54" src={avator_man}/>):
                      (<img width="54" height="54" src={avator_woman}/>)
                    }
                  </div>
                  <div className={'list_item_right'}>
                    <a href="javascript:;" style={{position:'absolute',bottom:'-1.1rem',right:'0'}} onClick={()=>this.onClickOnRow(record)}>查看</a>

                  </div>
              </div>
            </div>

          )
    }];
    this.setState({columns:columns});
    // <a href="javascript:;" style={{position:'absolute',top:'0',right:'0'}}>解矫</a>

  }
  onOrganSelectChange(val){
    // console.log("onOrganSelectChange--:",val);
    this.setState({
      selectOrganId:val
    });
  }
  render() {
    const { contactInfo,visible } = this.state;
    let selectOrganId = this.state.selectOrganId || this.props.redressOrganId;
    const { columns } = this.state;
    const { getFieldProps, getFieldError } = this.props.form;

    let organData = [];
    for(let i in this.props.organListData){
      organData.push({label:this.props.organListData[i].organName+'('+this.props.organListData[i].count+')',
         value: this.props.organListData[i].organId});
    }
    let optionData=[];
    for(let i in this.props.organListData){
      optionData.push(this.props.organListData[i].organName+'('+this.props.organListData[i].count+')');
    }
    let optionDataDisplay=organData.map((tagName,index)=>{
      return (<Option value={tagName.value+''} key={index}>{tagName.label}</Option>);
    });
    let sponsorDepartmentSource=(
      <div className={'oa_detail_cnt'}>
        <div>
          <Flex>
            <Flex.Item>
              <div>
                  <div style={{ float: 'left' }}>
                        <span style={{color: 'black',fontSize:'0.3rem'}}><Icon type="team"
                        style={{color: '#278197',fontSize:'0.6rem'}}/>组织机构:</span>
                        <Select defaultValue={optionData[0]} style={{ width: 400 }} onSelect={this.onOrganSelectChange}>
                              {optionDataDisplay}
                        </Select>
                  </div>

                  <InputItem {...getFieldProps('name')} style={{ float: 'left',marginLeft:20 }}
                  editable={true} labelNumber={2} placeholder="请输入姓名"><span style={{color: 'black',fontSize:'0.3rem',verticalAlign:'super'}}>
                  <Icon type="user"
                  style={{color: '#278197',fontSize:'0.6rem'}}/>姓名:</span></InputItem>
                  <InputItem {...getFieldProps('telephone')} style={{float: 'left'}}
                  editable={true} labelNumber={2} placeholder="请输入手机号">
                  <span style={{color: 'black',fontSize:'0.3rem',verticalAlign:'super'}}>
                  <Icon type="phone"
                  style={{color: '#EF9F2E',fontSize:'0.6rem'}}/>手机号:</span></InputItem>
                  <button type="submit" style={{marginLeft: 30}}
                    className="btn btn-primary" onClick={this.onClickSearchSubmit}
                    ><Icon type="search" /> 查询</button>
              </div>
            </Flex.Item>
          </Flex>

        </div>

      </div>
    );
    let multiTabPanels =
      (<div>
        {sponsorDepartmentSource}
      </div>)
    ;
    let ModalData =(<div>
          <Modal
             title="电子档案详情"
             visible={visible}
             onOk={this.handleOk}
             onCancel={this.handleCancel}
             width="400px"
             height="813px"
             maskClosable={true}>
                 <List>
                         <List.Item key='0'><span>姓名</span><span>{contactInfo.name}</span></List.Item>
                         {contactInfo.sex=="男"?
                         (<List.Item key='1'><span>图像</span><img src={avator_man}/></List.Item>):
                         (<List.Item key='1'><span>图像</span><img src={avator_woman}/></List.Item>)}
                         <List.Item key='2'><span>性别</span><span>{contactInfo.sex}</span></List.Item>
                         <List.Item key='11'><span>出生日期</span><span>{contactInfo.csrq}</span></List.Item>
                         <List.Item key='3'><span>机构名称</span><span>{contactInfo.organ}</span></List.Item>
                         <List.Item key='4'><span>身份证号码</span><span>{contactInfo.identity}</span></List.Item>
                         <List.Item key='5'><span>矫正开始时间</span><span>{contactInfo.startTime}</span></List.Item>
                         <List.Item key='6'><span>矫正结束时间</span><span>{contactInfo.endTime}</span></List.Item>
                         {contactInfo.manageLevel!=='' ? (
                            <List.Item key='7'><span>管理等级</span><span>{contactInfo.manageLevel}</span></List.Item>
                         ):null}
                         <List.Item key='8'><span>人员编号</span><span>{contactInfo.rymcId}</span></List.Item>
                         <List.Item key='9'><span>手机号码</span><span>{contactInfo.telephone}</span></List.Item>
                         {contactInfo.criminal!=='' ? (
                            <List.Item key='10'><span>罪名</span><span>{contactInfo.criminal}</span></List.Item>
                         ):null}
                         {contactInfo.status!=='' ? (
                            <List.Item key='12'><span>状态</span><span>{contactInfo.status}</span></List.Item>
                         ):null}
                         <List.Item key='13'><span>矫正类型</span><span>{contactInfo.type}</span></List.Item>
                         <List.Item key='14'><span>解矫文书</span><img src={'http://211.138.238.83:9000/'+contactInfo.relieveCorrectionUrl}/></List.Item>
                         <List.Item key='15'><span>档案号</span><span>{contactInfo.fileNumber}</span></List.Item>
                 </List>
                 <span style={{position:'absolute',right:0,top:0,cursor:'pointer'}} onClick={this.handleCancel}
                   ><Icon type="close" /></span>
              </Modal>
         </div>);
    let pagination = { //分页组件参数配置。
      pageSize:15,
      current:this.state.curPageNum,
      total:this.state.totalCount,
      onChange:this.onPaginationChange,
    };
    return (
      <div className="notificationdetai_container ERecordPcStyle">
        <div className="newDispatchList eRecordStyle">
            {multiTabPanels}
            <div style={{width:'100%'}}>
              <Table
                columns={columns}
                showHeader={false}
                dataSource={this.state.eRecordListData||[]}
                pagination={pagination}/>
            </div>
            {ModalData}
        </div>
      </div>
    )
  }
}

ERecordisPcComp.defaultProps = {
};
ERecordisPcComp.propTypes = {
};

export default createForm()(ERecordisPcComp);
