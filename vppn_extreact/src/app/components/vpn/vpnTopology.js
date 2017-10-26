import React,{Component} from 'react';
import Utils from '../../script/utils';

var dataArr = [], statusArr = [];
var bDelete = false, bAddNode = false;
var count = 0;
var data =[{"channel": "VPN Channel 4","server_ip":	"10.100.10.34","whitelist":	["google.com"]},
{"channel": "VPN Channel 2",client_ip : "10.100.10.200",server_ip : "52.221.247.103",whitelist :[]},
{"channel": "VPN Channel 3",client_ip : "10.100.10.200",server_ip : "52.221.247.103",whitelist :[]},
{"channel": "VPN Channel 1",client_ip : "10.100.10.200",server_ip : "52.221.247.103",whitelist :[]},
{"channel": "VPN Channel 0",client_ip : "10.100.10.200",server_ip : "52.221.247.103",whitelist :["baidu.com"]}];
var status =[{"channel":0,"status":"off"},{"channel":1,"status":"on"},{"channel":2,"status":"on"},{"channel":3,"status":"off"},{"channel":4,"status":"off"}];
var containerW = 0, containerH = 0;
var cyDraw = false;
var sourceNode = null,newNode = null,newEdge = null;
var bMouseDown = false;

var timer = null;

class VpnTopology extends Component{
  state = {
      elWidth: 0,
      elHeight: 0
  }
  componentDidMount(){
    this.hasMounted = true;
      // var container = this.props.manager.get('settings-2');
      // setWinHeight(this.props.id, container.width, container.height);

      timer = setInterval(function(){
        if($("#vpnSidebar_li_7").hasClass('active') && this.props.vpntopologyData.length !== 0 && this.props.windowSizeChange.flag && this.props.windowSizeChange.windowId=='settings-2') {
          //改变窗口大小时，重新绘图
          var elWidth = $("#window-settings-2 .wi-right").width();
          var elHeight = $("#window-settings-2 .wi-right").height();
          this.setState({elWidth:elWidth, elHeight:elHeight});
          this.initTopological(this.props.vpntopologyData, this.props.vpntopologyStatus, this.props.windowSize.width, this.props.windowSize.height);
          this.props.setWindowSizeChange(false);
        }
      }.bind(this), 10);
  }

  shouldComponentUpdate(nextProps, nextState) {
    var _this = this;
    //cyDraw false第一次绘图  true不是第一次绘图
    //若不是第一次绘图：vpntopologyData 更新的情况下才绘图
    // if(!cyDraw &&　data.length !== 0){
    if($("#window-settings-2").hasClass('active') && $("#vpnSidebar_li_7").hasClass('active') && (
      (!cyDraw &&　nextProps.vpntopologyData.length !== 0)
      || (cyDraw && _this.props.vpntopologyData !== nextProps.vpntopologyData)
      || (cyDraw && _this.props.vpntopologyStatus !== nextProps.vpntopologyStatus))){
        var elWidth = $("#window-settings-2 .wi-right").width();
        var elHeight = $("#window-settings-2 .wi-right").height();
        _this.initTopological(nextProps.vpntopologyData, nextProps.vpntopologyStatus, elWidth, elHeight);
    }
    // if($("#window-settings-2").hasClass('active') && $("#vpnSidebar_li_7").hasClass('active') && nextProps.vpntopologyData.length !== 0 && nextProps.windowSizeChange) {
    //   //改变窗口大小时，重新绘图
    //     if(_this.props.windowSize !== nextProps.windowSize){
    //         _this.setState({elWidth:elWidth, elHeight:elHeight});
    //         _this.initTopological(nextProps.vpntopologyData, nextProps.vpntopologyStatus, nextProps.windowSize.width, nextProps.windowSize.height);
    //         _this.props.setWindowSizeChange(false);
    //     }
    // }
    return true;
  }
  componentWillUnmount() {
    this.hasMounted = false;
    clearInterval(timer);
    timer = null;
  }

