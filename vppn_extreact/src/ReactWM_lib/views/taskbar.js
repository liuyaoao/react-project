
var _ = require('lodash');
import $ from 'jquery';
import React,{Component} from 'react';
import ReactDOM from 'react-dom';

import WindowModel from '../models/window';
import ManagerModel from '../models/manager';
// var TaskbarModel = require('../models/taskbar');
import Window from './window';
import StartMenu from './startMenu';

class Taskbar extends Component{
  state = {
    upload: 0,
    download: 0,
    setout: null
  }
  statics= {
    Manager: ManagerModel,
    // Taskbar: TaskbarModel,
    Window: WindowModel
  }

  componentDidMount () {
    this.manager = this.props.manager;
    this.manager.on('change', this.forceUpdate, this);
    // this.taskbar = this.props.taskbar;
    // this.taskbar.on('change', this.forceUpdate, this);
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
    // this.taskbar.off('change', this.forceUpdate);
    if (this.state.setout) {
      clearInterval(this.state.setout)
    }
  }

  toggleWindow(e) {
    const { desktopType } = this.props;
    var windows;
    if(desktopType == "router") {
      windows = this.props.manager.openWindows_router();
    }
    else if(desktopType == "phone") {
      windows = this.props.manager.openWindows_phone();
    }
    for(var i = 0; i < windows.length; i++) {
      if(e.target.id.substr(8) == windows[i].id) {
        var el = document.getElementById('window-'+windows[i].id);
        el.style.transition = 'all 0.3s ease';
        if(windows[i].isMinimize) {
          windows[i].show();
          windows[i].requestFocus();
        }
        else if(windows[i].id == this.props.manager._active.id) {
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

  handleClickStart = ()=>{
    this.props.manager.focus(null);
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

  render () {
    const { desktopType } = this.props;
    var bShowAll = true;
    var windows;
    if(desktopType == "router") {
      windows = this.props.manager.openWindows_router().map(function (window) {
        if(!window.isMinimize) {
          bShowAll = false;
        }
        return (
          <li key={window.id} className={this.props.manager._active.id==window.id && !this.props.manager._active.isMinimize ? "active-container":""}>
            <a id={"taskbar-"+window.id} title={window.title} onClick={this.toggleWindow}>
              {window.icon.substr(0, 7)=="images/" ? <img src={window.icon} id={"barIcon-"+window.id}/> : <span className={window.icon} id={"barIcon-"+window.id}></span>}
            </a>
          </li>
        );
      }, this);
    }
    else if(desktopType == "phone") {
      windows = this.props.manager.openWindows_phone().map(function (window) {
        if(!window.isMinimize) {
          bShowAll = false;
        }
        return (
          <li key={window.id} className={this.props.manager._active.id==window.id && !this.props.manager._active.isMinimize ? "active-container":""}>
            <a id={"taskbar-"+window.id} title={window.title} onClick={this.toggleWindow}>
              {window.icon.substr(0, 7)=="images/" ? <img src={window.icon} id={"barIcon-"+window.id}/> : <span className={window.icon} id={"barIcon-"+window.id}></span>}
            </a>
          </li>
        );
      }, this);
    }

    return (
      // <span style={{padding:0}}>
      //   {windows}
      // </span>
      <div className="app-bar fixed-top darcula" data-role="appbar">
          {/*<a className="app-bar-element branding">BrandName</a>*/}
          <div className="app-bar-element">
              <div className="dropdown-toggle startBtn" onMouseDown={this.handleClickStart}><img src="images/favicon.ico"/> Start</div>
              <StartMenu />
          </div>
          <span className="app-bar-divider"></span>
          <ul className="app-bar-menu m-menu">
              {windows}
          </ul>
          <div className="place-right">
            <span style={{float:"left", padding:"8px 1rem"}}>
              <div><span className="mif-arrow-up"></span><span style={{color:"#00ccff"}}> {this.state.upload}KB/s</span></div>
              <div><span className="mif-arrow-down"></span><span style={{color:"#7ad61d"}}> {this.state.download}KB/s</span></div>
            </span>
            <span className="app-bar-divider"></span>
            <ul className="app-bar-menu m-menu">
                <li><a><span className="mif-bubble"></span></a></li>
                <li><a><span className="mif-user"></span></a></li>
                <li><a><span className="mif-search"></span></a></li>
                <li><a><span className="mif-stack2" style={{transform:"rotateY(180deg)"}}></span></a></li>
            </ul>
            <span className="app-bar-divider"></span>
            <div className="app-bar-element" style={{width:"15px"}} onClick={this.toggleAllWindows} title={bShowAll ? "Show All Windows" : "Hide All Windows"}>
            </div>
          </div>
      </div>
    );
  }

}

Taskbar.propTypes={
  manager: React.PropTypes.instanceOf(ManagerModel).isRequired
  // taskbar: React.PropTypes.instanceOf(TaskbarModel).isRequired
}

export default Taskbar;