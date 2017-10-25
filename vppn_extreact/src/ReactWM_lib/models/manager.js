
var _ = require('lodash');
var signals = require('signals');
import Window from './window';
import Icon from './icon';

var INITIAL_INDEX = 1;

var Manager =  function (windows, icons) {
  signals.convert(this);

  this._windows = {};
  this._index = INITIAL_INDEX;
  this._active = false;

  this._icons = {};

  if (_.isArray(windows)) {
    windows.forEach(this.add, this);
  }

  if (_.isArray(icons)) {
    icons.forEach(this.add_icon, this);
  }

  this._resetIndex();
};

_.extend(Manager.prototype, {


  /**
   * get a window by it's id
   * - id (string) : window id
   */

  get: function (id) {
    return this._windows[id];
  },


  /**
   * check if a window exists in this manager
   * - window (window|string)
   */

  has: function (window) {
    var id = _.isObject(window) ? window.id : window;
    return this._windows.hasOwnProperty(id);
  },


  /**
   * add a window
   * - window (Window|object)
   */

  add: function (window) {
    if (!(window instanceof Window)) { window = new Window(window); }
    window.manager = this;

    this._windows[window.id] = window;
    this.focus(window);

    window.on('change:open', function () {
      this.emit('change');
    }, this);

    window.on('change:show', function () {
      this.emit('change');
    }, this);

    window.on('change', function () {
      this.emit('change:windows');
    }, this);

    this.emit('add', window);
    this.emit('change');

    return window;
  },


  /**
   * remove a window
   * - window (Window|string)
   */

  remove: function (window) {
    var id = _.isObject(window) ? window.id : window;
    window = this.get(id);

    if (! window) {
      throw new Error('Can not remove a window that it cannot find: ' + id);
    }

    delete this._windows[id];

    this.emit('remove', window);
    this.emit('change');

    return window;
  },


  /**
   * open a window
   * - id (string)
   * - component (React)
   * - defaults (object)
   */

  open: function (id, component, defaults) {
    if (! defaults) { defaults = {}; }
    defaults.id = id;

    var window = this.has(id) ? this.get(id) : this.add(defaults);
    window.setComponent(component);
    if(!window.isMinimize) {
      window.open();
      // window.show();
    }
    else {
      window.show();
      window.open();
    }
    this.focus(window);

    return window;
  },


  /**
   * count how many windows are open
   * > int
   */

  length: function () {
    return _.keys(this._windows).length;
  },


  /**
   * focus on a window
   * - window (Window|string)
   */

  focus: function (id) {
    if(id == null) {
      this._active = false;
      this.emit('change');
    }
    else {
      var window = _.isObject(id) ? id : this.get(id);

      if (! window) {
        throw new Error('Can not focus on a window it cannot find: ' + id);
      } else if (window === this._active) {
        // this window already has focus
        return;
      }

      window.setIndex(this._index);
      this._index += 1;
      this._active = window;
      this.emit('change');
    }
  },

  focus_notChangeIndex: function (id) {
    if(id == null) {
      this._active = false;
      this.emit('change');
    }
    else {
      var window = _.isObject(id) ? id : this.get(id);

      if (! window) {
        throw new Error('Can not focus on a window it cannot find: ' + id);
      } else if (window === this._active) {
        // this window already has focus
        return;
      }

      // window.setIndex(this._index);
      // this._index += 1;
      this._active = window;
      this.emit('change');
    }
  },

  /**
   * get the active window
   */

  active: function () {
    return this._active;
  },


  /**
   * get all windows (open and closed)
   */

  allWindows: function () {
    return _.values(this._windows);
  },


  /**
   * get all open windows
   * > array
   */

  openWindows: function () {
    return this.allWindows().filter(function (window) {
      return window.isOpen;
    });
  },

  /**
   * get all open router windows
   * > array
   */

  openWindows_router: function () {
    return this.allWindows().filter(function (window) {
      return window.isOpen && window.type=="router";
    });
  },

  /**
   * get all open phone windows
   * > array
   */

  openWindows_phone: function () {
    return this.allWindows().filter(function (window) {
      return window.isOpen && window.type=="phone";
    });
  },

  /**
   * get all show windows
   * > array
   */

  // showWindows: function () {
  //   return this.allWindows().filter(function (window) {
  //     return window.isShow;
  //   });
  // },

  /**
   * get a icon by it's id
   * - id (string) : icon id
   */

  get_icon: function (id) {
    return this._icons[id];
  },


  /**
   * check if a icon exists in this manager
   * - icon (icon|string)
   */

  has_icon: function (icon) {
    var id = _.isObject(icon) ? icon.id : icon;
    return this._icons.hasOwnProperty(id);
  },


  /**
   * add a icon
   * - icon (Window|object)
   */

  add_icon: function (icon) {
    if (!(icon instanceof Icon)) { icon = new Icon(icon); }
    icon.manager = this;

    this._icons[icon.id] = icon;
    // this.focus(icon);

    icon.on('change:open', function () {
      this.emit('change');
    }, this);

    icon.on('change', function () {
      this.emit('change:icons');
    }, this);

    this.emit('add', icon);
    this.emit('change');

    return icon;
  },


  /**
   * remove a icon
   * - icon (Window|string)
   */

  remove_icon: function (icon) {
    var id = _.isObject(icon) ? icon.id : icon;
    icon = this.get_icon(id);

    if (! icon) {
      throw new Error('Can not remove a icon that it cannot find: ' + id);
    }

    delete this._icons[id];

    this.emit('remove', icon);
    this.emit('change');

    return icon;
  },


  /**
   * open a icon
   * - id (string)
   * - defaults (object)
   */

  open_icon: function (id, defaults) {
    if (! defaults) { defaults = {}; }
    defaults.id = id;

    var icon = this.has_icon(id) ? this.get_icon(id) : this.add_icon(defaults);
    icon.open();
    // this.focus(icon);

    return icon;
  },


  /**
   * count how many icons are show
   * > int
   */

  length_icon: function () {
    return _.keys(this._icons).length;
  },

  /**
   * get all icons
   */

  allIcons: function () {
    return _.values(this._icons);
  },

  /**
   * get all router icons
   */

  allIcons_router: function () {
    return this.allIcons().filter(function (icon) {
      return icon.type=="router";
    });
  },

  /**
   * get all phone icons
   */

  allIcons_phone: function () {
    return this.allIcons().filter(function (icon) {
      return icon.type=="phone";
    });
  },


  /**
   * get all open icons
   * > array
   */

  openIcons: function () {
    return this.allIcons().filter(function (icon) {
      return icon.isOpen;
    });
  },


  /**
   * export as a standard JS array
   * > object
   */

  toJSON: function () {
    // return this.allWindows().map(function (window) {
    //   return window.toJSON();
    // });
    var windows = this.allWindows().map(function (window) {
      return window.toJSON();
    });
    var icons = this.allIcons().map(function (icon) {
      return icon.toJSON();
    });
    return ({
      windows: windows,
      icons: icons
    })
  },


  /**
   * export as a JSON string
   * > string
   */

  toString: function () {
    return JSON.stringify(this);
  },


  /**
   * private: reset window index to 0
   */

  _resetIndex: function () {
    this._index = INITIAL_INDEX;
    _.sortBy(this.allWindows(), 'index').forEach(function (window) {
      window.setIndex(this._index);
      this._index += 1;
      if(!window.isMinimize) {
        this._active = window;
      }
    }, this);
  }

});

export default Manager;
