import React from 'react';
import Reflux from 'reflux';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import naturalSort from 'javascript-natural-sort';

import PermissionsMixin from 'util/PermissionsMixin';
import Routes from 'routing/Routes';

import StoreProvider from 'injection/StoreProvider';
const NotificationsStore = StoreProvider.getStore('Notifications');

import { PluginStore } from 'graylog-web-plugin/plugin';

import GlobalThroughput from 'components/throughput/GlobalThroughput';
import UserMenu from 'components/navigation/UserMenu';
import HelpMenu from 'components/navigation/HelpMenu';

const Navigation = React.createClass({
  propTypes: {
    requestPath: React.PropTypes.string.isRequired,
    loginName: React.PropTypes.string.isRequired,
    fullName: React.PropTypes.string.isRequired,
    permissions: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  },

  mixins: [PermissionsMixin, Reflux.connect(NotificationsStore)],

  componentDidMount() {
    this.interval = setInterval(NotificationsStore.list, this.POLL_INTERVAL);
  },
  componentWillUnmount() {
    clearInterval(this.interval);
  },

  POLL_INTERVAL: 3000,

  _isActive(prefix) {
    return this.props.requestPath.indexOf(prefix) === 0;
  },

  _systemTitle() {
    const prefix = '系统设置';

    if (this._isActive('/system/overview')) {
      return prefix + ' / 概述';
    }
    if (this._isActive('/system/nodes')) {
      return prefix + ' / 节点';
    }
    if (this._isActive('/system/inputs')) {
      return prefix + ' / 输入';
    }
    if (this._isActive('/system/outputs')) {
      return prefix + ' / 输出';
    }
    if (this._isActive('/system/indices')) {
      return prefix + ' / 索引';
    }
    if (this._isActive('/system/logging')) {
      return prefix + ' / 日志';
    }
    if (this._isActive('/system/users')) {
      return prefix + ' / 用户';
    }
    if (this._isActive('/system/roles')) {
      return prefix + ' / 角色';
    }
    if (this._isActive('/system/contentpacks')) {
      return prefix + ' / 内容包';
    }
    if (this._isActive('/system/grokpatterns')) {
      return prefix + ' / Grok表达式';
    }
    if (this._isActive('/system/configurations')) {
      return prefix + ' / 配置';
    }

    const pluginRoute = PluginStore.exports('systemnavigation').filter(route => this._isActive(route.path))[0];
    if (pluginRoute) {
      return prefix + ' / ' + pluginRoute.description;
    }

    return prefix;
  },

  _shouldAddPluginRoute(pluginRoute) {
    return !pluginRoute.permissions || (pluginRoute.permissions && this.isPermitted(this.props.permissions, pluginRoute.permissions));
  },

  render() {
    const logoUrl = require('images/deeplogo.png');//  toplogo.png
    const brand = (
      <LinkContainer to={Routes.STARTPAGE}>
        <a><img src={logoUrl} style={{height: '30px'}}/></a>
      </LinkContainer>);
    // TODO: fix permission names

    let notificationBadge;

    if (this.state.total > 0) {
      notificationBadge = (
        <LinkContainer to={Routes.SYSTEM.OVERVIEW}>
          <span className="badge" style={{backgroundColor: '#ff3b00'}} id="notification-badge">{this.state.total}</span>
        </LinkContainer>
      );
    }

    const pluginNavigations = PluginStore.exports('navigation')
      .sort((route1, route2) => naturalSort(route1.description.toLowerCase(), route2.description.toLowerCase()))
      .map((pluginRoute) => {
        if (this._shouldAddPluginRoute(pluginRoute)) {
          return (
            <LinkContainer key={pluginRoute.path} to={pluginRoute.path}>
              <NavItem>{pluginRoute.description}</NavItem>
            </LinkContainer>
          );
        } else {
          return null;
        }
      });

    const pluginSystemNavigations = PluginStore.exports('systemnavigation')
      .sort((route1, route2) => naturalSort(route1.description.toLowerCase(), route2.description.toLowerCase()))
      .map((pluginRoute) => {
        if (this._shouldAddPluginRoute(pluginRoute)) {
          return (
            <LinkContainer key={pluginRoute.path} to={pluginRoute.path}>
              <NavItem>{pluginRoute.description}</NavItem>
            </LinkContainer>
          );
        } else {
          return null;
        }
      });

    return (
      <Navbar inverse fluid fixedTop>
        <Navbar.Header>
          <Navbar.Brand>{brand}</Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse eventKey={0}>
          <Nav navbar className="main-nav">
            {this.isPermitted(this.props.permissions, ['SEARCHES_ABSOLUTE', 'SEARCHES_RELATIVE', 'SEARCHES_KEYWORD']) &&
              <LinkContainer to={Routes.SEARCH}>
                <NavItem to="search">实时搜索</NavItem>
              </LinkContainer>
            }
            <LinkContainer to={Routes.STREAMS}>
              <NavItem>消息流</NavItem>
            </LinkContainer>

            <LinkContainer to={Routes.DASHBOARDS}>
              <NavItem >实时仪表板</NavItem>
            </LinkContainer>

            {this.isPermitted(this.props.permissions, ['SOURCES_READ']) &&
              <LinkContainer to={Routes.SOURCES}>
                <NavItem>日志源列表</NavItem>
              </LinkContainer>
            }

            <LinkContainer to={Routes.BJCA}>
              <NavItem >日志拓扑图 </NavItem>
            </LinkContainer>
            <LinkContainer to={Routes.BUSINESSFLOWDETAILVIEW} id="businessNav">
              <NavItem >业务错误详情 </NavItem>
            </LinkContainer>
            {/*<LinkContainer to={Routes.BUSINESSWEBERRORDETAILVIEW}>
              <NavItem >Web错误详情 </NavItem>
            </LinkContainer>*/}
            <LinkContainer to={Routes.FILTERSEARCH}>
              <NavItem to="search">Web错误详情</NavItem>
            </LinkContainer>
            {/**
            <LinkContainer to={Routes.ALARMINFO}>
              <NavItem >告警信息 </NavItem>
            </LinkContainer>*/}
            <LinkContainer to={Routes.BUSINESSVIEW}>
              <NavItem >业务性能视图 </NavItem>
            </LinkContainer>

            {pluginNavigations}

            <NavDropdown navItem title={this._systemTitle()} id="system-menu-dropdown">
              <LinkContainer to={Routes.SYSTEM.OVERVIEW}>
                <MenuItem>概述</MenuItem>
              </LinkContainer>
              {this.isPermitted(this.props.permissions, ['CLUSTER_CONFIG_ENTRY_READ']) &&
              <LinkContainer to={Routes.SYSTEM.CONFIGURATIONS}>
                <MenuItem>配置</MenuItem>
              </LinkContainer>
              }
              <LinkContainer to={Routes.SYSTEM.NODES.LIST}>
                <MenuItem>节点</MenuItem>
              </LinkContainer>
              {this.isPermitted(this.props.permissions, ['INPUTS_READ']) &&
                <LinkContainer to={Routes.SYSTEM.INPUTS}>
                  <MenuItem>输入</MenuItem>
                </LinkContainer>
              }
              {this.isPermitted(this.props.permissions, ['OUTPUTS_READ']) &&
                <LinkContainer to={Routes.SYSTEM.OUTPUTS}>
                  <MenuItem>输出</MenuItem>
                </LinkContainer>
              }
              {this.isPermitted(this.props.permissions, ['INDICES_READ']) &&
                <LinkContainer to={Routes.SYSTEM.INDICES.LIST}>
                  <MenuItem>索引</MenuItem>
                </LinkContainer>
              }
              {this.isPermitted(this.props.permissions, ['LOGGERS_READ']) &&
                <LinkContainer to={Routes.SYSTEM.LOGGING}>
                  <MenuItem>日志</MenuItem>
                </LinkContainer>
              }
              {this.isPermitted(this.props.permissions, ['USERS_READ']) &&
                <LinkContainer to={Routes.SYSTEM.USERS.LIST}>
                  <MenuItem>用户</MenuItem>
                </LinkContainer>
              }
              {this.isPermitted(this.props.permissions, ['ROLES_READ']) &&
                <LinkContainer to={Routes.SYSTEM.ROLES}>
                  <MenuItem>角色</MenuItem>
                </LinkContainer>
              }
              {/*{this.isPermitted(this.props.permissions, ['DASHBOARDS_CREATE', 'INPUTS_CREATE', 'STREAMS_CREATE']) &&
              <LinkContainer to={Routes.SYSTEM.CONTENTPACKS.LIST}>
                <MenuItem>内容包</MenuItem>
              </LinkContainer>
              }*/}
              {this.isPermitted(this.props.permissions, ['INPUTS_EDIT']) &&
              <LinkContainer to={Routes.SYSTEM.GROKPATTERNS}>
                <MenuItem>Grok表达式</MenuItem>
              </LinkContainer>
              }
              {pluginSystemNavigations}
            </NavDropdown>
          </Nav>
          {
            /*
            <Nav navbar>
              <NavItem className="notification-badge-link">
                {notificationBadge}
              </NavItem>
            </Nav>
            */
          }

          <Nav navbar pullRight>
            {/* Needed to replace NavItem with `li` and `a` elements to avoid LinkContainer setting NavItem as active */}
            {/* More information here: https://github.com/react-bootstrap/react-router-bootstrap/issues/134 */}
            <li role="presentation" className="">
              <LinkContainer to={Routes.SYSTEM.NODES.LIST}>
                <a>
                  <GlobalThroughput />
                </a>
              </LinkContainer>
            </li>
            {/*<HelpMenu active={this._isActive(Routes.GETTING_STARTED)}/>*/}
            <UserMenu fullName={this.props.fullName} loginName={this.props.loginName}/>
            {/*{typeof(DEVELOPMENT) !== 'undefined' && DEVELOPMENT ?
              <NavItem className="notification-badge-link">
              <span className="badge" style={{backgroundColor: '#ff3b00'}}>DEV</span>
              </NavItem>
              : null}*/}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  },
});

export default Navigation;
