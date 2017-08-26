import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Routes from 'routing/Routes';

import UserNotification from 'util/UserNotification';

import StoreProvider from 'injection/StoreProvider';
const RolesStore = StoreProvider.getStore('Roles');
const UsersStore = StoreProvider.getStore('Users');

import Spinner from 'components/common/Spinner';
import PageHeader from 'components/common/PageHeader';
import NewUserForm from 'components/users/NewUserForm';

const CreateUsersPage = React.createClass({
  componentDidMount() {
    RolesStore.loadRoles().then(roles => {
      this.setState({roles: roles});
    });
  },
  getInitialState() {
    return {
      roles: undefined,
    };
  },
  _onSubmit(request) {
    request.permissions = [];
    delete request['session-timeout-never'];
    UsersStore.create(request).then((result) => {
      UserNotification.success('用户 ' + request.username + ' 创建成功。', '成功！');
      this.props.history.replaceState(null, Routes.SYSTEM.USERS.LIST);
    }, (error) => {
      UserNotification.error('用户创建失败！', '错误！');
    });
  },
  render() {
    if (!this.state.roles) {
      return <Spinner />;
    }
    return (
      <span>
        <PageHeader title="创建新用户">
          <span>
            使用此页面来创建新的DeepLOG用户。这里创建的用户及其权限不限于只对Web界面，对于您的DeepLOG服务器节点的REST API也是有效的和被需要的。
          </span>
        </PageHeader>
        <Row className="content">
          <Col lg={8}>
            <NewUserForm roles={this.state.roles} onSubmit={this._onSubmit}/>
          </Col>
        </Row>
      </span>
    );
  },
});

export default CreateUsersPage;
