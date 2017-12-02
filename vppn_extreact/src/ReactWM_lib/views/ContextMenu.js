// var _ = require('lodash');
import $ from 'jquery';
import React,{Component} from 'react';
import ReactDOM from 'react-dom';

//右键菜单组件
class ContextMenu extends Component{
  componentDidMount() {
    let _this = this;
    this.props.manager.getContextMenu().on("change:hide",this.hideContextMenu);
    this.props.manager.getContextMenu().on("change:show",this.showContextMenu);
    //屏蔽浏览器右键菜单
    $(document).contextmenu(function() {
        return false;
    });
    //点击桌面的时候显示右键菜单
    $('.'+this.props.desktopManagerCls).contextmenu(function(event) {
        var x=event.clientX;
        var y=event.clientY-50;
        _this.props.manager.getContextMenu().showContextMenuEmit(x,y);
    });
  }

  componentWillUnmount() {
    this.props.manager.getContextMenu().off("change:hide",this.hideContextMenu);
    this.props.manager.getContextMenu().off("change:show",this.showContextMenu);
  }
  hideContextMenu = ()=>{
    $(this.refs.contextMenu).hide();
  }
  showContextMenu = (x,y)=>{
    let $menu = $(this.refs.contextMenu);
    var width=document.getElementById('desktop').clientWidth;
    var height=document.getElementById('desktop').clientHeight;
    x=(x+$menu.width())>=width?width-$menu.width():x;
    y=(y+$menu.height())>=height?y-$menu.height():y;
    //alert("可视高度："+height+",鼠标高度："+y);
    $menu.css("top",y);
    $menu.css("left",x);
    $menu.show();
  }
  onClickMenuItem = (evt)=>{
    let $li = $(evt.target).closest('li');
    let text = $li.text();
    console.log("onClickMenuItem--:",text,evt);
    switch (text) {
      case "Refresh":
          document.location.reload();
          break;
      case "Line Up To Grid":
          $("#icon_check_lineUptoGrid").toggle();
          if($("#icon_check_lineUptoGrid").is(':visible')) {
            this.props.arrange();
          }
          localStorage.lineUptoGrid = $("#icon_check_lineUptoGrid")[0].style.display;
          break;
      case "Show All Windows":
      case "Hide All Windows":
          this.props.toggleAllWindows();
          break;
      case "Logout":
          if(confirm("Are you should to log out？")){
          }
          break;
      default:
          break;
    }
    this.hideContextMenu();
  }

  render () {
    let bShowAll = true;
    this.props.manager.openWindows_router().map((window)=>{
      if(!window.isMinimize) {
        bShowAll = false;
      }
    });
    return (
      <div ref="contextMenu" className="content-menu">
        <ul onClick={this.onClickMenuItem}>
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
    );
  }
}
export default ContextMenu;
