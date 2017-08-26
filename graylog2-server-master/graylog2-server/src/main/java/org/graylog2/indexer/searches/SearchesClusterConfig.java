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
package org.graylog2.indexer.searches;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.auto.value.AutoValue;
import com.google.common.collect.ImmutableMap;
import com.google.common.collect.ImmutableSet;
import org.joda.time.Period;

import java.util.Map;
import java.util.Set;

@JsonAutoDetect
@AutoValue
public abstract class SearchesClusterConfig {
    private static final Period DEFAULT_QUERY_TIME_RANGE_LIMIT = Period.ZERO;
    private static final Map<Period, String> DEFAULT_RELATIVE_TIMERANGE_OPTIONS = ImmutableMap.<Period, String>builder()
            .put(Period.minutes(5), "搜索过去5分钟")
            .put(Period.minutes(15), "搜索过去15分钟")
            .put(Period.minutes(30), "搜索过去30分钟")
            .put(Period.hours(1), "搜索过去1小时")
            .put(Period.hours(2), "搜索过去2小时")
            .put(Period.hours(8), "搜索过去8小时")
            .put(Period.days(1), "搜索过去1天")
            .put(Period.days(2), "搜索过去2天")
            .put(Period.days(5), "搜索过去5天")
            .put(Period.days(7), "搜索过去7天")
            .put(Period.days(14), "搜索过去14天")
            .put(Period.days(30), "搜索过去30天")
            .put(Period.ZERO, "搜索所有信息")
            .build();
    private static final Map<Period, String> DEFAULT_SURROUNDING_TIMERANGE_OPTIONS = ImmutableMap.<Period, String>builder()
            .put(Period.seconds(1), "1秒")
            .put(Period.seconds(5), "5秒")
            .put(Period.seconds(10), "10秒")
            .put(Period.seconds(30), "30秒")
            .put(Period.minutes(1), "1分钟")
            .put(Period.minutes(5), "5分钟")
            .build();
    private static final Set<String> DEFAULT_SURROUNDING_FILTER_FIELDS = ImmutableSet.<String>builder()
            .add("source")
            .add("gl2_source_input")
            .add("file")
            .add("source_file")
            .build();

    @JsonProperty("query_time_range_limit")
    public abstract Period queryTimeRangeLimit();

    @JsonProperty("relative_timerange_options")
    public abstract Map<Period, String> relativeTimerangeOptions();

    @JsonProperty("surrounding_timerange_options")
    public abstract Map<Period, String> surroundingTimerangeOptions();

    @JsonProperty("surrounding_filter_fields")
    public abstract Set<String> surroundingFilterFields();

    @JsonCreator
    public static SearchesClusterConfig create(@JsonProperty("query_time_range_limit") Period queryTimeRangeLimit,
                                               @JsonProperty("relative_timerange_options") Map<Period, String> relativeTimerangeOptions,
                                               @JsonProperty("surrounding_timerange_options") Map<Period, String> surroundingTimerangeOptions,
                                               @JsonProperty("surrounding_filter_fields") Set<String> surroundingFilterFields) {
        return builder()
                .queryTimeRangeLimit(queryTimeRangeLimit)
                .relativeTimerangeOptions(relativeTimerangeOptions)
                .surroundingTimerangeOptions(surroundingTimerangeOptions)
                .surroundingFilterFields(surroundingFilterFields)
                .build();
    }

    public static SearchesClusterConfig createDefault() {
        return builder()
                .queryTimeRangeLimit(DEFAULT_QUERY_TIME_RANGE_LIMIT)
                .relativeTimerangeOptions(DEFAULT_RELATIVE_TIMERANGE_OPTIONS)
                .surroundingTimerangeOptions(DEFAULT_SURROUNDING_TIMERANGE_OPTIONS)
                .surroundingFilterFields(DEFAULT_SURROUNDING_FILTER_FIELDS)
                .build();
    }

    public static Builder builder() {
        return new AutoValue_SearchesClusterConfig.Builder();
    }

    public abstract Builder toBuilder();

    @AutoValue.Builder
    public static abstract class Builder {
        public abstract Builder queryTimeRangeLimit(Period queryTimeRangeLimit);
        public abstract Builder relativeTimerangeOptions(Map<Period, String> relativeTimerangeOptions);
        public abstract Builder surroundingTimerangeOptions(Map<Period, String> surroundingTimerangeOptions);
        public abstract Builder surroundingFilterFields(Set<String> surroundingFilterFields);

        public abstract SearchesClusterConfig build();
    }
}
