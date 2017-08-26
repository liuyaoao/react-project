import React, {PropTypes} from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';

import { IfPermitted } from 'components/common';
import StreamForm from './StreamForm';
import PermissionsMixin from 'util/PermissionsMixin';

import StoreProvider from 'injection/StoreProvider';
const StartpageStore = StoreProvider.getStore('Startpage');

const StreamControls = React.createClass({
  propTypes: {
    stream: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    onDelete: PropTypes.func.isRequired,
    onClone: PropTypes.func.isRequired,
    onQuickAdd: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
  },
  mixins: [PermissionsMixin],
  getInitialState() {
    return {};
  },
  componentDidMount() {
    //hover时 dropdown显示
    var hoverTimeout;
    $('.dropdown').hover(function() {
        clearTimeout(hoverTimeout);
        $(this).addClass('open');
    }, function() {
        var $self = $(this);
        hoverTimeout = setTimeout(function() {
            $self.removeClass('open');
        }, 50);
    });
  },
  _onDelete(event) {
    event.preventDefault();
    this.props.onDelete(this.props.stream);
  },
  _onEdit(event) {
    event.preventDefault();
    this.refs.streamForm.open();
  },
  _onClone(event) {
    event.preventDefault();
    this.refs.cloneForm.open();
  },
  _onCloneSubmit(_, stream) {
    this.props.onClone(this.props.stream.id, stream);
  },
  _onQuickAdd(event) {
    event.preventDefault();
    this.props.onQuickAdd(this.props.stream.id);
  },
  _setStartpage(event) {
    event.preventDefault();
    StartpageStore.set(this.props.user.username, 'stream', this.props.stream.id);
  },
  render() {
    const stream = this.props.stream;

    return (
      <span>
          <DropdownButton title="更多操作" ref="dropdownButton" pullRight
                          id={`more-actions-dropdown-${stream.id}`}>
            <IfPermitted permissions={`streams:edit:${stream.id}`}>
              <MenuItem key={`editStreams-${stream.id}`} onSelect={this._onEdit}>编辑消息流</MenuItem>
            </IfPermitted>
            <IfPermitted permissions={`streams:edit:${stream.id}`}>
              <MenuItem key={`quickAddRule-${stream.id}`} onSelect={this._onQuickAdd}>快速添加规则</MenuItem>
            </IfPermitted>
            <IfPermitted permissions={['streams:create', `streams:read:${stream.id}`]}>
              <MenuItem key={`cloneStream-${stream.id}`} onSelect={this._onClone}>克隆这个消息流</MenuItem>
            </IfPermitted>
            <MenuItem key={`setAsStartpage-${stream.id}`} onSelect={this._setStartpage} disabled={this.props.user.read_only}>
              设为起始页
            </MenuItem>
            <IfPermitted permissions={`streams:edit:${stream.id}`}>
              <MenuItem key={`divider-${stream.id}`} divider/>
            </IfPermitted>
            <IfPermitted permissions={`streams:edit:${stream.id}`}>
              <MenuItem key={`deleteStream-${stream.id}`} onSelect={this._onDelete}>
                删除这个消息流
              </MenuItem>
            </IfPermitted>
          </DropdownButton>
          <StreamForm ref="streamForm" title="编辑消息流" onSubmit={this.props.onUpdate} stream={stream}/>
          <StreamForm ref="cloneForm" title="克隆消息流" onSubmit={this._onCloneSubmit}/>
      </span>
    );
  },
});

export default StreamControls;
