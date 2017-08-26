import React from 'react';
import Reflux from 'reflux';
import { Row, Col, ButtonToolbar, DropdownButton, MenuItem, Alert } from 'react-bootstrap';

import PageHeader from 'components/common/PageHeader';
import { Spinner } from 'components/common';

import StoreProvider from 'injection/StoreProvider';
const CurrentUserStore = StoreProvider.getStore('CurrentUser');

var ReactWidgets = require('react-widgets');
var Globalize = require('globalize');
var globalizeLocalizer = require('react-widgets/lib/localizers/globalize');
globalizeLocalizer(Globalize);

var socket, bBusinessViewPageMounted = false;
var mySearchSingal = ['==','>=','>','<=','<'];

const ConditionSearch = React.createClass({
  mixins: [Reflux.connect(CurrentUserStore)],
  _isLoading() {
    return !this.state.currentUser;
  },
  getInitialState() {
    return {
        bRefresh: true,
        sourceData: [],
        conditionSearchTableData: [],
        conditionA: '请选择搜索条件',
        conditionB: mySearchSingal[0]
    };
  },
  componentDidMount() {
    $('#conditionSearchTable').bootstrapTable({
        columns: [
            {
                field: 'state',
                checkbox: true
            },
            {
                title: '字段',
                field: 'searchName',
                // width: 120,
                sortable: false
            }, {
                title: '条件',
                field: 'searchCondition',
                // width: 150,
                sortable: false
                // formatter: durationFormatter
            }, {
                title: '值',
                field: 'value',
                // width: 150,
                sortable: false
            }
        ],
        data: this.state.conditionSearchTableData
    });

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
  },
  componentDidUpdate() {
    //   if(this.state.bRefresh) {
          // $('#conditionSearchTable').bootstrapTable('resetView');
          // $('#conditionSearchTable').bootstrapTable('load', this.state.businessTableData);
          // $('#conditionSearchTable').bootstrapTable('scrollTo', 'bottom');
    //   }
  },
  componentWillUnmount() {
      // socket.send("close");
      // bBusinessViewPageMounted = false;
    //   socket = null;
  },
  addCondition(){
    var conditionA  = this.state.conditionA;
    var conditionB  = this.state.conditionB;
    var conditionC  = $('#conditionC').val();
    //var conditionItem = this.state.itoss_system.monitorReturnItem;
    if(conditionC.trim() == ""){
      alert("项目表达式的值不能为空!");
      return;
    }
    var nextItems =[];
    var tableObj = {
      id:this.uuid(),
      searchName:conditionA,
      searchCondition:conditionB,
      value:conditionC
    };
    var eArray = this.state.conditionSearchTableData;
        for(var i=0;i < eArray.length;i++){
          if(conditionA == eArray[i].searchName && conditionB == eArray[i].searchCondition && conditionC == eArray[i].value){
            alert("该条件已存在");
            return false;
          }
        }

    nextItems = this.state.conditionSearchTableData.concat([tableObj]);
    this.setState({conditionSearchTableData:nextItems});
    console.log(nextItems);
    $('#conditionSearchTable').bootstrapTable('refreshOptions', {data: nextItems});


    // var tempState = this.state.conditionSearchTableData;
    // tempState.push({searchName:"1",searchCondition:"==",value:"456"})
    // this.setState({conditionSearchTableData:tempState});
    // $('#conditionSearchTable').bootstrapTable('resetView');
    // alert();
    return;
  },
  getTableData(){
    var radioValue = $("input[type='radio']:checked").val();
    var normalData = this.state.conditionSearchTableData;
    var selectMult = $('#conditionSearchTable').bootstrapTable('getSelections');

    var newStr = "";
    for(var i =0;i< selectMult.length;i++){
      let tempCondition = "";
      if(selectMult[i].searchCondition == "=="){
        tempCondition = "";
      }else{
        tempCondition = selectMult[i].searchCondition;
      }
      if(i == selectMult.length-1){
        newStr += selectMult[i].searchName+":"+tempCondition+selectMult[i].value;
      }else{
        newStr += selectMult[i].searchName+":"+tempCondition+selectMult[i].value+(radioValue == "1" ? " AND ":" OR ");
      }
  }

    return newStr;
  },
  show(){
    $('#infoModal').modal('show');
  },
  uuid:function() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
  },
  _onClickDelete(){
    var selectMult = $('#conditionSearchTable').bootstrapTable('getSelections');
    var eArray = this.state.conditionSearchTableData;
    if(selectMult.length > 0 ){
      var newData = [];
      for(var y=0;y < eArray.length;y++){
        var has = false;
        for(var z =0;z < selectMult.length;z++){
          if(eArray[y].id == selectMult[z].id){
            has = true;
            break;
          }
        }
        if(!has){
          newData.push(eArray[y]);
        }
      }
      this.setState({conditionSearchTableData:newData});
      $('#conditionSearchTable').bootstrapTable('refreshOptions', {data: newData});
    }
  },
  _onChangeconditionA:function(e){
    this.setState({conditionA: e.currentTarget.title});
  },
  _onChangeconditionB:function(e){
    this.setState({conditionB: e.currentTarget.title});
  },
  _setConditionData(data, isOr) {
    this.setState({conditionSearchTableData: data});
    if (isOr) {
      $("input[type='radio']")[1].checked = true;
    } else {
      $("input[type='radio']")[0].checked = true;
    }
    $('#conditionSearchTable').bootstrapTable('refreshOptions', {data: data});
  },
  render() {
    var searchNames = [];
    var xx=   localStorage.getItem("searchName");
    var allSearchName = localStorage.getItem("searchAllName");
    if(allSearchName == "undefined"){
      if(xx != "undefined"){
        searchNames = JSON.parse(xx);
        // searchNames.sort();
      }
    }else{
      searchNames = JSON.parse(allSearchName);
      // searchNames.sort();
    }
    if(searchNames == null){
      searchNames = [];
    }
    var mySearchNames = [];
    for(var i=0; i < searchNames.length;i++){
      mySearchNames.push(searchNames[i].name);
    }
    mySearchNames.sort();
    // console.log('searchNames',searchNames);

    if (this._isLoading()) {
      return <Spinner/>;
    }

    // const mySearchNamesHtml = Object.keys(mySearchNames).map((key) => {
    //   return <MenuItem>{mySearchNames}</MenuItem>;
    // });
    const mySearchNamesHtml = mySearchNames.map(function(mySearchNames,m){
      return <MenuItem title={mySearchNames}>{mySearchNames}</MenuItem>;
    });
    const mySearchSingalHtml = mySearchSingal.map(function(mySearchSingal,m){
      return <MenuItem title={mySearchSingal}>{mySearchSingal}</MenuItem>;
    });


    return (
      <div className="modal fade" id="infoModal" tabIndex="-1" role="dialog" aria-labelledby="infoModalLabel" aria-hidden="true">
          <div className="modal-dialog infoModalDialog">
              <div className="modal-content">
                  <div className="modal-header">
                      <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      <h5 className="modal-title">选择搜索条件</h5>
                  </div>
                  <div className="modal-body">
                    <div>
                        <div id="toolbar">
                            <div className="form-inline" role="form">
                                <div className="form-group">
                                  <span>条件: </span>
                                </div>
                                <div className="form-group" style={{marginLeft:"15px"}}>
                                      <DropdownButton id="conditionA"
                                                      className="pretendSelect form-control" style={{padding:"0px",width:"170px"}}
                                                      title={this.state.conditionA} onSelect={this._onChangeconditionA}>
                                                      {mySearchNamesHtml}
                                      </DropdownButton>
                                </div>
                                <div className="form-group" style={{marginLeft:"15px"}}>

                                          <DropdownButton id="conditionB"
                                                          className="pretendSelect form-control" style={{padding:"0px",width:"120px"}}
                                                          title={this.state.conditionB} onSelect={this._onChangeconditionB}>
                                                          {mySearchSingalHtml}
                                          </DropdownButton>
                                </div>
                                <div className="form-group" style={{marginLeft:"15px"}}>
                                  <input id="conditionC" className="form-control" style={{width:"200px"}} type="text" />
                                </div>
                                <div>
                                  <div className="form-group">
                                      <span>关系: </span>
                                  </div>
                                  <div className="form-group" style={{marginLeft:"15px"}}>
                                      <div className="radio radioDiv">
                                          <label>
                                              <input id="editErrorConditionModal_radio_And" type="radio" name="editErrorConditionModal_radio_and_or" value="1" defaultChecked="true" onClick={this._handleOnClickRadio}/> 与
                                          </label>
                                      </div>
                                      <div className="radio radioDiv">
                                          <label>
                                              <input id="editErrorConditionModal_radio_Or" type="radio" name="editErrorConditionModal_radio_and_or" value="2" onClick={this._handleOnClickRadio}/> 或
                                          </label>
                                      </div>
                                  </div>
                                  <button id="ok" type="button" className="btn btn-default" style={{marginLeft:"5px",float:'right'}} onClick={this.addCondition}>添加</button>
                                </div>
                            </div>
                        </div>
                        <table id="conditionSearchTable"
                               data-toggle="table"
                               data-classes="table table-striped table-hover"
                               data-height="380"
                               data-toolbar="#toolbar">
                        </table>
                    </div>
                  </div>
                  <div className="modal-footer">
                      <button type="button" className="btn btn-sm btn-success" onClick={this._onClickDelete}>删除</button>
                      <button type="button" className="btn btn-sm btn-success" data-dismiss="modal" onClick={this.props.onAddCondition}>确定</button>
                      <button type="button" className="btn btn-sm btn-success" data-dismiss="modal">关闭</button>
                  </div>
              </div>
          </div>
      </div>
    );
  },
});

export default ConditionSearch;
