
import _ from 'lodash';
var signals = require('signals');

var INACTIVE = 0;
var MOVE = 1;

let Icon = function (props) {
  signals.convert(this);

  _.extend(this, _.defaults(_.clone(props), this.defaults));
  this.mode = INACTIVE;

  if (this.id === undefined) {
    throw new Error('All icons must have an id');
  }
};

_.extend(Icon.prototype, {


  /**
   * defaults
   */

  defaults: {
    id: undefined,
    type: 'router',
    x: 0,
    y: 0,
    // width: 80,
    // height: 80,
    title: '',
    iconUrl: '',
    isOpen: true
  },


  /**
   * set position of the icon
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
   * resize the icon
   * - width (number)
   * - height (number)
   */

  // setSize: function (width, height) {
  //   this.width = width;
  //   this.height = height;
  //   this.emit('change:size');
  //   this.emit('change');
  // },

  /**
   * start moving the icon
   * - x (number) : horizontal position of the mouse
   * - y (number) : vertical position of the mouse
   */

  startMove: function (x, y) {
    this.mode = MOVE;
    this._offsetX = x - this.x;
    this._offsetY = y - this.y;
  },

  /**
   * update a move action
   * - x (number) : horizontal position of the mouse
   * - y (number) : vertical position of the mouse
   */

  update: function (x, y) {
    if (this.mode === MOVE) { return this._move(x, y); }
  },


  /**
   * finish moving the icon
   */

  endChange: function () {
    if (this.mode === INACTIVE) { return; }
    this.mode = INACTIVE;

    if (this.mode === MOVE) {
      delete this._offsetX;
      delete this._offsetY;
    }

    this.emit('change:position');
    this.emit('change');
  },


  /**
   * open the icon
   */

  open: function () {
    if (this.isOpen) { return; }
    this.isOpen = true;
    this.emit('change:open');
    this.emit('change');
  },

  /**
   * close the icon
   */

  close: function () {
    if (! this.isOpen) { return; }
    this.isOpen = false;
    this.manager.remove_icon(this);
    this.emit('change:open');
    this.emit('change');
  },

  /*
   * rename the icon
   * - title (string)
   */

  // rename: function (title) {
  //   this.title = title;
  //   this.emit('change:title');
  //   this.emit('change');
  // },

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
      // width:      this.width,
      // height:     this.height,
      title:      this.title,
      iconUrl:    this.iconUrl,
      isOpen:     this.isOpen
    };
  },



  /**
   * private
   * move the icon to a point
   * - x (number) : horizontal position of the mouse
   * - y (number) : vertical position of the mouse
   */

  _move: function (x, y) {
    this.x = x - this._offsetX;
    this.y = y - this._offsetY;
  }

});

export default Icon;
