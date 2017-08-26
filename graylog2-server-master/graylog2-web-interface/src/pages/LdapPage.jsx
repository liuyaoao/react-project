import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import DocsHelper from 'util/DocsHelper';
import Routes from 'routing/Routes';

import { IfPermitted, PageHeader } from 'components/common';
import DocumentationLink from 'components/support/DocumentationLink';
import LdapComponent from 'components/ldap/LdapComponent';

const LdapPage = React.createClass({
  render() {
    return (
      <span>
        <PageHeader title="LDAP设置">
          <span>此页面是你需要建立DeepLOG LDAP集成的唯一资源。 你可以测试你的LDAP服务器的连接，甚至可以马上尝试使用你选择的LDAP账户进行登录。</span>

          <span>更过关于LDAP配置的信息请阅读 <DocumentationLink page={DocsHelper.PAGES.USERS_ROLES} text="documentation"/>。</span>

          <span>
            <IfPermitted permissions="LDAPGROUPS_EDIT">
              <LinkContainer to={Routes.SYSTEM.LDAP.GROUPS}>
                <Button bsStyle="info">LDAP组映射</Button>
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
          <Col md={12}>
            <LdapComponent />
          </Col>
        </Row>
      </span>
    );
  },
});

export default LdapPage;
