import React, {PropTypes} from 'react';
import Reflux from 'reflux';
import { Button } from 'react-bootstrap';

import StoreProvider from 'injection/StoreProvider';
const InputStatesStore = StoreProvider.getStore('InputStates');

function inputStateFilter(state) {
  return state.inputStates ? state.inputStates[this.props.input.id] : undefined;
}

const InputStateControl = React.createClass({
  propTypes: {
    input: PropTypes.object.isRequired,
  },
  mixins: [Reflux.connectFilter(InputStatesStore, 'inputState', inputStateFilter)],
  _isInputRunning() {
    if (!this.state.inputState) {
      return false;
    }

    const nodeIDs = Object.keys(this.state.inputState);
    if (nodeIDs.length === 0) {
      return false;
    }

    return nodeIDs.some(nodeID => {
      const nodeState = this.state.inputState[nodeID];
      return nodeState.state === 'RUNNING';
    });
  },
  _startInput() {
    InputStatesStore.start(this.props.input);
  },
  _stopInput() {
    InputStatesStore.stop(this.props.input);
  },
  render() {
    if (this._isInputRunning()) {
      return <Button bsStyle="primary" onClick={this._stopInput}>停止输入值</Button>;
    }

    return <Button bsStyle="success" onClick={this._startInput}>启动输入值</Button>;
  },
});

export default InputStateControl;
