/**
* yonggang.wei  2016/08/01.
* 编辑GrokExtractorConfiguration
*/
var React = require('react');
import StoreProvider from 'injection/StoreProvider';
const GrokPatternsStore = StoreProvider.getStore('GrokPatterns');
const ToolsStore = StoreProvider.getStore('Tools');
// require('bootstrap');
function editExpression(){
  return '<a class="dataDictTable1Edit grokStyle" href="javascript:void(0)" title="编辑"></a>';
};
function deletExpression(){
  return '<a class="deletDictTable1Edit grokStyledelet" href="javascript:void(0)" title="删除"></a>';
};
var _this = null;
window.editExpressionEvent = {
  'click .dataDictTable1Edit':function(e, value, row, index){
    // console.log(e,value,row,index,"edit");
    _this.setState({currentExpression:row});
    $("#indexEditComnetInput").val(row.aliasName);
    $("#selectExpressionInput").val(row.grokName);
    $("#indexEditComnet").modal("show");
  }
};
window.deletExpressionEvent = {
  'click .deletDictTable1Edit':function(e, value, row, index){
    // console.log(e,value,row,index,"edit");
    // newDatas
    var _newDatas = _this.state.newDatas;
    for (var i = 0; i < _this.state.newDatas.length; i++) {
      if(_this.state.newDatas[i].field == row.field){
        _newDatas.splice(i, 1);
      }
    }
    _this.setState({newDatas:_newDatas});
  }
};

