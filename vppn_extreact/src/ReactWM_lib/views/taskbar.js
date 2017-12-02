
var _ = require('lodash');
import $ from 'jquery';
import React,{Component} from 'react';
import ReactDOM from 'react-dom';

import {intl_language_key} from '../models/Constants';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as HomeActions from '../../app/actions/home_action';

import WindowModel from '../models/window';
import ManagerModel from '../models/manager';
import Window from './window';
import StartMenu from './startMenu'; //开始菜单。

//整个任务栏部分
class Taskbar extends Component{
  state = {
    upload: 0,
    download: 0,
    setout: null,
  }
  statics= {
    Manager: ManagerModel,
    Window: WindowModel
  }

  componentDidMount () {
    this.manager = this.props.manager;
    this.manager.on('change', this.forceUpdate, this);
    var _this = this;
    var setout = setInterval(function() {
      _this.setState({
        upload: parseInt(50*Math.random()),
        download: parseInt(100*Math.random())
      })
    }, 1000);
    this.setState({setout});
  }

  componentWillUnmount () {
    this.manager.off('change', this.forceUpdate);
    if (this.state.setout) {
      clearInterval(this.state.setout)
    }
  }

  toggleWindow = (e)=>{
    var windows = this.props.manager.openWindows_router();
    for(var i = 0; i < windows.length; i++) {
      if(e.target.id.substr(8) == windows[i].id) {
        var el = document.getElementById('window-'+windows[i].id);
        el.style.transition = 'all 0.3s ease';
        if(windows[i].isMinimize) {
          windows[i].show();
          windows[i].requestFocus();
        }
        else if(windows[i].id == this.props.manager.getActiveWindow().id) {
          windows[i].minimize_notChangeFocus($('#taskbar-'+windows[i].id).offset().left + 16 + $('#taskbar-'+windows[i].id).width()/2, 0);
        }
        else {
          windows[i].requestFocus();
        }
        requestAnimationFrame(function () {
          // var el = document.getElementById('window-'+windows[i].id);
          el.style.width  = windows[i].width + 'px';
          el.style.height = windows[i].height + 'px';
          el.style.top    = windows[i].y + 'px';
          el.style.left   = windows[i].x + 'px';
          el.style.opacity= windows[i].opacity;
        });
        setTimeout(function(){
          el.style.transition = 'box-shadow 0.15s ease';
        }, 300);
        break;
      }
    }
  }

  onClickAppBar = (evt)=>{
    this.props.manager.emit("click:appbar");
  }

  toggleAllWindows = ()=>{
    var windows = this.props.manager.openWindows_router();
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
  toggleFullSreen = ()=>{ //开启或者退出全屏
    if(document.body.scrollHeight == window.screen.height){
      this.exitFullscreen(document.documentElement);
    }else{
      this.launchFullscreen(document.documentElement);
    }
  }
  launchFullscreen=(element)=>{
   if(element.requestFullscreen) {
    element.requestFullscreen();
   } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
   } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
   } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
   }
  }
  exitFullscreen = ()=>{
     if(document.exitFullscreen) {
      document.exitFullscreen();
     } else if(document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
     } else if(document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
     }
  }

  onClickChangeLanguage = (evt)=>{
    let btnText = $(evt.target).text();
    console.log("btnText:",btnText);
    let changeToLang = btnText=="English"?"en":"zh";
    localStorage.setItem(intl_language_key, changeToLang);
    document.location.reload();
  }
  render () {
    let {} = this.state;
    const { manager } = this.props;
    var bShowAll = true, fullScreen = document.body.scrollHeight == window.screen.height;
    let windowsIcon = manager.openWindows_router().map((window)=>{
      if(!window.isMinimize) {
        bShowAll = false;
      }
      return (
        <li key={window.id}
          className={manager.getActiveWindow().id==window.id && !manager.getActiveWindow().isMinimize ? "active-container":""}>
          <a id={"taskbar-"+window.id}
            title={window.title}
            onClick={this.toggleWindow}>
            {window.icon.substr(0, 7)=="images/" ?
              <img src={window.icon} id={"barIcon-"+window.id}/> :
              <span className={window.icon} id={"barIcon-"+window.id}></span>
            }
          </a>
        </li>
      );
    });

    let curLang = localStorage.getItem(intl_language_key) || "en"; //当前使用的语言
    return (
      <div className="app-bar fixed-top darcula" data-role="appbar" onClick={this.onClickAppBar}>
          {/*<a className="app-bar-element branding">BrandName</a>*/}
          <div className="app-bar-element" style={{width:"15px"}} onClick={this.toggleAllWindows} title={bShowAll ? "Show All Windows" : "Hide All Windows"}></div>
          <span className="app-bar-divider"></span>
          <StartMenu manager={this.props.manager}/>
          <span className="app-bar-divider"></span>
          <ul className="app-bar-menu m-menu">
            {windowsIcon}
          </ul>
          <div className="place-right">
            <span style={{'float':"left", padding:"8px 1rem"}}>
              <div><span className="mif-arrow-up"></span><span style={{color:"#00ccff"}}> {this.state.upload}KB/s</span></div>
              <div><span className="mif-arrow-down"></span><span style={{color:"#7ad61d"}}> {this.state.download}KB/s</span></div>
            </span>
            <span className="app-bar-divider"></span>
            <div className='' style={{'float':'left',height:'3.125rem',lineHeight:'3.125rem',margin:"0 auto",textAlign:'center',width:'66px'}}>
              <button style={{borderRadius:'4px',opacity:'0.7',color:'#fff',backgroundColor:'#484545'}} onClick={this.onClickChangeLanguage}>{curLang=="zh"?"English":"中文"}</button>
            </div>

            {/*<span className="app-bar-divider"></span>
            <ul className="app-bar-menu m-menu">
                <li><a><span className="mif-bubble"></span></a></li>
                <li><a><span className="mif-user"></span></a></li>
                <li><a><span className="mif-search"></span></a></li>
                <li><a><span className="mif-stack2" style={{transform:"rotateY(180deg)"}}></span></a></li>
            </ul>*/}
            <span className="app-bar-divider"></span>
            <div className="app-bar-element" style={{width:"15px"}} onClick={this.toggleFullSreen} title={fullScreen ? "normal screen" : "full screen"}></div>
          </div>
      </div>
    );
  }

}

Taskbar.propTypes={
  manager: React.PropTypes.instanceOf(ManagerModel).isRequired
  // taskbar: React.PropTypes.instanceOf(TaskbarModel).isRequired
}

const mapStateToProps = (state)=>{
  return {
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {
    actions: bindActionCreators(HomeActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Taskbar);
