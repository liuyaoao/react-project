
var _ = require('lodash');
import $ from 'jquery';
import React,{Component} from 'react';
import ReactDOM from 'react-dom';

import ManagerModel from '../models/manager';
// var WindowModel = require('../models/window');
import IconModel from '../models/icon';
import Settings from '../../settings';

var INACTIVE = 0;
var MOVE     = 1;
var RESIZE   = 2;

var bodyWidth = document.documentElement.clientWidth / 2, bodyHeight = (document.documentElement.clientHeight - 50) / 2;

class Icon extends Component{

  propTypes= {
    manager: React.PropTypes.instanceOf(ManagerModel).isRequired,
    // window: React.PropTypes.instanceOf(WindowModel).isRequired,
    icon: React.PropTypes.instanceOf(IconModel).isRequired,
    offset: React.PropTypes.object.isRequired
  }

  componentWillMount () {
    this.icon = this.props.icon;
  }

  componentDidMount () {
    // console.log(ReactDOM.findDOMNode(this))
    this.icon.on('change', this.forceUpdate, this);
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
    ReactDOM.findDOMNode(this).addEventListener('mousemove', this.handleIconMouseMove);
    ReactDOM.findDOMNode(this).addEventListener('mouseout', this.handleIconMouseOut);
    ReactDOM.findDOMNode(this).addEventListener('dblclick', this.handleIconDblClick);
  }

  // componentDidUpdate: function() {
  //   var _this = this;
  //   setTimeout(function(){
  //     _ReactDOM.findDOMNode(this).style.transition = 'box-shadow 0.15s ease';
  //   }, 500);
  // },

  componentWillUnmount () {
    this.icon.off('change', this.forceUpdate);
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
    ReactDOM.findDOMNode(this).removeEventListener('mousemove', this.handleIconMouseMove);
    ReactDOM.findDOMNode(this).removeEventListener('mouseout', this.handleIconMouseOut);
    ReactDOM.findDOMNode(this).removeEventListener('dblclick', this.handleIconDblClick);
  }

  quickUpdate () {
    var self = this;
    requestAnimationFrame(function () {
      var el = ReactDOM.findDOMNode(self);
      // el.style.width  = self.icon.width + 'px';
      // el.style.height = self.icon.height + 'px';
      el.style.top    = self.icon.y + 'px';
      el.style.left   = self.icon.x + 'px';
    });

    var position=this.getPosition();

    if($("#icon_check_lineUptoGrid")[0].style.display == "block" || $("#icon_check_lineUptoGrid")[0].style.display == "inline") {
      // var icons = this.props.manager.allIcons();
      var icons;
      if(this.props.desktopType == "router") {
        icons = this.props.manager.allIcons_router();
      }
      else if(this.props.desktopType == "phone") {
        icons = this.props.manager.allIcons_phone();
      }
      for(var i = 0; i < icons.length; i++) {
        if(this.icon.id != icons[i].id) {
          if(this.icon.x+position.width/2 >= icons[i].x-position.padding.left/2 && this.icon.x+position.width/2 < icons[i].x+position.width+position.padding.left/2
          && ((this.icon.y+position.height/2 >= icons[i].y-position.padding.top && this.icon.y+position.height/2 < icons[i].y+position.height/2)
          || (this.icon.y+position.height/2 < 0 && icons[i].y == 0))) {
            $("#icon_position_line")[0].style.left = icons[i].x + 'px';
            $("#icon_position_line")[0].style.top = icons[i].y - position.padding.top + 'px';
            $("#icon_position_line").show();
            break;
          }
          else if(this.icon.x+position.width/2 >= icons[i].x-position.padding.left/2 && this.icon.x+position.width/2 < icons[i].x+position.width+position.padding.left/2
          && ((this.icon.y+position.height/2 >= icons[i].y+position.height/2 && this.icon.y+position.height/2 < icons[i].y+position.height+position.padding.bottom)
          || (this.icon.y+position.height/2 >= icons[i].y+position.height+position.padding.bottom && icons[i].y >= position.parent.height-2*position.bottom))) {
            $("#icon_position_line")[0].style.left = icons[i].x + 'px';
            $("#icon_position_line")[0].style.top = icons[i].y + position.height + position.padding.bottom + 'px';
            $("#icon_position_line").show();
            break;
          }
          else {
            $("#icon_position_line").hide();
          }
        }
      }
    }
  }

