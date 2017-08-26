import React from 'react';

import moment from 'moment';
import {} from 'moment-duration-format';

const TimeBasedRotationStrategySummary = React.createClass({
  propTypes: {
    config: React.PropTypes.object.isRequired,
  },

  _humanizedPeriod() {
    const duration = moment.duration(this.props.config.rotation_period);

    return `${duration.format()}, ${duration.humanize()}`;
  },

  render() {
    return (
      <div>
        <dl className="deflist">
          <dt>指数轮换策略:</dt>
          <dd>指数时间</dd>
          <dt>循环周期:</dt>
          <dd>{this.props.config.rotation_period} ({this._humanizedPeriod()})</dd>
        </dl>
      </div>
    );
  },
});

export default TimeBasedRotationStrategySummary;
