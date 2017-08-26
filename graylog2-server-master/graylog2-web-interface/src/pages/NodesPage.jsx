import React from 'react';
import Reflux from 'reflux';

import StoreProvider from 'injection/StoreProvider';
const CurrentUserStore = StoreProvider.getStore('CurrentUser');

import { PageHeader } from 'components/common';
import { NodesList } from 'components/nodes';

const NodesPage = React.createClass({
  mixins: [Reflux.connect(CurrentUserStore)],
  render() {
    return (
      <div>
        <PageHeader title="节点">
          <span>这个页面提供了您的DeepLOG集群中的节点的实时概述详情</span>

          <span>
			您可以随时暂定消息进程。进程缓存器在您重新启动之前不会接受任何新的消息。如果节点的消息日志可用（默认可用），即便进程已被禁用，获取的消息仍会被存储到硬盘。
			</span>
        </PageHeader>
        <NodesList permissions={this.state.currentUser.permissions}/>
      </div>
    );
  },
});

export default NodesPage;
