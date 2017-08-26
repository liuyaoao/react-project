import FieldContentConditionForm from './FieldContentConditionForm';
import FieldContentConditionSummary from './FieldContentConditionSummary';

export default {
  title: '字段内容值',
  description: '这个条件只有当消息的内容和一个已经被定义的值相等时才会被触发。',
  configuration_form: FieldContentConditionForm,
  summary: FieldContentConditionSummary,
}
