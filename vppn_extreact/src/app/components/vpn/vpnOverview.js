import React,{Component} from 'react';
import Utils from '../../script/utils';

class VpnOverview extends Component{
  state = {
    vpnChannelsList: [
      {id: 1, connection: 'OFF', proxyAddress: '', vpnIP: '', whiteListNum: 0},
      {id: 2, connection: 'OFF', proxyAddress: '', vpnIP: '', whiteListNum: 0},
      {id: 3, connection: 'OFF', proxyAddress: '', vpnIP: '', whiteListNum: 0},
      {id: 4, connection: 'OFF', proxyAddress: '', vpnIP: '', whiteListNum: 0},
      {id: 5, connection: 'OFF', proxyAddress: '', vpnIP: '', whiteListNum: 0}
    ]
  }
  componentDidMount() {
    this.hasMounted = true;
    for(var i = 0; i < this.state.vpnChannelsList.length; i++) {
      var key = this.state.vpnChannelsList[i].id;
      var $server = $(this.refs['vpnServer_' + key]);
      var _this = this;
      $server.on("select2:open", function (e) {
        var key = this;
        _this.refs['vpnServer_' + key].value = "";
        for (var j = 0; j < _this.refs['vpnServer_' + key].options.length; j++) {
          if(_this.refs['vpnServer_' + key].options[j].value == _this.refs["serverIP_" + key].value) {
            _this.refs['vpnServer_' + key].value = _this.refs["serverIP_" + key].value;
            break;
          }
        }
      }.bind(key));
    }
    for(var i = 1; i < 6; i++) {
      this.getVPNStatus(i);
      this.getVPNConfig(i);
    }
    // this.getVPNServerList();
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.proxyServerList != this.props.proxyServerList) {
      for(var i = 0; i < this.state.vpnChannelsList.length; i++) {
        var key = this.state.vpnChannelsList[i].id;
        while (this.refs['vpnServer_' + key].options.length > 0) {
          this.refs['vpnServer_' + key].options.remove(0);
        }
        this.refs['vpnServer_' + key].options.add(new Option("auto", "auto"));
        for(var j = 0; j < nextProps.proxyServerList.length; j++) {
          if(nextProps.proxyServerList[j].ServerType == ("Game"+key)) {
            this.refs['vpnServer_' + key].options.add(new Option(nextProps.proxyServerList[j].IP, nextProps.proxyServerList[j].IP));
          }
        }
      }
    }
    return true;
  }
  componentWillUnmount(){
    this.hasMounted = false;
  }
  render(){
    var { vpnChannelsList } = this.state;
    var VpnChannelsList = vpnChannelsList.map(function(channel, i){
      return (
        <tr key={i}>
          <td>{channel.id}</td>
          <td><span id={"channelConn_" + channel.id} className={"tag " + (channel.connection == 'ON' ? 'success' : (channel.connection == 'OFF' ? 'alert' : 'warning'))}>{channel.connection}</span></td>
          <td>
            <div className="input-control text no-sel no-margin">
              <input type="text" className="sel-text" ref={"serverIP_" + channel.id} defaultValue={channel.proxyAddress || "auto"} onClick={this.handleToggleServer.bind(this, channel.id)}/>
              <select className="full-size ws-select" ref={"vpnServer_" + channel.id} defaultValue={channel.proxyAddress}>
                {/*VpnServerList*/}
              </select>
            </div>
          </td>
          <td>
            <div className="input-control text no-margin">
                <input type="text" ref={"clientIP_" + channel.id} defaultValue={channel.vpnIP} disabled="true" />
            </div>
          </td>
          <td><a href="javascript:;" onClick={this.handleShow.bind(this, channel.id, 1)}>{channel.whiteListNum}</a></td>
          <td>
            <button type="button" className="button info info2 no-margin text-shadow" style={{padding:"0 10px"}} onClick={this.handleOpenVpn.bind(this, channel.id)}>
              <span className="mif-checkmark"></span>
            </button>
          </td>
          <td>
            {/*<label className="switch">
              <input type="checkbox" defaultChecked={channel.connection == 'ON'} onChange={this.handleVpnSwitch.bind(this, channel.id)} />
              <span ref={"vpnSwitch_" + channel.id} className="check"></span>
            </label>*/}
            <button type="button" className="button danger no-margin text-shadow" style={{padding:"0 10px"}} onClick={this.handleCloseVPN.bind(this, channel.id)}>
              <span className="mif-settings-power"></span>
            </button>
          </td>
          <td><a href="javascript:;" onClick={this.handleShow.bind(this, channel.id, 0)}><span className="mif-cog"></span></a></td>
        </tr>
      )
    }.bind(this));
    return (
      <div className="wi-right-1 padding20 auto-y">
        {/*<div className="wire-block">
          <h5>Virtual Private Network Overview</h5>
          <div className="grid">
            <div className="form-group row cells6">
              <div className="cell colspan6" style={{paddingTop:"13px"}}>
                <label>Manager Server:</label>
                <div className="inline m-l-15">
                  <div className="input-control text full-size">
                    <input id="vpn_managerServerIP" type="text" defaultValue="220.168.30.10"/>
                  </div>
                </div>
                <label className="m-l-25">Port:</label>
                <div className="inline m-l-15">
                  <div className="input-control text" style={{width:"5.447rem"}}>
                    <input id="vpn_managerServerPort" type="text" defaultValue="7070"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>*/}
        <div className="wire-block over-table">
          <h5>Virtual Private Network Overview</h5>
          <table className="table hovered m-t-25">
            <thead>
              <tr>
                <th>Tunnel</th>
                <th>Status</th>
                <th>VPN Proxy Address</th>
                <th>Virtual Lan IP</th>
                <th># of Whitelist</th>
                <th>ON / Apply</th>
                <th>OFF</th>
                <th>Settings</th>
              </tr>
            </thead>
            <tbody>
              {VpnChannelsList}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
  handleToggleServer(key){
    var $server = $(this.refs['vpnServer_' + key]);
    if (!this.refs['serverIP_' + key].value) {
      $server.val(null).trigger('change');
    }
    $server.select2("open");
    $('.select2-container').css("margin-top", '-5px');
    var _self = this;
    $server.on("select2:select", function (e) {
      _self.refs['serverIP_' + key].value = e.target.value;
    });
  }
  handleShow(key, flag, e){
    $('#vpnWindow .wi').each(function(){
      $(this).removeClass('active');
    })
    $('#vpnWindow .sidebar3 li').each(function(i){
      if (this.id == "vpnSidebar_li_"+key) {
        $(this).addClass('active');
      } else {
        $(this).removeClass('active');
      }
    })
    var vpnWindowEl = $('#vpnWindow #wi_right_' + key);
    vpnWindowEl.addClass('active');
    vpnWindowEl.find('li').each(function(i){
      $(this).removeClass('active');
      if (i == flag) {
        $(this).addClass('active');
      }
    });
    vpnWindowEl.find('.frame').each(function(i){
      $(this).css('display', 'none');
      if (i == flag) {
        $(this).css('display', 'block');
      }
    })
    this.props.getVPNStatus(key);
    this.props.getVPNConfig(key);
    // this.props.getVPNServerList(key);
  }
  getVPNStatus(channel, expectedStatus) {
    var postData = {
      act_type: "get_vpnstatus",
      channel: channel-1
    }
    var formEl = document.getElementById("vpnForm_"+channel);
    if(!formEl) {
      console.log("vpnForm_"+channel+" has been unmounted!");
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
        if(!_this.hasMounted) {
          console.log("vpnOverview has been unmounted!");
          return;
        }
        var vpnChannelsList = _this.state.vpnChannelsList.slice(0);
        var vpnChannel = null;
        for(var i = 0; i < vpnChannelsList.length; i++) {
          if(vpnChannelsList[i].id == channel) {
            vpnChannel = vpnChannelsList[i];
            break;
          }
        }
        try {
          var res = JSON.parse(result.responseText);
          if(res.hasOwnProperty("status")) {
            switch (res.status) {
              case "off":
                vpnChannel.connection = "OFF";
                break;
              case "on":
                vpnChannel.connection = "ON";
                break;
              default:
                console.log("Get VPN status error!");
                vpnChannel.connection = "OFF";
                break;
            }
          }
          else {
            console.log(channel);

            console.log("Get VPN status error!");
            vpnChannel.connection = "OFF";
          }

          if(expectedStatus && expectedStatus != vpnChannel.connection) {
            var dialogMsg = {
              title: 'Tips'
            }
            if(expectedStatus == "ON") {
              dialogMsg.content = 'Open VPN fail.'
            }
            else {
              dialogMsg.content = 'Close VPN fail.'
            }
            _this.props.setDialogMsg(dialogMsg);
            showMetroDialog('#vpnDiaglog');
          }
        } catch (e) {
          console.log("Get VPN status error!");
          vpnChannel.connection = "OFF";

          if(expectedStatus && expectedStatus != vpnChannel.connection) {
            var dialogMsg = {
              title: 'Tips'
            }
            if(expectedStatus == "ON") {
              dialogMsg.content = 'Open VPN fail.'
            }
            else {
              dialogMsg.content = 'Close VPN fail.'
            }
            _this.props.setDialogMsg(dialogMsg);
            showMetroDialog('#vpnDiaglog');
          }
        }
        _this.setState({vpnChannelsList: vpnChannelsList});
      }
    });
  }
  getVPNConfig(channel) {
    var postData = {
      act_type: "get_vpnconfig",
      channel: channel-1
    }
    var formEl = document.getElementById("vpnForm_"+channel);
    if(!formEl) {
      console.log("vpnForm_"+channel+" has been unmounted!");
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
        if(!_this.hasMounted) {
          console.log("vpnOverview has been unmounted!");
          return;
        }
        var vpnChannelsList = _this.state.vpnChannelsList.slice(0);
        var vpnChannel = null;
        for(var i = 0; i < vpnChannelsList.length; i++) {
          if(vpnChannelsList[i].id == channel) {
            vpnChannel = vpnChannelsList[i];
            break;
          }
        }
        try {
          var res = JSON.parse(result.responseText);
          if(res.hasOwnProperty("status") && res.status == "fail") {
            vpnChannel.proxyAddress = "";
            vpnChannel.vpnIP = "";
            vpnChannel.whiteListNum = 0;
            _this.refs['serverIP_' + channel].value = "auto";
            _this.refs['clientIP_' + channel].value = "";
            console.log("Get VPN config error!");
            return;
          }

          if(res.hasOwnProperty("server_ip")) {
            vpnChannel.proxyAddress = res.server_ip;
            _this.refs['serverIP_' + channel].value = res.server_ip || "auto";
          }
          else {
            vpnChannel.proxyAddress = "";
            _this.refs['serverIP_' + channel].value = "auto";
            console.log("Get VPN config server IP error!");
          }

          if(res.hasOwnProperty("client_ip")) {
            vpnChannel.vpnIP = res.client_ip;
            _this.refs['clientIP_' + channel].value = res.client_ip;
          }
          else {
            vpnChannel.vpnIP = "";
            _this.refs['clientIP_' + channel].value = "";
            console.log("Get VPN config client IP error!");
          }

          if(res.hasOwnProperty("whitelist")) {
            vpnChannel.whiteListNum = res.whitelist.length;
          }
          else {
            vpnChannel.whiteListNum = 0;
            console.log("Get VPN config white list error!");
          }
        } catch (e) {
          vpnChannel.proxyAddress = "";
          vpnChannel.vpnIP = "";
          vpnChannel.whiteListNum = 0;
          _this.refs['serverIP_' + channel].value = "auto";
          _this.refs['clientIP_' + channel].value = "";
          console.log("Get VPN config error!");
        }
        _this.setState({vpnChannelsList: vpnChannelsList});
      }
    });
  }
  // getVPNServerList: function() {
  //   const { managerServerIP, managerServerPort } = this.props;
  //   var postData = {
  //     act_type: "get_serverlist",
  //     host: managerServerIP,
  //     port: managerServerPort
  //   }
  //   var formEl = document.getElementById("vpnForm_1");
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
  //         for(var i = 0; i < _this.state.vpnChannelsList.length; i++) {
  //           var key = _this.state.vpnChannelsList[i].id;
  //           while (_this.refs['vpnServer_' + key].options.length > 0) {
  //             _this.refs['vpnServer_' + key].options.remove(0);
  //           }
  //           _this.refs['vpnServer_' + key].options.add(new Option("auto", "auto"));
  //           for(var j = 0; j < res.length; j++) {
  //             if(res[j].ServerType == ("Game"+key)) {
  //               _this.refs['vpnServer_' + key].options.add(new Option(res[j].IP, res[j].IP));
  //             }
  //           }
  //         }
  //       } catch (e) {
  //         for(var i = 0; i < _this.state.vpnChannelsList.length; i++) {
  //           var key = _this.state.vpnChannelsList[i].id;
  //           while (_this.refs['vpnServer_' + key].options.length > 0) {
  //             _this.refs['vpnServer_' + key].options.remove(0);
  //           }
  //           _this.refs['vpnServer_' + key].options.add(new Option("auto", "auto"));
  //         }
  //         console.log("Get servier list error!")
  //       }
  //     }
  //   });
  // },
  handleSubmitVpn(channel){
    // e.preventDefault();
    var postData = {
      act_type: "set_tinc",
      server_ip: this.refs["serverIP_" + channel].value.trim(),
      country_code: "auto",
      channel: channel-1
    }
    var formEl = document.getElementById("vpnForm_"+channel);
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
              _this.getVPNConfig(channel);
              _this.getVPNStatus(channel);
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
  }
  handleOpenVpn(key, e) {
    var dialogMsg = {
      title: 'Tips'
    }
    var dialogId = "vpnDiaglog";
    var serverIP = this.refs['serverIP_' + key].value, clientIP = this.refs['clientIP_' + key].value;
    // if (!serverIP || !clientIP) {
    //   dialogMsg.content = 'You must configure your server address and virtual lan ip first .'
    //   this._showDialog(dialogMsg, dialogId);
    //   return;
    // }
    var formatServerIp = Utils.verifyIpAddress(serverIP);
    if (serverIP !== 'auto' && !formatServerIp) {
      dialogMsg.content = 'Please confirm the format of server address .'
      this._showDialog(dialogMsg, dialogId);
      return;
    }
    // var formatClientIp = Utils.verifyIpAddress(clientIP, key);
    // if (!formatClientIp) {
    //   dialogMsg.content = 'Please confirm the format and range of virtual lan ip .'
    //   this._showDialog(dialogMsg, dialogId);
    //   return;
    // }

    var vpnChannelsList = this.state.vpnChannelsList.slice(0);
    var vpnChannel = null;
    for(var i = 0; i < vpnChannelsList.length; i++) {
      if(vpnChannelsList[i].id == key) {
        vpnChannel = vpnChannelsList[i];
        break;
      }
    }
    vpnChannel.connection = "CONNECTING";
    this.setState({vpnChannelsList: vpnChannelsList});

    var postData = {
      act_type: "start_vpn",
      channel: key-1
    }
    var formEl = document.getElementById("vpnForm_"+key);
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
            // $(_this.refs["vpnSwitch_" + key]).removeClass("checkStarting");
            // if(checked) {
              _this.handleSubmitVpn(key);
              // vpnChannel.connection = "ON";
              // _this.setState({vpnChannelsList: vpnChannelsList});
          }
          else {
            console.log("Open VPN error!");
            _this.getVPNStatus(key, "ON");
          }
        } catch (e) {
          console.log("Open VPN error!");
          _this.getVPNStatus(key, "ON");
        }
      }
    });
  }
  handleCloseVPN(key, e) {
    var vpnChannelsList = this.state.vpnChannelsList.slice(0);
    var vpnChannel = null;
    for(var i = 0; i < vpnChannelsList.length; i++) {
      if(vpnChannelsList[i].id == key) {
        vpnChannel = vpnChannelsList[i];
        break;
      }
    }
    vpnChannel.connection = "CLOSING";
    this.setState({vpnChannelsList: vpnChannelsList});

    var postData = {
      act_type: "stop_vpn",
      channel: key-1
    }
    var formEl = document.getElementById("vpnForm_"+key);
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
            // vpnChannel.connection = "OFF";
            // _this.setState({vpnChannelsList: vpnChannelsList});
            setTimeout(function(){
              _this.getVPNConfig(key);
              _this.getVPNStatus(key);
            }, 5000)
          }
          else {
            console.log("Close VPN error!");
            _this.getVPNStatus(key, "OFF");
          }
        } catch (e) {
          console.log("Close VPN error!");
          _this.getVPNStatus(key, "OFF");
        }
      }
    });
  }
  _showDialog(dialogMsg, dialogId) {
    this.props.setDialogMsg(dialogMsg);
    showMetroDialog('#' + dialogId);
  }
}

export default VpnOverview;
