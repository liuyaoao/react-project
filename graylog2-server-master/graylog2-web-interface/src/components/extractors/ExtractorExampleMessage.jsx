import React, { PropTypes } from 'react';
import MessageLoader from './MessageLoader';

const ExtractorExampleMessage = React.createClass({
  propTypes: {
    field: PropTypes.string.isRequired,
    example: PropTypes.string,
    onExampleLoad: PropTypes.func,
  },
  _onExampleLoad(message) {
    const newExample = message.fields[this.props.field];
    this.props.onExampleLoad(newExample);
  },
  render() {
    const originalMessage = <span id="xtrc-original-example" style={{display: 'none'}}>{this.props.example}</span>;
    let messagePreview;

    if (this.props.example) {
      messagePreview = (
        <div className="well well-sm xtrc-new-example">
          <span id="xtrc-example">{this.props.example}</span>
        </div>
      );
    } else {
      messagePreview = (
        <div className="alert alert-warning xtrc-no-example">
		  无法加载字段'{this.props.field}'的示例。在提取器没有更新之前无法测试它。
        </div>
      );
    }

    return (
      <div>
        {originalMessage}
        {messagePreview}
        <MessageLoader onMessageLoaded={this._onExampleLoad}/>
      </div>
    );
  },
});

export default ExtractorExampleMessage;