  quickUpdate_snaptogrid () {
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

    var bAboveOrUnderIcon = false;
    // var icons = this.props.manager.allIcons();
    var icons;
    if(this.props.desktopType == "router") {
      icons = this.props.manager.allIcons_router();
    }
    else if(this.props.desktopType == "phone") {
      icons = this.props.manager.allIcons_phone();
    }
    for(var i = 0; i < icons.length; i++) {
      if(this.icon.id != icons[i].id) {
        if(this.icon.x+position.width/2 >= icons[i].x-position.padding.left/2 && this.icon.x+position.width/2 < icons[i].x+position.width+position.padding.left/2
        && this.icon.y+position.height/2 >= icons[i].y-position.padding.top && this.icon.y+position.height/2 < icons[i].y+position.height/2) {
          bAboveOrUnderIcon = true;
          position.x = icons[i].x;
          position.y = icons[i].y;
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
          this.icon.setPosition(position.x, position.y);
          var self = this;
          requestAnimationFrame(function () {
            var el = ReactDOM.findDOMNode(self);
            el.style.top    = self.icon.y + 'px';
            el.style.left   = self.icon.x + 'px';
          });
          var bForward = this.getIconMoveDirection(this.icon, this.icon.x, this.icon.y);
          this.quickUpdate_overlapped(this.icon, this.icon.x, this.icon.y, bForward);
          break;
        }
        else if(this.icon.x+position.width/2 >= icons[i].x-position.padding.left/2 && this.icon.x+position.width/2 < icons[i].x+position.width+position.padding.left/2
        && this.icon.y+position.height/2 >= icons[i].y+position.height/2 && this.icon.y+position.height/2 < icons[i].y+position.height+position.padding.bottom) {
          bAboveOrUnderIcon = true;
          position.x = icons[i].x;
          position.y = icons[i].y+position.height+position.padding.top+position.padding.bottom;
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
          this.icon.setPosition(position.x, position.y);
          var self = this;
          requestAnimationFrame(function () {
            var el = ReactDOM.findDOMNode(self);
            el.style.top    = self.icon.y + 'px';
            el.style.left   = self.icon.x + 'px';
          });
          var bForward = this.getIconMoveDirection(this.icon, this.icon.x, this.icon.y);
          this.quickUpdate_overlapped(this.icon, this.icon.x, this.icon.y, bForward);
          break;
        }
      }
    }

    if(!bAboveOrUnderIcon) {
      for(var i = 0; ; i++) {
        if(i*(position.width+position.padding.left) > position.parent.width-(position.width+position.padding.left)) break;
        for(var j = 0; ; j++) {
          if(j*(position.height+position.padding.top+position.padding.bottom) > position.parent.height-position.bottom) break;
          if(this.icon.x+position.width/2 >= i*(position.width+position.padding.left) && this.icon.x+position.width/2 < (i+1)*(position.width+position.padding.left)) {
            if(this.icon.y+position.height/2 >= j*(position.height+position.padding.top+position.padding.bottom) && this.icon.y+position.height/2 < (j+1)*(position.height+position.padding.top+position.padding.bottom)) {
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
              this.icon.setPosition(position.x, position.y);
              var self = this;
              requestAnimationFrame(function () {
                var el = ReactDOM.findDOMNode(self);
                el.style.top    = self.icon.y + 'px';
                el.style.left   = self.icon.x + 'px';
              });
              var bForward = this.getIconMoveDirection(this.icon, this.icon.x, this.icon.y);
              this.quickUpdate_overlapped(this.icon, this.icon.x, this.icon.y, bForward);
              break;
            }
            else if(this.icon.y+position.height/2 < 0) {
              position.x = i*(position.width+position.padding.left);
              position.y = 0;
              this.icon.setPosition(position.x, position.y);
              var self = this;
              requestAnimationFrame(function () {
                var el = ReactDOM.findDOMNode(self);
                el.style.top    = self.icon.y + 'px';
                el.style.left   = self.icon.x + 'px';
              });
              var bForward = this.getIconMoveDirection(this.icon, this.icon.x, this.icon.y);
              this.quickUpdate_overlapped(this.icon, this.icon.x, this.icon.y, bForward);
              break;
            }
            else if(this.icon.y+position.height/2 >= position.parent.height-position.bottom) {
              var flag = false;
              for(var k = 0; k < icons.length; k++) {
                if(this.icon.id != icons[k].id && icons[k].x == i*(position.width+position.padding.left) && icons[k].y < position.parent.height-position.bottom && icons[k].y >= position.parent.height-2*position.bottom) {
                  flag = true;
                }
              }
              position.x = i*(position.width+position.padding.left) + (flag ? position.width+position.padding.left : 0);
              position.y = flag ? 0 : maxY;
              if(flag && position.x > maxX) {
                position.x = maxX;
                position.y = maxY;
              }
              this.icon.setPosition(position.x, position.y);
              var self = this;
              requestAnimationFrame(function () {
                var el = ReactDOM.findDOMNode(self);
                el.style.top    = self.icon.y + 'px';
                el.style.left   = self.icon.x + 'px';
              });
              var bForward = this.getIconMoveDirection(this.icon, this.icon.x, this.icon.y);
              this.quickUpdate_overlapped(this.icon, this.icon.x, this.icon.y, bForward);
              break;
            }
          }
          else if (this.icon.x+position.width/2 < 0) {
            if(this.icon.y+position.height/2 >= j*(position.height+position.padding.top+position.padding.bottom) && this.icon.y+position.height/2 < (j+1)*(position.height+position.padding.top+position.padding.bottom)) {
              position.x = 0;
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
              this.icon.setPosition(position.x, position.y);
              var self = this;
              requestAnimationFrame(function () {
                var el = ReactDOM.findDOMNode(self);
                el.style.top    = self.icon.y + 'px';
                el.style.left   = self.icon.x + 'px';
              });
              var bForward = this.getIconMoveDirection(this.icon, this.icon.x, this.icon.y);
              this.quickUpdate_overlapped(this.icon, this.icon.x, this.icon.y, bForward);
              break;
            }
            else if(this.icon.y+position.height/2 < 0) {
              position.x = 0;
              position.y = 0;
              this.icon.setPosition(position.x, position.y);
              var self = this;
              requestAnimationFrame(function () {
                var el = ReactDOM.findDOMNode(self);
                el.style.top    = self.icon.y + 'px';
                el.style.left   = self.icon.x + 'px';
              });
              var bForward = this.getIconMoveDirection(this.icon, this.icon.x, this.icon.y);
              this.quickUpdate_overlapped(this.icon, this.icon.x, this.icon.y, bForward);
              break;
            }
            else if(this.icon.y+position.height/2 >= position.parent.height-position.bottom) {
              var flag = false;
              for(var k = 0; k < icons.length; k++) {
                if(this.icon.id != icons[k].id && icons[k].x == 0 && icons[k].y < position.parent.height-position.bottom && icons[k].y >= position.parent.height-2*position.bottom) {
                  flag = true;
                }
              }
              position.x = 0 + (flag ? position.width+position.padding.left : 0);
              position.y = flag ? 0 : maxY;
              if(flag && position.x > maxX) {
                position.x = maxX;
                position.y = maxY;
              }
              this.icon.setPosition(position.x, position.y);
              var self = this;
              requestAnimationFrame(function () {
                var el = ReactDOM.findDOMNode(self);
                el.style.top    = self.icon.y + 'px';
                el.style.left   = self.icon.x + 'px';
              });
              var bForward = this.getIconMoveDirection(this.icon, this.icon.x, this.icon.y);
              this.quickUpdate_overlapped(this.icon, this.icon.x, this.icon.y, bForward);
              break;
            }
          }
          else if (this.icon.x > position.parent.width-(position.width/2+position.padding.left)) {
            if(this.icon.y+position.height/2 >= j*(position.height+position.padding.top+position.padding.bottom) && this.icon.y+position.height/2 < (j+1)*(position.height+position.padding.top+position.padding.bottom)) {
              position.x = maxX;
              position.y = j*(position.height+position.padding.top+position.padding.bottom);
              if(position.y>=position.parent.height-position.bottom){
          			position.y=maxY;
          		}
              this.icon.setPosition(position.x, position.y);
              var self = this;
              requestAnimationFrame(function () {
                var el = ReactDOM.findDOMNode(self);
                el.style.top    = self.icon.y + 'px';
                el.style.left   = self.icon.x + 'px';
              });
              var bForward = this.getIconMoveDirection(this.icon, this.icon.x, this.icon.y);
              this.quickUpdate_overlapped(this.icon, this.icon.x, this.icon.y, bForward);
              break;
            }
            else if(this.icon.y+position.height/2 < 0) {
              position.x = maxX;
              position.y = 0;
              this.icon.setPosition(position.x, position.y);
              var self = this;
              requestAnimationFrame(function () {
                var el = ReactDOM.findDOMNode(self);
                el.style.top    = self.icon.y + 'px';
                el.style.left   = self.icon.x + 'px';
              });
              var bForward = this.getIconMoveDirection(this.icon, this.icon.x, this.icon.y);
              this.quickUpdate_overlapped(this.icon, this.icon.x, this.icon.y, bForward);
              break;
            }
            else if(this.icon.y+position.height/2 >= position.parent.height-position.bottom) {
              position.x = maxX;
              position.y = maxY;
              this.icon.setPosition(position.x, position.y);
              var self = this;
              requestAnimationFrame(function () {
                var el = ReactDOM.findDOMNode(self);
                el.style.top    = self.icon.y + 'px';
                el.style.left   = self.icon.x + 'px';
              });
              var bForward = this.getIconMoveDirection(this.icon, this.icon.x, this.icon.y);
              this.quickUpdate_overlapped(this.icon, this.icon.x, this.icon.y, bForward);
              break;
            }
          }
        }
      }
    }
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
    position.height=$(ReactDOM.findDOMNode(this)).height()+2;
    position.width=$(ReactDOM.findDOMNode(this)).width()+2;
    position.bottom=position.height+position.padding.top+position.padding.bottom;
    return position;
  }

