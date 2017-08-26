import { PluginManifest, PluginStore } from 'graylog-web-plugin/plugin';

import MessageCountRotationStrategyConfiguration from './MessageCountRotationStrategyConfiguration';
import MessageCountRotationStrategySummary from './MessageCountRotationStrategySummary';
import SizeBasedRotationStrategyConfiguration from './SizeBasedRotationStrategyConfiguration';
import SizeBasedRotationStrategySummary from './SizeBasedRotationStrategySummary';
import TimeBasedRotationStrategyConfiguration from './TimeBasedRotationStrategyConfiguration';
import TimeBasedRotationStrategySummary from './TimeBasedRotationStrategySummary';

PluginStore.register(new PluginManifest({}, {
  indexRotationConfig: [
    {
      type: 'org.graylog2.indexer.rotation.strategies.MessageCountRotationStrategy',
      displayName: '指标的消息数',
      configComponent: MessageCountRotationStrategyConfiguration,
      summaryComponent: MessageCountRotationStrategySummary,
    },
    {
      type: 'org.graylog2.indexer.rotation.strategies.SizeBasedRotationStrategy',
      displayName: '指标的大小',
      configComponent: SizeBasedRotationStrategyConfiguration,
      summaryComponent: SizeBasedRotationStrategySummary,
    },
    {
      type: 'org.graylog2.indexer.rotation.strategies.TimeBasedRotationStrategy',
      displayName: '指标时间',
      configComponent: TimeBasedRotationStrategyConfiguration,
      summaryComponent: TimeBasedRotationStrategySummary,
    },
  ],
}));
