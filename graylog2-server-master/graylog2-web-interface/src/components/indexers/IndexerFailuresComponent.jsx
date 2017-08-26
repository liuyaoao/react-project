import React from 'react';
import { Alert, Button, Col, Row } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import numeral from 'numeral';
import moment from 'moment';

import StoreProvider from 'injection/StoreProvider';
const IndexerFailuresStore = StoreProvider.getStore('IndexerFailures');

import DocsHelper from 'util/DocsHelper';
import Routes from 'routing/Routes';

import { Spinner } from 'components/common';
import { SmallSupportLink, DocumentationLink } from 'components/support';

const IndexerFailuresComponent = React.createClass({
  getInitialState() {
    return {};
  },
  componentDidMount() {
    const since = moment().subtract(24, 'hours');

    IndexerFailuresStore.count(since).then((response) => {
      this.setState({total: response.count});
    });
  },
  _formatFailuresSummary() {
    return (
      <Alert bsStyle={this.state.total === 0 ? 'success' : 'danger'}>
        <i className={'fa fa-' + this._iconForFailureCount(this.state.total)} /> {this._formatTextForFailureCount(this.state.total)}

        <LinkContainer to={Routes.SYSTEM.INDICES.FAILURES}>
          <Button bsStyle="info" bsSize="xs" className="pull-right">
            显示错误
          </Button>
        </LinkContainer>
      </Alert>
    );
  },
  _formatTextForFailureCount(count) {
    if (count === 0) {
      return '过去24小时内没有失败的索引故障发生';
    }
    return <strong>在过去24小时内有 {numeral(count).format('0,0')} 个索引故障发生</strong>;
  },
  _iconForFailureCount(count) {
    if (count === 0) {
      return 'check-circle';
    }
    return 'ambulance';
  },
  render() {
    if (this.state.total === undefined) {
      return <Spinner />;
    }
    return (
      <Row className="content">
        <Col md={12}>
          <h2><i className="fa fa-truck" /> Elastic Search索引器故障</h2>

          <SmallSupportLink>
			每个没有被成功编入索引的信息都会被标记为一个索引器故障。
          </SmallSupportLink>

          {this._formatFailuresSummary()}

        </Col>
      </Row>
    );
  },
});

export default IndexerFailuresComponent;
