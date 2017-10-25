
var _ = require('lodash');
import $ from 'jquery';
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
// var classSet = require('react/addons').addons.classSet;
import classSet from 'react-classset';
import WindowModel from '../models/window';
var INACTIVE = 0;
var MOVE     = 1;
var RESIZE   = 2;
var RESIZE_EW = 3;
var RESIZE_NS = 4;
var bodyWidth = document.documentElement.clientWidth / 2, bodyHeight = (document.documentElement.clientHeight - 50) / 2;

class Window extends Component{
  propTypes= {
    window: React.PropTypes.instanceOf(WindowModel).isRequired,
    offset: React.PropTypes.object.isRequired
  }

  componentWillMount() {
    this.window = this.props.window;
  }

  componentDidMount() {
    this.window.on('change', this.forceUpdate, this);
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  }

  componentDidUpdate() {
    var _this = this;
    setTimeout(function(){
      if(_this.isMounted()) {
        ReactDOM.findDOMNode(_this).style.transition = 'box-shadow 0.15s ease';
      }
    }, 500);
  }

  componentWillUpdate(nextProps, nextState) {
    var _this = this;
    if(_this.window.isMinimize) {
      ReactDOM.findDOMNode(_this).style.transition = 'all 0.3s ease';
    }
  }

  componentWillUnmount() {
    this.window.off('change', this.forceUpdate);
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  }

  quickUpdate() {
    var self = this;
    requestAnimationFrame(function () {
      var el = ReactDOM.findDOMNode(self);
      el.style.width  = self.window.width + 'px';
      el.style.height = self.window.height + 'px';
      el.style.top    = self.window.y + 'px';
      el.style.left   = self.window.x + 'px';
      el.style.opacity= self.window.opacity;
      self.props.setWindowSize({width: el.style.width, height:el.style.height});
      switch (self.window.id) {
        case "photo":
        case "video":
        case "music":
        case "file":
        case "phone_photo":
        case "phone_video":
        case "phone_music":
        case "phone_file":
        case "settings-2":
          if(!self.window.isMinimize && (self.window.mode == RESIZE || self.window.mode == RESIZE_EW || self.window.mode == RESIZE_NS)) {
            self.props.setWindowSizeChange({windowId: self.window.id, flag: true});
          }
          break;
        default:
          break;
      }
    });
  }

  preventDefault(e) {
    e.preventDefault();
    return false;
  }

  handlePropagation(e) {
    if (!(e.ctrlKey || e.metaKey || e.altKey || e.button !== 0)){
      this.focus();
      e.stopPropagation();
    }
  }

  handleResize (e) {
    this.focus();
    var mouse = this.convertPoints(e);
    this.window.startResize(mouse.x, mouse.y);
    e.stopPropagation();
  }

  handleResize_ew (e) {
    this.focus();
    var mouse = this.convertPoints(e);
    this.window.startResize_ew(mouse.x, mouse.y);
    e.stopPropagation();
  }

  handleResize_ns (e) {
    this.focus();
    var mouse = this.convertPoints(e);
    this.window.startResize_ns(mouse.x, mouse.y);
    e.stopPropagation();
  }

  handleMove (e) {
    e.preventDefault();
    this.focus();
    var mouse = this.convertPoints(e);
    this.window.startMove(mouse.x, mouse.y);
    ReactDOM.findDOMNode(this.refs.content).children[0].focus();
  }

  handleMouseMove (e) {
    if (this.window.mode === INACTIVE) { return true; }
    var mouse = this.convertPoints(e);
    this.window.update(mouse.x, mouse.y);
    this.quickUpdate();
  }

  handleMouseUp () {
    this.window.endChange();
    this.props.setWindowSizeChange({windowId: this.window.id, flag: false});
  }

  focus () {
    this.window.requestFocus();
  }

  close () {
    this.window.requestFocus();
    this.window.close();
    if(this.window.id == "my-phone") {
      this.window.x = bodyWidth - this.window.width / 2, this.window.y = bodyHeight - this.window.height / 2;
    }
  }

