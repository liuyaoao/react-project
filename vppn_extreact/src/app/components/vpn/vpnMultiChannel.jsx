var React = require('react');
var Utils = require('../../script/utils');

var VpnMultiChannel = React.createClass({
  getInitialState: function () {
    return {
      // vpnSwitch_disable: false,
      // vpnSwitch: false,
      vpnStatus: "OFF",
      // serverList: [],
      vpnWhite: [],
      serverSelect: false,
      ping: null
    };
  },
  componentDidMount: function(){
    var _self = this;
    var $server = $(this.refs.vpnServer);
    $(this.refs.vpnServer).on("select2:open", function (e) {
      _self.refs.vpnServer.value = "";
      for (var i = 0; i < _self.refs.vpnServer.options.length; i++) {
        if(_self.refs.vpnServer.options[i].value == _self.refs.serverIP.value) {
          _self.refs.vpnServer.value = _self.refs.serverIP.value;
          break;
        }
      }
    });
    $server.on("select2:close", function (e) {
      _self.setState({serverSelect: false});
    });
    // $(this.refs.vpnServer).on("select2:open", function (e) {
    // });
    // $server.on("select2:close", function (e) {
    // });
    $server.val(null).trigger('change');
    $server.on("select2:select", function (e) {
      _self.refs.serverIP.value = e.target.value;
      _self.setState({serverSelect: false});
    });
    // document.body.addEventListener("click", this.handleBodyClick);
    // if(this.props.id == 1) {
      // this.getVPNStatus();
      // this.getVPNConfig();
      // this.getVPNServerList();
    // }
    // if(this.refs.serverIP.value.trim() == "" || this.refs.clientIP.value.trim() == "") {
    //   this.setState({vpnSwitch_disable: true});
    // }
    // else {
    //   this.setState({vpnSwitch_disable: false});
    // }
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    if(nextProps.proxyServerList != this.props.proxyServerList) {
      while (this.refs.vpnServer.options.length > 0) {
        this.refs.vpnServer.options.remove(0);
      }
      this.refs.vpnServer.options.add(new Option("auto", "auto"));
      for(var i = 0; i < nextProps.proxyServerList.length; i++) {
        if(nextProps.proxyServerList[i].ServerType == ("Game"+this.props.id)) {
          this.refs.vpnServer.options.add(new Option(nextProps.proxyServerList[i].IP, nextProps.proxyServerList[i].IP));
        }
      }
    }
    return true;
  },
  componentWillUnmount: function(){
    // document.body.removeEventListener("click", this.handleBodyClick);
  },
  handleBodyClick: function(e){
    if (e.target.className && e.target.className.indexOf('sel-text') == -1 && this.state.serverSelect) {
      if(this.isMounted()) {
        this.setState({serverSelect: false});
      }
    }
  },
  render: function(){
    var {vpnSwitch, vpnWhite, vpnSwitch_disable, vpnStatus} = this.state;
    var {id} = this.props;
    var VpnWhiteList = vpnWhite.map(function(white, i){
      return (
        <tr key={i}>
          <td>{white}</td>
          <td>
            <a href="javascript:;" onClick={this.handleDeleteWhite.bind(this, white)}><span className="mif-cross"></span></a>
          </td>
        </tr>
      )
    }.bind(this))
    // var VpnServerList = this.state.serverList.map(function(server, i){
    //   return (
    //     <option key={i} value={server.IP}>{server.IP}</option>
    //   )
    // });
    return (
      <div className="wi-right-1">
        <div className="tabcontrol" data-role="tabcontrol">
          <ul className="tabs">
              <li className="active"><a href={"#vpn_mul"+id+"_1"}>VPN Setup</a></li>
              <li><a href={"#vpn_mul"+id+"_2"}>White List</a></li>
          </ul>
          <div className="frames">
            <div className="frame no-padding" id={"vpn_mul"+id+"_1"}>
              <form id={"vpnForm_"+id} action="/cgi-bin/set-vpn.cgi" method="post" onSubmit={this.handleOpenVpn}>
                <div className="wi-content auto-y padding20">
                  <div className="wire-block" style={{borderBottom: "none"}}>
                    <h5>Virtual Private Network Tunnel {id} Setup</h5>
                    <div className="grid">
                      <div className="form-group row cells6">
                        <div className="cell colspan2" style={{paddingTop:"13px"}}>
                          <label>VPN Status:</label>
                        </div>
                        <div className="cell colspan2" style={{paddingTop:"13px", paddingBottom:"13px"}}>
                          {/*<label className="switch">
                            <input type="checkbox" disabled={vpnSwitch_disable} checked={vpnSwitch} onChange={this.handleVpnSwitch} />
                            <span ref="vpnSwitch" className="check"></span>
                          </label>*/}
                          <span className={"tag "+(vpnStatus=="ON"?"success":(vpnStatus=="OFF"?"alert":"warning"))}>{vpnStatus}</span>
                        </div>
                      </div>
                      <div className="form-group row cells6">
                        <div className="cell colspan2" style={{paddingTop:"13px"}}>
                          <label>VPN Server Address:</label>
                        </div>
                        <div className="cell colspan2">
                          <div className="input-control text full-size no-sel">
                            <input type="text" className="sel-text" ref="serverIP" defaultValue="auto" onClick={this.handleToggleServer} onChange={this.handleServerChange}/>
                            <select className="full-size ws-select" ref="vpnServer">
                              {/*VpnServerList*/}
                            </select>
                          </div>

                        </div>
                        {/*<div className="cell colspan2">
                          <button type="button" className="button" style={{margin:"0.325rem 10px"}} onClick={this.handlePing}>Ping</button>
                          <label style={{color:"#a9a9a9"}}><label className="inline text-center" style={{borderBottom: "1px solid #a9a9a9", minWidth:"15px", paddingBottom:"1px"}}>
                            {this.state.ping !== null ? this.state.ping : <span>&nbsp;</span>}</label> ms
                          </label>
                        </div>*/}
                      </div>
                      <div className="form-group row cells6">
                        <div className="cell colspan2" style={{paddingTop:"13px"}}>
                          <label>Virtual LAN IP:</label>
                        </div>
                        <div className="cell colspan2">
                          <div className="input-control text full-size">
                            <input type="text" ref="clientIP" defaultValue="" disabled="true"/>
                          </div>
                          <label style={{color:"#a9a9a9", paddingTop:"5px"}}>Auto assigned by system.</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bottom">
                  <button type="submit" className="button info info2">Turn On</button>
                  <button type="button" className="button danger" onClick={this.handleCloseVpn}>Turn Off</button>
                </div>
              </form>
            </div>
            <div className="frame" id={"vpn_mul"+id+"_2"}>
              <div className="wire-block" style={{borderBottom: "none"}}>
                <h5>Configure Whitelist</h5>
                <div className="grid">
                  <div className="form-group row cells6">
                    <div className="cell colspan6">
                      <form onSubmit={this.handleAddWhite}>
                        <div className="input-control text" data-role="input" style={{width:"18rem"}}>
                          <input type="text" ref="addWhite"/>
                          <button type="submit" className="button">Add</button>
                        </div>
                        <label className="p-l-10" style={{color:"#a9a9a9"}}>( Add like www.google.com or 1.2.3.4 )</label>
                      </form>
                    </div>
                    <div className="cell colspan6 white-table" style={{marginTop:"15px"}}>
                      <table className="table">
                        <tbody>
                          {VpnWhiteList}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  handleToggleServer: function(){
    var {serverSelect} = this.state;
    if (!serverSelect) {
      $(this.refs.vpnServer).select2("open");
      $('.select2-container').css("margin-top", '-5px')
    } else {
      $('.select2-container').css("margin-top", '5px')
    }
    $('.select2.select2-container').css("margin-top", '0px')
    this.setState({serverSelect: !serverSelect});
  },
  handleServerChange: function(e){
    if (!e.target.value) {
      $(this.refs.vpnServer).val(null).trigger('change');
    }

    // if(this.refs.serverIP.value.trim() == "" || this.refs.clientIP.value.trim() == "") {
    //   this.setState({vpnSwitch_disable: true});
    // }
    // else {
    //   this.setState({vpnSwitch_disable: false});
    // }
  },
  getVPNStatus: function(expectedStatus) {
    var postData = {
      act_type: "get_vpnstatus",
      channel: this.props.id-1
    }
    var dialogId = "vpnDiaglog";
    var formEl = document.getElementById("vpnForm_"+this.props.id);
    if(!formEl) {
      console.log("vpnForm_"+this.props.id+" has been unmounted!");
      return;
    }
    var _this = this;
    $.ajax({
      type: "POST",
      async: true,
      url: formEl.action,
      dataType: "json",
      cache:false,
      data: postData,
      complete : function(result){
        if(!_this.isMounted()) {
          console.log("VpnMultiChannel has been unmounted!");
          return;
        }
        try {
          var res = JSON.parse(result.responseText);
          if(res.hasOwnProperty("status")) {
            switch (res.status) {
              case "off":
                // _this.setState({vpnSwitch: false});
                _this.setState({vpnStatus: "OFF"});
                break;
              case "on":
                // _this.setState({vpnSwitch: true});
                _this.setState({vpnStatus: "ON"});
                break;
              default:
                console.log("Get VPN status error!");
                // _this.setState({vpnSwitch: false});
                _this.setState({vpnStatus: "OFF"});
                break;
            }
          }
          else {
            console.log("Get VPN status error!");
            // _this.setState({vpnSwitch: false});
            _this.setState({vpnStatus: "OFF"});
          }

          if(expectedStatus && expectedStatus != _this.state.vpnStatus) {
            var dialogMsg = {
              title: 'Tips'
            }
            if(expectedStatus == "ON") {
              dialogMsg.content = 'Open VPN fail.'
            }
            else {
              dialogMsg.content = 'Close VPN fail.'
            }
            _this._showDialog(dialogMsg, dialogId);
          }
        } catch (e) {
          console.log("Get VPN status error!");
          // _this.setState({vpnSwitch: false});
          _this.setState({vpnStatus: "OFF"});

          if(expectedStatus && expectedStatus != _this.state.vpnStatus) {
            var dialogMsg = {
              title: 'Tips'
            }
            if(expectedStatus == "ON") {
              dialogMsg.content = 'Open VPN fail.'
            }
            else {
              dialogMsg.content = 'Close VPN fail.'
            }
            _this._showDialog(dialogMsg, dialogId);
          }
        }
      }
    });
  },
  getVPNConfig: function() {
    var postData = {
      act_type: "get_vpnconfig",
      channel: this.props.id-1
    }
    var formEl = document.getElementById("vpnForm_"+this.props.id);
    if(!formEl) {
      console.log("vpnForm_"+this.props.id+" has been unmounted!");
      return;
    }
    var _this = this;
    $.ajax({
      type: "POST",
      async: true,
      url: formEl.action,
      dataType: "json",
      cache:false,
      data: postData,
      complete : function(result){
        if(!_this.isMounted()) {
          console.log("VpnMultiChannel has been unmounted!");
          return;
        }
        try {
          var res = JSON.parse(result.responseText);
          if(res.hasOwnProperty("status") && res.status == "fail") {
            _this.refs.serverIP.value = "auto";
            _this.refs.clientIP.value = "";
            _this.setState({vpnWhite: []});
            console.log("Get VPN config error!");
            return;
          }

          if(res.hasOwnProperty("server_ip")) {
            _this.refs.serverIP.value = res.server_ip || "auto";
          }
          else {
            _this.refs.serverIP.value = "auto";
            console.log("Get VPN config server IP error!");
          }

          if(res.hasOwnProperty("client_ip")) {
            _this.refs.clientIP.value = res.client_ip;
          }
          else {
            _this.refs.clientIP.value = "";
            console.log("Get VPN config client IP error!");
          }

          if(res.hasOwnProperty("whitelist")) {
            _this.setState({vpnWhite: res.whitelist});
          }
          else {
            _this.setState({vpnWhite: []});
            console.log("Get VPN config white list error!");
          }
        } catch (e) {
          _this.refs.serverIP.value = "auto";
          _this.refs.clientIP.value = "";
          _this.setState({vpnWhite: []});
          console.log("Get VPN config error!");
        }

        // if(_this.refs.serverIP.value.trim() == "" || _this.refs.clientIP.value.trim() == "") {
        //   _this.setState({vpnSwitch_disable: true});
        // }
        // else {
        //   _this.setState({vpnSwitch_disable: false});
        // }
      }
    });
  },
  // getVPNServerList: function() {
  //   const { managerServerIP, managerServerPort } = this.props;
  //   var postData = {
  //     act_type: "get_serverlist",
  //     host: managerServerIP,
  //     port: managerServerPort
  //   }
  //   var formEl = document.getElementById("vpnForm_"+this.props.id);
  //   var _this = this;
  //   $.ajax({
  //     type: "POST",
  //     async: true,
  //     url: formEl.action,
  //     dataType: "json",
  //     cache:false,
  //     data: postData,
  //     complete : function(result){
  //       try {
  //         var res = JSON.parse(result.responseText);
  //         while (_this.refs.vpnServer.options.length > 0) {
  //           _this.refs.vpnServer.options.remove(0);
  //         }
  //         _this.refs.vpnServer.options.add(new Option("auto", "auto"));
  //         for(var i = 0; i < res.length; i++) {
  //           if(res[i].ServerType == ("Game"+_this.props.id)) {
  //             _this.refs.vpnServer.options.add(new Option(res[i].IP, res[i].IP));
  //           }
  //         }
  //       } catch (e) {
  //         while (_this.refs.vpnServer.options.length > 0) {
  //           _this.refs.vpnServer.options.remove(0);
  //         }
  //         _this.refs.vpnServer.options.add(new Option("auto", "auto"));
  //         console.log("Get servier list error!")
  //       }
  //     }
  //   });
  // },
  handleSubmitVpn: function(){
    // e.preventDefault();
    var postData = {
      act_type: "set_tinc",
      server_ip: this.refs.serverIP.value.trim(),
      country_code: "auto",
      channel: this.props.id-1
    }
    var formEl = document.getElementById("vpnForm_"+this.props.id);
    var _this = this;
    $.ajax({
      type: "POST",
      async: true,
      url: formEl.action,
      dataType: "json",
      cache:false,
      data: postData,
      complete : function(result){
        try {
          var res = JSON.parse(result.responseText);
          if(res.hasOwnProperty("status") && res.status == "success") {
            setTimeout(function(){
              _this.getVPNConfig();
              _this.getVPNStatus();
            }, 5000)
          }
          else {
            console.log("set VPN Address error!");
          }
        } catch (e) {
          console.log("set VPN Address error!");
        }
      }
    });
  },
  handleOpenVpn: function(e){
    e.preventDefault();
    var dialogMsg = {
      title: 'Tips'
    }
    var dialogId = "vpnDiaglog";
    // if (!this.refs.serverIP.value || !this.refs.clientIP.value) {
    //   dialogMsg.content = 'You must configure your server address and virtual lan ip first .'
    //   this._showDialog(dialogMsg, dialogId);
    //   return;
    // }
    var formatServerIp = Utils.verifyIpAddress(this.refs.serverIP.value);
    if (this.refs.serverIP.value !== 'auto' && !formatServerIp) {
      dialogMsg.content = 'Please confirm the format of server address .'
      this._showDialog(dialogMsg, dialogId);
      return;
    }
    // var formatClientIp = Utils.verifyIpAddress(this.refs.clientIP.value, this.props.id);
    // if (!formatClientIp) {
    //   dialogMsg.content = 'Please confirm the format and range of virtual lan ip .'
    //   this._showDialog(dialogMsg, dialogId);
    //   return;
    // }
    // var checked = e.target.checked;
    // this.setState({vpnSwitch: checked});
    // if(checked) {
    //   $(this.refs.vpnSwitch).addClass("checkStarting");
    // }
    this.setState({vpnStatus: "CONNECTING"});
    var postData = {
      act_type: "start_vpn",
      channel: this.props.id-1
    }
    var formEl = document.getElementById("vpnForm_"+this.props.id);
    var _this = this;
    $.ajax({
      type: "POST",
      async: true,
      url: formEl.action,
      dataType: "json",
      cache:false,
      data: postData,
      complete : function(result){
        try {
          var res = JSON.parse(result.responseText);
          if(res.hasOwnProperty("status") && res.status == "success") {
            // $(_this.refs.vpnSwitch).removeClass("checkStarting");
            // _this.setState({vpnStatus: "ON"});
            _this.handleSubmitVpn();
          }
          else {
            // console.log((checked ? "Open VPN": "Close VPN") + " error!");
            // $(_this.refs.vpnSwitch).removeClass("checkStarting");
            // _this.setState({vpnSwitch: !checked});
            console.log("Open VPN error!");
            // _this.setState({vpnStatus: "OFF"});
            _this.getVPNStatus("ON");
          }
        } catch (e) {
          // console.log((checked ? "Open VPN": "Close VPN") + " error!");
          // $(_this.refs.vpnSwitch).removeClass("checkStarting");
          // _this.setState({vpnSwitch: !checked});
          console.log("Open VPN error!");
          // _this.setState({vpnStatus: "OFF"});
          _this.getVPNStatus("ON");
        }
      }
    });

    // if(checked) {
    //   this.handleSubmitVpn();
    // }
  },
  handleCloseVpn: function(e){
    e.preventDefault();
    this.setState({vpnStatus: "CLOSING"});
    var postData = {
      act_type: "stop_vpn",
      channel: this.props.id-1
    }
    var formEl = document.getElementById("vpnForm_"+this.props.id);
    var _this = this;
    $.ajax({
      type: "POST",
      async: true,
      url: formEl.action,
      dataType: "json",
      cache:false,
      data: postData,
      complete : function(result){
        try {
          var res = JSON.parse(result.responseText);
          if(res.hasOwnProperty("status") && res.status == "success") {
            // $(_this.refs.vpnSwitch).removeClass("checkStarting");
            // _this.setState({vpnStatus: "OFF"});
            setTimeout(function(){
              _this.getVPNConfig();
              _this.getVPNStatus();
            }, 5000)
          }
          else {
            // console.log((checked ? "Open VPN": "Close VPN") + " error!");
            // $(_this.refs.vpnSwitch).removeClass("checkStarting");
            // _this.setState({vpnSwitch: !checked});
            console.log("Close VPN error!");
            _this.getVPNStatus("OFF");
          }
        } catch (e) {
          // console.log((checked ? "Open VPN": "Close VPN") + " error!");
          // $(_this.refs.vpnSwitch).removeClass("checkStarting");
          // _this.setState({vpnSwitch: !checked});
          console.log("Close VPN error!");
          _this.getVPNStatus("OFF");
        }
      }
    });
  },
  _showDialog: function(dialogMsg, dialogId) {
    this.props.setDialogMsg(dialogMsg);
    showMetroDialog('#' + dialogId);
  },
  handlePing: function() {
    var postData = {
      act_type: "get_speed",
      dest_ip: this.refs.serverIP.value.trim(),
      channel: this.props.id-1
    }
    var formEl = document.getElementById("vpnForm_"+this.props.id);
    var _this = this;
    $.ajax({
      type: "POST",
      async: true,
      url: formEl.action,
      dataType: "json",
      cache:false,
      data: postData,
      complete : function(result){
        try {
          var res = JSON.parse(result.responseText);
          if(res.hasOwnProperty("time")) {
            _this.setState({ping: res.time});
          }
          else {
            console.log("Get speed error!");
            _this.setState({ping: null});
          }
        } catch (e) {
          console.log("Get speed error!");
          _this.setState({ping: null});
        }
      }
    });
  },
  handleDeleteWhite: function(white){
    // console.log(white);
    var postData = {
      act_type: "del_whitelist",
      uri: white,
      channel: this.props.id-1
    }
    var formEl = document.getElementById("vpnForm_"+this.props.id);
    var _this = this;
    $.ajax({
      type: "POST",
      async: true,
      url: formEl.action,
      dataType: "json",
      cache:false,
      data: postData,
      complete : function(result){
        try {
          var res = JSON.parse(result.responseText);
          if(res.hasOwnProperty("status") && res.status == "success") {
            _this.getVPNConfig();
          }
          else {
            console.log("Delete white list error!");
          }
        } catch (e) {
          console.log("Delete white list error!");
        }
      }
    });
  },
  handleAddWhite: function(e){
    e.preventDefault();
    var addWhite = this.refs.addWhite.value.trim();
    var dialogMsg = {
      title: 'Tips'
    }
    var dialogId = "vpnDiaglog";
    if (!addWhite) {
      dialogMsg.content = 'Please input the address .'
      this._showDialog(dialogMsg, dialogId);
      return;
    }
    if (addWhite.indexOf('http://') > -1) {
      dialogMsg.content = 'No http://'
      this._showDialog(dialogMsg, dialogId);
      return;
    }
    var whiteFirst = addWhite.split('.')[0];
    var checkWhiteAddress = Utils.verifyIpAddress(addWhite);
    if (addWhite.indexOf('.') == -1 || (!isNaN(whiteFirst) && !checkWhiteAddress)) {
      dialogMsg.content = 'Please confirm the format of address .'
      this._showDialog(dialogMsg, dialogId);
      return;
    }
    var postData = {
      act_type: "add_whitelist",
      uri: addWhite,
      channel: this.props.id-1
    }
    var formEl = document.getElementById("vpnForm_"+this.props.id);
    var _this = this;
    $.ajax({
      type: "POST",
      async: true,
      url: formEl.action,
      dataType: "json",
      cache:false,
      data: postData,
      complete : function(result){
        try {
          var res = JSON.parse(result.responseText);
          if(res.hasOwnProperty("status") && res.status == "success") {
            _this.getVPNConfig();
            _this.refs.addWhite.value = "";
          }
          else {
            console.log("Add white list error!");
          }
        } catch (e) {
          console.log("Add white list error!");
        }
      }
    });
  }
});

module.exports = VpnMultiChannel;
