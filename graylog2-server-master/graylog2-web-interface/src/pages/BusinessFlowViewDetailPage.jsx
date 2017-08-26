import React from 'react';
import Reflux from 'reflux';
import { Row, Col } from 'react-bootstrap';

import PageHeader from 'components/common/PageHeader';
import { Spinner } from 'components/common';
import { LinkContainer } from 'react-router-bootstrap';
import { ButtonToolbar, DropdownButton, MenuItem } from 'react-bootstrap';
import Routes from 'routing/Routes';
import StoreProvider from 'injection/StoreProvider';
const CurrentUserStore = StoreProvider.getStore('CurrentUser');

require('!script!../../public/javascripts/paper-full.min.js');
import InfoModal from 'components/architecture/infoModal';
var ReactWidgets = require('react-widgets');
var widget = require('./widget.js');
import AppConfig from 'util/AppConfig';
import ErrorConditionSearch from './ErrorConditionSearch';
// var SERVERADDRESS = 'http://192.168.9.241:9000';//192.168.54.110:8080    192.168.9.163:8080  192.168.6.18
// var SERVERADDRESS = '';
var arrayDropValue = ['相对','绝对'];
var arrayDropTimeValue= [{key:'5m',value:'搜索过去5分钟'},{key:'15m',value:'搜索过去15分钟'},{key:'30m',value:'搜索过去30分钟'},
                {key:'1h',value:'搜索过去1小时'},{key:'2h',value:'搜索过去2小时'},{key:'8h',value:'搜索过去8小时'},{key:'1d',value:'搜索过去1天'},
                {key:'2d',value:'搜索过去2天'},{key:'5d',value:'搜索过去5天'},{key:'7d',value:'搜索过去7天'},{key:'14d',value:'搜索过去14天'},
                {key:'30d',value:'搜索过去30天'}];//,{key:'all',value:'搜索所有信息'}

var resultArr = [];
var tempArr = [];