  maximize () {
    ReactDOM.findDOMNode(this).style.transition = 'all 0.3s ease';
    this.window.requestFocus();
    if(!this.window.isMaximize) {
      this.window.maximize();
      // e.target.className = "max fa fa-window-restore";
      $('.n-resize').hide();
      $('.s-resize').hide();
      $('.e-resize').hide();
      $('.w-resize').hide();
      $('.nw-resize').hide();
      $('.ne-resize').hide();
      $('.sw-resize').hide();
      $('.se-resize').hide();
    }
    else {
      this.window.maximize_restore();
      // e.target.className = "max fa fa-window-maximize";
      $('.n-resize').show();
      $('.s-resize').show();
      $('.e-resize').show();
      $('.w-resize').show();
      $('.nw-resize').show();
      $('.ne-resize').show();
      $('.sw-resize').show();
      $('.se-resize').show();
    }
    this.quickUpdate();
    this.props.setWindowSizeChange({windowId: this.window.id, flag: true});
    this.window.endChange();
    setTimeout(function(){
      this.props.setWindowSizeChange({windowId: this.window.id, flag: false});
    }.bind(this), 300);
  }

  minimize () {
    ReactDOM.findDOMNode(this).style.transition = 'all 0.3s ease';
    this.window.requestFocus();
    this.window.minimize($('#taskbar-'+this.window.id).offset().left + 16 + $('#taskbar-'+this.window.id).width()/2, 0);
    this.quickUpdate();
    // this.window.hide();
    // this.window.endChange();
  }

  convertPoints (e) {
    return {
      x: e.clientX - this.props.offset.left,
      y: e.clientY - this.props.offset.top
    };
  }

  render () {
    var classes = classSet({
      window: true,
      active: this.window.isFocused()
    });

    var styles = {
      top:     this.window.y < 0 ? 0 : this.window.y,
      left:    this.window.x,
      width:   this.window.width,
      height:  this.window.height,
      zIndex:  this.window.index,
      opacity: this.window.opacity
    };

    return (
      /* jshint ignore: start */
      <div id={"window-"+this.window.id} className={classes} style={styles} onMouseDown={this.handleMove}>
        <header className='window-caption '>
          <span className="window-caption-icon">{this.window.icon.substr(0,7)=="images/" ? <img src={this.window.icon}/> : <span className={this.window.icon}></span>}</span>
          <span className='window-caption-title' title={this.window.title} style={{maxWidth:this.window.width-11-20-27*3}}>{this.window.title}</span>
          <span className='min' onMouseDown={this.handlePropagation} onClick={this.minimize}>
            <svg x="0px" y="0px" viewBox="0 0 10.2 1" data-radium="true" style={{width: "10px", height: "10px"}}><rect width="10.2" height="1"></rect></svg>
          </span>
          <span className='max' onMouseDown={this.handlePropagation} onClick={this.maximize}>
            {!this.window.isMaximize ? <svg x="0px" y="0px" viewBox="0 0 10.2 10.1" data-radium="true" style={{width: "10px", height: "10px"}}><path d="M0,0v10.1h10.2V0H0z M9.2,9.2H1.1V1h8.1V9.2z"></path></svg>
              : <svg x="0px" y="0px" viewBox="0 0 10.2 10.2" data-radium="true" style={{width: "10px", height: "10px"}}><path d="M2.1,0v2H0v8.1h8.2v-2h2V0H2.1z M7.2,9.2H1.1V3h6.1V9.2z M9.2,7.1h-1V2H3.1V1h6.1V7.1z"></path></svg>}
          </span>
          <span className='close' onMouseDown={this.handlePropagation} onClick={this.close}>
            <svg x="0px" y="0px" viewBox="0 0 10.2 10.2" data-radium="true" style={{width: "10px", height: "10px"}}><polygon points="10.2,0.7 9.5,0 5.1,4.4 0.7,0 0,0.7 4.4,5.1 0,9.5 0.7,10.2 5.1,5.8 9.5,10.2 10.2,9.5 5.8,5.1 "></polygon></svg>
          </span>
        </header>
        <div className='content' onMouseDown={this.handlePropagation} ref='content'>
          {this.window.component}
        </div>
        <div className='resize n-resize' onMouseDown={this.handleResize_ns} />
        <div className='resize s-resize' onMouseDown={this.handleResize_ns} />
        <div className='resize e-resize' onMouseDown={this.handleResize_ew} />
        <div className='resize w-resize' onMouseDown={this.handleResize_ew} />
        <div className='resize nw-resize' onMouseDown={this.handleResize} />
        <div className='resize ne-resize' onMouseDown={this.handleResize} />
        <div className='resize sw-resize' onMouseDown={this.handleResize} />
        <div className='resize se-resize' onMouseDown={this.handleResize} />
      </div>
      /* jshint ignore: end */
    );
  }
}

export default Window;
