import React, {PropTypes} from 'react';
import { NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import DocsHelper from 'util/DocsHelper';
import Routes from 'routing/Routes';

const HelpMenu = React.createClass({
  propTypes: {
    active: PropTypes.bool.isRequired,
  },
  render() {
    return (
      <NavDropdown navItem title="帮助" id="user-menu-dropdown" active={this.props.active}>
        <LinkContainer to={Routes.getting_started(true)}>
          <MenuItem>入门指南</MenuItem>
        </LinkContainer>
        <MenuItem href={DocsHelper.versionedDocsHomePage()} target="blank">
          <i className="fa fa-external-link"></i> 文档
        </MenuItem>
      </NavDropdown>
    );
  },
});

export default HelpMenu;
