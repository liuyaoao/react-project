export { default as FieldGraphs } from './FieldGraphs';
export { default as FieldQuickValues } from './FieldQuickValues';
export { default as FieldStatistics } from './FieldStatistics';
export { default as LegacyFieldGraph } from './LegacyFieldGraph';

import { PluginManifest, PluginStore } from 'graylog-web-plugin/plugin';
import FieldStatistics from './FieldStatistics';
import FieldQuickValues from './FieldQuickValues';
import FieldGraphs from './FieldGraphs';

PluginStore.register(new PluginManifest({}, {
  fieldAnalyzers: [
    {
      refId: 'fieldStatisticsComponent',
      displayName: '统计',
      component: FieldStatistics,
      displayPriority: 2,
    },
    {
      refId: 'fieldQuickValuesComponent',
      displayName: '快速赋值',
      component: FieldQuickValues,
      displayPriority: 1,
    },
    {
      refId: 'fieldGraphsComponent',
      displayName: '生成图表',
      component: FieldGraphs,
      displayPriority: 0,
    },
  ],
}));
