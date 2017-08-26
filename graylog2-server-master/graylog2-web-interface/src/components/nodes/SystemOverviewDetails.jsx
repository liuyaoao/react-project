import React, {PropTypes} from 'react';
import { Row, Col, Alert, Button } from 'react-bootstrap';

import { IfPermitted } from 'components/common';
import { DocumentationLink } from 'components/support';
import NodeThroughput from 'components/throughput/NodeThroughput';

import DocsHelper from 'util/DocsHelper';
import StringUtils from 'util/StringUtils';

import StoreProvider from 'injection/StoreProvider';
const SystemProcessingStore = StoreProvider.getStore('SystemProcessing');

const SystemOverviewDetails = React.createClass({
  propTypes: {
    node: PropTypes.object.isRequired,
    information: PropTypes.object.isRequired,
  },
  _toggleMessageProcessing() {
    if (confirm(`您将${this.props.information.is_processing ? '暂停' : '继续'} 这个节点的消息进程。您确定吗？`)) {
      if (this.props.information.is_processing) {
        SystemProcessingStore.pause(this.props.node.node_id);
      } else {
        SystemProcessingStore.resume(this.props.node.node_id);
      }
    }
  },
  render() {
    const information = this.props.information;
    const lbStatus = information.lb_status.toUpperCase();
    let processingStatus;

    if (information.is_processing) {
      processingStatus = (
        <span>
          <i className="fa fa-info-circle"/>&nbsp; <NodeThroughput nodeId={this.props.node.node_id} longFormat/>
        </span>
      );
    } else {
      processingStatus = (
        <span>
          <i className="fa fa-exclamation-triangle"/>&nbsp; 节点 <strong>没有</strong> 执行消息
        </span>
      );
    }

    return (
      <Row>
        <Col md={4}>
          <Alert bsStyle="info">
            <i className="fa fa-exchange"/>&nbsp;
            生命周期状态: <strong>{StringUtils.capitalizeFirstLetter(this.props.information.lifecycle)}</strong>
          </Alert>
        </Col>
        <Col md={4}>
          <Alert bsStyle={lbStatus === 'ALIVE' ? 'success' : 'danger'}>
            <i className="fa fa-heart"/>&nbsp;
            把加载平衡器标记为 <strong>{lbStatus === 'ALIVE' ? '存活' : '死亡'}</strong> 
          </Alert>
        </Col>
        <Col md={4}>
          <Alert bsStyle={information.is_processing ? 'success' : 'danger'}>
            <IfPermitted permissions="processing:changestate">
              <span className="pull-right">
                <Button onClick={this._toggleMessageProcessing} bsSize="xsmall" bsStyle={information.is_processing ? 'danger' : 'success'}>
                  {information.is_processing ? '暂停' : '继续'} 进程
                </Button>
              </span>
            </IfPermitted>
            {processingStatus}
          </Alert>
        </Col>
      </Row>
    );
  },
});

export default SystemOverviewDetails;
