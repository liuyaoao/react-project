import React from 'react';
import Reflux from 'reflux';
import { LinkContainer } from 'react-router-bootstrap';
import { Button, Row, Col } from 'react-bootstrap';

import { IfPermitted, PageHeader, Spinner } from 'components/common';
import DocumentationLink from 'components/support/DocumentationLink';
import LdapGroupsComponent from 'components/ldap/LdapGroupsComponent';

import DocsHelper from 'util/DocsHelper';
import Routes from 'routing/Routes';

import StoreProvider from 'injection/StoreProvider';
const CurrentUserStore = StoreProvider.getStore('CurrentUser');
const LdapStore = StoreProvider.getStore('Ldap');

const LdapGroupsPage = React.createClass({
  mixins: [Reflux.connect(CurrentUserStore), Reflux.connect(LdapStore)],

  _areGroupsEnabled(ldapSettings) {
    return ldapSettings.group_search_base && ldapSettings.group_search_pattern;
  },

  _getContent() {
    if (!this.state.ldapSettings) {
      return <Spinner/>;
    }
    if (!this.state.ldapSettings.enabled) {
      return (
        <p>
          LDAP未启用，无法编辑LDAP组映射。请在{' '}
          <LinkContainer to={Routes.SYSTEM.LDAP.SETTINGS}><a>LDAP设置</a></LinkContainer>{' '}
          中启用LDAP集成。
        </p>
      );
    }

    if (!this._areGroupsEnabled(this.state.ldapSettings)) {
      return (
        <p>
          所需的LDAP配置未设置，请检查{' '}
          <LinkContainer to={Routes.SYSTEM.LDAP.SETTINGS}><a>LDAP配置设置</a></LinkContainer>{' '}
          以启用组映射。
        </p>
      );
    }

    return <LdapGroupsComponent/>;
  },

  render() {
    return (
      <span>
        <PageHeader title="LDAP组映射">
          <span>映射LDAP组到DeepLOG角色</span>

          <span>
            没有定义的LDAP组将使用你的{' '}
            <LinkContainer to={Routes.SYSTEM.LDAP.SETTINGS}><a>LDAP设置</a></LinkContainer>{' '}
            中的默认设置。{' '}
            更多关于它的信息请阅读：<DocumentationLink page={DocsHelper.PAGES.USERS_ROLES} text="documentation"/>.
          </span>

          <span>
            <IfPermitted permissions="LDAP_EDIT">
              <LinkContainer to={Routes.SYSTEM.LDAP.SETTINGS}>
                <Button bsStyle="info">配置LDAP</Button>
              </LinkContainer>
            </IfPermitted>
            &nbsp;
            <IfPermitted permissions="USERS_LIST">
              <LinkContainer to={Routes.SYSTEM.USERS.LIST}>
                <Button bsStyle="info">管理用户</Button>
              </LinkContainer>
            </IfPermitted>
          </span>
        </PageHeader>

        <Row className="content">
          <Col md={8}>
            {this._getContent()}
          </Col>
        </Row>
      </span>
    );
  },
});

export default LdapGroupsPage;