const BusinessFlowViewDetailPage = React.createClass({
  mixins: [Reflux.connect(CurrentUserStore)],
  _isLoading() {
    return !this.state.currentUser;
  },
  getInitialState: function() {
      return {
          isShow:false,
          isShowSelect:false,
          isTimeScope:false,
          dropDownValue: arrayDropValue[0],
          dropDownTimeValue:arrayDropTimeValue[0].value,
          defaultTime: '5m',//相对搜索默认时间  m h d all
          initFrom: 1,
          initNumPerPage: 25,
          initCurrentPage: 1,
          numPerPage:25, //当前每页显示多少条记录
          currentPage:1, //当前页码。
          errorLogList:[],
          errorLogCount:0,
          conditionList: [],
          isOr: ""
      }
  },
  //获取table数据
  getServerListData(data){
    //有两种方式的查询  1.相对  2.绝对
    var _this = this;
    var startFrom = 1;
    var endTo = 25;
    if(data){
      startFrom = data.from;
      endTo = data.to;
      startDate = data.startTime;
      endDate = data.endTime;
    }
    if(this.state.isTimeScope){ //绝对
      var errorStartTime= $("#errorFlowStartTime").find('input').val();
      var errorEndTime= $("#errorFlowEndTime").find('input').val();
      if(!errorStartTime){ return; }
      var startDate =  Date.parse(errorStartTime.replace(/-/,"/"));
      var endDate = Date.parse(errorEndTime.replace(/-/,"/"));
      console.log('endDate===',errorEndTime);
      console.log('new data ==',new Date());

      var SERVERADDRESS = AppConfig.gl2ServerUrl()+"/";  //localStorage.getItem("servletServiceUrl")
      var address = SERVERADDRESS+"business?action=allerror&id=&start="+startDate+"&end="+endDate+"&from="+startFrom+"&to="+endTo;
      $.ajax({
            type: "get",
            async: false,
            url: address,
            dataType: "json",
            cache:false,
            success: function (data) {
              var bb = _this.state.conditionList;
              var qq = _this.state.isOr;
              //判断是 与 或
              var isOr = false;
              if(qq.indexOf("OR") > 0 ){
                isOr = true;
              }
              var cc = data.list;
              if(bb.length > 0){
                resultArr = [];
                for(var i=0; i<bb.length; i++){

                  //匹配6个参数
                  if(bb[i].searchName === "业务ID"){
                    var aa = resultArr;
                    if(!(isOr) && aa.length > 0){
                      _this.mactchResults(bb[i],aa,"businessID");
                    }else{
                      _this.mactchResults(bb[i],cc,"businessID");
                    }
                  }else if(bb[i].searchName === "RA耗时"){
                    var aa = resultArr;
                    if(!(isOr) && aa.length > 0){
                      _this.mactchResults(bb[i],aa,"raDuration");
                    }else{
                      _this.mactchResults(bb[i],cc,"raDuration");
                    }

                  }else if(bb[i].searchName === "CA耗时"){
                    var aa = resultArr;
                    if(!(isOr) && aa.length > 0){
                      _this.mactchResults(bb[i],aa,"caDuration");
                    }else{
                      _this.mactchResults(bb[i],cc,"caDuration");
                    }

                  }else if(bb[i].searchName === "KM耗时"){
                    var aa = resultArr;
                    if(!(isOr) && aa.length > 0){
                      _this.mactchResults(bb[i],aa,"kmDuration");
                    }else{
                      _this.mactchResults(bb[i],cc,"kmDuration");
                    }

                  }else if(bb[i].searchName === "开始时间"){
                    var aa = resultArr;
                    if(!(isOr) && aa.length > 0){
                      _this.mactchResults(bb[i],aa,"startTime");
                    }else{
                      _this.mactchResults(bb[i],cc,"startTime");
                    }

                  }else if(bb[i].searchName === "结束时间"){
                    var aa = resultArr;
                    if(!(isOr) && aa.length > 0){
                      _this.mactchResults(bb[i],aa,"endTime");
                    }else{
                      _this.mactchResults(bb[i],cc,"endTime");
                    }

                  }
                  if(i == bb.length-1){

                    _this.setState({errorLogCount:data.total});
                    _this.setState({errorLogList:resultArr});

                  }
                }

              }else{
                _this.setState({errorLogCount:data.total});
                _this.setState({errorLogList:data.list});
              }
            },
            timeout: 30000,
            error: function (data) {

            }
          });
    }else{
      var now = new Date();
      var sD = '';//起始时间    结束时间 -起始时间
      var eD = '';
        // var time = now.getTime() - 1000*60*30;//过去30分钟
      var tString = this.state.defaultTime;
      var searchTime= '';
      if(tString.indexOf('m') > 0){//5 15 30
        var newStr=tString.replace("m","");
        var time = now.getTime()-1000*60*newStr;
        // console.log('过去半小时？',new Date(time));
        sD = Date.parse(new Date(time));
        eD = Date.parse(now);
        // console.log('sD=',sD,'eD=',eD);
      }else if(tString.indexOf('h') > 0){ //1 2 8
        var newStr=tString.replace("h","");
        var time = now.getTime()-1000*60*60*newStr;
        sD = Date.parse(new Date(time));
        eD = Date.parse(now);
        // console.log('sD=',sD,'eD=',eD);
      }else if(tString.indexOf('d') > 0){//7 14 30
        var newStr=tString.replace("d","");
        var time = now.getTime()-1000*60*60*24*newStr;
        sD = Date.parse(new Date(time));
        eD = Date.parse(now);
        // console.log('sD=',sD,'eD=',eD);
      }else{//所有

      }
      var SERVERADDRESS = AppConfig.gl2ServerUrl()+"/";
      var address = SERVERADDRESS+"business?action=allerror&id=&start="+sD+"&end="+eD+"&from="+startFrom+"&to="+endTo;
      $.ajax({
            type: "get",
            async: false,
            url: address,
            dataType: "json",
            cache:false,
            success: function (data) {
              var bb = _this.state.conditionList;
              var qq = _this.state.isOr;
              //判断是 与 或
              var isOr = false;
              if(qq.indexOf("OR") > 0 ){
                isOr = true;
              }
              var cc = data.list;
              if(bb.length > 0){
                resultArr = [];
                for(var i=0; i<bb.length; i++){

                  //匹配6个参数
                  if(bb[i].searchName === "业务ID"){
                    var aa = resultArr;

                    if(!(isOr) && aa.length > 0){
                      _this.mactchResults(bb[i],aa,"businessID");
                    }else{
                      _this.mactchResults(bb[i],cc,"businessID");
                    }
                  }else if(bb[i].searchName === "RA耗时"){
                    var aa = resultArr;

                    if(!(isOr) && aa.length > 0){
                      _this.mactchResults(bb[i],aa,"raDuration");
                    }else{
                      _this.mactchResults(bb[i],cc,"raDuration");
                    }

                  }else if(bb[i].searchName === "CA耗时"){
                    var aa = resultArr;

                    if(!(isOr) && aa.length > 0){
                      _this.mactchResults(bb[i],aa,"caDuration");
                    }else{
                      _this.mactchResults(bb[i],cc,"caDuration");
                    }

                  }else if(bb[i].searchName === "KM耗时"){
                    var aa = resultArr;
                    if(!(isOr) && aa.length > 0){
                      _this.mactchResults(bb[i],aa,"kmDuration");
                    }else{
                      _this.mactchResults(bb[i],cc,"kmDuration");
                    }
                  }else if(bb[i].searchName === "开始时间"){
                    var aa = resultArr;

                    if(!(isOr) && aa.length > 0){
                      _this.mactchResults(bb[i],aa,"startTime");
                    }else{
                      _this.mactchResults(bb[i],cc,"startTime");
                    }

                  }else if(bb[i].searchName === "结束时间"){
                    var aa = resultArr;

                    if(!(isOr) && aa.length > 0){
                      _this.mactchResults(bb[i],aa,"endTime");
                    }else{
                      _this.mactchResults(bb[i],cc,"endTime");
                    }
                  }
                  if(i == bb.length-1){
                    _this.setState({errorLogCount:data.total});
                    _this.setState({errorLogList:resultArr});
                  }
                }

              }else{
                _this.setState({errorLogCount:data.total});
                _this.setState({errorLogList:data.list});
              }
            },
            timeout: 30000,
            error: function (data) {
            }
          });
    }
  },
  mactchResults(bb,cc,param){
    tempArr = [];
    for(var j=0; j<cc.length; j++){
      if(param === "businessID"){
        var value = parseInt($.trim(bb.value));
        var dd = parseInt(cc[j].businessID);
      }else if(param === "raDuration"){
        var value = parseInt($.trim(bb.value));
        var dd = parseInt(cc[j].raDuration);
      }else if(param === "caDuration"){
        var value = parseInt($.trim(bb.value));
        var dd = parseInt(cc[j].caDuration);
      }else if(param === "kmDuration"){
        var value = parseInt($.trim(bb.value));
        var dd = parseInt(cc[j].kmDuration);
      }else if(param === "startTime"){

        var time = Date.parse(cc[j].startTime.replace(/-/,"/"));
        var value = Date.parse($.trim(bb.value).replace(/-/,"/"));
        var disparityTime = time - value;

      }else if(param === "endTime"){

        var time = Date.parse(cc[j].endTime.replace(/-/,"/"));
        var value = Date.parse($.trim(bb.value).replace(/-/,"/"));
        var disparityTime = time - value;
      }
      //匹配五种搜索情况
      if(bb.searchCondition === "=="){
        if(param === "startTime" || param === "endTime"){
          if(disparityTime === 0){
            tempArr.push(cc[j]);
          }
        }
        if(dd === value){
          tempArr.push(cc[j]);
        }
      }else if(bb.searchCondition === ">="){
          if(param === "startTime" || param === "endTime"){
            if(disparityTime >= 0){
              tempArr.push(cc[j]);
            }
          }
          if(dd >= value){
            tempArr.push(cc[j]);
          }
      }else if(bb.searchCondition === ">"){
          if(param === "startTime" || param === "endTime"){
            if(disparityTime > 0){
              tempArr.push(cc[j]);
            }
          }

          if(dd > value){
            tempArr.push(cc[j]);
          }
      }else if(bb.searchCondition === "<="){
          if(param === "startTime" || param === "endTime"){
            if(disparityTime <= 0){
              tempArr.push(cc[j]);
            }
          }

          if(dd <= value){
            tempArr.push(cc[j]);
          }
      }else if(bb.searchCondition === "<"){
          if(param === "startTime" || param === "endTime"){
            if(disparityTime < 0){
              tempArr.push(cc[j]);
            }
          }
          if(dd < value){
            tempArr.push(cc[j]);
          }
      }
      if(j==cc.length-1){
        resultArr = tempArr;
      }
    }
  },
  componentWillUnmount(){
    $('#businessNav').attr("className","");
  },
  componentDidMount() {
    this.getServerListData(null);
    $('#businessNav').attr("className","active");
    // console.log(aa);

    //hover时 dropdown显示
    var hoverTimeout;
    $('.dropdown').hover(function() {
        clearTimeout(hoverTimeout);
        $(this).addClass('open');
    }, function() {
        var $self = $(this);
        hoverTimeout = setTimeout(function() {
            $self.removeClass('open');
        }, 50);
    });

    //hover时 dropdown显示
    var hoverTimeout1;
    $('.keep-open').hover(function() {
        clearTimeout(hoverTimeout1);
        $(this).addClass('open');
    }, function() {
        var $self = $(this);
        hoverTimeout1 = setTimeout(function() {
            $self.removeClass('open');
        }, 50);
    });
  },
  valueFormatter(value,row){
    if(value == undefined) return;
    return value+"ms";
  },
  getIntegralTime(){
    var today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    return today;
  },
  _request(param){
    if($("#errorFlowStartTime").find('input').val()){
      var errorFlowStartTime = Date.parse($("#errorFlowStartTime").find('input').val().replace(/-/,"/"));
    }
    if($("#errorFlowEndTime").find('input').val()){
      var errorFlowEndTime = Date.parse($("#errorFlowEndTime").find('input').val().replace(/-/,"/"));
    }
    console.log('yoyo=========',param,errorFlowStartTime,errorFlowEndTime);
    // console.log('slaCreateTime==',today.toString());
    var _this = this;
    var data = {};
    data.startTime = errorFlowStartTime;
    data.endTime = errorFlowEndTime;
    data.from = param.range.from;
    data.to = param.range.to;
    if(param.sort_name) data.sort_name=param.sort_name;
    if(param.sort_order) data.sort_order=param.sort_order;
    // this.getFlux().actions.AssetManageActions.get_monitor_data({
    // this.props.get_monitor_data({
    //     data: data
    // });
    this.getServerListData(data);
  },
  onClickRow(e){
    var _this = this;
    var SERVERADDRESS = AppConfig.gl2ServerUrl()+"/";
    var address = SERVERADDRESS+"business?action=listmsg&id="+e.businessID;
    $.ajax({
          type: "get",
          async: false,
          url: address,
          dataType: "json",
          cache:false,
          success: function (data) {
            _this.refs.errorFlowModal.refreshTable(data);
            _this.refs.errorFlowModal.setCurrentId(e.businessID);
          },
          timeout: 30000,
          error: function (data) {
            console.log('错误记录：',data);
          }
        });
    this.refs.errorFlowModal.show();
  },
  onQuery(){ //点击查询

    this.getServerListData({

    });
  },
  onEnabled(){
    var eUpdateTime=  localStorage.getItem("errorUpdateTime");
    var eObj = eval('('+eUpdateTime+')');
    var tempTime = eObj;
    if(eObj != null){
      tempTime = eObj.value;
    }else{
      tempTime = 5000;
    }
    var _this = this;
    this.onClearTime();
    this.errorInterval = setInterval(function(){
      _this.onQuery();
    },tempTime);
  },
  onLi(obj){
    var _this = this;
    this.onClearTime();
    this.errorInterval = setInterval(function(){
      _this.onQuery();
    },obj.value);
  },
  onClearTime(){
    clearInterval(this.errorInterval);
  },
  onDropdown(){
    if(this.state.isShow){
      this.setState({isShow:false});
      // this.setState({isTimeScope:false});
    }else{
      this.setState({isShow:true});
      // this.setState({isTimeScope:true});
    }
  },
  onDropdownSelect(){
    this.setState({isShowSelect:!this.state.isShowSelect});
    this.setState({isShow:false});
  },
  onLiWay(i){
    // console.log('-------------',this.refs.onDropdownValue.innerHTML);
    if(i =="0"){
      this.setState({isTimeScope:false});
      this.setState({dropDownValue:arrayDropValue[0]});
    }else{
      this.setState({isTimeScope:true});
      this.setState({dropDownValue:arrayDropValue[1]});
    }
    this.setState({isShow:false});
  },
  onLiTime(obj){
    this.setState({defaultTime:obj.key});
    this.setState({dropDownTimeValue: obj.value});
    this.setState({isShowSelect:false});
  },
  onConditions:function(){
      this.refs.errorSearchModal.show();
  },
  setConditionStr:function(){
      var xx = this.refs.errorSearchModal.getTableData();
      this.setState({conditionList: xx.total, isOr: xx.str});
      // var aa = $.trim($('#erroyQueryId').val());
      // aa = aa + " "
      $('#erroyQueryId').val(xx.str);
  },
  render() {
    if (this._isLoading()) {
      return <Spinner/>;
    }
    var columns = [
    {
        field: 'state',
        checkbox: true,
    }, {
        title: '业务ID',
        field: 'businessID',
        halign: 'left',
        align: 'left',
        sortable: true
    },{
        title: 'RA 耗时',
        field: 'raDuration',
        formatter: this.valueFormatter,
        halign: 'left',
        align: 'left',
        sortable: true
    }, {
        title: 'CA 耗时',
        field: 'caDuration',
        formatter: this.valueFormatter,
        halign: 'left',
        align: 'left',
        sortable: true
    }, {
        title: 'KM 耗时',
        field: 'kmDuration',
        formatter: this.valueFormatter,
        halign: 'left',
        align: 'left',
        sortable: true
    }, {
        title: '开始时间',
        field: 'startTime',
        sortable: true,
        halign: 'left',
        align: 'left'
    }, {
        title: '结束时间',
        field: 'endTime',
        sortable: true,
        halign: 'left',
        align: 'left'
    }, {
        field: 'EQUIPMENTTYPE',
        visible: false
    }];

    console.log("业务错误详情展示render....");
    return (
      <div >
        <InfoModal/>
        <ErrorConditionSearch ref="errorSearchModal" onAddCondition={this.setConditionStr} />

        <PageHeader title="实时错误日志搜索">
          <span>业务错误详情展示。</span>
        </PageHeader>

        <Row className="content">
          <widget.ErrorFlowModal ref="errorFlowModal"/>
            <div className="form-inline" role="form" style={{textAlign:'start',marginRight:'auto'}}>

              <div className="form-group" style={{marginLeft:"15px"}}>
                <ButtonToolbar>
                  <DropdownButton title={this.state.dropDownValue} ref="onDropdownValue"
                                  id='dropdownMenu1' bsStyle="info" onSelect={this.onDropdown}>
                    {arrayDropValue.map((value,i)=>{
                      return(
                        <li role="presentation" onClick={this.onLiWay.bind(this,i)}><a role="menuitem" tabIndex="-1" href="#">{value}</a></li>
                      )
                    })}
                  </DropdownButton>
                </ButtonToolbar>
              </div>

              {
                this.state.isTimeScope ? (
                  <div className="form-group" style={{marginLeft:"15px"}}>
                    <div className="form-group">
                      <span style={{fontSize:'16px'}}>时间段: </span>
                    </div>
                    <div className="form-group" style={{marginLeft:"15px"}}>
                        <ReactWidgets.DateTimePicker format={"yyyy-MM-dd HH:mm:ss"} id="errorFlowStartTime" defaultValue={this.getIntegralTime()}/>
                    </div>
                    <div className="form-group" style={{marginLeft:"15px"}}>
                      <span style={{fontSize:'16px'}}>至: </span>
                    </div>
                    <div className="form-group" style={{marginLeft:"15px"}}>
                        <ReactWidgets.DateTimePicker format={"yyyy-MM-dd HH:mm:ss"} id="errorFlowEndTime" defaultValue={new Date()}/>
                    </div>
                  </div>):
                  (<div className="form-group" style={{marginLeft:"15px"}}>
                    <div className="form-group">
                        <ButtonToolbar>
                          <DropdownButton id='dropdownMenu2'
                            title={this.state.dropDownTimeValue}
                            ref="onDropdownValue1"
                            bsStyle="info"
                            onSelect={this.onDropdownSelect}>
                            {arrayDropTimeValue.map((obj,i)=>{
                              return(
                                <li role="presentation"
                                  onClick={this.onLiTime.bind(this,obj)}>
                                  <a role="menuitem" tabIndex="-1" href="#">{obj.value}</a>
                                </li>)
                            })}
                          </DropdownButton>
                        </ButtonToolbar>
                    </div>
                  </div>)
              }

              <div className="form-group" style={{marginLeft:"15px"}}>
                <button type="button" className="btn btn-success" onClick={this.onQuery}>查询</button>
              </div>

              <div className="form-group" style={{marginLeft:"8px"}}>
                <button type="button" className="btn btn-success" onClick={this.onConditions}>条件</button>
              </div>
              <div className="form-group" style={{marginLeft:"8px"}}>
                <input type="text" className="form-control" style={{width:"600px"}}  placeholder="在此输入您的查询条件" id="erroyQueryId"/>
              </div>
              {/**
              <div className="form-group" style={{marginLeft:"15px"}}>
                <LinkContainer to={Routes.BUSINESSFLOWVIEW}>
                  <button type="button" className="btn btn-success">查看业务流程图</button>
                </LinkContainer>
              </div>*/}
              <widget.UpdateGroup onEnabled={this.onEnabled} onLi={this.onLi} onClearTime={this.onClearTime}/>
            </div>
            {/**
            <canvas id="canvas" style={{width:"100%", height:"100%", backgroundColor:"white"}}></canvas>*/}
            <widget.PaginationTable
                          initFrom={this.state.initFrom}
                          initNumPerPage={this.state.initNumPerPage}
                          initCurrentPage={this.state.initCurrentPage}
                          columns={columns}
                          list={this.state.errorLogList}
                          id={"businessflowdetailTable"}
                          count={this.state.errorLogCount}
                          onClickRow={this.onClickRow}
                          onClickSort={this.onClickSort}
                          onClickRefresh={this.onClickRefresh}
                          setState={this.setState}
                          request={this._request} />

        </Row>
      </div>
    );
  },
});

export default BusinessFlowViewDetailPage;
