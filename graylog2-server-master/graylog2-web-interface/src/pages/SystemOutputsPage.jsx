import React from 'react';
import Reflux from 'reflux';

import StoreProvider from 'injection/StoreProvider';
const CurrentUserStore = StoreProvider.getStore('CurrentUser');

import PageHeader from 'components/common/PageHeader';
import OutputsComponent from 'components/outputs/OutputsComponent';

const SystemOutputsPage = React.createClass({
  mixins: [Reflux.connect(CurrentUserStore)],
  render() {
    return (
      <span>
        <PageHeader title="输出集群">
          <span>
			<strong>DeepLOG节点可以通过输出进行转发。执行或终止任意数量的输出，并且将其派发给流，便可即时转发该流中所有的信息。</strong>
          </span>

          <span>
			
          </span>
        </PageHeader>

        <OutputsComponent permissions={this.state.currentUser.permissions}/>
      </span>
    );
  },
});

export default SystemOutputsPage;
