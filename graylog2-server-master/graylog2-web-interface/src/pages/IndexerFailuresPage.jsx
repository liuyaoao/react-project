import React from 'react';
import { Col, Row } from 'react-bootstrap';
import numeral from 'numeral';
import moment from 'moment';

import StoreProvider from 'injection/StoreProvider';
const IndexerFailuresStore = StoreProvider.getStore('IndexerFailures');

import DocsHelper from 'util/DocsHelper';

import { Spinner, PageHeader, PaginatedList } from 'components/common';
import { DocumentationLink } from 'components/support';
import { IndexerFailuresList } from 'components/indexers';

const IndexerFailuresPage = React.createClass({
  getInitialState() {
    return {};
  },
  componentDidMount() {
    IndexerFailuresStore.count(moment().subtract(10, 'years')).then((response) => {
      this.setState({total: response.count});
    });
    this.loadData(1, this.defaultPageSize);
  },
  defaultPageSize: 50,
  loadData(page, size) {
    IndexerFailuresStore.list(size, (page-1)*size).then((response) => {
      this.setState({failures: response.failures});
    });
  },
  _onChangePaginatedList(page, size) {
    this.loadData(page, size);
  },
  render() {
    if (this.state.total === undefined || !this.state.failures) {
      return <Spinner />;
    }
    return (
      <span>
        <PageHeader title="Elastic Search索引器故障">
          <span>
						这个列表显示了发生了索引故障的消息。一个消息的故障说明这个消息虽然已被成功传达至您的DeepLOG，但是在写入Elastcsearch集群的时候出错。请注意这个列表最多显示50MB的数据，所以可能不会显示全部发生过的故障信息。
          </span>

          <span>
						总共收集了{numeral(this.state.total).format('0,0')}个索引器的故障信息。
          </span>
        </PageHeader>
        <Row className="content">
          <Col md={12}>
            <PaginatedList totalItems={this.state.total} onChange={this._onChangePaginatedList} pageSize={this.defaultPageSize}>
              <IndexerFailuresList failures={this.state.failures}/>
            </PaginatedList>
          </Col>
        </Row>
      </span>
    );
  },
});

export default IndexerFailuresPage;