  initTopological(data, status, elWidth, elHeight) {
      cyDraw = true;
      var _this = this;
      var nodesArr = [];
      var edgesArr = [];
      //窗口大小最小限制在 w 703 h 408
      if((parseInt(elWidth)-270) < 703 || (parseInt(elWidth)-270) < 408){
        containerW = 703;
        containerH = 408;
        $("#cy").css({"width": "703px", "height": "368px"});
      }else{
        containerW = parseInt(elWidth)-300;
        containerH = parseInt(elHeight)-142;
        $("#cy").css({"width": containerW+"px", "height": containerH-40+"px"});
      }
      //计算白名单的数量
      var countWhiteList = 0;
      var newList = [];
      for(var c=0;c<data.length;c++){
        for(var d=0;d<data[c].whitelist.length;d++){
          if(newList.length==0){
            newList.push(data[c].whitelist[d]);
          }else{
            for(var w=0;w<newList.length;w++){
              if(data[c].whitelist[d] !== newList[w]){
                if(w == newList.length-1){
                  newList.push(data[c].whitelist[d]);
                }
              }else{
                break;
              }
            }
          }
        }
        if(c==data.length-1){
          countWhiteList = newList.length;
        }
      }
      //定位
      var nodeWidth=40;
      var sWidth=40;
      var lPositionX = (containerW/3)/2-nodeWidth/2;
      var lPositionY = (containerH-nodeWidth)/2;
      var mPositionY = (containerH/5-nodeWidth)/2;
      var rPositionY = (containerH/countWhiteList-sWidth)/2;
      nodesArr.push({data:{id: "router", label: "Router"},"position":{"x":lPositionX,"y":lPositionY},"group":"nodes","locked":true,"classes":"router"});

      if(status.length > 0){
          for(var i=0;i<5;i++){
              var whitelists = data[i].whitelist;
              var whiteLength = whitelists.length;
              var mPositionX = lPositionX + containerW/3;
              var rPositionX = mPositionX + containerW/3;
              var clientID = "client"+i;
              var edgeID = "channelEdge"+i;
              var whitelistID = "whiteList"+i;
              var whiteListEdgeID = "whiteListEdge"+i;
              if(i > 0){
                  mPositionY= mPositionY + containerH/5;
              }
              if(status[i].status === "off"){
                  var client = {data:{id: clientID, label: data[i].server_ip+" "+data[i].server_name},"position":{"x":mPositionX,"y":mPositionY},"group":"nodes","locked":true,"classes":"client clientClose"};
                  nodesArr.push(client);
                  edgesArr.push({data:{id: edgeID, source: "router", target: clientID, label: "Tunnel " + (i+1)}});
                  for(var k=0;k<whiteLength;k++){
                    whitelistID = whitelistID+k;
                    whiteListEdgeID = whiteListEdgeID+k;
                    for(var g=0; g<nodesArr.length; g++){
                      if(whitelists[k] === nodesArr[g].data.label){
                        edgesArr.push({data:{id: whiteListEdgeID, source: clientID, target: nodesArr[g].data.id}, classes:"whiteListEdge"});
                        break;
                      }else{
                        if(g==nodesArr.length-1){
                          var whitelistNode = {data:{id: whitelistID, label: whitelists[k]},"position":{"x":rPositionX,"y":rPositionY},"group":"nodes","locked":true,"classes":"whiteListClose"};
                          nodesArr.push(whitelistNode);
                          edgesArr.push({data:{id: whiteListEdgeID, source: clientID, target: whitelistID}, classes: "whiteListEdge"});
                          rPositionY=rPositionY+containerH/countWhiteList;
                        }
                      }
                    }
                  }
              }else{
                  var client = {data:{id: clientID, label: data[i].server_ip+" "+data[i].server_name},"position":{"x":mPositionX,"y":mPositionY},"group":"nodes","locked":true,"classes":"client clientOpen"};
                  nodesArr.push(client);
                  edgesArr.push({data:{id: edgeID, source: "router", target: clientID, label: "Tunnel " + (i+1)}, classes:"normal"});
                  for(var k=0;k<whiteLength;k++){
                    whitelistID = whitelistID+k;
                    whiteListEdgeID = whiteListEdgeID+k;
                    for(var g=0; g<nodesArr.length; g++){
                      if(whitelists[k] === nodesArr[g].data.label){
                        edgesArr.push({data:{id: whiteListEdgeID, source: clientID, target: nodesArr[g].data.id}, classes: "whiteListEdge normal"});
                        break;
                      }else{
                        if(g==nodesArr.length-1){
                          var whitelistNode = {data:{id: whitelistID, label: whitelists[k]},"position":{"x":rPositionX,"y":rPositionY},"group":"nodes","locked":true,"classes":"whiteListOpen"};
                          nodesArr.push(whitelistNode);
                          edgesArr.push({data:{id: whiteListEdgeID, source: clientID, target: whitelistID}, classes:"whiteListEdge normal"});
                          rPositionY=rPositionY+containerH/countWhiteList;
                        }
                      }
                    }
                  }
              }
          }
          var stylesArr = [
              {
                selector: 'node',
                style: {
                  "shape": "rectangle",
                  'background-opacity': 0,
                  'border-opacity': 0,
                  'label': 'data(label)',
                  "background-fit": "cover",
                  'overflow':'visible'
                }
              },
              {
                selector: 'edge',
                style: {
                  'width': 1,
                  'line-color': '#ccc',
                  'target-arrow-color': '#ccc',
                  'target-arrow-shape': 'triangle',
                  'curve-style': 'bezier',
                  'content': 'data(label)',
                  'edge-text-rotation': 'autorotate'
                }
              },
              {
                selector: 'edge.normal',
                style: {
                  'line-color': '#5aca38',
                  'target-arrow-color': '#5aca38',
                }
              },
              {
                selector: 'edge:selected, edge.normal:selected',
                style: {
                  'line-color': '#216ee2',
                  'target-arrow-color': '#216ee2'
                }
              },
              {
                selector: '.clientClose',
                style: {
                  "background-image":"url(images/topology/PC_Red.png)",
                  "text-valign":"bottom",
                  "text-halign":"center",
                  'width': nodeWidth,
                  'height': nodeWidth,
                }
              },
              {
                selector: '.whiteListClose',
                style: {
                  "background-image":"url(images/topology/whiteList_Red.png)",
                  "width":sWidth,
                  "height":sWidth
                }
              },
              {
                selector: '.clientOpen',
                style: {
                  "background-image":"url(images/topology/PC_Blue.png)",
                  "text-valign":"bottom",
                  "text-halign":"center",
                  'width': nodeWidth,
                  'height': nodeWidth,
                }
              },
              {
                selector: '.whiteListOpen',
                style: {
                  "background-image":"url(images/topology/whiteList_Blue.png)",
                  "width":sWidth,
                  "height":sWidth
                }
              },{
                  selector: '.router',
                  style: {
                    "background-image":"url(images/topology/R7800.jpg)",
                    "width":50,
                    "height":50,
                  }
              },
              {
                selector: '.client',
                style: {
                  'text-wrap': 'wrap',
                  'text-max-width': 120
                }
              }
          ];
          if(nodesArr.length!==0){
            var cy = window.cy = cytoscape({
              container: document.getElementById('cy'),
              style: stylesArr,
              elements: {
                  nodes: nodesArr,
                  edges: edgesArr
              }
            });
          }
          cy.userZoomingEnabled(false);
          cy.zoom({level:1});
          cy.fit();
          cy.on('mousedown', 'node', function(event){
                var sourceNodeID = event.cyTarget.id();
                var sourceChannel = sourceNodeID.substring(6);
                //只有client和白名单可以连线
                if (sourceNodeID.indexOf('client') >= 0 && Math.abs(event.cyPosition.x - event.cyTarget.position().x) <= event.cyTarget.width() / 4 && Math.abs(event.cyPosition.y - event.cyTarget.position().y) <= event.cyTarget.height() / 4) {
                    event.cyTarget.ungrabify();
                    sourceNode = event.cyTarget;
                    bMouseDown = true;
                    newNode = {
                        data: {
                            id: 'tempNode'
                        },
                        position: event.cyPosition
                    };
                    if(status[sourceChannel].status === "off"){
                        newEdge = {
                            data: {
                                id: 'tempEdge',
                                source: event.cyTarget.id(),
                                target: 'tempNode'
                            },
                            classes:"whiteListEdge"
                        }
                    }else{
                        newEdge = {
                            data: {
                                id: 'tempEdge',
                                source: event.cyTarget.id(),
                                target: 'tempNode'
                            },
                            classes:"whiteListEdge normal"
                        }
                    }
                    cy.add(newNode);
                    cy.add(newEdge);
                }
          });
          cy.on('mousemove', 'node', function(event){
              if (bMouseDown) {
                  cy.$('#tempNode').relativePosition(event.cyPosition);
                  cy.$('#e').relativePosition(cy.$('#e').cyPosition);
              }
          });
          cy.on('mouseup', 'node', function(event){
              bMouseDown = false;
              cy.remove(cy.$('#tempNode'));
              cy.remove(cy.$('#tempEdge'));
              if (sourceNode) {
                  var allNodes = cy.nodes();
                  var sourceID = sourceNode.id();
                  var sourceChannel = sourceID.substring(6);
                  var sourceConnectedNodes = cy.$("#"+ sourceID).connectedEdges();
                  for (var i = 0; i < allNodes.length; i++) {
                      var targetNodeID = allNodes[i].id();
                      var targetNodeLabel = allNodes[i].data().label;
                      if (sourceNode.id() != targetNodeID
                      && Math.abs(event.cyPosition.x - allNodes[i].position().x) <= allNodes[i].width() / 2 && Math.abs(event.cyPosition.y - allNodes[i].position().y) <= allNodes[i].height() /2
                      && targetNodeID.indexOf('whiteList') >= 0) {
                          if(sourceConnectedNodes.length > 0){
                              for(var k=0; k < sourceConnectedNodes.length; k++){
                                var target = cy.$("#" + sourceConnectedNodes[k].id()).target();
                                  if(target.id() != targetNodeID){
                                      if(k == sourceConnectedNodes.length-1){
                                          if(status[sourceChannel].status === "off"){
                                              newEdge = {
                                                  data: {
                                                      id: getUuid(),
                                                      source: sourceNode.id(),
                                                      target: targetNodeID
                                                  },
                                                  classes:"whiteListEdge"
                                              }
                                          }else{
                                              newEdge = {
                                                  data: {
                                                      id: getUuid(),
                                                      source: sourceNode.id(),
                                                      target: targetNodeID
                                                  },
                                                  classes:"whiteListEdge normal"
                                              }
                                          }
                                          _this.addWhite_vpntopolopy(targetNodeLabel, sourceNode.id().substring(6));
                                          cy.add(newEdge);
                                          break;
                                      }
                                  }
                              }
                          }else{
                            if(status[sourceChannel].status === "off"){
                                newEdge = {
                                    data: {
                                        id: getUuid(),
                                        source: sourceNode.id(),
                                        target: targetNodeID
                                    },
                                    classes:"whiteListEdge"
                                }
                            }else{
                                newEdge = {
                                    data: {
                                        id: getUuid(),
                                        source: sourceNode.id(),
                                        target: targetNodeID
                                    },
                                    classes:"whiteListEdge normal"
                                }
                            }
                            _this.addWhite_vpntopolopy(targetNodeLabel, sourceNode.id().substring(6));
                            cy.add(newEdge);
                            break;
                          }
                      }
                  }
                  sourceNode.grabify();
                  sourceNode = null;
              }
          });
          //contextMenu
          cy.contextMenus({
              menuItems: [{
                  id: 'remove',
                  title: 'Remove',
                  selector: 'node, .whiteListEdge',
                  onClickFunction: function(event) {
                      var node = event.cyTarget;
                      if(event.cyTarget.isNode()){
                        var connectedEdges = cy.$("#"+ node.data().id).connectedEdges();
                        var sourceIndexs = [];
                        for(var i=0; i<connectedEdges.length; i++){
                          var sources = connectedEdges[i].data().source;
                          sourceIndexs.push(sources.substring(6));
                        }
                        for(var k=0; k<sourceIndexs.length; k++){
                          _this.deleteWhite_vpntopology(node.data().label,sourceIndexs[k]);
                          if(k == sourceIndexs.length-1){
                            node.remove();
                          }
                        }
                      }else if(event.cyTarget.isEdge()){
                          var channel = node.data().source.substring(6);
                          var target = node.target();
                          var white = target.data().label;
                          if(channel && white){
                            _this.deleteWhite_vpntopology(white,channel);
                            node.remove();
                            //如果白名单没有任何连线了，直接删除
                            var connectedEdges = cy.$("#"+ target.data().id).connectedEdges();
                            if(connectedEdges.length == 0){
                              cy.$("#"+ target.data().id).remove();
                            }
                          }
                      }
                }
              }]
          });
      }
      function getUuid() {
            var len = 32; //32长度
            var radix = 16; //16进制
            var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
            var uuid = [],
                i;
            radix = radix || chars.length;
            if (len) {
                for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
            } else {
                var r;
                uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                uuid[14] = '4';
                for (i = 0; i < 36; i++) {
                    if (!uuid[i]) {
                        r = 0 | Math.random() * 16;
                        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                    }
                }
            }
            return uuid.join('');
        }

  }

