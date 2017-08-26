import { PluginManifest, PluginStore } from 'graylog-web-plugin/plugin';
import DeletionRetentionStrategyConfiguration from './DeletionRetentionStrategyConfiguration';
import DeletionRetentionStrategySummary from './DeletionRetentionStrategySummary';
import ClosingRetentionStrategyConfiguration from './ClosingRetentionStrategyConfiguration';
import ClosingRetentionStrategySummary from './ClosingRetentionStrategySummary';

PluginStore.register(new PluginManifest({}, {
  indexRetentionConfig: [
    {
      type: 'org.graylog2.indexer.retention.strategies.DeletionRetentionStrategy',
      displayName: '删除指标',
      configComponent: DeletionRetentionStrategyConfiguration,
      summaryComponent: DeletionRetentionStrategySummary,
    },
    {
      type: 'org.graylog2.indexer.retention.strategies.ClosingRetentionStrategy',
      displayName: '关闭指标',
      configComponent: ClosingRetentionStrategyConfiguration,
      summaryComponent: ClosingRetentionStrategySummary,
    },
  ],
}));
