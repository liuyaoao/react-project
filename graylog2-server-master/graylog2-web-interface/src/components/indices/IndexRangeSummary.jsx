import React from 'react';
import {Timestamp} from 'components/common';

const IndexRangeSummary = React.createClass({
  propTypes: {
    indexRange: React.PropTypes.object,
  },
  render() {
    const { indexRange } = this.props;
    if (!indexRange) {
      return <span><i>无指标范围可用。</i></span>;
    }
    return (
      <span>范围重新计算{' '}
        <span title={indexRange.calculated_at}><Timestamp dateTime={indexRange.calculated_at} relative/></span>{' '}
        在{indexRange.took_ms}毫秒。
      </span>
    );
  },
});

export default IndexRangeSummary;
