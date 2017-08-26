import React from 'react';

import { IfPermitted } from 'components/common';
import { IndexerClusterHealth, IndexerFailuresComponent } from 'components/indexers';
import { NotificationsList } from 'components/notifications';
import { SystemJobsComponent } from 'components/systemjobs';
import { SystemMessagesComponent } from 'components/systemmessages';
import { TimesList } from 'components/times';

const SystemOverviewPage = React.createClass({
  render() {
    return (
      <span>
        <IfPermitted permissions="notifications:read">
          <NotificationsList />
        </IfPermitted>

        <IfPermitted permissions="systemjobs:read">
          <SystemJobsComponent />
        </IfPermitted>

        <IfPermitted permissions="indexercluster:read">
          <IndexerClusterHealth />
        </IfPermitted>

        <IfPermitted permissions="indices:failures">
          <IndexerFailuresComponent />
        </IfPermitted>

        <TimesList />



        <IfPermitted permissions="systemmessages:read">
          <SystemMessagesComponent />
        </IfPermitted>
      </span>
    );
  },
});

export default SystemOverviewPage;
