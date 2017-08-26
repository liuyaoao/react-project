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
package org.graylog2.messageprocessors;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.auto.value.AutoValue;
import org.graylog2.plugin.messageprocessors.MessageProcessor;

@JsonAutoDetect
@AutoValue
public abstract class MessageProcessorDescriptor {
    @JsonProperty("name")
    public abstract String name();

    @JsonProperty("class_name")
    public abstract String className();

    @JsonCreator
    public static MessageProcessorDescriptor create(@JsonProperty("name") String name,
                                                    @JsonProperty("class_name") String className) {
        return new AutoValue_MessageProcessorDescriptor(name, className);
    }

    public static MessageProcessorDescriptor fromDescriptor(MessageProcessor.Descriptor descriptor) {
        return create(descriptor.name(), descriptor.className());
    }
}