  preventDefault (e) {
    e.preventDefault();
    return false;
  }

  handleMove (e) {
    e.preventDefault();
    this.focus();
    var mouse = this.convertPoints(e);
    this.icon.startMove(mouse.x, mouse.y);
    // this.refs.content.getDOMNode().children[0].focus();
  }

  handleMouseMove (e) {
    if (this.icon.mode === INACTIVE) { return true; }
    $(ReactDOM.findDOMNode(this))[0].style.zIndex = "1";
    var mouse = this.convertPoints(e);
    this.icon.update(mouse.x, mouse.y);
    this.quickUpdate();
  }

  handleMouseUp (e) {
    if(this.icon.mode != INACTIVE) {
      $(ReactDOM.findDOMNode(this))[0].style.zIndex = "";
      $("#icon_position_line").hide();
      if($("#icon_check_lineUptoGrid")[0].style.display == "block" || $("#icon_check_lineUptoGrid")[0].style.display == "inline") {
        this.quickUpdate_snaptogrid();
      }
    }
    this.icon.endChange();
  }

  handleIconMouseMove (e) {
    $(ReactDOM.findDOMNode(this)).addClass("icons-move");
  }

  handleIconMouseOut (e) {
    $(ReactDOM.findDOMNode(this)).removeClass("icons-move");
  }

