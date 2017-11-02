import $ from 'jquery';
import _ from 'lodash';
import React, { Component } from 'react';
// import Settings from './settings';
import ManagerModel from './ReactWM_lib/models/manager';
import WindowContentTpl from './ReactWM_lib/views/WindowContentTpl';
import ReactWM from './ReactWM_lib/index';
import desktopIconDatas from './datas/desktopIconData';

// var bodyWidth = document.documentElement.clientWidth / 2, bodyHeight = (document.documentElement.clientHeight - 50) / 2;

// var windowData = localStorage.windows_icons ? JSON.parse(localStorage.windows_icons).windows : [];
// var iconData = localStorage.windows_icons ? JSON.parse(localStorage.windows_icons).icons : [];
// var manager = window.m = new ReactWM.Manager.WrappedComponent.Manager(windowData, iconData);

var manager = window.m = new ManagerModel(null, null);
manager.allWindows().forEach(function (window) {
  window.setComponent(<WindowContentTpl id={window.id} manager={manager} contentComp={window.contentComp}/>);
});

var save = _.debounce(function () {
  localStorage.windows_icons = manager.toString();
  // console.log("$icon_check_lineUptoGrid:",$("#icon_check_lineUptoGrid").length);
  localStorage.lineUptoGrid = $("#icon_check_lineUptoGrid").length>0 && $("#icon_check_lineUptoGrid")[0].style.display;
  // localStorage.icons = manager.toString();
}, 500);

manager.on('change', save);
manager.on('change:windows', save);
manager.on('change:icons', save);

var clickBody = function(e){
  if(e.target.id == "desktop" || e.target.id == "icons") {
    // manager.focus(null);
    $(".icons li").removeClass("icons-focus");
  }
  manager.clickDesktopEmit();
  manager.getContextMenu().hideContextMenuEmit();
}

//router icons。  添加PC端的桌面图标
desktopIconDatas.forEach((item,index)=>{
  let cfgs = Object.assign({},item);
  manager.open_icon(item.id, cfgs);
});

//phone icons.  添加手机端的桌面图标
// manager.open_icon('phone_disconnect', {
//   type: 'phone',
//   x: 0,
//   y: 0,
//   title: 'Disconnect',
//   iconUrl: 'images/disconnect_80.png'
// });
// manager.open_icon('phone_file', {
//   type: 'phone',
//   x: 0,
//   y: 100,
//   title: 'File',
//   iconUrl: 'images/file_80.png'
// });
// manager.open_icon('phone_photo', {
//   type: 'phone',
//   x: 0,
//   y: 200,
//   title: 'Photo',
//   iconUrl: 'images/photo_80.png'
// });
// manager.open_icon('phone_music', {
//   type: 'phone',
//   x: 0,
//   y: 300,
//   title: 'Music',
//   iconUrl: 'images/music_80.png'
// });
// manager.open_icon('phone_video', {
//   type: 'phone',
//   x: 0,
//   y: 400,
//   title: 'Video',
//   iconUrl: 'images/video_80.png'
// });

class ReactWMHome extends Component{
  componentDidMount(){
    $('body').on('click', clickBody);
    // $('body').on('mousedown', bodyMousedown);
  }
  render(){
    return (
      <div>
        <ReactWM.Manager manager={manager} />
        <ReactWM.Taskbar manager={manager} />
      </div>
    )
  }
}

export default ReactWMHome;
