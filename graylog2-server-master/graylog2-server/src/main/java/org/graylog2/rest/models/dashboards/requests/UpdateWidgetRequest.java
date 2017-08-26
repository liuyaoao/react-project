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
package org.graylog2.rest.models.dashboards.requests;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.auto.value.AutoValue;

import javax.annotation.Nullable;
import javax.validation.constraints.Min;

@JsonAutoDetect
@AutoValue
public abstract class UpdateWidgetRequest {
    @Nullable
    @JsonProperty
    public abstract String description();

    @JsonProperty("cache_time")
    public abstract int cacheTime();

    @JsonCreator
    public static UpdateWidgetRequest create(@JsonProperty("description") @Nullable String description,
                                             @JsonProperty("cache_time") @Min(0) int cacheTime) {
        return new AutoValue_UpdateWidgetRequest(description, cacheTime);
    }
}
