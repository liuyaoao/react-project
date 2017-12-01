
import _ from 'lodash';
var signals = require('signals');
import {WIN_MODE} from './Constants';

export default function Window(props) {
  signals.convert(this);

  _.extend(this, _.defaults(_.clone(props), this.defaults));
  this.mode = WIN_MODE.INACTIVE;

  // JSON converts Infinity to null
  if (this.maxWidth === null) { this.maxWidth = Infinity; }
  if (this.maxHeight === null) { this.maxHeight = Infinity; }

  if (this.id === undefined) {
    throw new Error('All windows must have an id');
  }
};

_.extend(Window.prototype, {
  defaults: {
    id: undefined,
    type: 'router',
    x: 0,
    y: 0,
    index: 1,
    width: 0,
    height: 0,
    maxWidth: window.innerWidth,
    minWidth: 200,
    maxHeight: window.innerHeight-30,
    minHeight: 100,
    title: '',
    isOpen: true,
    // isShow: true,
    isMinimize: false,
    showX: 0,
    showY: 0,
    showWidth: 0,
    showHeight: 0,
    opacity: 1,
    component: undefined,
    isMaximize: false,
    restoreX: 0,
    restoreY: 0,
    restoreWidth: 0,
    restoreHeight: 0,
    icon: ''
  },

  /**
   * set position of the window
   * - x (number)
   * - y (number)
   */
  setPosition: function (x, y) {
    this.x = x;
    this.y = y;
    this.emit('change:position');
    this.emit('change');
  },

  /**
   * resize the window
   * - width (number)
   * - height (number)
   */
  setSize: function (width, height) {
    this.width = width;
    this.height = height;
    this.emit('change:size');
    this.emit('change');
  },


  /**
   * set z-index of window
   * - index (int)
   */

  setIndex: function (index) {
    this.index = index;
    this.emit('change:index');
    this.emit('change');
  },


  /**
   * start moving the window
   * - x (number) : horizontal position of the mouse
   * - y (number) : vertical position of the mouse
   */

  startMove: function (x, y) {
    this.mode = WIN_MODE.MOVE;
    this._offsetX = x - this.x;
    this._offsetY = y - this.y;
  },


  /**
   * start resizing the window
   * - x (number) : horizontal position of the mouse
   * - y (number) : vertical position of the mouse
   */

  startResize: function (x, y) {
    this.mode = WIN_MODE.RESIZE;
    this._quad = this._quadrant(x, y);
    this._startX = this.x;
    this._startY = this.y;
    this._startWidth = this.width;
    this._startHeight = this.height;
    this._originX = x;
    this._originY = y;
  },

  startResize_ew: function (x, y) {
    this.mode = WIN_MODE.RESIZE_EW;
    this._quad = this._quadrant(x, y);
    this._startX = this.x;
    // this._startY = this.y;
    this._startWidth = this.width;
    // this._startHeight = this.height;
    this._originX = x;
    // this._originY = y;
  },

  startResize_ns: function (x, y) {
    this.mode = WIN_MODE.RESIZE_NS;
    this._quad = this._quadrant(x, y);
    // this._startX = this.x;
    this._startY = this.y;
    // this._startWidth = this.width;
    this._startHeight = this.height;
    // this._originX = x;
    this._originY = y;
  },


  /**
   * update a move/resize action
   * - x (number) : horizontal position of the mouse
   * - y (number) : vertical position of the mouse
   */

  update: function (x, y) {
    if (this.mode === WIN_MODE.MOVE) { return this._move(x, y); }
    if (this.mode === WIN_MODE.RESIZE) { return this._resize(x, y); }
    if (this.mode === WIN_MODE.RESIZE_EW) { return this._resize_ew(x, y); }
    if (this.mode === WIN_MODE.RESIZE_NS) { return this._resize_ns(x, y); }
  },


  /**
   * finish moving/resizing the window
   */

  endChange: function () {
    if (this.mode === WIN_MODE.INACTIVE) { return; }
    this.mode = WIN_MODE.INACTIVE;

    if (this.mode === WIN_MODE.MOVE) {
      delete this._offsetX;
      delete this._offsetY;
    }

    else if (this.mode === WIN_MODE.RESIZE || this.mode === WIN_MODE.RESIZE_EW || this.mode === WIN_MODE.RESIZE_NS) {
      delete this._quad;
      delete this._startX;
      delete this._startY;
      delete this._startWidth;
      delete this._startHeight;
      delete this._originX;
      delete this._originY;
      this.emit('change:size');
    }

    this.emit('change:position');
    this.emit('change');
  },


  /**
   * open the window
   */

  open: function () {
    this.showX = this.x;
    this.showY = this.y;
    this.showWidth = this.width;
    this.showHeight = this.height;
    if (this.isOpen) { return; }
    this.isOpen = true;
    this.emit('change:open');
    this.emit('change');
  },


  /**
   * close the window
   */

  close: function () {
    if (! this.isOpen) { return; }
    this.isOpen = false;
    // this.manager.remove(this);
    var windows = this.manager.openWindows();
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
    this.emit('change:open');
    this.emit('change');
  },

  /**
   * show the window
   */

  show: function () {
    // if(this.isMinimize) {
      this.isMinimize = false;
      this.x = this.showX;
      this.y = this.showY;
      this.width = this.showWidth;
      this.height = this.showHeight;
      this.opacity = 1;
    // }
    // if (this.isShow) { return; }
    // this.isShow = true;
    // this.emit('change:show');
    this.emit('change');
  },

  /**
   * maximize the window
   */

  maximize: function () {
    this.isMaximize = true;
    this.restoreX = this.x;
    this.restoreY = this.y;
    this.restoreWidth = this.width;
    this.restoreHeight = this.height;
    this.x = 0;
    this.y = 0;
    this.width = window.innerWidth;
    this.height = window.innerHeight-50;
    this.emit('change');
  },

  /**
   * restore the maximize window
   */

  maximize_restore: function () {
    this.isMaximize = false;
    this.x = this.restoreX;
    this.y = this.restoreY;
    this.width = this.restoreWidth;
    this.height = this.restoreHeight;
    this.emit('change');
  },

  /**
   * minimize the window
   */

  minimize: function (left, top) {
    // if (! this.isShow) { return; }
    // this.isShow = false;
    this.isMinimize = true;
    this.showX = this.x;
    this.showY = this.y;
    this.showWidth = this.width;
    this.showHeight = this.height;
    this.x = left;
    this.y = top;
    this.width = 0;
    this.height = 0;
    this.opacity = 0;
    // this.emit('change:show');
    // this.emit('change');
    // this.manager.focus(null);
    var windows = this.manager.openWindows();
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
  },

  minimize_notChangeIndex: function (left, top) {
    this.isMinimize = true;
    this.showX = this.x;
    this.showY = this.y;
    this.showWidth = this.width;
    this.showHeight = this.height;
    this.x = left;
    this.y = top;
    this.width = 0;
    this.height = 0;
    this.opacity = 0;

    var windows = this.manager.openWindows();
    var maxIndex = -1, tmp = -1;
    for(var i = 0; i < windows.length; i++) {
      if(!windows[i].isMinimize && windows[i].index > maxIndex) {
        maxIndex = windows[i].index;
        tmp = i;
      }
    }
    if(tmp == -1) {
      this.manager.focus_notChangeIndex(null);
    }
    else {
      this.manager.focus_notChangeIndex(windows[tmp]);
    }
  },

  minimize_notChangeFocus: function (left, top) {
    this.isMinimize = true;
    this.showX = this.x;
    this.showY = this.y;
    this.showWidth = this.width;
    this.showHeight = this.height;
    this.x = left;
    this.y = top;
    this.width = 0;
    this.height = 0;
    this.opacity = 0;
  },

  /**
   * hide the window
   */

  // hide: function() {
  //   if (! this.isShow) { return; }
  //   this.isShow = false;
  //   this.emit('change:show');
  //   this.emit('change');
  // },

  /**
   * focus the window
   */

  requestFocus: function () {
    if (! this.manager) {
      throw new Error('Cannot focus a window that is not being managed');
    }
    this.manager.focus(this);
  },


  /**
   * check if the window is focused
   */

  isFocused: function () {
    if (! this.manager) { return false; }
    return this.manager.active() === this;
  },


  /*
   * rename the window
   * - title (string)
   */

  rename: function (title) {
    this.title = title;
    this.emit('change:title');
    this.emit('change');
  },


  /*
   * set component
   * - component (React)
   */

  setComponent: function (component) {
    this.component = component;
    this.emit('change:component');
    this.emit('change');
  },


  /**
   * export model as json
   */

  toJSON: function () {
    return {
      id:         this.id,
      type:       this.type,
      x:          this.x,
      y:          this.y,
      index:      this.index,
      width:      this.width,
      height:     this.height,
      maxWidth:   this.maxWidth,
      minWidth:   this.minWidth,
      maxHeight:  this.maxHeight,
      minHeight:  this.minHeight,
      title:      this.title,
      isOpen:     this.isOpen,
      // isShow:     this.isShow,
      isMinimize: this.isMinimize,
      showX:      this.showX,
      showY:      this.showY,
      showWidth:  this.showWidth,
      showHeight: this.showHeight,
      isMaximize: this.isMaximize,
      restoreX:   this.restoreX,
      restoreY:   this.restoreY,
      restoreWidth: this.restoreWidth,
      restoreHeight: this.restoreHeight,
      icon:       this.icon
    };
  },



  /**
   * private
   * move the window to a point
   * - x (number) : horizontal position of the mouse
   * - y (number) : vertical position of the mouse
   */

  _move: function (x, y) {
    this.x = x - this._offsetX;
    this.y = y - this._offsetY;
    if(this.x < 20-this.width) {
      this.x = 20-this.width;
    }
    else if(this.x > window.innerWidth-20) {
      this.x = window.innerWidth-20;
    }

    if(this.y < 0) {
      this.y = 0;
    }
    else if(this.y > window.innerHeight-70) {
      this.y = window.innerHeight-70;
    }
  },


  /**
   * private
   * resize the window by an amount
   * - x (number) : horizontal position of the mouse
   * - y (number) : vertical position of the mouse
   */

  _resize: function (x, y) {
    var deltaX = x - this._originX;
    var deltaY = y - this._originY;

    var finalWidth = this._startWidth + (this._quad.left ? deltaX * -1 : deltaX);
    var finalHeight = this._startHeight + (this._quad.top ? deltaY * -1 : deltaY);

    if (finalWidth > this.maxWidth ) {
      deltaX = this.maxWidth - this._startWidth;
      if (this._quad.left) { deltaX *= -1; }
    } else if (finalWidth < this.minWidth) {
      deltaX = this.minWidth - this._startWidth;
      if (this._quad.left) { deltaX *= -1; }
    }

    if (finalHeight > this.maxHeight) {
      deltaY = this.maxHeight - this._startHeight;
      if (this._quad.top) { deltaY *= -1; }
    } else if (finalHeight < this.minHeight) {
      deltaY = this.minHeight - this._startHeight;
      if (this._quad.top) { deltaY *= -1; }
    }

    if (this._quad.left) {
      this.x = this._startX + deltaX;
      this.width = this._startWidth - deltaX;
    } else {
      this.width = this._startWidth + deltaX;
    }

    if (this._quad.top) {
      this.y = this._startY + deltaY;
      this.height = this._startHeight - deltaY;
    } else {
      this.height = this._startHeight + deltaY;
    }
  },

  _resize_ew: function (x, y) {
    var deltaX = x - this._originX;
    // var deltaY = y - this._originY;

    var finalWidth = this._startWidth + (this._quad.left ? deltaX * -1 : deltaX);
    // var finalHeight = this._startHeight + (this._quad.top ? deltaY * -1 : deltaY);

    if (finalWidth > this.maxWidth ) {
      deltaX = this.maxWidth - this._startWidth;
      if (this._quad.left) { deltaX *= -1; }
    } else if (finalWidth < this.minWidth) {
      deltaX = this.minWidth - this._startWidth;
      if (this._quad.left) { deltaX *= -1; }
    }

    // if (finalHeight > this.maxHeight) {
    //   deltaY = this.maxHeight - this._startHeight;
    //   if (this._quad.top) { deltaY *= -1; }
    // } else if (finalHeight < this.minHeight) {
    //   deltaY = this.minHeight - this._startHeight;
    //   if (this._quad.top) { deltaY *= -1; }
    // }

    if (this._quad.left) {
      this.x = this._startX + deltaX;
      this.width = this._startWidth - deltaX;
    } else {
      this.width = this._startWidth + deltaX;
    }

    // if (this._quad.top) {
    //   this.y = this._startY + deltaY;
    //   this.height = this._startHeight - deltaY;
    // } else {
    //   this.height = this._startHeight + deltaY;
    // }
  },

  _resize_ns: function (x, y) {
    // var deltaX = x - this._originX;
    var deltaY = y - this._originY;

    // var finalWidth = this._startWidth + (this._quad.left ? deltaX * -1 : deltaX);
    var finalHeight = this._startHeight + (this._quad.top ? deltaY * -1 : deltaY);

    // if (finalWidth > this.maxWidth ) {
    //   deltaX = this.maxWidth - this._startWidth;
    //   if (this._quad.left) { deltaX *= -1; }
    // } else if (finalWidth < this.minWidth) {
    //   deltaX = this.minWidth - this._startWidth;
    //   if (this._quad.left) { deltaX *= -1; }
    // }

    if (finalHeight > this.maxHeight) {
      deltaY = this.maxHeight - this._startHeight;
      if (this._quad.top) { deltaY *= -1; }
    } else if (finalHeight < this.minHeight) {
      deltaY = this.minHeight - this._startHeight;
      if (this._quad.top) { deltaY *= -1; }
    }

    // if (this._quad.left) {
    //   this.x = this._startX + deltaX;
    //   this.width = this._startWidth - deltaX;
    // } else {
    //   this.width = this._startWidth + deltaX;
    // }

    if (this._quad.top) {
      this.y = this._startY + deltaY;
      this.height = this._startHeight - deltaY;
    } else {
      this.height = this._startHeight + deltaY;
    }
  },


  /**
   * private
   * find which quadrant of the window the mouse is
   * - x (number) : horizontal position of the mouse
   * - y (number) : vertical position of the mouse
   */

  _quadrant: function (x, y) {
    return {
      top: y < this.y + (this.height / 2),
      left: x < this.x + (this.width / 2)
    };
  }

});
