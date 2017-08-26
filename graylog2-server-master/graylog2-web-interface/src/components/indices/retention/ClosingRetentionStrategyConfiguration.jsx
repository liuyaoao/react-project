import React from 'react';
import { Input } from 'react-bootstrap';

const ClosingRetentionStrategyConfiguration = React.createClass({
  propTypes: {
    config: React.PropTypes.object.isRequired,
    jsonSchema: React.PropTypes.object.isRequired,
    updateConfig: React.PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      max_number_of_indices: this.props.config.max_number_of_indices,
    };
  },

  _onInputUpdate(field) {
    return (e) => {
      const update = {};
      update[field] = e.target.value;

      this.setState(update);
      this.props.updateConfig(update);
    };
  },

  render() {
    return (
      <div>
        <fieldset>
          <Input type="number"
                 id="max-number-of-indices"
                 label="指标的最大值"
                 onChange={this._onInputUpdate('max_number_of_indices')}
                 value={this.state.max_number_of_indices}
                 help={<span>最大数量的指标，以保持在<strong>关闭</strong>最旧的</span>}
                 autoFocus
                 required />
        </fieldset>
      </div>
    );
  },
});

export default ClosingRetentionStrategyConfiguration;