  handleIconDblClick () {
    // alert("double click " + this.icon.title);
    if(this.icon.id == "phone_disconnect") {
      // $(document.body).css("background-image", "url(../images/bj.jpg)");
      // this.props.setDesktopType("router");
      // var phoneWindows = this.props.manager.openWindows_phone();
      // while (phoneWindows.length) {
      //   this.props.manager.remove(phoneWindows[0]);
      //   phoneWindows = this.props.manager.openWindows_phone();
      // }
      showMetroDialog('#phoneDisDialog');
    }
    else {
      var options = {
        title: this.icon.title,
        width: 1000,
        height: 570,
        x: 20,
        y: 20,
        icon: this.icon.iconUrl
      }
      switch (this.icon.id) {
        case 'my-phone':
          options.width = 480, options.height = 320;
          // options.minWidth = 480, options.minHeight = 320;
          // options.maxWidth = 480, options.minHeight = 320;
          break;
        case 'phone_file':
        case 'phone_photo':
        case 'phone_music':
        case 'phone_video':
          options.type = 'phone';
          break;
        default:
          break;
      }
      options.x = bodyWidth - options.width / 2, options.y = bodyHeight - options.height / 2;
      this.props.manager.open(this.icon.id, <Settings id={this.icon.id} manager={this.props.manager}/>, options);
    }
  }

  focus () {
    // this.window.requestFocus();
    $(".icons li").removeClass("icons-focus");
		$(ReactDOM.findDOMNode(this)).addClass("icons-focus");
  }

  close () {
    // this.window.requestFocus();
    this.window.close();
  }
  convertPoints (e) {
    return {
      x: e.clientX - this.props.offset.left,
      y: e.clientY - this.props.offset.top
    };
  }

  render () {
    var styles = {
      top:     this.icon.y,
      left:    this.icon.x,
      // width:   this.icon.width,
      // height:  this.icon.height
    };
    return (
      /* jshint ignore: start */
      <li id={"icon-"+this.icon.id} style={styles} onMouseDown={this.handleMove}>
        <img src={this.icon.iconUrl}/>
        <div className="icon-text">{this.icon.title}</div>
      </li>
      /* jshint ignore: end */
    );
  }

}

export default Icon;
