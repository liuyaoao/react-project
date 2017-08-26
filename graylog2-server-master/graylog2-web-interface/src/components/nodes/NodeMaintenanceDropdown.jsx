import React, {PropTypes} from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { ButtonGroup, DropdownButton, MenuItem } from 'react-bootstrap';

import { IfPermitted } from 'components/common';

import Routes from 'routing/Routes';

const NodeMaintenanceDropdown = React.createClass({
  propTypes: {
    node: PropTypes.object.isRequired,
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
  render() {
    return (
      <ButtonGroup>
        <DropdownButton bsStyle="info" bsSize="lg" title="操作" id="node-maintenance-actions" pullRight>
          <IfPermitted permissions="threads:dump">
            <LinkContainer to={Routes.SYSTEM.THREADDUMP(this.props.node.node_id)}>
              <MenuItem>获取线程转储</MenuItem>
            </LinkContainer>
          </IfPermitted>

          <LinkContainer to={Routes.SYSTEM.METRICS(this.props.node.node_id)}>
            <MenuItem>程序调用详情</MenuItem>
          </LinkContainer>

          <IfPermitted permissions="loggers:read">
            <LinkContainer to={Routes.SYSTEM.LOGGING}>
              <MenuItem>配置内部登录</MenuItem>
            </LinkContainer>
          </IfPermitted>

        </DropdownButton>
      </ButtonGroup>
    );
  },
});

export default NodeMaintenanceDropdown;
