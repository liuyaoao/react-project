import React from 'react';

import { PageHeader } from 'components/common';
import { LoggerOverview } from 'components/loggers';

const LoggersPage = React.createClass({
  render() {
    return (
      <span>
        <PageHeader title="日志">
          <span>
            这一部分控制DeepLOG架构的日志，并允许你在系统运行时改变日志级别。请注意，当你重启受影响的服务后，日志级别将重置为默认值。
          </span>
        </PageHeader>
        <LoggerOverview />
      </span>
    );
  },
});

export default LoggersPage;
