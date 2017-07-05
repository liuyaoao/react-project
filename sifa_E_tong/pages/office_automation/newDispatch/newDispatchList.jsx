//最新发文
import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import { createForm } from 'rc-form';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import SearchZoneComp from './searchZone_comp.jsx';

// import myWebClient from 'client/my_web_client.jsx';
import { Modal,WhiteSpace, SwipeAction, Flex,Button,
  Tabs, RefreshControl, ListView,SearchBar,Picker,
  List,NavBar,DatePicker,InputItem} from 'antd-mobile';
import { Icon} from 'antd';
const TabPane = Tabs.TabPane;
import moment from 'moment';
import 'moment/locale/zh-cn';
const zhNow = moment().locale('zh-cn').utcOffset(8);

const alert = Modal.alert;

//最新发文
class NewDispatchList extends React.Component {
  constructor(props) {
      super(props);
      this.showDeleteConfirmDialog = this.showDeleteConfirmDialog.bind(this);
      const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      });
      this.state = {
        rootlbunid: '72060E133431242D987C0A80A4124268',
        tabsArr:["按日期", "按年度", "按主办部门", "组合查询"],
        activeTabkey:'按日期',
        colsNameCn:["拟稿日期","拟稿单位", "拟稿人", "文件标题", "发文类型", "发文文号", "当前办理人", "办理状态"],
        colsNameEn:["draftDate", "draftUnit", "draftPerson", "fileTitle", "fileType", "fileNum", "curUsers", "status"],
        currentpage:1, //当前页码。
        totalPageCount:1, //总页数。
        isLoading:false, //是否在加载列表数据
        isMoreLoading:false, //是否正在加载更多。
        hasMore:false, //是否还有更多数据。
        listData:[],
        dataSource: dataSource.cloneWithRows([]),
        departmentSource:[],
        showDetail:false,
        detailInfo:null,
      };
  }
  componentWillMount(){
    OAUtils.getOrganization({
      tokenunid:this.props.tokenunid,
      successCall: (data)=>{
        //console.log("获取OA的组织机构数据：",data);
        let organizationList = OAUtils.formatOrganizationData(data.values);
        let dataDepartment=[];
        for(var i=0;i<=organizationList.length-1;i++){
          let commonname = organizationList[i].commonname;
          if(commonname && commonname.indexOf('暂定')==-1 && commonname.indexOf('打印室')==-1){
            dataDepartment[i] = commonname;
          }
        }
        this.setState({
          departmentSource:dataDepartment,
        });
      }
    });
    //从服务端获取数据。
    this.getServerListData(this.state.activeTabkey,this.state.currentpage);
  }
  getServerListData = (keyName,currentpage)=>{
    this.setState({isLoading:true});
    OAUtils.getNewDispatchListData({
      tokenunid: this.props.tokenunid,
      currentpage:currentpage,
      keyName:keyName,
      viewcolumntitles:this.state.colsNameCn.join(','),
      successCall: (data)=>{
        console.log("get 最新发文的list data:",data);
        let {colsNameEn} = this.state;
        let parseData = OAUtils.formatServerListData(colsNameEn, data.values);
        parseData = { ...this.state.listData, ...parseData };
        this.setState({
          isLoading:false,
          isMoreLoading:false,
          currentpage:this.state.currentpage+1,
          totalPageCount:data.totalcount,
          listData:parseData,
          hasMore:(currentpage+1)<=data.totalcount,
          dataSource: this.state.dataSource.cloneWithRows(parseData),
        });
      },
      errorCall: (data)=>{
        this.setState({isLoading:false,isMoreLoading:false});
      }
    });
  }
  showDeleteConfirmDialog = (record)=>{
    let selectedId = record.id ? record.id : '';
    alert('删除', '确定删除么??', [
      { text: '取消', onPress: () => console.log('cancel') },
      { text: '确定', onPress: () => this.confirmDelete(selectedId) },
    ]);
  }
  confirmDelete = (selectedId)=>{ //确认删除
    //TODO.
  }
  handleTabClick = (key)=>{
    this.setState({
      activeTabkey:key,
      listData:[],
      currentpage:1
    });
    this.getServerListData(key,1);
  }
  onClickOneRow = (rowData)=>{
    console.log("incomingList click rowData:",rowData);
    this.setState({detailInfo:rowData, showDetail:true});
  }
  onClickLoadMore = (evt)=>{
    let {currentpage,totalPageCount,hasMore} = this.state;
    if (!this.state.isMoreLoading && !hasMore) {
      return;
    }
    this.setState({ isMoreLoading: true });
    this.getServerListData(this.state.activeTabkey,currentpage);
  }

  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: '#F5F5F9',
          height: 8,
          borderTop: '1px solid #ECECED',
          borderBottom: '1px solid #ECECED',
        }}
      />
    );
    const listRow = (rowData, sectionID, rowID) => {
      return (
        <SwipeAction style={{ backgroundColor: 'gray' }}
          autoClose
          disabled={false}
          right={[
            {
              text: '取消',
              onPress: () => console.log('cancel'),
              style: { backgroundColor: '#ddd', color: 'white' },
            },
            {
              text: '删除',
              onPress: ()=>{this.showDeleteConfirmDialog(rowData)},
              style: { backgroundColor: '#F4333C', color: 'white' },
            },
          ]}
          onOpen={() => console.log('global open')}
          onClose={() => console.log('global close')}
          >
          <div key={rowID} className={'custom_listView_item'}
            style={{
              padding: '0.08rem 0.16rem',
              backgroundColor: 'white',
            }}
            onClick={()=>this.onClickOneRow(rowData)}
          >
            <div className={'list_item_container'}>
              <div className={'list_item_middle'}>
                <div style={{color:'black',fontSize:'0.33rem',fontWeight:'bold'}}>{rowData.title}</div>
              </div>
              <div className={'list_item_left'}>
                <span className={'list_item_left_icon'} >
                  <Icon type="schedule" style={{fontSize:'3em'}} />
                </span>
              </div>
              <div className={'list_item_right'}>
                <div style={{position:'absolute',top:'0',right:'0'}}>{rowData.sendTime}</div>
                <div style={{ position:'absolute',bottom:'-1rem',right:'0' }}>{rowData.verifState}</div>
              </div>
            </div>
        </div>
      </SwipeAction>
      );
    };
    const listViewRenderFooter = ()=>{
      if(this.state.isMoreLoading){
        return (<div style={{ padding: 10, textAlign: 'center' }}>加载中...</div>);
      }else if(this.state.hasMore){
        return (<div style={{ padding: 10, textAlign: 'center' }} >
              <Button type="default" style={{margin:'0 auto',width:'90%'}}
                onClick={()=>this.onClickLoadMore()}>加载更多</Button>
            </div>);
      }
      return (<div style={{ padding: 10, textAlign: 'center' }}>没有更多了！</div>);
    };

    let multiTabPanels = this.state.tabsArr.map((tabName,index)=>{
      let {dataSource} = this.state;
      if(this.state.activeTabkey != tabName){
        dataSource = this.state.dataSource.cloneWithRows([]);
      }
      return (<TabPane tab={tabName} key={tabName} >
        <SearchZoneComp
          departmentSource={this.state.departmentSource}
          tabName={tabName}
        />
        {this.state.isLoading?<div style={{textAlign:'center'}}><Icon type="loading"/></div>:null}
        {(!this.state.isLoading && this.state.listData.length<=0)?
          (<div style={{textAlign:'center'}}>暂无数据</div>):null}
        <ListView
          dataSource={dataSource}
          renderRow={listRow}
          renderSeparator={separator}
          renderFooter={listViewRenderFooter}
          initialListSize={this.state.currentpage*10}
          pageSize={this.state.currentpage*10}
          scrollRenderAheadDistance={400}
          scrollEventThrottle={20}
          style={{}}
          scrollerOptions={{ scrollbars: false }}
        />
      </TabPane>);
    });
    return (
      <div className="newDispatchList">
        <Tabs
          swipeable={false}
          defaultActiveKey={this.state.activeTabkey}
          pageSize={4}
          onTabClick={this.handleTabClick}>
          {multiTabPanels}
        </Tabs>
        <WhiteSpace />
      </div>
    )
  }
}

NewDispatchList.defaultProps = {
};
NewDispatchList.propTypes = {
};

export default createForm()(NewDispatchList);
