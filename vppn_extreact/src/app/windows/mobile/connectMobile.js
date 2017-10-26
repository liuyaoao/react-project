var React = require('react');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as HomeActions from '../../actions/home_action';
var CommonDialog = require('../../components/common/dialog');
var Settings = require('../../../settings');
var PhoneHelp = require('./phoneHelp');

var setRightHeight = function(id){
  var windowId = '#window-' + id;
  var height = $(windowId).height(), headerHeight = 30;
  $(windowId + ' .connect-content').css("height", height - headerHeight - 100);
}

var bodyWidth = document.documentElement.clientWidth / 2, bodyHeight = (document.documentElement.clientHeight - 50) / 2;

var ConnectMobile = React.createClass({
  getInitialState: function(){
    return {
      connectStatus: 0,
      dialogMsg: {title: 'Tips', content: ''}
    }
  },
  componentDidMount: function(){
    setRightHeight(this.props.id);
    document.addEventListener('mousemove', this.handleMouseMove);
  },
  componentWillUnmount: function(){
    document.removeEventListener('mousemove', this.handleMouseMove);
    this.setState({connectStatus: 0});
  },
  handleMouseMove: function(){
    var cl = $("#window-" + this.props.id);
    if (cl.hasClass('active')) {
      setRightHeight(this.props.id);
    }
  },
  render: function(){
    var {connectStatus} = this.state;
    return (
      <div className="connect-mobile">
        <div className="connect-header">
          <h3 className="title">Start My Phone</h3>
        </div>
        <div className="connect-content">
          {connectStatus == 0 ? <div className="input-control text" data-role="input" style={{width:"18rem"}}>
            <input type="text" placeholder="Enter IP Address" ref="enterIP" onKeyDown={this.handleKeyDownIP}/>
            <button type="button" className="button" onClick={this.handleEnterIP}><span className="mif-arrow-right icon"></span></button>
          </div> :
          <div className="connect-load">
            <span className="mif-spinner3 mif-ani-spin mif-2x"></span><br/>
            <p className="con-dev">Connecting device ...</p>
          </div>
          }
          <div className="connect-footer">
            <a href="javascript:;" id="phone-help" onClick={this.handleOpenHelp}><span className="mif-question"></span> Help</a>
          </div>
        </div>
        <CommonDialog id="connectDiaglog" dialogMsg={this.state.dialogMsg} />
      </div>
    )
  },
  handleKeyDownIP: function(e) {
    var keynum;

    if(window.event) // IE
    {
      keynum = e.keyCode;
    }
    else if(e.which) // Netscape/Firefox/Opera
    {
      keynum = e.which
    }

    if(keynum == 13) {
      this.handleEnterIP();
    }
  },
  handleEnterIP: function(){
    this.setState({connectStatus: 1});
    this.connectDevice();
  },
  connectDevice: function(){
    var phoneIP = this.refs.enterIP.value;
    var _this = this;
    $.ajax({
      type: "GET",
      async: true,
      url: "http://"+phoneIP+":12012/heartbeat",
      // dataType: "json",
      cache:false,
      timeout: 10000,
      complete : function(result, status){
        if(status == "success") {
          _this.setState({connectStatus: 0});
          $(document.body).css("background-image", "url(../images/bj_phone.jpg)");
          _this.props.actions.setMyPhoneIP(phoneIP);
          _this.props.actions.setDesktopType("phone");
        }
        else if(status == "timeout") {
          console.log("Connect device timeout!");
          _this.setState({
            connectStatus: 0,
            dialogMsg: {title: 'Tips', content: 'Connect device timeout.'}
          });
          showMetroDialog('#connectDiaglog');
          _this.props.actions.setMyPhoneIP("");
        }
        else {
          console.log("Connect device error!");
          _this.setState({
            connectStatus: 0,
            dialogMsg: {title: 'Tips', content: 'Connect device fail.'}
          });
          showMetroDialog('#connectDiaglog');
          _this.props.actions.setMyPhoneIP("");
          // $(document.body).css("background-image", "url(../images/bj_phone.jpg)");
          // _this.props.actions.setMyPhoneIP(phoneIP);
          // _this.props.actions.setDesktopType("phone");
        }
      }
    });
  },
  handleOpenHelp: function(){
    var defaultOptions = {
      id: 'phone-help',
      title: 'Connect Help',
      width: 1000,
      height: 570,
      x: bodyWidth - 1000 / 2,
      y: bodyHeight - 570 / 2,
      icon: 'mif-question'
    }
    this.props.manager.open(defaultOptions.id, <PhoneHelp id={defaultOptions.id} />, defaultOptions);
  },
});

// module.exports = ConnectMobile;
function mapStateToProps(state){
  return {
  }
}

function mapDispatchToProps(dispatch){
  return {
    actions: bindActionCreators(HomeActions, dispatch)
  }
}

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectMobile);
