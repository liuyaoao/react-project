import React from 'react';
import Reflux from 'reflux';
import { Col, Row } from 'react-bootstrap';

import StoreProvider from 'injection/StoreProvider';
const SystemJobsStore = StoreProvider.getStore('SystemJobs');

import ActionsProvider from 'injection/ActionsProvider';
const SystemJobsActions = ActionsProvider.getActions('SystemJobs');

import { Spinner } from 'components/common';
import { SystemJobsList } from 'components/systemjobs';

const SystemJobsComponent = React.createClass({
  mixins: [Reflux.connect(SystemJobsStore)],
  componentDidMount() {
    SystemJobsActions.list();

    this.interval = setInterval(2000, SystemJobsActions.list);
  },
  componentWillUnmount() {
    clearInterval(this.interval);
  },
  render() {
    if (!this.state.jobs) {
      return <Spinner />;
    }
    const jobs = Object.keys(this.state.jobs).map((nodeId) => this.state.jobs[nodeId].jobs).reduce((a, b) => a.concat(b));
    return (
      <Row className="content">
        <Col md={12}>
          <h2>系统工作</h2>
          <p className="description">
			系统工作是一个由DeepLOG服务器节点所执行的为了维护而长时间运行的任务。有些系统工作提供了进度信息或者可以被终止。
          </p>

          <SystemJobsList jobs={jobs} />
        </Col>
      </Row>
    );
  },
});

export default SystemJobsComponent;
