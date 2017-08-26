import React from 'react';
import { Label } from 'react-bootstrap';

import DateTime from 'logic/datetimes/DateTime';

import { IndexSizeSummary } from 'components/indices';

const IndexSummary = React.createClass({
  propTypes: {
    children: React.PropTypes.node.isRequired,
    index: React.PropTypes.object.isRequired,
    indexRange: React.PropTypes.object,
    isDeflector: React.PropTypes.bool.isRequired,
    name: React.PropTypes.string.isRequired,
  },
  getInitialState() {
    return { showDetails: this.props.isDeflector };
  },
  _formatLabels(index) {
    const labels = [];
    if (index.is_deflector) {
      labels.push(<Label key={`${this.props.name}-deflector-label`} bsStyle="primary">偏转</Label>);
    }

    if (index.is_closed) {
      labels.push(<Label key={`${this.props.name}-closed-label`} bsStyle="warning">关闭</Label>);
    }

    if (index.is_reopened) {
      labels.push(<Label key={`${this.props.name}-reopened-label`} bsStyle="success">重新开放</Label>);
    }

    return <span className="index-label">{labels}</span>;
  },

  _formatIndexRange() {
    if (this.props.isDeflector) {
      return `包含消息到${new DateTime().toRelativeString()}`;
    }

    const sizes = this.props.index.size;
    if (sizes) {
      const count = sizes.events;
      const deleted = sizes.deleted;
      if (count === 0 || count - deleted === 0) {
        return '指数不包含任何消息。';
      }
    }

    if (!this.props.indexRange) {
      return '指标的时间范围是未知的，因为指标范围是不可用。请手动重新计算指标范围。';
    }

    if (this.props.indexRange.begin === 0) {
      return `包含消息到${new DateTime(this.props.indexRange.end).toRelativeString()}`;
    }

    return `包含来自${new DateTime(this.props.indexRange.begin).toRelativeString()}的消息到${new DateTime(this.props.indexRange.end).toRelativeString()}`;
  },
  _formatShowDetailsLink() {
    if (this.state.showDetails) {
      return <span className="index-more-actions"><i className="fa fa-caret-down"/> 隐藏细节/动作</span>;
    }
    return <span className="index-more-actions"><i className="fa fa-caret-right"/> 显示细节/动作</span>;
  },
  _toggleShowDetails(event) {
    event.preventDefault();
    this.setState({ showDetails: !this.state.showDetails });
  },
  render() {
    const index = this.props.index;
    return (
      <span>
        <h2>
          {this.props.name}{' '}

          <small>
            {this._formatLabels(index)}{' '}
            {this._formatIndexRange(index)}{' '}

            <IndexSizeSummary index={index} />

            <a onClick={this._toggleShowDetails} href="#">{this._formatShowDetailsLink()}</a>
          </small>
        </h2>

        <div className="index-info-holder">
          {this.state.showDetails && this.props.children}
        </div>
      </span>
    );
  },
});

export default IndexSummary;
