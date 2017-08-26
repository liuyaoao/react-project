import React from 'react';
import Reflux from 'reflux';

import StoreProvider from 'injection/StoreProvider';
const CurrentUserStore = StoreProvider.getStore('CurrentUser');
const InputStatesStore = StoreProvider.getStore('InputStates');

import { PageHeader } from 'components/common';
import { InputsList } from 'components/inputs';

const InputsPage = React.createClass({
  mixins: [Reflux.connect(CurrentUserStore)],
  componentDidMount() {
    this.interval = setInterval(InputStatesStore.list, 2000);
  },
  componentWillUnmount() {
    clearInterval(this.interval);
  },
  render() {
    return (
      <div>
        <PageHeader title="输入值">
          <span>DeepLOG节点通过输入值接收数据。此页面可以启动或终止任何您想操作的输入值。</span>
        </PageHeader>
        <InputsList permissions={this.state.currentUser.permissions}/>
      </div>
    );
  },
});

export default InputsPage;