  handleOnClickAddNode(){
    var _this = this;
    //添加白名单
    bAddNode = true;
    cy.on('click', function(event){
      if(bAddNode){
          var x = event.cyPosition.x;
          var y = event.cyPosition.y;
          var labelX = x - 75;
          var labelY = y - 25;
          var labelInput = '<div class="label-container" style="left:' + labelX + 'px;top:' + labelY + 'px"><input type="text" class="label-input" placeholder="Please input your whitelist" /><span id="ok" class="mif-checkmark"></span></div>'
          $('.cyContainer').append(labelInput);
          var whitelistID = "whiteList-"+ count;
          count = count + 1;
          var data = {id: whitelistID};
          cy.add({
              data: data,
              position: {
                  x: x,
                  y: y
              },
              classes: "whiteListOpen"
          });
          //按enter键
          $('.label-input').keypress(function(event){
              var keycode = (event.keyCode ? event.keyCode : event.which);
              if(keycode == '13'){
                addWhite();
              }
          });
          //点击
          $('.label-container #ok').click(function(event){
              addWhite();
          });

          function addWhite(){
              var labelVal = $(".label-input").val().trim();
              var dialogMsg = {
                title: 'Tips'
              }
              var dialogId = "vpnDiaglog";
              if(labelVal){
                if (labelVal.indexOf('http://') > -1) {
                  dialogMsg.content = 'No http://'
                  _this._showDialog(dialogMsg, dialogId);
                  return;
                }
                var whiteFirst = labelVal.split('.')[0];
                var checkWhiteAddress = Utils.verifyIpAddress(labelVal);
                if (labelVal.indexOf('.') == -1 || (!isNaN(whiteFirst) && !checkWhiteAddress)) {
                  dialogMsg.content = 'Please confirm the format of address .'
                  _this._showDialog(dialogMsg, dialogId);
                  return;
                }
                cy.$("#" + whitelistID).data("label", labelVal);
                $(".label-container").remove();
              }else{
                  dialogMsg.content = 'Please input the address .'
                  _this._showDialog(dialogMsg, dialogId);
                  return;
              }
          }

          bAddNode = false;
        }
    });
  }

