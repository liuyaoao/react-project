import React from 'react';
import { Link } from 'react-router';

import Routes from 'routing/Routes';
import DocsHelper from 'util/DocsHelper';
import DocumentationLink from 'components/support/DocumentationLink';

class NotificationsFactory {
  static getForNotification(notification) {
    switch(notification.type) {
      case 'check_server_clocks':
        return {
          title: '检查您的DeepLOG服务器节点的系统时钟。',
          description: (
            <span>
			  检测到了某个DeepLOG服务器节点遇到被激活的同时立即被禁用的情况。
			  这通常是因为在系统时间中出现了一个重大的跳跃，比如通过NTP，或者另一个拥有不同系统时间的DeepLOG服务器节点被激活了。请确保2个graylog系统的时钟是同步的。
            </span>
          ),
        };
      case 'deflector_exists_as_index':
        return {
          title: '导向板作为一个索引存在，并且不是别名',
          description: (
            <span>
			  导向板应该是一个别名而不是一个索引。这可能是由多个基础设备的故障产生的。您的消息仍然可以被索引，但所有的搜索和维护进程都会产生错误的结果。强烈建议您尽快解决此问题。
            </span>
          ),
        };
      case 'email_transport_configuration_invalid':
        return {
          title: '邮件传输配置丢失或者失效！',
          description: (
            <span>
			  邮件传输的子系统配置丢失或者失效了。
			  请检查相关的的DeepLOG服务器配置文件。
			  这是详细的报错信息：{notification.details.exception}
            </span>
          ),
        };
      case 'email_transport_failed':
        return {
          title: '发送邮件时出错！',
          description: (
            <span>
			  DeepLOG服务器在发送邮件时遇到了一个错误。
			  这是详细的报错信息：{notification.details.exception}
            </span>
          ),
        };
      case 'es_cluster_red':
        return {
          title: 'Elasticsearch集群不健康 (RED)',
          description: (
            <span>
              Elasticsearch集群是红色的，这表示分片未被派发。
			  这通常说明出现了一个有冲突并且需要详细研究的集群。DeepLOG会将此错误记录在本地硬盘的日志中。
            </span>
          ),
        };
      case 'es_open_files':
        return {
          title: '一些Elasticsearch节点遇到了最低打开文件限制。',
          description: (
            <span>
			  有部分Elasticsearch节点有最低打开文件的显示（当前限制:{' '}
              <em>{notification.details.max_file_descriptors}</em> 位于主机 <em>{notification.details.hostname}</em>；应该不少于64000）这个问题很难被检测到。
            </span>
          ),
        };
      case 'es_unavailable':
        return {
          title: 'Elasticsearch集群不可用',
          description: (
            <span>
			  DeepLOG无法连接到Elasticsearch集群。如果您使用的是多路广播，请检查此传播方式在您所在的网络环境中可用，并且Elasticsearch是可访问的。同时请检查集群的命名设置是正确的。
            </span>
          ),
        };
      case 'gc_too_long':
        return {
          title: '节点遇到太多GC（垃圾采集器）的停顿',
          description: (
            <span>
			  有些DeepLOG节点的垃圾采集器运行时间太长了。
			  GC（垃圾采集器）的运行时间越短越好。请检查这些节点是否健康。
			  （注意：<em>{notification.node_id}</em>, GC 运行时间: <em>{notification.details.gc_duration_ms} 毫秒</em>,
              GC 阀值: <em>{notification.details.gc_threshold_ms} 毫秒</em>）
            </span>
          ),
        };
      case 'generic':
        return {
          title: notification.details.title,
          description: notification.details.description,
        };
      case 'index_ranges_recalculation':
        return {
          title: '需要重新计算索引范围',
          description: (
            <span>
			  索引范围未同步。请通过主菜单跳转至 System/Indices 页面触发索引范围的重新计算。
            </span>
          ),
        };
      case 'input_failed_to_start':
        return {
          title: '输入值无法执行',
          description: (
            <span>
			  输入值{notification.details.input_id}因某些原因无法在节点{notification.node_id}上执行：»{notification.details.reason}«。
			  这说明你通过这个输入值无法获取消息。
			  这通常表明配置发生了错误。你可以点击{' '}<Link to={Routes.SYSTEM.INPUTS}>这里</Link>解决此问题。
            </span>
          ),
        };
      case 'journal_uncommitted_messages_deleted':
        return {
          title: '未被提交的消息从日志中删除了',
          description: (
            <span>
			  有些可以被写入Elasticsearch的消息从DeepLOG日志中删除了。请确保您的Elasticsearch是健康的并且速度足够快。您也可以浏览您的DeepLOG的日志并且设置一个更高的限制。（注意：<em>{notification.node_id}</em>）
            </span>
          ),
        };
      case 'journal_utilization_too_high':
        return {
          title: '日志的使用过多',
          description: (
            <span>
			  日志的使用过多并且有可能即将突破限制。请确保您的Elasticsearch是健康的并且速度足够快。您也可以浏览您的DeepLOG的日志并且设置一个更高的限制。（注意：<em>{notification.node_id}</em>）
            </span>
          ),
        };
      case 'multi_master':
        return {
          title: '集群中存在多个DeepLOG服务器管理者',
          description: (
            <span>
			  您的DeepLOG集群中有多个DeepLOG服务器被定义为了管理者。集群能够在已经存在一个管理者的情况下通过启动新的低级节点自动处理此问题，但您仍需自己解决它。请检查每个节点的graylog.conf以确保只有一个节点的is_master被设置为了true。如果您认为您的问题已经被解决请关闭此提示信息。当您再次启动第二个管理者节点时此信息将会重新出现。
            </span>
          ),
        };
      case 'no_input_running':
        return {
          title: '有个节点没有任何输入值。',
          description: (
            <span>
			  有个节点没有任何输入值。这说明你此时无法从这个节点获取任何消息。这很有可能是因为错误的配置产生的。你可以点击<Link to={Routes.SYSTEM.INPUTS}>这里</Link>解决此问题。
            </span>
          ),
        };
      case 'no_master':
        return {
          title: '集群中没有检测到DeepLOG服务器管理者',
          description: (
            <span>
			  DeepLOG服务器的某些操作需要管理者节点，但没有这样的管理者节点。
			  请确保有且只有一个DeepLOG服务器节点的设置包含有<code>is_master = true</code>并且它是正在运行的。在这个问题解决之前，索引的循环都不会执行，这意味着索引保留机制也不会执行，从而导致index的占用量不断增加。某些特定的维护功能和各种网站交互页面都是不可使用的。
            </span>
          ),
        };
      case 'outdated_version':
        return {
          title: '您的DeepLOG版本已过期。',
          description: (
            <span>
			  目前最稳定的DeepLOG版本是<em>{notification.details.current_version}</em>。
            </span>
          ),
        };
      case 'output_disabled':
        return {
          title: '无法输出值',
          description: (
            <span>
			  消息流"{notification.details.streamTitle}"(id: {notification.details.streamId}) 中的id为 {notification.details.outputId} 的输出值被禁用了 {notification.details.faultPenaltySeconds} 秒，因为发生了 {notification.details.faultCount} 的故障。
		  	（注意：<em>{notification.node_id}</em>，故障阀值：<em>{notification.details.faultCountThreshold}</em>）
            </span>
          ),
        };
      case 'stream_processing_disabled':
        return {
          title: '因超过执行时间，消息流的进程被禁用了',
          description: (
            <span>
			  消息流(id: {notification.details.streamId})的进程执行时间太久（{notification.details.fault_count}次失败）。为了维护消息进程的稳定，该流被禁用了。请修改流的规则并重新启用该流。
            </span>
          ),
        };
      default:
        return {title: 'unknown (' + notification.type + ')', description: 'unknown'};
    }
  }
}

export default NotificationsFactory;
