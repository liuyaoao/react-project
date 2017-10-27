import $ from 'jquery';
import _ from 'lodash';
import React, { Component } from 'react';
import Settings from './settings';
import ManagerModel from './ReactWM_lib/models/manager';
import ReactWM from './ReactWM_lib/index';

// $(function () {
var bodyWidth = document.documentElement.clientWidth / 2, bodyHeight = (document.documentElement.clientHeight - 50) / 2;

var windowData = localStorage.windows_icons ? JSON.parse(localStorage.windows_icons).windows : [];
var iconData = localStorage.windows_icons ? JSON.parse(localStorage.windows_icons).icons : [];

// var manager = window.m = new ReactWM.Manager.WrappedComponent.Manager(windowData, iconData);
var manager = window.m = new ManagerModel(null, null);

manager.allWindows().forEach(function (window) {
  window.setComponent(<Settings id={window.id}/>);
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


var bodyMousedown = function(e){
  var bClickContentMenu = false;
  if($(e.target)[0] == $(".content-menu")[0]) {
    bClickContentMenu = true;
  }
  else if($(e.target)[0] == $(".content-menu ul")[0]) {
    bClickContentMenu = true;
  }
  if(!bClickContentMenu) {
    for(var i = 0; i < $(".content-menu ul hr").length; i++) {
      if($(e.target)[0] == $(".content-menu ul hr")[i]) {
        bClickContentMenu = true;
        break;
      }
    }
  }
  if(!bClickContentMenu) {
    for(var i = 0; i < $(".content-menu ul li").length; i++) {
      if($(e.target)[0] == $(".content-menu ul li")[i]) {
        bClickContentMenu = true;
        break;
      }
    }
  }
  if(!bClickContentMenu) {
    for(var i = 0; i < $(".content-menu ul li span").length; i++) {
      if($(e.target)[0] == $(".content-menu ul li span")[i]) {
        bClickContentMenu = true;
        break;
      }
    }
  }
  if(!bClickContentMenu) {
    for(var i = 0; i < $(".content-menu ul li a").length; i++) {
      if($(e.target)[0] == $(".content-menu ul li a")[i]) {
        bClickContentMenu = true;
        break;
      }
    }
  }
  if(!bClickContentMenu) {
    $(".content-menu").hide();
  }
}

var clickBody = function(e){
  if(e.target.id == "desktop" || e.target.id == "icons") {
    // manager.focus(null);
    $(".icons li").removeClass("icons-focus");
  }
}

var toggleStartMenu = function () {
  $('.open-start-menu').toggleClass('active');
  $('#startMenu').toggle();
};
var hideStartMenu = function () {
  setTimeout(function () {
    $('.open-start-menu').removeClass('active');
    $('#startMenu').hide();
  }, 200);
};

var openMenuWin = function () {
  var defaultOptions = {
    id: '',
    title: '',
    width: 1000,
    height: 570,
    x: 100,
    y: 100,
    icon: ''
  }
  switch (this.id) {
    case 'menu-item-1':
      defaultOptions.id = 'settings-1';
      defaultOptions.title = 'Network Center';
      defaultOptions.icon = 'images/icon/Network-Center.png';
      break;
    case 'menu-item-2':
      defaultOptions.id = 'settings-2';
      defaultOptions.title = 'VPN Center';
      defaultOptions.icon = 'images/icon/VPN.png';
      defaultOptions.width = 1015;
      break;
    case 'app-center':
      defaultOptions.id = 'app-center';
      defaultOptions.title = 'App Center';
      defaultOptions.icon = 'images/icon/app.png';
      break;
    case 'menu-item-4':
      defaultOptions.id = 'settings-4';
      defaultOptions.title = 'Settings 4';
      defaultOptions.icon = 'mif-image';
      break;
    case 'device-manage':
      defaultOptions.id = 'device-manage';
      defaultOptions.title = '';
      defaultOptions.icon = 'mif-mobile';
      defaultOptions.width = 300, defaultOptions.height = 600;
      defaultOptions.x = 400, defaultOptions.y = 120;
      // defaultOptions.hiddenHeader = true;
      break;
    default:
      break;
  }
  defaultOptions.x = bodyWidth - defaultOptions.width / 2, defaultOptions.y = bodyHeight - defaultOptions.height / 2;
  manager.open(defaultOptions.id, <Settings id={defaultOptions.id}/>, defaultOptions);

  if($('.app-bar-element').hasClass('active-container')) {
    $('.app-bar-element').removeClass('active-container');
  }
  if($('.dropdown-toggle.startBtn').hasClass('active-toggle')) {
    $('.dropdown-toggle.startBtn').removeClass('active-toggle');
  }
  $('#start-container').hide();
};

//router icons。  添加PC端的桌面图标
manager.open_icon('photo', {
  x: 0,
  y: 0,
  title: 'Photo',
  iconUrl: 'images/icon/photo.png'
});
manager.open_icon('video', {
  x: 0,
  y: 100,
  title: 'Video',
  iconUrl: 'images/icon/video.png'
});
manager.open_icon('file', {
  x: 0,
  y: 200,
  title: 'File',
  iconUrl: 'images/icon/file.png'
});
manager.open_icon('music', {
  x: 0,
  y: 300,
  title: 'Music',
  iconUrl: 'images/icon/music.png'
});
manager.open_icon('my-phone', {
  x: 0,
  y: 400,
  title: 'My Phone',
  iconUrl: 'images/icon/my-phone.png'
});

//phone icons.  添加手机端的桌面图标
manager.open_icon('phone_disconnect', {
  type: 'phone',
  x: 0,
  y: 0,
  title: 'Disconnect',
  iconUrl: 'images/disconnect_80.png'
});
manager.open_icon('phone_file', {
  type: 'phone',
  x: 0,
  y: 100,
  title: 'File',
  iconUrl: 'images/file_80.png'
});
manager.open_icon('phone_photo', {
  type: 'phone',
  x: 0,
  y: 200,
  title: 'Photo',
  iconUrl: 'images/photo_80.png'
});
manager.open_icon('phone_music', {
  type: 'phone',
  x: 0,
  y: 300,
  title: 'Music',
  iconUrl: 'images/music_80.png'
});
manager.open_icon('phone_video', {
  type: 'phone',
  x: 0,
  y: 400,
  title: 'Video',
  iconUrl: 'images/video_80.png'
});


class ReactWMHome extends Component{
  componentDidMount(){
    $('body').on('click', clickBody);
    $('body').on('mousedown', bodyMousedown);
    $('.open-start-menu').on('click', toggleStartMenu);
    $('.open-start-menu').blur(hideStartMenu);
    $('.open-menu-win').on('click', openMenuWin);
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
