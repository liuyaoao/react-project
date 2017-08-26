import React from 'react';
import Immutable from 'immutable';

import { Tabs, Tab, Button, ButtonGroup } from 'react-bootstrap';

import TableList from '../common/TableList';

const PermissionSelector = React.createClass({
  propTypes: {
    onChange: React.PropTypes.func,
    streams: React.PropTypes.object,
    dashboards: React.PropTypes.object,
    permissions: React.PropTypes.object,
  },

  render() {
    const streamItemButtons = (stream) => {
      const isRead = this.props.permissions.contains(`streams:read:${stream.id}`);
      const isEdit = this.props.permissions.contains(`streams:edit:${stream.id}`);
      return (<ButtonGroup bsSize="small">
        <Button bsStyle={isRead ? 'info' : 'default'} onClick={() => this._toggleStreamReadPermissions(stream)}
                active={isRead}>允许读取</Button>
        <Button bsStyle={isEdit ? 'info' : 'default'} onClick={() => this._toggleStreamEditPermissions(stream)}
                active={isEdit}>允许编辑</Button>
      </ButtonGroup>);
    };

    const multiStreamButtons = (streamIds) => {
      return (
        <div className="pull-right" style={{marginTop: 10, marginBottom: 10}}>
          <Button bsSize="xsmall" bsStyle="info" onClick={() => this._toggleAllStreamsRead(streamIds)}>切换读取权限</Button>
          &nbsp;
          <Button bsSize="xsmall" bsStyle="info" onClick={() => this._toggleAllStreamsEdit(streamIds)}>切换编辑权限</Button>
        </div>
      );
    };

    const dashboardItemButtons = (dashboard) => {
      const isRead = this.props.permissions.contains(`dashboards:read:${dashboard.id}`);
      const isEdit = this.props.permissions.contains(`dashboards:edit:${dashboard.id}`);
      return (<ButtonGroup bsSize="small">
        <Button bsStyle={isRead ? 'info' : 'default'} onClick={() => this._toggleDashboardReadPermissions(dashboard)}
                active={isRead}>允许读取</Button>
        <Button bsStyle={isEdit ? 'info' : 'default'} onClick={() => this._toggleDashboardEditPermissions(dashboard)}
                active={isEdit}>允许编辑</Button>
      </ButtonGroup>);
    };

    const multiDashboardButtons = (dashboardIds) => {
      return (
        <div className="pull-right" style={{marginTop: 10, marginBottom: 10}}>
          <Button bsSize="xsmall" bsStyle="info" onClick={() => this._toggleAllDashboardsRead(dashboardIds)}>切换读取权限</Button>
          &nbsp;
          <Button bsSize="xsmall" bsStyle="info" onClick={() => this._toggleAllDashboardsEdit(dashboardIds)}>切换编辑权限</Button>
        </div>
      );
    };

    return (
      <div>
        <Tabs defaultActiveKey={1} animation={false}>
          <Tab eventKey={1} title="消息流">
            <div style={{marginTop: 10}}>
              <TableList
                items={this.props.streams}
                filterLabel="过滤消息流"
                filterKeys={['title']}
                itemActionsFactory={streamItemButtons}
                headerActionsFactory={multiStreamButtons}
              />
            </div>
          </Tab>
          <Tab eventKey={2} title="仪表板">
            <div style={{marginTop: 10}}>
              <TableList
                items={this.props.dashboards}
                filterLabel="过滤仪表板"
                filterKeys={['title']}
                itemActionsFactory={dashboardItemButtons}
                headerActionsFactory={multiDashboardButtons}
              />
            </div>
          </Tab>
        </Tabs>
      </div>
    );
  },

  /*
   * onClick actions for single edits
   */
  _toggleStreamReadPermissions(stream) {
    this._toggleReadPermissions('streams', Immutable.Set.of(stream.id));
  },

  _toggleStreamEditPermissions(stream) {
    this._toggleEditPermissions('streams', Immutable.Set.of(stream.id));
  },

  _toggleDashboardReadPermissions(dashboard) {
    this._toggleReadPermissions('dashboards', Immutable.Set.of(dashboard.id));
  },

  _toggleDashboardEditPermissions(dashboard) {
    this._toggleEditPermissions('dashboards', Immutable.Set.of(dashboard.id));
  },

  /*
   * onClick actions for bulk edits
   */

  _toggleAllStreamsRead(streamIds) {
    this._toggleReadPermissions('streams', streamIds);
  },

  _toggleAllStreamsEdit(streamIds) {
    this._toggleEditPermissions('streams', streamIds);
  },

  _toggleAllDashboardsRead(dashboardIds) {
    this._toggleReadPermissions('dashboards', dashboardIds);
  },

  _toggleAllDashboardsEdit(dashboardIds) {
    this._toggleEditPermissions('dashboards', dashboardIds);
  },

  _toggleReadPermissions(target, idList) {
    let added = Immutable.Set.of();
    let deleted = Immutable.Set.of();

    idList.forEach((id) => {
      const readTarget = target + ':read:' + id;
      const editTarget = target + ':edit:' + id;

      if (this.props.permissions.contains(readTarget)) {
        deleted = deleted.add(readTarget).add(editTarget);
      } else {
        added = added.add(readTarget);
      }
    }, this);
    this.props.onChange(added, deleted);
  },
  _toggleEditPermissions(target, idList) {
    let added = Immutable.Set.of();
    let deleted = Immutable.Set.of();

    idList.forEach((id) => {
      const readTarget = target + ':read:' + id;
      const editTarget = target + ':edit:' + id;

      if (this.props.permissions.contains(editTarget)) {
        deleted = deleted.add(editTarget);
      } else {
        added = added.add(readTarget).add(editTarget);
      }
    }, this);
    this.props.onChange(added, deleted);
  },
});

export default PermissionSelector;
