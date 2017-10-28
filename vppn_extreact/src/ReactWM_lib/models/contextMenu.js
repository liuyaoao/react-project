
import _ from 'lodash';
var signals = require('signals');

let ContextMenuModel = function (props) {
  signals.convert(this);
  _.extend(this, _.defaults(_.clone(props), this.defaults));
  if (this.id === undefined) {
    throw new Error('All contextMenu must have an id');
  }
};

_.extend(ContextMenuModel.prototype, {
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
    title: ''
  },

});

export default ContextMenuModel;