var GrokExtractorConfigurationAddModel = React.createClass({
  getInitialState:function(){
    var extractorDetail=[];
    // console.log('this.props.extractorDetail11111111111111',this.props.extractorDetail);
    if(this.props.extractorDetail!=undefined&&this.props.extractorDetail!=''){
      extractorDetail = JSON.parse(this.props.extractorDetail);
    }
    _this = this;
    return{
      newDatas:extractorDetail,
      patterns:[],
      currentExpression:{},
      currentselectExpression:"",
      currentselectPattern:""
    }
  },
  shouldComponentUpdate: function(nextProps, nextState){
     if (nextState.patterns !== this.state.patterns) {
        $("#GrokModelOldTable").bootstrapTable("load",nextState.patterns);
     }
     return true;
   },

  componentDidUpdate:function(){
    // $("#GrokModelOldTable").bootstrapTable("load",this.state.patterns);
    $("#GrokModelNewTable").bootstrapTable("load",this.state.newDatas);
  },
  componentDidMount: function(){
      //加载Grol表达式数据
      GrokPatternsStore.loadPatterns((patterns) => {
        this.setState({
          patterns: patterns,
        });
      });
      const { flowPersonnelListData } = this.props;
      // 新数据
      $('#GrokModelNewTable').bootstrapTable({
          columns: [
              {
                title: '提取字段',
                field: 'field',
                sortable: true
              },{
                title: '表达式',
                field: 'grokstring',
                sortable: true
              },{
                title: '别名',
                field: 'aliasName',
                sortable: true
              },{
                title: '编辑',
                field: 'edit',
                sortable: true,
                events: editExpressionEvent,
                formatter: editExpression
              },{
                title: '删除',
                field: 'delet',
                sortable: true,
                events: deletExpressionEvent,
                formatter: deletExpression
              }
              // ,{
              //   title: '结果预览',
              //   field: '_result',
              //   sortable: true
              // }
          ],
          data: []
      });

      //旧数据
      //表格触发事件
      $('#GrokModelOldTable').on('check.bs.table', function (e, row) {
        // const expression = "%{"+row.name+"}"
        _this.setState({currentselectPattern:row.pattern});
        _this.setState({currentselectExpression:row.name});
      })
      $('#GrokModelOldTable').bootstrapTable({
          columns: [
              {
                  title: '选择',
                  field: 'state',
                  radio: true,
              }, {
                  title: '名称',
                  field: 'name',
                  sortable: true
              },{
                  title: '表达式',
                  field: 'pattern',
                  sortable: true
              }
          ],
          data:[]
      });
    },
  _handleOnClickOK:function(){
    // field  this.state.currentExpression
    var isAdd = true;//add or updata
    var _result =[];
    var _newDatas = this.state.newDatas;
    var aliasNameState = 0;//别名是否合法
    var pass = true;
    var str = this.state.currentExpression.field;//字符串
    var aliasName = $("#indexEditComnetInput").val().replace(/(^\s*)|(\s*$)/g,"");
    var grokName = $("#selectExpressionInput").val().replace(/(^\s*)|(\s*$)/g,"");
    if(aliasName==""){
      alert("别名不能为空");
      return;
    }
    if(/.*[\u4e00-\u9fa5]+.*$/.test(aliasName)){
      alert("别名不能有中文");
      return;
    }
    for (var i = 0; i < this.state.newDatas.length; i++) {
      if(this.state.currentExpression.field == this.state.newDatas[i].field){
        isAdd = false;
      }
      if(aliasName == this.state.newDatas[i].aliasName){
        aliasNameState +=1;
      }
    }
    if(isAdd){
      if(aliasNameState>=1){
        alert("别名已存在");
        return;
      }
    }else{
      if(aliasNameState>=2){
        alert("别名已存在");
        return;
      }
    }
    if(grokName==""){
      alert("表达式不能为空");
      return;
    }

    var _grokName = "%{"+grokName+":"+aliasName+"}";
    var promise = ToolsStore.testGrok(_grokName, str);
    // console.log('_grokName>>>>>>>>>>>>>>',_grokName);
    // console.log('str>>>>>>>>>>>>>>',str);
    // console.log('promise>>>>>>>>>>>>>>',promise);
    promise.then(result => {
      if (!result.matched) {
        alert('表达式有误，请重新选择');
        return;
      }else{
        // console.log("自选表达式成功！");
        var _grokNameTwo = "%{"+grokName+":"+aliasName+"}";
        var _fieldTwo = this.state.currentExpression.field;
        var strTwo = this.assemblyExampleString(this.props.exampleMessage,_fieldTwo,_grokNameTwo);
        // console.log("_strTwoTwo11",strTwo);
        // console.log("_grokNameTwo11",this.props.exampleMessage);

        var promiseTwo = ToolsStore.testGrok(strTwo,this.props.exampleMessage);
        // console.log("promiseTwo11",promiseTwo);
        promiseTwo.then(result2 => {
          if (!result2.matched) {
            // alert('系统已经默认匹配表达式');
            if(isAdd){
              var obj = {
                aliasName:aliasName,
                grokName:"DATA",
                grokstring:"%{DATA:"+aliasName+"}",
                field:this.state.currentExpression.field,
                _result:[{name:aliasName,match:this.state.currentExpression.field}]
              }
              _newDatas.push(obj);
              this.setState({newDatas:_newDatas});
              $("#indexEditComnet").modal("hide");
              $("#indexEditComnetInput").val("");
              $("#extractFieldsInput").val("");
            }else{
              for (var i = 0; i < _newDatas.length; i++) {
                if(this.state.currentExpression.field == this.state.newDatas[i].field){
                  _newDatas[i].aliasName = aliasName;
                  _newDatas[i].grokName = grokName;
                  _newDatas[i].grokstring = "%{"+grokName+":"+aliasName+"}";
                  _newDatas[i]._result = [{name:aliasName,match:this.state.currentExpression.field}];
                }
              }
              this.setState({newDatas:_newDatas});
              $("#indexEditComnet").modal("hide");
              $("#indexEditComnetInput").val("");
              $("#extractFieldsInput").val("");
            }
          }else{
            for(var value of result.matches){
              _result.push(value);
            }
            if(isAdd){
              var obj = {
                aliasName:aliasName,
                grokName:grokName,
                grokstring:"%{"+grokName+":"+aliasName+"}",
                field:this.state.currentExpression.field,
                _result:_result
              }
              _newDatas.push(obj);
              this.setState({newDatas:_newDatas});
              $("#indexEditComnet").modal("hide");
              $("#indexEditComnetInput").val("");
              $("#extractFieldsInput").val("");
            }else{
              for (var i = 0; i < _newDatas.length; i++) {
                if(this.state.currentExpression.field == this.state.newDatas[i].field){
                  _newDatas[i].aliasName = aliasName;
                  _newDatas[i].grokName = grokName;
                  _newDatas[i].grokstring = "%{"+grokName+":"+aliasName+"}";
                  _newDatas[i]._result = _result;
                }
              }
              this.setState({newDatas:_newDatas});
              $("#indexEditComnet").modal("hide");
              $("#indexEditComnetInput").val("");
              $("#extractFieldsInput").val("");
            }
          }
        });
      }
    });

  },
  assemblyExampleString:function(exampleMessage,_fieldTwo,str){
    // console.log("exampleMessage++++++",exampleMessage);
    // console.log("str++++++",str);
    exampleMessage = exampleMessage.split("");
    for(var key in exampleMessage){
      if(this._checkStringObj(exampleMessage[key])){
        exampleMessage[key] = '\\'+exampleMessage[key];
      }
    }
    if(exampleMessage[0]=="\\{"){
      exampleMessage[0] = "%{PARENTHESES:default_PARENTHESES}";
    }
    exampleMessage = exampleMessage.join("");
    for (var i = 0; i < exampleMessage.length; i++) {
      exampleMessage = exampleMessage.replace(_fieldTwo,str);
    }
    exampleMessage = exampleMessage.split("");
    for(var key in exampleMessage){
      if(this._checkString(exampleMessage[key])){
        exampleMessage[key] = '\\'+exampleMessage[key];
      }
    }
    exampleMessage = exampleMessage.join("");
    return exampleMessage;
  },
  _handleOnClickCancel:function(){
    $("#indexEditComnet").modal("hide");
    $("#indexEditComnetInput").val("");
  },
  _modalOnClickCancel:function(){
    $("#grokExtractorConfigurationAddModel").modal("hide");
  },
  _checkStringObj:function(str){
    var strs = '{}';
    if(strs.indexOf(str)==-1){
      return false;
    }
    return true;
  },
  _checkString:function(str){
    var strs = '$@[]()*';
    if(strs.indexOf(str)==-1){
      return false;
    }
    return true;
  },
  _modalOnClickOK:function(){
    // "%{IP:client} %{WORD:method} %{URIPATHPARAM:request} %{NUMBER:bytes} %{NUMBER:duration}"
    //全部内容 this.state.exampleMessage    用户选择的内容 this.state.newDatas field  grokName aliasName
    if(this.state.newDatas.length!=0){
      var _newDatas = this.state.newDatas;
      var _exampleMessage = this.props.exampleMessage;
      // var _exampleMessage = "john _13235_ [2016-08-02 17:30:57.031] 341.ms [192.168.52.54] [10200000003783] [0] [CA 签发证书成功, sigsn(17700000000000006571)]";
      var _exampleMessage = _exampleMessage.split("");
      for(var key in _exampleMessage){
        if(this._checkStringObj(_exampleMessage[key])){
          _exampleMessage[key] = '\\'+_exampleMessage[key];
        }
      }
      if(_exampleMessage[0]=="\\{"){
        _exampleMessage[0] = "%{PARENTHESES:default_PARENTHESES}";
      }
      _exampleMessage = _exampleMessage.join("");
      for (var i = 0; i < _newDatas.length; i++) {
        _exampleMessage = _exampleMessage.replace(_newDatas[i].field,_newDatas[i].grokstring);
      }
      _exampleMessage = _exampleMessage.split("");
      // console.log(_exampleMessage);
      for(var key in _exampleMessage){
        if(this._checkString(_exampleMessage[key])){
          _exampleMessage[key] = '\\'+_exampleMessage[key];
        }
      }
      _exampleMessage = _exampleMessage.join("");

      const newConfig = this.props.configuration;
      newConfig['grok_pattern'] = _exampleMessage;
      this.props.onChange(newConfig);
      var grokTable =  JSON.stringify(this.state.newDatas);
      // console.log("grokTable=====>",grokTable);
      this.props.setExtractorDetails(grokTable);
    }

    // $("#grok_pattern").val(_exampleMessage);
    // $("#trialGrokButton").disabled = true;
    $("#grokExtractorConfigurationAddModel").modal("hide");
  },
  _addExtractFields:function(){
    var _input = $("#extractFieldsInput").val().replace(/(^\s*)|(\s*$)/g,"");
    if(_input!=""){
      if(this.props.exampleMessage.indexOf(_input)!=-1){
        this.setState({currentExpression:{field:_input,name:"",_state:false}});
        $("#selectExpressionInput").val("");
        $("#indexEditComnetInput").val("");
        $("#indexEditComnet").modal("show");
      }else{
        alert("不存在的提取字段");
      }
    }else{
      alert("提取字段不能为空");
    }
  },
  _selectExpressionModel:function(){
    $("#selectExpressionModel").modal("show");
  },
  _selectExpressionOk:function(){
    $("#selectExpressionInput").val(this.state.currentselectExpression);
    $("#selectExpressionModel").modal("hide");
  },
  _selectExpressionCancel:function(){
    $("#selectExpressionModel").modal("hide");
  },
  // testOnselect:function(){
  //   alert("111111");
  // },
  // _getGrokResults:function(){
  //   var results;
  //   for(var value of this.state.newDatas){
  //     for(var v of value){
  //       console.log(v.name,"=>",v._result);
  //     }
  //   }
  //   // return results;
  // },
  render : function(){
    var _currentselectName ="";
    var _currentselectVale ="";
    if(this.state.currentselect){
      _currentselectName = this.state.currentselect.name;
      _currentselectVale = this.state.currentselect.value;
    }
    var grokResults = [];
    for(var value of this.state.newDatas){
      grokResults.push(<span  className="col-lg-4 col-md-4 col-xs-4 col-sm-4"><b>{value.grokName}</b> : {value.field}</span>);
    }
    // for(var value of this.state.newDatas){
    //   console.log("value",value);
    //   for(var v of value._result){
    //     grokResults.push(<span  className="col-lg-4 col-md-4 col-xs-4 col-sm-4"><b>{v.name}</b> : {v.match}</span>);
    //   }
    // }

    // var grokResultsNode;
    // for(var i=0,i<=grokResults.length;i++){
    // }
    // console.log('extractorDetail---->',this.props.extractorDetail);
      return (
        <div>
            <div id="grokExtractorConfigurationAddModel" className="modal fade"  tabIndex="-1" role="dialog" aria-labelledby="filtrationFieldModalLabel" aria-hidden="true">
              <div className="modal-dialog" style={{"width":"60%"}}>
                  <div className="modal-content">
                      <div className="modal-header">
                          <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                          <h4 className="modal-title">编辑 Grok匹配表达式</h4>
                      </div>
                      <div className="modal-body">
                            <div className='row' style={{"margin":"5px 0px"}}>
                              <span>注意：提取字段时，请注意符号</span>
                            </div>
                            <div className='row' style={{"margin":"10px 0px"}}>
                              <div className="well well-sm xtrc-new-example">
                                <span id="xtrc-example" onselect={this.testOnselect} onSelect={this.testOnselect}>{this.props.exampleMessage}</span>
                              </div>
                            </div>

                            <div className='row' style={{"margin":"10px 0px"}}>
                              <div className="col-lg-1 col-md-2 col-xs-2 col-sm-2 text-right" style={{"lineHeight":"30px"}}>
                                <span>提取字段:</span>
                              </div>
                              <div className="col-lg-3 col-md-3" style={{"position":"absolute"},{"left":"-15px"}}>
                                <input type="input" id="extractFieldsInput" className="form-control"/>
                              </div>
                              <div className="col-lg-2 col-md-2" style={{"position":"absolute"},{"left":"-30px"}}>
                                <input type="button" value="添加" className="btn btn-success btn-sm modalFootBtn"  onClick={this._addExtractFields}/>
                              </div>
                            </div>

                            <div className='row' style={{"margin":"10px 10px 0px 10px"}}>
                                <table id='GrokModelNewTable'
                                data-checkbox="true"
                                data-toggle='table'
                                data-classes='table table-no-bordered table-hover'
                                data-pagination='true'
                                data-page-size='5'>
                                </table>
                            </div>

                            <div className='row' style={{"margin":"10px 0px","fontSize":"1.5em"}}>
                                Grok表达式结果预览：
                            </div>
                            <div className='row' style={{"margin":"10px 0px"}}>
                              <div className="well well-sm xtrc-new-example" style={{"overflow":"hidden"}}>
                                {grokResults}
                              </div>
                            </div>

                      </div>
                      <div className="modal-footer">
                          <button type="button" className="btn btn-default btn-sm modalFootBtn" onClick={this._modalOnClickCancel}>取消</button>
                          <button type="button" className="btn btn-success btn-sm modalFootBtn" onClick={this._modalOnClickOK}>确认</button>
                      </div>
                  </div>
              </div>
            </div>

            <div className="modal fade" id="indexEditComnet" tabIndex="-1" role="dialog">
              <div className="modal-dialog" role="document" style={{"width":"400px"}}>
                <div className="modal-content">
                  <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 className="modal-title">提取以下字段：</h4>
                    <p style={{"paddingLeft":"30px","fontSize":"1.8em"}}>{this.state.currentExpression.field}</p>
                  </div>
                  <div className="modal-body">
                    <div className="filterTable">
                      <div className='row' style={{"margin":"10px 0px"}}>
                        <span className="text" style={{"padding":"5px"}}><b>别名</b></span>
                      </div>
                      <div className='row' style={{"margin":"10px 0px"}}>
                        <input type="text" className="form-control" id="indexEditComnetInput"/>
                      </div>
                      <div className='row' style={{"margin":"10px 0px"}}>
                        <span className="text" style={{"padding":"5px"}}><b>表达式</b></span>
                      </div>
                      <div className='row' style={{"margin":"10px 0px"}}>
                        <input type="text" className="form-control" id="selectExpressionInput"/>
                      </div>
                      <div className='row' style={{"margin":"10px 0px"}}>
                        <input type="button" onClick={this._selectExpressionModel} className='btn btn-success modalFootBtn'  value="选择Grok表达式"/>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-default btn-sm modalFootBtn" onClick={this._handleOnClickCancel}>取消</button>
                    <button type="button" className="btn btn-success btn-sm modalFootBtn" onClick={this._handleOnClickOK}>确定</button>
                  </div>
                </div>
            </div>

            <div className="modal fade" id="selectExpressionModel" tabIndex="-1" role="dialog">
              <div className="modal-dialog" role="document" style={{"width":"55%"}}>
                <div className="modal-content">
                  <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 className="modal-title">选择表达式</h4>
                  </div>
                  <div className="modal-body">
                    <div className="filterTable">
                      <div className='row' style={{"margin":"10px 0px"}}>
                        <table id='GrokModelOldTable'
                           data-radio="true"
                           data-toggle='table'
                           data-search='true'
                           data-click-to-select="true"
                           data-classes='table table-no-bordered table-hover'
                           data-height= '450'
                           data-resizable='true'>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer"style={{"marginTop":"10px"}}>
                    <button type="button" className="btn btn-default btn-sm modalFootBtn" onClick={this._selectExpressionCancel}>取消</button>
                    <button type="button" className="btn btn-success btn-sm modalFootBtn" onClick={this._selectExpressionOk}>确定</button>
                  </div>
                </div>
            </div>

          </div>
        </div>
      </div>
      );
  }
});
module.exports = GrokExtractorConfigurationAddModel;
