import React, { PropTypes } from 'react';
import Reflux from 'reflux';

import StreamRulesEditor from 'components/streamrules/StreamRulesEditor';
import { PageHeader, Spinner } from 'components/common';

import StoreProvider from 'injection/StoreProvider';
const CurrentUserStore = StoreProvider.getStore('CurrentUser');
const StreamsStore = StoreProvider.getStore('Streams');

const StreamEditPage = React.createClass({
  propTypes: {
    params: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  },
  mixins: [Reflux.connect(CurrentUserStore)],

  componentDidMount() {
    StreamsStore.get(this.props.params.streamId, (stream) => {
      this.setState({ stream });
    });
    //hover时 dropdown显示
    var hoverTimeout;
    $('.dropdown').hover(function() {
        clearTimeout(hoverTimeout);
        $(this).addClass('open');
    }, function() {
        var $self = $(this);
        hoverTimeout = setTimeout(function() {
            $self.removeClass('open');
        }, 50);
    });
  },

  _isLoading() {
    return !this.state.currentUser || !this.state.stream;
  },

  render() {
    if (this._isLoading()) {
      return <Spinner />;
    }

    return (
      <div>
        <PageHeader title={<span>消息流的规则 &raquo;{this.state.stream.title}&raquo;</span>}>
          <span>
            这个页面是专门用来简单地创建和操作消息流规则的。在这里，你可以{' '}看到配置的消息流规则的效果。
          </span>
        </PageHeader>

        <StreamRulesEditor currentUser={this.state.currentUser} streamId={this.props.params.streamId}
                           messageId={this.props.location.query.message_id} index={this.props.location.query.index} />
      </div>
    );
  },
});

export default StreamEditPage;
