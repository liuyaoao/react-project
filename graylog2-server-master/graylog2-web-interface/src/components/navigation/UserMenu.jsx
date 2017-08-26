import React from 'react';
import { NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import StoreProvider from 'injection/StoreProvider';
const SessionStore = StoreProvider.getStore('Session');

import ActionsProvider from 'injection/ActionsProvider';
const SessionActions = ActionsProvider.getActions('Session');

import Routes from 'routing/Routes';
import history from 'util/History';

const UserMenu = React.createClass({
  propTypes: {
    loginName: React.PropTypes.string.isRequired,
    fullName: React.PropTypes.string.isRequired,
  },
  onLogoutClicked() {
    SessionActions.logout.triggerPromise(SessionStore.getSessionId()).then(() => {
      history.pushState(null, Routes.STARTPAGE);
    });
  },
  render() {
    return (
      <NavDropdown navItem title={this.props.fullName} id="user-menu-dropdown">
        <LinkContainer to={Routes.SYSTEM.USERS.edit(this.props.loginName)}>
          <MenuItem>编辑资料</MenuItem>
        </LinkContainer>
        <MenuItem divider />
        <MenuItem onSelect={this.onLogoutClicked}><i className="fa fa-sign-out"/> 注销</MenuItem>
      </NavDropdown>
    );
  },
});

export default UserMenu;
