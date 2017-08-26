import React from 'react';
import { Row, Col } from 'react-bootstrap';

import DocsHelper from 'util/DocsHelper';

import PageHeader from 'components/common/PageHeader';
import DocumentationLink from 'components/support/DocumentationLink';
import RolesComponent from 'components/users/RolesComponent';

const RolesPage = React.createClass({
  render() {
    return (
      <span>
        <PageHeader title="角色">
          <span>
            角色绑定可同时分配给多个用户的权限
          </span>

          <span>
            更多关于DeepLOG角色的信息请阅读 <DocumentationLink page={DocsHelper.PAGES.USERS_ROLES} text="documentation"/>。
          </span>
        </PageHeader>

        <Row className="content">
          <Col md={12}>
            <RolesComponent />
          </Col>
        </Row>
      </span>
    );
  },
});

export default RolesPage;
