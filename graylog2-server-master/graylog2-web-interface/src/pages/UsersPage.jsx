import React from 'react';
import Reflux from 'reflux';
import { Row, Col, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import DocsHelper from 'util/DocsHelper';
import PermissionsMixin from 'util/PermissionsMixin';
import Routes from 'routing/Routes';

import StoreProvider from 'injection/StoreProvider';
const CurrentUserStore = StoreProvider.getStore('CurrentUser');

import PageHeader from 'components/common/PageHeader';
import DocumentationLink from 'components/support/DocumentationLink';
import UserList from 'components/users/UserList';

const UsersPage = React.createClass({
  mixins: [Reflux.connect(CurrentUserStore), PermissionsMixin],
  render() {
    const permissions = this.state.currentUser.permissions;
    // TODO: fix permission names
    return (
      <span>
        <PageHeader title="用户帐户">
          <span>创建任意数量的用户在这默认管理员用户旁边。 您也可以配置LDAP和更改已经存在的用户。</span>

          <span>更多关于用户管理的信息请阅读 <DocumentationLink page={DocsHelper.PAGES.USERS_ROLES} text="documentation"/>。</span>
          <span>
            {this.isPermitted(permissions, 'LDAP_EDIT') &&
              <LinkContainer to={Routes.SYSTEM.LDAP.SETTINGS}>
                <Button bsStyle="info">配置LDAP</Button>
              </LinkContainer>
            }
            {' '}
            {this.isPermitted(permissions, 'LDAPGROUPS_EDIT') &&
              <LinkContainer to={Routes.SYSTEM.LDAP.GROUPS}>
                <Button bsStyle="info">LDAP组映射</Button>
              </LinkContainer>
            }
            {' '}
            {this.isPermitted(permissions, 'USERS_CREATE') &&
              <LinkContainer to={Routes.SYSTEM.USERS.CREATE}>
                <Button bsStyle="success">添加新用户</Button>
              </LinkContainer>
            }
          </span>
        </PageHeader>

        <Row className="content">
          <Col md={12}>
            <UserList currentUsername={this.state.currentUser.username} currentUser={this.state.currentUser}/>
          </Col>
        </Row>
      </span>
    );
  },
});

export default UsersPage;
