/**
 * This file is part of Graylog.
 *
 * Graylog is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Graylog is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Graylog.  If not, see <http://www.gnu.org/licenses/>.
 */
package org.graylog2.inputs.transports;

import com.codahale.metrics.Gauge;
import com.codahale.metrics.MetricRegistry;
import com.google.common.eventbus.EventBus;
import com.google.common.eventbus.Subscribe;
import com.google.inject.assistedinject.Assisted;
import com.google.inject.assistedinject.AssistedInject;
import com.rabbitmq.client.ConnectionFactory;
import org.graylog2.plugin.configuration.fields.BooleanField;
import org.graylog2.plugin.inputs.annotations.ConfigClass;
import org.graylog2.plugin.inputs.annotations.FactoryClass;
import org.graylog2.plugin.LocalMetricRegistry;
import org.graylog2.plugin.configuration.Configuration;
import org.graylog2.plugin.configuration.ConfigurationRequest;
import org.graylog2.plugin.configuration.fields.ConfigurationField;
import org.graylog2.plugin.configuration.fields.NumberField;
import org.graylog2.plugin.configuration.fields.TextField;
import org.graylog2.plugin.inputs.MessageInput;
import org.graylog2.plugin.inputs.MisfireException;
import org.graylog2.plugin.inputs.codecs.CodecAggregator;
import org.graylog2.plugin.inputs.transports.ThrottleableTransport;
import org.graylog2.plugin.inputs.transports.Transport;
import org.graylog2.plugin.lifecycles.Lifecycle;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Named;
import java.io.IOException;
import java.util.concurrent.ScheduledExecutorService;

public class AmqpTransport extends ThrottleableTransport {
    public static final String CK_HOSTNAME = "broker_hostname";
    public static final String CK_PORT = "broker_port";
    public static final String CK_VHOST = "broker_vhost";
    public static final String CK_USERNAME = "broker_username";
    public static final String CK_PASSWORD = "broker_password";
    public static final String CK_PREFETCH = "prefetch";
    public static final String CK_EXCHANGE = "exchange";
    public static final String CK_EXCHANGE_BIND = "exchange_bind";
    public static final String CK_QUEUE = "queue";
    public static final String CK_ROUTING_KEY = "routing_key";
    public static final String CK_PARALLEL_QUEUES = "parallel_queues";
    public static final String CK_TLS = "tls";
    public static final String CK_REQUEUE_INVALID_MESSAGES = "requeue_invalid_messages";
    public static final String CK_HEARTBEAT_TIMEOUT = "heartbeat";

    private static final Logger LOG = LoggerFactory.getLogger(AmqpTransport.class);

    private final Configuration configuration;
    private final EventBus eventBus;
    private final MetricRegistry localRegistry;
    private final ScheduledExecutorService scheduler;

    private AmqpConsumer consumer;

    @AssistedInject
    public AmqpTransport(@Assisted Configuration configuration,
                         EventBus eventBus,
                         LocalMetricRegistry localRegistry,
                         @Named("daemonScheduler") ScheduledExecutorService scheduler) {
        super(eventBus, configuration);
        this.configuration = configuration;
        this.eventBus = eventBus;
        this.localRegistry = localRegistry;
        this.scheduler = scheduler;

        localRegistry.register("read_bytes_1sec", new Gauge<Long>() {
            @Override
            public Long getValue() { return consumer.getLastSecBytesRead().get();
            }
        });
        localRegistry.register("written_bytes_1sec", new Gauge<Long>() {
                                    @Override
                                    public Long getValue() { return 0L;
                                    }
                                });
        localRegistry.register("read_bytes_total", new Gauge<Long>() {
                                    @Override
                                    public Long getValue() { return consumer.getTotalBytesRead().get();
                                    }
                                });
        localRegistry.register("written_bytes_total", new Gauge<Long>() {
                                    @Override
                                    public Long getValue() { return 0L;
                                    }
                                });
    }

    @Subscribe
    public void lifecycleChanged(Lifecycle lifecycle) {
        try {
            LOG.debug("Lifecycle changed to {}", lifecycle);
            switch (lifecycle) {
                case PAUSED:
                case FAILED:
                case HALTING:
                    try {
                        if (consumer != null) {
                            consumer.stop();
                        }
                    } catch (IOException e) {
                        LOG.warn("Unable to stop consumer", e);
                    }
                    break;
                default:
                    if (consumer.isConnected()) {
                        LOG.debug("Consumer is already connected, not running it a second time.");
                        break;
                    }
                    try {
                        consumer.run();
                    } catch (IOException e) {
                        LOG.warn("Unable to resume consumer", e);
                    }
                    break;
            }
        } catch (Exception e) {
            LOG.warn("This should not throw any exceptions", e);
        }
    }

    @Override
    public void setMessageAggregator(CodecAggregator aggregator) {

    }

