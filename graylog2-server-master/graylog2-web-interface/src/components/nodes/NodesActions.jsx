import React, {PropTypes} from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';
import URI from 'urijs';

import { IfPermitted } from 'components/common';

import StoreProvider from 'injection/StoreProvider';
const SystemProcessingStore = StoreProvider.getStore('SystemProcessing');
const SystemLoadBalancerStore = StoreProvider.getStore('SystemLoadBalancer');
const SystemShutdownStore = StoreProvider.getStore('SystemShutdown');

import Routes from 'routing/Routes';

const NodesActions = React.createClass({
  propTypes: {
    node: PropTypes.object.isRequired,
    systemOverview: PropTypes.object.isRequired,
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
  _toggleMessageProcessing() {
    if (confirm(`您将 ${this.props.systemOverview.is_processing ? '暂停' : '继续'} 这个节点的消息进程。您确定吗？`)) {
      if (this.props.systemOverview.is_processing) {
        SystemProcessingStore.pause(this.props.node.node_id);
      } else {
        SystemProcessingStore.resume(this.props.node.node_id);
      }
    }
  },
  _changeLBStatus(status) {
    return () => {
			var state = status=="ALIVE"?"存活":"死亡";
      if (confirm("您将修改这个节点的加载平衡器状态至 "+state+" 。您确定吗?")) {
        SystemLoadBalancerStore.override(this.props.node.node_id, status);
      }
    };
  },
  _shutdown() {
    if (prompt('您确定要关闭此节点吗？输入 "SHUTDOWN" 以确定。') === 'SHUTDOWN') {
      SystemShutdownStore.shutdown(this.props.node.node_id);
    }
  },
  render() {
    const apiBrowserURI = new URI(`${this.props.node.transport_address}/api-browser`).normalizePathname();
    return (
      <div className="item-actions">
        <LinkContainer to={Routes.SYSTEM.NODES.SHOW(this.props.node.node_id)}>
          <Button bsStyle="info">详情</Button>
        </LinkContainer>

        <LinkContainer to={Routes.SYSTEM.METRICS(this.props.node.node_id)}>
          <Button bsStyle="info">程序调用详情</Button>
        </LinkContainer>

        <DropdownButton title="更多操作" id={`more-actions-dropdown-${this.props.node.node_id}`} pullRight>
          <IfPermitted permissions="processing:changestate">
            <MenuItem onSelect={this._toggleMessageProcessing}>
              {this.props.systemOverview.is_processing ? '暂停' : '继续'} 消息进程
            </MenuItem>
          </IfPermitted>

          <IfPermitted permissions="lbstatus:change">
            <li className="dropdown-submenu left-submenu">
              <a href="#">重置加载平衡器状态</a>
              <ul className="dropdown-menu">
                <MenuItem onSelect={this._changeLBStatus('ALIVE')}>存活</MenuItem>
                <MenuItem onSelect={this._changeLBStatus('DEAD')}>死亡</MenuItem>
              </ul>
            </li>
          </IfPermitted>

          <IfPermitted permissions="node:shutdown">
            <MenuItem onSelect={this._shutdown}>优雅地关闭</MenuItem>
          </IfPermitted>

          <IfPermitted permissions={['processing:changestate', 'lbstatus:change', 'node:shutdown']} anyPermissions>
            <IfPermitted permissions={['inputs:read', 'threads:dump']} anyPermissions>
              <MenuItem divider/>
            </IfPermitted>
          </IfPermitted>

          <IfPermitted permissions="inputs:read">
            <LinkContainer to={Routes.node_inputs(this.props.node.node_id)}>
              <MenuItem>本地消息输入值</MenuItem>
            </LinkContainer>
          </IfPermitted>
          <IfPermitted permissions="threads:dump">
            <LinkContainer to={Routes.SYSTEM.THREADDUMP(this.props.node.node_id)}>
              <MenuItem>获取线程转储</MenuItem>
            </LinkContainer>
          </IfPermitted>
        </DropdownButton>
      </div>
    );
  },
});

export default NodesActions;
