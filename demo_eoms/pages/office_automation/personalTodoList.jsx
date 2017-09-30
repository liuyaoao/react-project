//个人办公的待办事项
import $ from 'jquery';
import React from 'react';
import {Link,browserHistory} from 'react-router/es6';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import { WhiteSpace, WingBlank, Button, ListView, Toast} from 'antd-mobile';
import {Icon} from 'antd';
import moment from 'moment';

// import DS_DetailComp from './dispatch/ds_detail_comp.jsx';  //发文管理--详情页。
// import SignReportDetail from './signReport/signReportDetail_comp.jsx';  //签报管理--详情页。
// import SuperviseDetail from './supervision/superviseDetail_comp.jsx';  //督办管理--详情页。

class PersonalTodoList extends React.Component {
  constructor(props) {
      super(props);
      const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      });
      this.state = {
        colsNameCn:["标题", "模块","性质","紧急程度","送文人", "发送时间"],
        colsNameEn:["fileTitle", "moduleName", "property","urgency","fileSender", "sendTime"],
        currentpage:1, //当前页码。
        totalPageCount:1, //总页数。
        isLoading:false, //是否在加载列表数据.
        isMoreLoading:false, //是否正在加载更多。
        hasMore:false, //是否还有更多数据。
        listData:[], //原生list数据
        dataSource: dataSource.cloneWithRows([]),  //listView的源数据。
        showDetail:false,
        detailInfo:{},
        tokenunid:'',
      };
  }
  componentWillMount(){
    if(this.props.location.pathname!="/office_automation/todo_list"){
      this.setState({ showDetail:true,detailInfo:{} });
    }
  }
  componentDidMount(){
    //从服务端获取数据。
    this.getServerListData(this.state.currentpage);
  }
  componentWillReceiveProps(nextProps){
    console.log("nextProps---this.props---:",nextProps, this.props);
    if(nextProps.location.pathname=="/office_automation/todo_list" && nextProps.location.pathname!=this.props.location.pathname){
      this.setState({ showDetail:false,detailInfo:{} });
      this.getServerListData(this.state.currentpage);
    }
  }
  //获取服务器端的待办事项数据。
  getServerListData = (currentpage)=>{
    let loginInfo = localStorage.getItem(OAUtils.OA_LOGIN_INFO_KEY);
    let tokenunid = JSON.parse(loginInfo)['tockenunid'];
    this.setState({
      tokenunid,
      isLoading:true
    });
    OAUtils.getPersonalTodoListData({
      tokenunid: tokenunid,
      currentpage:currentpage,
      urlparam:{
        key:'dbsx',
        type:3
      },
      viewcolumntitles:this.state.colsNameCn.join(','),
      successCall: (data)=>{
        // console.log("get 待办事项的list data:",data);
        let {colsNameEn} = this.state;
        localStorage.setItem(OAUtils.OA_TODO_LIST_KEY,data.itemcount);
        let parseData = OAUtils.formatServerListData(colsNameEn, data.values);
        let listData = this.state.listData.concat(parseData);
        listData.sort((item1,item2)=>{
          return moment(item2.sendTime).format("x")-moment(item1.sendTime).format("x");
        });
        // console.log("待办事项的format list data:",listData);
        this.setState({
          isLoading:false,
          isMoreLoading:false,
          currentpage:currentpage+1,
          totalPageCount:data.totalcount,
          listData:listData,
          hasMore:(currentpage+1)<=data.totalcount,
          dataSource: this.state.dataSource.cloneWithRows(listData),
        });
      },
      errorCall: (data)=>{
        this.setState({isLoading:false,isMoreLoading:false});
      }
    });
  }
  onClickLoadMore = (evt)=>{ //点击加载更多。
    let {currentpage,totalPageCount,hasMore} = this.state;
    if (!this.state.isMoreLoading && !hasMore) {
      return;
    }
    this.setState({ isMoreLoading: true });
    this.getServerListData(currentpage);
  }
  onClickOneRow = (rowData)=>{
    // console.log("待办事项 click rowData:",rowData);
    this.setState({detailInfo:rowData, showDetail:true});
    Toast.info(<div><Icon type={'loading'} /><span>  加载中...</span></div>, 2, null, true);
    if(rowData.moduleName == "发文管理"){
      browserHistory.push('/office_automation/todo_list/dispatch_detail?unid='+rowData.frmunid);
    }else if(rowData.moduleName == "签报管理"){
      browserHistory.push('/office_automation/todo_list/signReport_detail?unid='+rowData.frmunid);
    }else if(rowData.moduleName == "督办管理"){
      browserHistory.push('/office_automation/todo_list/supervision_detail?unid='+rowData.frmunid);
    }
  }
  backToTableListCall = (showType)=>{   //返回到列表页。
    let showDetail = false;
    if(showType == "showDetail"){
      showDetail = true;
      this.setState({ showDetail });
    }else{
      this.setState({ showDetail,detailInfo:{} });
    }
  }
  updateListViewCall = ()=>{ //跟新列表。
    this.setState({
      listData:[],
      currentpage:1
    });
    this.getServerListData(1);
  }
  render() {
    let {tokenunid} = this.state;
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
        <div key={rowID} className={'custom_listView_item'}
          style={{
            padding: '0.08rem 0.16rem',
            backgroundColor: 'white',
          }}
          onClick={()=>this.onClickOneRow(rowData)}
        >
        <div className={'list_item_container'}>
          <div className={'list_item_middle'}>
            <div style={{color:'black',fontSize:'0.33rem',fontWeight:'bold'}}>{rowData.fileTitle}</div>
            <div>送文人：<span>{rowData.fileSender}</span></div>
            <div>性质：<span>{rowData.property}</span></div>
            <div style={{"position":"relative", "minHeight": "21px"}}>
              <span style={{"position": "absolute"}}>紧急程度：</span>
              <div style={{"marginLeft": "70px"}} dangerouslySetInnerHTML={{ __html:rowData.urgency }}>
              </div>
            </div>
          </div>
          <div className={'list_item_left'}>
            <span className={'list_item_left_icon'} >
              <Icon type="schedule" style={{fontSize:'3em'}} />
            </span>
          </div>
          <div className={'list_item_right'}>
            <div style={{position:'absolute',top:'0',right:'0'}}>{rowData.sendTime.split(" ")[0]}</div>
            <div style={{ position:'absolute',bottom:'-1.5rem',right:'0' }}>{rowData.moduleName}</div>
          </div>
        </div>
        </div>
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
      return !this.state.isLoading?(<div style={{ padding: 10, textAlign: 'center' }}>没有更多了！</div>):null;
    };
    let {showDetail, detailInfo} = this.state;
    detailInfo = Object.assign({}, detailInfo , {unid:detailInfo.frmunid || ''});
    return (
      <div>
        <WhiteSpace />
        {this.state.isLoading?<div style={{textAlign:'center'}}><Icon type="loading"/></div>:null}
        {(!this.state.isLoading && this.state.listData.length<=0)?
          <div style={{textAlign:'center'}}>暂无数据</div>:null}
        {(!showDetail)?(<ListView
          dataSource={this.state.dataSource}
          renderRow={listRow}
          renderSeparator={separator}
          renderFooter={listViewRenderFooter}
          initialListSize={this.state.currentpage*10}
          pageSize={this.state.currentpage*10}
          scrollRenderAheadDistance={200}
          scrollEventThrottle={20}
          useBodyScroll={true}
          scrollerOptions={{ scrollbars: true }}
        />):null}
        {showDetail?this.props.children:null}
        {/*
          (showDetail && detailInfo.moduleName=="发文管理")?
          <DS_DetailComp
            activeTabkey={'待办'}
            detailInfo={detailInfo}
            tokenunid={tokenunid}
            updateListViewCall={this.updateListViewCall}
            backToTableListCall={this.backToTableListCall}
          />:null
        */}
        {/*
          (showDetail && detailInfo.moduleName=="签报管理")?
          <SignReportDetail
            activeTabkey={'待办'}
            detailInfo={detailInfo}
            tokenunid={tokenunid}
            updateListViewCall={this.updateListViewCall}
            backToTableListCall={this.backToTableListCall}
          />:null
        */}
        {/*
          (showDetail && detailInfo.moduleName=="督办管理")?
          <SuperviseDetail
            activeTabkey={'待办'}
            detailInfo={detailInfo}
            tokenunid={tokenunid}
            updateListViewCall={this.updateListViewCall}
            backToTableListCall={this.backToTableListCall}
          />:null
        */}
      </div>
    )
  }
}

PersonalTodoList.defaultProps = {
};

PersonalTodoList.propTypes = {
  title:React.PropTypes.string,
};

export default PersonalTodoList;