    @Override
    public void doLaunch(MessageInput input) throws MisfireException {
        int heartbeatTimeout = ConnectionFactory.DEFAULT_HEARTBEAT;
        if (configuration.intIsSet(CK_HEARTBEAT_TIMEOUT)) {
            heartbeatTimeout = configuration.getInt(CK_HEARTBEAT_TIMEOUT);
            if (heartbeatTimeout < 0) {
                LOG.warn("AMQP heartbeat interval must not be negative ({}), using default timeout ({}).",
                         heartbeatTimeout, ConnectionFactory.DEFAULT_HEARTBEAT);
                heartbeatTimeout = ConnectionFactory.DEFAULT_HEARTBEAT;
            }
        }
        consumer = new AmqpConsumer(
                configuration.getString(CK_HOSTNAME),
                configuration.getInt(CK_PORT),
                configuration.getString(CK_VHOST),
                configuration.getString(CK_USERNAME),
                configuration.getString(CK_PASSWORD),
                configuration.getInt(CK_PREFETCH),
                configuration.getString(CK_QUEUE),
                configuration.getString(CK_EXCHANGE),
                configuration.getBoolean(CK_EXCHANGE_BIND),
                configuration.getString(CK_ROUTING_KEY),
                configuration.getInt(CK_PARALLEL_QUEUES),
                configuration.getBoolean(CK_TLS),
                configuration.getBoolean(CK_REQUEUE_INVALID_MESSAGES),
                heartbeatTimeout,
                input,
                scheduler,
                this
        );
        eventBus.register(this);
        try {
            consumer.run();
        } catch (IOException e) {
            eventBus.unregister(this);
            throw new MisfireException("Could not launch AMQP consumer.", e);
        }
    }

    @Override
    public void doStop() {
        if (consumer != null) {
            try {
                consumer.stop();
            } catch (IOException e) {
                LOG.error("Could not stop AMQP consumer.", e);
            }
        }
        eventBus.unregister(this);
    }

    @Override
    public com.codahale.metrics.MetricSet getMetricSet() {
        return localRegistry;
    }

    @FactoryClass
    public interface Factory extends Transport.Factory<AmqpTransport> {
        @Override
        AmqpTransport create(Configuration configuration);

        @Override
        Config getConfig();
    }

    @ConfigClass
    public static class Config extends ThrottleableTransport.Config {
        @Override
        public ConfigurationRequest getRequestedConfiguration() {
            final ConfigurationRequest cr = super.getRequestedConfiguration();
            cr.addField(
                    new TextField(
                            CK_HOSTNAME,
                            "代理主机名",
                            "",
                            "AMQP代理的主机名",
                            ConfigurationField.Optional.NOT_OPTIONAL
                    )
            );

            cr.addField(
                    new NumberField(
                            CK_PORT,
                            "代理端口",
                            5672,
                            "AMQP代理的端口号",
                            ConfigurationField.Optional.OPTIONAL,
                            NumberField.Attribute.IS_PORT_NUMBER
                    )
            );

            cr.addField(
                    new TextField(
                            CK_VHOST,
                            "代理虚拟主机",
                            "/",
                            "AMQP代理使用的虚拟主机",
                            ConfigurationField.Optional.NOT_OPTIONAL
                    )
            );

            cr.addField(
                    new TextField(
                            CK_USERNAME,
                            "用户名",
                            "",
                            "连接AMQP代理的用户名。",
                            ConfigurationField.Optional.OPTIONAL
                    )
            );

            cr.addField(
                    new TextField(
                            CK_PASSWORD,
                            "密码",
                            "",
                            "连接AMQP代理的密码。",
                            ConfigurationField.Optional.OPTIONAL,
                            TextField.Attribute.IS_PASSWORD
                    )
            );

            cr.addField(
                    new NumberField(
                            CK_PREFETCH,
                            "预获取数",
                            100,
                            "高级用法：AMQP的预获取数量。默认为100。",
                            ConfigurationField.Optional.NOT_OPTIONAL
                    )
            );

            cr.addField(
                    new TextField(
                            CK_QUEUE,
                            "队列",
                            defaultQueueName(),
                            "创建的队列名。",
                            ConfigurationField.Optional.NOT_OPTIONAL
                    )
            );

            cr.addField(
                    new TextField(
                            CK_EXCHANGE,
                            "交换",
                            defaultExchangeName(),
                            "绑定交换的名字。",
                            ConfigurationField.Optional.NOT_OPTIONAL
                    )
            );

            cr.addField(
                    new BooleanField(
                            CK_EXCHANGE_BIND,
                            "交换绑定",
                            false,
                            "将此队列绑定到已被配置的交换上。交换必须已存在。"
                    )
            );

            cr.addField(
                    new TextField(
                            CK_ROUTING_KEY,
                            "路由键",
                            defaultRoutingKey(),
                            "监听的路由键。",
                            ConfigurationField.Optional.NOT_OPTIONAL
                    )
            );

            cr.addField(
                    new NumberField(
                            CK_PARALLEL_QUEUES,
                            "队列数",
                            1,
                            "并发的队列数量。",
                            ConfigurationField.Optional.NOT_OPTIONAL
                    )
            );

            cr.addField(
                    new NumberField(
                            CK_HEARTBEAT_TIMEOUT,
                            "心跳时间",
                            ConnectionFactory.DEFAULT_HEARTBEAT,
                            "心跳间隙秒数（0表示禁止心跳）。",
                            ConfigurationField.Optional.OPTIONAL
                    )
            );

            cr.addField(
                    new BooleanField(
                            CK_TLS,
                            "启用TLS？",
                            false,
                            "启用通过TLS进行传输加密（需要有效的TLS端口设置）。"
                    )
            );

            cr.addField(
                    new BooleanField(
                            CK_REQUEUE_INVALID_MESSAGES,
                            "重新排列无效消息？",
                            true,
                            "如果禁用此功能，无效的消息将被删除。"
                    )
            );

            return cr;
        }

        protected String defaultRoutingKey() {
            return "#";
        }

        protected String defaultExchangeName() {
            return "log-messages";
        }

        protected String defaultQueueName() {
            return "log-messages";
        }
    }
}
