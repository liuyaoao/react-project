// var _ = require('lodash');
import $ from 'jquery';
import React,{Component} from 'react';
import ReactDOM from 'react-dom';

//右键菜单组件
class ContextMenu extends Component{
  componentDidMount() {
  }

  componentWillUnmount() {
  }
  onClickMenuItem = ()=>{

  }

  render () {
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
