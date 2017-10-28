
import _ from 'lodash';
import $ from 'jquery';
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
// var CSSTransitionGroup = require('react/addons').addons.CSSTransitionGroup;

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as HomeActions from '../../app/actions/home_action';

import WindowModel from '../models/window'; //窗口的控制器和数据模型
import IconModel from '../models/icon';
import ManagerModel from '../models/manager';
import Window from './window'; //窗口组件
import Icon from './icon';  //图标组件
import CommonDialog from '../../app/components/common/dialog';

var heartbeatTimer = null;
//整个桌面部分控件
class Manager extends Component{
  state = {
    offset: {
      top: 0,
      left: 0
    }
  }
  componentDidMount () {
    this.manager = this.props.manager;
    this.manager.on('change', this.forceUpdate, this);
    var el = $(ReactDOM.findDOMNode(this));
    this.setState({  offset: el.offset() });
    var _this = this;
    //屏蔽浏览器右键菜单
    $(document).contextmenu(function() {
        return false;
    });
    //点击桌面的时候显示右键菜单
    $(".desktopIcon-manager").contextmenu(function(event) {
        var x=event.clientX;
        var y=event.clientY-50;
        var menu=$(".content-menu");
        //判断坐标
        var width=document.getElementById('desktop').clientWidth;
        var height=document.getElementById('desktop').clientHeight;
        x=(x+menu.width())>=width?width-menu.width():x;
        y=(y+menu.height())>=height?y-menu.height():y;
        //alert("可视高度："+height+",鼠标高度："+y);
        menu.css("top",y);
        menu.css("left",x);
        menu.show();
    });

    $(".content-menu ul li").click(function() {
        var text=$(this).text();
        switch (text) {
          case "Refresh":
              document.location.reload();
              break;
          case "Line Up To Grid":
              $("#icon_check_lineUptoGrid").toggle();
              if($("#icon_check_lineUptoGrid").is(':visible')) {
                _this.arrange();
              }
              localStorage.lineUptoGrid = $("#icon_check_lineUptoGrid")[0].style.display;
              break;
          case "Show All Windows":
          case "Hide All Windows":
              _this.toggleAllWindows();
              break;
          case "Logout":
              if(confirm("Are you should to log out？")){
              }
              break;
          default:
              break;
        }

        $(".content-menu").hide();
    });
  }

 shouldComponentUpdate(nextProps, nextState) {
   if(nextProps.desktopType != this.props.desktopType && nextProps.desktopType == "phone") {
     var _this = this;
     heartbeatTimer = setInterval(function(){
       $.ajax({
         type: "GET",
         async: true,
         url: "http://"+nextProps.myPhoneIP+":12012/heartbeat",
        //  dataType: "json",
         cache:false,
         timeout: 10000,
         complete : function(result, status){
           if(status != "success") {
             if(status == "timeout") {
               clearInterval(heartbeatTimer);
               heartbeatTimer = null;
               console.log("Connect device timeout!");
               showMetroDialog('#phoneDisNotifyDialog');
               _this.props.actions.setMyPhoneIP("");

             }
             else {
               clearInterval(heartbeatTimer);
               heartbeatTimer = null;
               console.log("Connect device error!");
               showMetroDialog('#phoneDisNotifyDialog');
               _this.props.actions.setMyPhoneIP("");
             }
           }
         }
       });
     }, 10000);
   }
   return true;
 }

