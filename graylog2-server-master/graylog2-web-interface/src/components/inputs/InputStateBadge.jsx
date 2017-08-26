import React from 'react';
import Reflux from 'reflux';
import { Label, OverlayTrigger, Popover } from 'react-bootstrap';

import StoreProvider from 'injection/StoreProvider';
const InputStatesStore = StoreProvider.getStore('InputStates');
const NodesStore = StoreProvider.getStore('Nodes');

import { LinkToNode, Spinner } from 'components/common';

import InputStateComparator from 'logic/inputs/InputStateComparator';

const InputStateBadge = React.createClass({
  propTypes: {
    input: React.PropTypes.object.isRequired,
  },
  mixins: [Reflux.connect(InputStatesStore), Reflux.connect(NodesStore)],
  comparator: new InputStateComparator(),
  _labelClassForState(sortedStates) {
    const nodesWithKnownState = sortedStates.reduce((numberOfNodes, state) => {
      return numberOfNodes + state.count;
    }, 0);

    if (this.props.input.global && nodesWithKnownState !== Object.keys(this.state.nodes).length) {
      return 'warning';
    }

    const state = sortedStates[0].state;
    switch (state) {
      case 'RUNNING':
        return 'success';
      case 'FAILED':
        return 'danger';
      case 'STARTING':
        return 'info';
      default:
        return 'warning';
    }
  },
  _transState(state){
		var res = "";
		switch(state){
			case "CREATED":res="已创建";break;
			case "INITIALIZED":res="已初始化";break;
			case "INVALID_CONFIGURATION":res="无效配置";break;
			case "STARTING":res="正在启动";break;
			case "RUNNING":res="运行中";break;
			case "FAILED":res="发生故障";break;
			case "STOPPING":res="正在停止";break;
			case "STOPPED":res="停止";break;
			case "TERMINATED":res="终止";break;
		}
		return res;
	},
  _textForState(sortedStates) {
    if (this.props.input.global) {
      return sortedStates.map(state => state.count + ' ' + state.state).join(', ');
    }
    return this._transState(sortedStates[0].state);
  },
  _isLoading() {
    return !(this.state.inputStates && this.state.nodes);
  },
  render() {
    if (this._isLoading()) {
      return <Spinner />;
    }

    const input = this.props.input;
    const inputId = input.id;

    const inputStates = {};
    if (this.state.inputStates[inputId]) {
      Object.keys(this.state.inputStates[inputId]).forEach((node) => {
        const state = this.state.inputStates[inputId][node].state;
        if (!inputStates[state]) {
          inputStates[state] = [];
        }
        inputStates[state].push(node);
      });
    }

    const sorted = Object.keys(inputStates).sort(this.comparator.compare.bind(this.comparator)).map(state => {
      return {state: state, count: inputStates[state].length};
    });

    if (sorted.length > 0) {
      const popOverText = sorted.map(state => {
        return inputStates[state.state].map(node => {
          return <span><LinkToNode nodeId={node} />: {this._transState(state.state)}<br/></span>;
        });
      });
      const popover = (
        <Popover id="inputstate-badge-details" title={input.title + ' 的输入值状态'} style={{fontSize: 12}}>
          {popOverText}
        </Popover>
      );
      return (
        <OverlayTrigger trigger="click" placement="bottom" overlay={popover} rootClose>
          <Label bsStyle={this._labelClassForState(sorted)} title="点击显示详情"
                 bsSize="xsmall" style={{cursor: 'pointer'}}>{this._textForState(sorted)}</Label>
        </OverlayTrigger>
      );
    } else {
      const text = input.global || input.node === undefined ? '0 运行' : '不在运行中';
      return (
        <Label bsStyle="danger" bsSize="xsmall">{text}</Label>
      );
    }
  },
});

export default InputStateBadge;
