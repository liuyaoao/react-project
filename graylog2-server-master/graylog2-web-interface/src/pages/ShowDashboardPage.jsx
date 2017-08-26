import React from 'react';
import Reflux from 'reflux';
import { Row, Col, Button, Alert } from 'react-bootstrap';
import { PluginStore } from 'graylog-web-plugin/plugin';

import StoreProvider from 'injection/StoreProvider';
const CurrentUserStore = StoreProvider.getStore('CurrentUser');
const DashboardsStore = StoreProvider.getStore('Dashboards');
const FocusStore = StoreProvider.getStore('Focus');
const WidgetsStore = StoreProvider.getStore('Widgets');

import DocsHelper from 'util/DocsHelper';
import UserNotification from 'util/UserNotification';

import { GridsterContainer, PageHeader, Spinner, IfPermitted } from 'components/common';
import PermissionsMixin from 'util/PermissionsMixin';
import DocumentationLink from 'components/support/DocumentationLink';
import EditDashboardModalTrigger from 'components/dashboard/EditDashboardModalTrigger';
import Widget from 'components/widgets/Widget';

const ShowDashboardPage = React.createClass({
  mixins: [Reflux.connect(CurrentUserStore), Reflux.connect(FocusStore), PermissionsMixin],

  getInitialState() {
    return {
      locked: true,
      forceUpdateInBackground: false,
    };
  },
  componentDidMount() {
    this.loadData();
    this.listenTo(WidgetsStore, this.removeWidget);
    this.loadInterval = setInterval(this.loadData, 2000);
  },
  componentWillUnmount() {
    if (this.loadInterval) {
      clearInterval(this.loadInterval);
    }
  },
  DASHBOARDS_EDIT: 'dashboards:edit',
  DEFAULT_HEIGHT: 1,
  DEFAULT_WIDTH: 2,
  loadData() {
    DashboardsStore.get(this.props.params.dashboardId)
      .then((dashboard) => {
        if (this.isMounted()) {
          this.setState({dashboard: dashboard});
        }
      });
  },
  updateUnFocussed() {
    return this.state.currentUser.preferences.updateUnfocussed;
  },
  shouldUpdate() {
    return Boolean(this.updateUnFocussed() || this.state.forceUpdateInBackground || this.state.focus);
  },
  removeWidget(props) {
    if (props.delete) {
      this.loadData();
    }
  },
  emptyDashboard() {
    return (
      <Row className="content">
        <Col md={12}>
          <Alert className="no-widgets">
            这个仪表板没有小部件. 在这个<DocumentationLink
            page={DocsHelper.PAGES.DASHBOARDS} text="文档"/>里学习如何添加部件.
          </Alert>
        </Col>
      </Row>
    );
  },
  _defaultWidgetDimensions(widget) {
    const dimensions = {col: 0, row: 0};

    const widgetPlugin = PluginStore.exports('widgets').filter(plugin => plugin.type.toUpperCase() === widget.type.toUpperCase())[0];
    if (widgetPlugin) {
      dimensions.height = widgetPlugin.defaultHeight;
      dimensions.width = widgetPlugin.defaultWidth;
    } else {
      dimensions.heigh = this.DEFAULT_HEIGHT;
      dimensions.width = this.DEFAULT_WIDTH;
    }

    return dimensions;
  },
  _dashboardIsEmpty(dashboard) {
    return dashboard.widgets.length === 0;
  },
  formatDashboard(dashboard) {
    if (this._dashboardIsEmpty(dashboard)) {
      return this.emptyDashboard();
    }

    const positions = {};
    dashboard.widgets.forEach(widget => {
      positions[widget.id] = dashboard.positions[widget.id] || this._defaultWidgetDimensions(widget);
    });

    const widgets = dashboard.widgets.sort((widget1, widget2) => {
      const position1 = positions[widget1.id];
      const position2 = positions[widget2.id];
      if (position1.col === position2.col) {
        return position1.row - position2.row;
      }

      return position1.col - position2.col;
    }).map((widget) => {
      return (
        <Widget id={widget.id} key={`widget-${widget.id}`} widget={widget} dashboardId={dashboard.id}
                locked={this.state.locked} shouldUpdate={this.shouldUpdate()}/>
      );
    });

    return (
      <Row>
        <div className="dashboard">
          <GridsterContainer ref="gridsterContainer" positions={positions} onPositionsChange={this._onPositionsChange}>
            {widgets}
          </GridsterContainer>
        </div>
      </Row>
    );
  },
  _unlockDashboard(event) {
    event.preventDefault();
    this.setState({locked: false});
  },
  _onUnlock() {
    const locked = !this.state.locked;
    this.setState({locked: locked});

    if (locked) {
      this.refs.gridsterContainer.lockGrid();
    } else {
      this.refs.gridsterContainer.unlockGrid();
    }
  },
  _onPositionsChange(newPositions) {
    DashboardsStore.updatePositions(this.state.dashboard, newPositions);
  },
  _toggleFullscreen() {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  },
  _toggleUpdateInBackground() {
    const forceUpdate = !this.state.forceUpdateInBackground;
    this.setState({forceUpdateInBackground: forceUpdate});
    UserNotification.success('将更新图 ' + (forceUpdate ? 'even' : 'only')
      + ' when the browser is in the ' + (forceUpdate ? 'background' : 'foreground'), '');
      
    UserNotification.success((forceUpdate ? '浏览器界面关闭后，后台仍然更新数据' : '浏览器界面关闭后,后台停止更新数据'));
  },
  render() {
    if (!this.state.dashboard) {
      return <Spinner />;
    }

    const dashboard = this.state.dashboard;

    let actions;
    if (!this._dashboardIsEmpty(dashboard)) {
      actions = (
        <div>
          <Button id="update-unfocussed" bsStyle="info" onClick={this._toggleUpdateInBackground}>
            在{this.state.forceUpdateInBackground ? '前台' : '后台'}更新
          </Button>
          {' '}
          <Button className="toggle-fullscreen" bsStyle="info" onClick={this._toggleFullscreen}>全屏</Button>
          <IfPermitted permissions={`${this.DASHBOARDS_EDIT}:${dashboard.id}`}>
            {' '}
            <Button bsStyle="success" onClick={this._onUnlock}>{this.state.locked ? '解锁 / 编辑' : '锁上'}</Button>
          </IfPermitted>
        </div>
      );
    }

    let supportText;
    if (!this._dashboardIsEmpty(dashboard)) {
      supportText = (
        <IfPermitted permissions={`${this.DASHBOARDS_EDIT}:${dashboard.id}`}>
          <div id="drag-widgets-description">
             通过<a href="#" role="button" onClick={this._unlockDashboard}>
            解锁 / 编辑</a> 模式,将小部件拖到你喜欢的位置
          </div>
        </IfPermitted>
      );
    }

    const dashboardTitle = (
      <span>
        <span data-dashboard-id={dashboard.id} className="dashboard-title">{dashboard.title}</span>
        &nbsp;
        {!this.state.locked && !this._dashboardIsEmpty(dashboard) &&
        <EditDashboardModalTrigger id={dashboard.id} action="edit" title={dashboard.title}
                                   description={dashboard.description} buttonClass="btn-info btn-xs">
          <i className="fa fa-pencil"/>
        </EditDashboardModalTrigger>}
      </span>
    );
    return (
      <span>
        <PageHeader title={dashboardTitle}>
          <span data-dashboard-id={dashboard.id} className="dashboard-description">{dashboard.description}</span>
          {supportText}
          {actions}
        </PageHeader>

        {this.formatDashboard(dashboard)}
        <div className="clearfix"/>
      </span>
    );
  },
});

export default ShowDashboardPage;
