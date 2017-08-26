import React from 'react';

const MetricsFilterInput = React.createClass({
  render() {
    return (
      <input type="text" className="metrics-filter input-lg form-control"
             style={{width: '100%'}} placeholder="输入一个程序调用详情的名字进行过滤..." {...this.props} />
    );
  },
});

export default MetricsFilterInput;
