import React from 'react';
import { Alert, Button } from 'react-bootstrap';

import ActionsProvider from 'injection/ActionsProvider';
const IndicesActions = ActionsProvider.getActions('Indices');

import { IndexRangeSummary } from 'components/indices';

const ClosedIndexDetails = React.createClass({
  propTypes: {
    indexName: React.PropTypes.string.isRequired,
    indexRange: React.PropTypes.object,
  },
  _onReopen() {
    IndicesActions.reopen(this.props.indexName);
  },
  render() {
    const { indexRange } = this.props;
    return (
      <div className="index-info">
        <IndexRangeSummary indexRange={indexRange} />
        <Alert bsStyle="info"><i className="fa fa-info-circle"/> 这个指标是关闭的。指标信息在那一刻不可用，请重新打开指标，然后再试一次。</Alert>

        <hr style={{ marginBottom: '5', marginTop: '10' }}/>

        <Button bsStyle="warning" bsSize="xs" onClick={this._onReopen}>重新打开指标</Button>{' '}
      </div>
    );
  },
});

export default ClosedIndexDetails;
