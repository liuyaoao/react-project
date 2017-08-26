import React from 'react';
import { ButtonGroup, DropdownButton, MenuItem } from 'react-bootstrap';

import ActionsProvider from 'injection/ActionsProvider';
const DeflectorActions = ActionsProvider.getActions('Deflector');
const IndexRangesActions = ActionsProvider.getActions('IndexRanges');

import StoreProvider from 'injection/StoreProvider';
const DeflectorStore = StoreProvider.getStore('Deflector'); // eslint-disable-line no-unused-vars

const IndicesMaintenanceDropdown = React.createClass({
  _onRecalculateIndexRange() {
    if (window.confirm('这将触发后台系统的工作。继续吗？')) {
      IndexRangesActions.recalculate();
    }
  },
  _onCycleDeflector() {
    if (window.confirm('真的手动循环导流？遵循本页的文档链接，以了解更多。')) {
      DeflectorActions.cycle();
    }
  },
  render() {
    return (
      <ButtonGroup>
        <DropdownButton bsStyle="info" bsSize="lg" title="维护" id="indices-maintenance-actions" pullRight>
          <MenuItem eventKey="1" onClick={this._onRecalculateIndexRange}>重新计算指标范围</MenuItem>
          <MenuItem eventKey="2" onClick={this._onCycleDeflector}>手动循环导流</MenuItem>
        </DropdownButton>
      </ButtonGroup>
    );
  },
});

export default IndicesMaintenanceDropdown;
