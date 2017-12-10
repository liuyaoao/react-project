
var _ = require('lodash');
import $ from 'jquery';
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import classSet from 'react-classset';
// import { TabPanel, Container,Grid,Column  } from '@extjs/ext-react';
import {WIN_MODE} from '../models/Constants';
import WindowModel from '../models/window';
import Intl from '../../intl/Intl';

var bodyWidth = document.documentElement.clientWidth / 2, bodyHeight = (document.documentElement.clientHeight - 50) / 2;

//窗口的框架容器
class Window extends Component{
  state={
  }
  componentWillMount() {
    this.hasMounted = true;
    this.window = this.props.windowModel;
    this.windowModel = this.props.windowModel;
  }

  componentDidMount() {
    this.windowModel.on('change', this.forceUpdate, this);
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  }
  componentWillReceiveProps(nextProps){
    // console.log('views window will receive props.......');
  }

  componentDidUpdate() {
    var _this = this;
    setTimeout(function(){
      if(_this.hasMounted) {
        ReactDOM.findDOMNode(_this).style.transition = 'box-shadow 0.15s ease';
      }
    }, 500);
  }

  componentWillUpdate(nextProps, nextState) {
    var _this = this;
    if(_this.windowModel.isMinimize) {
      ReactDOM.findDOMNode(_this).style.transition = 'all 0.3s ease';
    }
  }

  componentWillUnmount() {
    this.hasMounted = false;
    this.windowModel.off('change', this.forceUpdate);
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  }

  quickManualUpdate() { //手动更新窗口的有关样式。
    var self = this;
    requestAnimationFrame(function () {
      var el = ReactDOM.findDOMNode(self);
      el.style.width  = self.windowModel.width + 'px';
      el.style.height = self.windowModel.height + 'px';
      el.style.top    = self.windowModel.y + 'px';
      el.style.left   = self.windowModel.x + 'px';
      el.style.opacity= self.windowModel.opacity;
      self.props.setWindowSize({width: el.style.width, height:el.style.height});

      let isResize = (self.window.mode == WIN_MODE.RESIZE || self.window.mode == WIN_MODE.RESIZE_EW || self.window.mode == WIN_MODE.RESIZE_NS);
      if(!self.window.isMinimize && isResize) {
        self.props.setWindowSizeChange({windowId: self.window.id, flag: true});
      }

    });
  }

  handlePropagation = (e)=>{
    if (!(e.ctrlKey || e.metaKey || e.altKey || e.button !== 0)){
      this.focus();
      // e.stopPropagation();
    }
  }

  handleResize = (e)=>{
    this.focus();
    var mouse = this.convertPoints(e);
    this.window.startResize(mouse.x, mouse.y);
    e.stopPropagation();
  }

  handleResize_ew = (e)=>{
    this.focus();
    var mouse = this.convertPoints(e);
    this.window.startResize_ew(mouse.x, mouse.y);
    e.stopPropagation();
  }

  handleResize_ns = (e)=>{
    this.focus();
    var mouse = this.convertPoints(e);
    this.window.startResize_ns(mouse.x, mouse.y);
    e.stopPropagation();
  }

  onWindowHeaderMouseDown = (e)=>{
    e.preventDefault();
    // console.log("window header mouse down......");
    this.window.opacity = 0.4;
    this.focus();
    var mouse = this.convertPoints(e);
    this.window.startMove(mouse.x, mouse.y);
    ReactDOM.findDOMNode(this.refs.content).children[0].focus();
  }

  handleMouseMove = (e)=>{
    if (this.window.mode === WIN_MODE.INACTIVE) { return true; }
    console.log("mouse move!!!!!!");
    //窗口移动时设置成半透明
    this.window.mode == WIN_MODE.MOVE ? $("#window-"+this.window.id+' .content')[0].style.opacity = '0.01' : null;
    var mouse = this.convertPoints(e);
    this.window.update(mouse.x, mouse.y);
    this.quickManualUpdate();
  }

  handleMouseUp = ()=>{
    if(this.window.mode != WIN_MODE.INACTIVE){

      this.window.opacity = 1;
      this.window.endChange();
      console.log("mouse up on window=====");
      $("#window-"+this.window.id)[0].style.opacity = '1';
      $("#window-"+this.window.id+' .content')[0].style.opacity = '1';
      this.props.setWindowSizeChange({windowId: this.window.id, flag: false});
    }
  }

  focus () {
    this.window.requestFocus();
  }

  close = ()=>{
    this.window.requestFocus();
    this.window.close();
    if(this.window.id == "my-phone") {
      this.window.x = bodyWidth - this.window.width / 2, this.window.y = bodyHeight - this.window.height / 2;
    }
  }

  maximize = ()=>{
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
    this.quickManualUpdate();
    this.props.setWindowSizeChange({windowId: this.window.id, flag: true});
    this.window.endChange();
    setTimeout(function(){
      this.props.setWindowSizeChange({windowId: this.window.id, flag: false});
    }.bind(this), 300);
  }

  minimize = ()=>{
    ReactDOM.findDOMNode(this).style.transition = 'all 0.3s ease';
    this.window.requestFocus();
    this.window.minimize($('#taskbar-'+this.window.id).offset().left + 16 + $('#taskbar-'+this.window.id).width()/2, 0);
    this.quickManualUpdate();
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
      <div id={"window-"+this.windowModel.id} className={classes} style={styles} >
        <header className='window-caption' onMouseDown={this.onWindowHeaderMouseDown}>
          <span className="window-caption-icon">{this.window.icon.substr(0,7)=="images/" ? <img src={this.window.icon}/> : <span className={this.window.icon}></span>}</span>
          <span className='window-caption-title' title={this.window.title} style={{maxWidth:this.window.width-11-20-27*3}}>{Intl.get(this.window.title)}</span>
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
          {this.windowModel.component}
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

Window.propTypes= {
  windowModel: React.PropTypes.instanceOf(WindowModel).isRequired,
  offset: React.PropTypes.object.isRequired
}

export default Window;