  _showDialog(dialogMsg, dialogId) {
    this.props.setDialogMsg(dialogMsg);
    showMetroDialog('#' + dialogId);
  }

  render(){
    return (
      <div className="wi-right-1 padding20 auto-y">
        <div className="wire-block">
          <h5>Virtual Private Network Topology</h5>
        </div>
        <div className="cyContainer">
            <div className="cy-opt">
                <button type="button" id="add-node" onClick={this.handleOnClickAddNode}>Add WhiteList</button>
            </div>
            <div id="cy">

            </div>
        </div>
        <form id="vpntopologyForm" action="/cgi-bin/set-vpn.cgi" method="post">
        </form>
      </div>
    )
  }

  getVPNConfig_vpntopolopy(channel) {
    var postData = {
      act_type: "get_vpnconfig",
      channel: channel-1
    }
    var formEl = document.getElementById("vpntopologyForm");
    if(!formEl) {
      console.log("vpntopologyForm has been unmounted!");
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
          console.log("VpnTopology has been unmounted!");
          return;
        }
        try {
          var res = JSON.parse(result.responseText);
          res.channel = "Tunnel "+ parseInt(channel-1);
          if(res.server_ip){
            var ipaddress = res.server_ip;
            var requestURL = "http://api.ipinfodb.com/v3/ip-city/?key=c9fa2961ab751d2c7353de50a25f4a8a1b98f50035460409b783a24d14948aea&ip="+ ipaddress;
            $.ajax({
              type: "GET",
              async: true,
              url: requestURL,
              dataType: "json",
              cache:false,
              complete : function(result){
                try {
                  if(result.responseText.indexOf("ERROR") >= 0){
                      res.server_name = "";
                      dataArr.push(res);
                  }else{
                      var results = result.responseText.split(";");
                      res.server_name = results[3]+"-"+ results[5] +"-"+ results[6];
                      dataArr.push(res);
                  }
                } catch (e) {
                  console.log("Get VPN config error!");
                }
              }
            });
          }else{
              res.server_name = "";
              dataArr.push(res);
          }
          if(dataArr.length==5){
            var by = function(name){
                return function(o, p){
                    var a, b;
                    if (typeof o === "object" && typeof p === "object" && o && p) {
                        a = o[name];
                        b = p[name];
                        if (a === b) {
                            return 0;
                        }
                        if (typeof a === typeof b) {
                            return a < b ? -1 : 1;
                        }
                        return typeof a < typeof b ? -1 : 1;
                    }
                    else {
                        throw ("error");
                    }
                }
            }
            var finalResult = dataArr.sort(by("channel"));
            dataArr=[];
            _this.props.setVpnTopologyData(finalResult);
          }
        } catch (e) {
          console.log(channel);
          console.log("Get VPN config error!");
        }
      }
    });
  }

  getVPNStatus_vpntopolopy(channel) {
    var postData = {
      act_type: "get_vpnstatus",
      channel: channel-1
    }
    var formEl = document.getElementById("vpntopologyForm");
    if(!formEl) {
      console.log("vpntopologyForm has been unmounted!");
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
          console.log("vpnTopology has been unmounted!");
          return;
        }
        try {
          var res = JSON.parse(result.responseText);
          res.channel = parseInt(channel-1);
          statusArr.push(res);
          if(statusArr.length==5){
            var by = function(name){
                return function(o, p){
                    var a, b;
                    if (typeof o === "object" && typeof p === "object" && o && p) {
                        a = o[name];
                        b = p[name];
                        if (a === b) {
                            return 0;
                        }
                        if (typeof a === typeof b) {
                            return a < b ? -1 : 1;
                        }
                        return typeof a < typeof b ? -1 : 1;
                    }
                    else {
                        throw ("error");
                    }
                }
            }
            statusArr.sort(by("channel"));
            _this.props.setVpnTopologyStatus(statusArr);
            statusArr=[];
          }
        } catch (e) {
          console.log("Get VPN status error!");
        }
      }
    });
  }

  deleteWhite_vpntopology(white, channel){
      var postData = {
        act_type: "del_whitelist",
        uri: white,
        channel: channel
      }
      var formEl = document.getElementById("vpntopologyForm");
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
              // console.log("Delete white list success!");
              for(var i=1;i<6;i++){
                _this.getVPNConfig_vpntopolopy(i);
              }
            }
            else {
              console.log("Delete white list error!");
            }
          } catch (e) {
            console.log("Delete white list error!");
          }
        }
      });
  }

  addWhite_vpntopolopy(white, channel){
    var postData = {
      act_type: "add_whitelist",
      uri: white,
      channel: channel
    }
    var formEl = document.getElementById("vpntopologyForm");
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
              for(var i=1;i<6;i++){
                _this.getVPNConfig_vpntopolopy(i);
              }
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
}

export default VpnTopology;