  componentWillUnmount () {
    this.props.manager.off('change', this.forceUpdate);
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
  arrange() {
    var ul=$(".icons");
      var desktop=$(".desktopIcon-manager");
      //位置坐标
      // var position={x:0,y:0,bottom:100,width:80,height:80,parent:{height:0,width:0},padding:{top:10,left:10,right:0,bottom:10}};
      // position.parent.height=desktop.height();
      // position.parent.width=desktop.width();
    var position=this.getPosition();

    var maxX = 0, maxY = 0;
    for(var i = 0; ; i++) {
      if(i*(position.width+position.padding.left) > position.parent.width-(position.width+position.padding.left)) {
        maxX = (i-1)*(position.width+position.padding.left);
        break;
      }
    }
    for(var i = 0; ; i++) {
      if(i*(position.height+position.padding.top+position.padding.bottom) > position.parent.height-position.bottom) {
        maxY = (i-1)*(position.height+position.padding.top+position.padding.bottom);
        break;
      }
    }

    var _this = this;
      ul.find("li").each(function(index) {
      // var icons = _this.props.manager.allIcons();
      var icons;
      if(_this.props.desktopType == "router") {
        icons = _this.props.manager.allIcons_router();
      }
      else if(_this.props.desktopType == "phone") {
        icons = _this.props.manager.allIcons_phone();
      }
      for(var k = 0; k < icons.length; k++) {
        if(("icon-"+icons[k].id) == $(this).attr("id")) {
          for(var i = 0; ; i++) {
            if(i*(position.width+position.padding.left) > position.parent.width-(position.width+position.padding.left)) break;
            for(var j = 0; ; j++) {
              if(j*(position.height+position.padding.top+position.padding.bottom) > position.parent.height-position.bottom) break;
              if(icons[k].x+position.width/2 >= i*(position.width+position.padding.left) && icons[k].x+position.width/2 < (i+1)*(position.width+position.padding.left)
              && icons[k].y+position.height/2 >= j*(position.height+position.padding.top+position.padding.bottom) && icons[k].y+position.height/2 < (j+1)*(position.height+position.padding.top+position.padding.bottom)) {
                position.x = i*(position.width+position.padding.left);
                position.y = j*(position.height+position.padding.top+position.padding.bottom);
                if(position.y>=position.parent.height-position.bottom){
                  if(position.x+position.width+position.padding.left <= maxX) {
                    position.y=0;
                          position.x=position.x+position.width+position.padding.left;
                  }
                        else {
                    position.y=maxY;
                          position.x=maxX;
                  }
                    }
                icons[k].setPosition(position.x, position.y);
                $(this).css("top",position.y+"px");
                    $(this).css("left",position.x+"px");
                var bForward = _this.getIconMoveDirection(icons[k], icons[k].x, icons[k].y);
                _this.quickUpdate_overlapped(icons[k], icons[k].x, icons[k].y, bForward);
                break;
              }
            }
          }
        }
      }
      });
  }

  // 被覆盖的图标按规定方式顺移, bForward为true时按从上至下、从左至右的方向，为false时按从下至上从右至左的方向
  quickUpdate_overlapped(icon, x, y, bForward) {
    var position=this.getPosition();

    // var icons = this.props.manager.allIcons();
    var icons;
    if(this.props.desktopType == "router") {
      icons = this.props.manager.allIcons_router();
    }
    else if(this.props.desktopType == "phone") {
      icons = this.props.manager.allIcons_phone();
    }
    for(var i = 0; i < icons.length; i++) {
      if(icon.id != icons[i].id && icons[i].x == x && icons[i].y == y) {
        position.x=x;
        if(bForward) {
          position.y=y+position.height+position.padding.top+position.padding.bottom;
          if(position.y>=position.parent.height-position.bottom){
                  position.y=0;
                  position.x=position.x+position.width+position.padding.left;
              }
        }
        else {
          var maxY = 0;
          for(var j = 0; ; j++) {
            if(j*(position.height+position.padding.top+position.padding.bottom) > position.parent.height-position.bottom) {
              maxY = (j-1)*(position.height+position.padding.top+position.padding.bottom);
              break;
            }
          }

          position.y=y-(position.height+position.padding.top+position.padding.bottom);
          if(position.y<0){
                  position.y=maxY;
                  position.x=position.x-(position.width+position.padding.left);
              }
        }
        icons[i].setPosition(position.x, position.y);
        // var self = this;
        // requestAnimationFrame(function () {
        //   var el = ReactDOM.findDOMNode(self);
          var el = document.getElementById("icon-"+icons[i].id);
          el.style.top    = icons[i].y + 'px';
          el.style.left   = icons[i].x + 'px';
        // });
        this.quickUpdate_overlapped(icons[i], icons[i].x, icons[i].y, bForward);
        // break;
      }
    }
  }

  // 获取图标顺移方式
  getIconMoveDirection(icon, x, y) {
    var position=this.getPosition();
    // var icons = this.props.manager.allIcons();
    var icons;
    if(this.props.desktopType == "router") {
      icons = this.props.manager.allIcons_router();
    }
    else if(this.props.desktopType == "phone") {
      icons = this.props.manager.allIcons_phone();
    }

    var bForward = false;
    for(var i = x/(position.width+position.padding.left); ; i++) {
      if(i*(position.width+position.padding.left) > position.parent.width-(position.width+position.padding.left)) break;
      if(i == x/(position.width+position.padding.left)) {
        for(var j = y/(position.height+position.padding.top+position.padding.bottom); ; j++) {
          if(j*(position.height+position.padding.top+position.padding.bottom) > position.parent.height-position.bottom) break;
          var flag = false;
          for(var k = 0; k < icons.length; k++) {
            if(icon.id != icons[k].id && icons[k].x == i*(position.width+position.padding.left) && icons[k].y == j*(position.height+position.padding.top+position.padding.bottom)) {
              flag = true;
              break;
            }
          }
          if(!flag) {
            bForward = true;
            break;
          }
        }
      }
      else {
        for(var j = 0; ; j++) {
          if(j*(position.height+position.padding.top+position.padding.bottom) > position.parent.height-position.bottom) break;
          var flag = false;
          for(var k = 0; k < icons.length; k++) {
            if(icon.id != icons[k].id && icons[k].x == i*(position.width+position.padding.left) && icons[k].y == j*(position.height+position.padding.top+position.padding.bottom)) {
              flag = true;
              break;
            }
          }
          if(!flag) {
            bForward = true;
            break;
          }
        }
      }

      if(bForward) break;
    }
    return bForward;
  }

  getPosition() {
    var desktop=$(".desktopIcon-manager");
    var position={x:0,y:0,bottom:100,width:80,height:80,parent:{height:0,width:0},padding:{top:10,left:10,right:0,bottom:10}};
    position.parent.height=desktop.height();
    position.parent.width=desktop.width();
    // position.height=$(ReactDOM.findDOMNode(this)).height()+2;
    // position.width=$(ReactDOM.findDOMNode(this)).width()+2;
    // position.bottom=position.height+position.padding.top+position.padding.bottom;
    return position;
  }

  toggleAllWindows() {
    const { desktopType } = this.props;
    var windows;
    if(desktopType == "router") {
      windows = this.props.manager.openWindows_router();
    }
    else if(desktopType == "phone") {
      windows = this.props.manager.openWindows_phone();
    }
    var bShowAll = true;
    for(var i = 0; i < windows.length; i++) {
      if(!windows[i].isMinimize) {
        bShowAll = false;
        var el = document.getElementById('window-'+windows[i].id);
        el.style.transition = 'all 0.3s ease';
        windows[i].minimize_notChangeIndex($('#taskbar-'+windows[i].id).offset().left + 16 + $('#taskbar-'+windows[i].id).width()/2, 0);
        // requestAnimationFrame(function () {
          // var el = document.getElementById('window-'+windows[i].id);
          el.style.width  = windows[i].width + 'px';
          el.style.height = windows[i].height + 'px';
          el.style.top    = windows[i].y + 'px';
          el.style.left   = windows[i].x + 'px';
          el.style.opacity= windows[i].opacity;
        // });
        setTimeout(function(){
          el.style.transition = 'box-shadow 0.15s ease';
        }, 300);
      }
    }

    if(bShowAll) {
      for(var i = 0; i < windows.length; i++) {
        var el = document.getElementById('window-'+windows[i].id);
        el.style.transition = 'all 0.3s ease';
        windows[i].show();
        // windows[i].requestFocus();
        // requestAnimationFrame(function () {
          // var el = document.getElementById('window-'+windows[i].id);
          el.style.width  = windows[i].width + 'px';
          el.style.height = windows[i].height + 'px';
          el.style.top    = windows[i].y + 'px';
          el.style.left   = windows[i].x + 'px';
          el.style.opacity= windows[i].opacity;
        // });
        setTimeout(function(){
          el.style.transition = 'box-shadow 0.15s ease';
        }, 300);
      }

      var maxIndex = -1, tmp = -1;
      for(var i = 0; i < windows.length; i++) {
        if(!windows[i].isMinimize && windows[i].index > maxIndex) {
          maxIndex = windows[i].index;
          tmp = i;
        }
      }
      if(tmp == -1) {
        this.manager.focus(null);
      }
      else {
        this.manager.focus(windows[tmp]);
      }
    }
  }

  _diaglogConformFunc(){
    hideMetroDialog("#phoneDisNotifyDialog");
    $(document.body).css("background-image", "url(../images/bj.jpg)");
    this.props.actions.setDesktopType("router");
    var phoneWindows = this.props.manager.openWindows_phone();
    while (phoneWindows.length) {
      this.props.manager.remove(phoneWindows[0]);
      phoneWindows = this.props.manager.openWindows_phone();
    }
    var connectWindow = this.props.manager.get('my-phone');
    if (connectWindow) {
      this.props.manager.remove(connectWindow);
    }
  }

  render () {
    const { desktopType, cySize, vpntopologyData, vpntopologyStatus } = this.props;
    var bShowAll = true;
    var windows, icons;
    if(desktopType == "router") { //pc端的图标
      windows = this.props.manager.openWindows_router().map(function (window) {
        if(!window.isMinimize) {
          bShowAll = false;
        }
        return <Window key={window.id} offset={this.state.offset} window={window} setCySize={this.props.actions.setCySize} setVpnTopologyData={this.props.actions.setVpnTopologyData}
        setVpnTopologyStatus={this.props.actions.setVpnTopologyStatus} cySize={cySize} vpntopologyData={vpntopologyData} vpntopologyStatus={vpntopologyStatus} setWindowSizeChange={this.props.actions.setWindowSizeChange}
        setWindowSize={this.props.actions.setWindowSize}/>
      }, this);
      icons = this.props.manager.allIcons_router().map(function (icon) {
        return <Icon key={icon.id} offset={this.state.offset} icon={icon} manager={this.props.manager} desktopType={desktopType} setDesktopType={this.props.actions.setDesktopType}/>
      }, this);
    }
    else if(desktopType == "phone") {  //移动端的图标
      windows = this.props.manager.openWindows_phone().map(function (window) {
        if(!window.isMinimize) {
          bShowAll = false;
        }
        return <Window key={window.id} offset={this.state.offset} window={window} setCySize={this.props.actions.setCySize} setVpnTopologyData={this.props.actions.setVpnTopologyData}
        setVpnTopologyStatus={this.props.actions.setVpnTopologyStatus} cySize={cySize} vpntopologyData={vpntopologyData} vpntopologyStatus={vpntopologyStatus} setWindowSizeChange={this.props.actions.setWindowSizeChange}
        setWindowSize={this.props.actions.setWindowSize}/>
      }, this);
      icons = this.props.manager.allIcons_phone().map(function (icon) {
        return <Icon key={icon.id} offset={this.state.offset} icon={icon} manager={this.props.manager} desktopType={desktopType} setDesktopType={this.props.actions.setDesktopType}/>
      }, this);
    }

    return (
      /* jshint ignore: start */
      <div>
        {/*桌面上的图标*/}
        <div id="desktop" className="desktopIcon-manager">
          <ul id="icons" className="icons">
            {icons}
            <div id="icon_position_line" className="icon-position-line"></div>
          </ul>
        </div>
        <div className='window-manager'>
          {/*所有已打开窗口*/}
          <div className='windows'>{windows}</div>
        </div>
        {/*右键菜单*/}
        <div className="content-menu">
          <ul>
              <li><a href="javascript:;">Refresh</a></li>
              <li><span id="icon_check_lineUptoGrid" className="mif-checkmark icon" style={{display: localStorage.lineUptoGrid ? localStorage.lineUptoGrid : "block"}}></span><a href="javascript:;">Line Up To Grid</a></li>
              <li><a href="javascript:;">{bShowAll ? "Show All Windows" : "Hide All Windows"}</a></li>
              <hr/>
              <li><a href="javascript:;">Help</a></li>
              <hr/>
              <li><a href="javascript:;">About</a></li>
              <hr/>
              <li><a href="javascript:;">Settings</a></li>
              <li><a href="javascript:;">Logout</a></li>
          </ul>
        </div>
        {/*一个通用的提示弹窗*/}
        <CommonDialog id="phoneDisDialog" dialogMsg={{title: 'Tips', content: 'Are you sure to disconnect from your phone ?'}} confirmFunc={this._diaglogConformFunc} />
        <div data-role="dialog, draggable" id="phoneDisNotifyDialog" className="padding20 dialog" data-overlay="true">
          <h3>Tips</h3>
          <p id="content">
              Your phone is disconnected .
          </p>
          <div className="footer place-right p-t-10">
            <button type="button" className="button info info2" onClick={this._diaglogConformFunc}>OK</button>
          </div>
        </div>
      </div>
      /* jshint ignore: end */
    );
  }

}

Manager.statics= {
  Manager: ManagerModel,
  Window: WindowModel,
  Icon: IconModel
}
Manager.propTypes= {
  manager: React.PropTypes.instanceOf(ManagerModel).isRequired
}

//react-redux,容器组件配置
const mapStateToProps = (state)=>{
  const { desktopType, cySize, vpntopologyData, vpntopologyStatus, myPhoneIP } = state.homeReducer;
  return {
    desktopType,
    cySize,
    vpntopologyData,
    vpntopologyStatus,
    myPhoneIP
  }
}
const mapDispatchToProps = (dispatch)=>{
  return {
    actions: bindActionCreators(HomeActions, dispatch)
  }
}
const ManagerConnect = connect(
  mapStateToProps,
  mapDispatchToProps
)(Manager);

export default ManagerConnect;
