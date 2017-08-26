/// <reference path="../../../declarations/bluebird/bluebird.d.ts" />

const Reflux = require('reflux');

const UserNotification = require('util/UserNotification');
import ApiRoutes = require('routing/ApiRoutes');
const URLUtils = require('util/URLUtils');
const Builder = require('logic/rest/FetchProvider').Builder;
const fetch = require('logic/rest/FetchProvider').default;

const ActionsProvider = require('injection/ActionsProvider');
const WidgetsActions = ActionsProvider.getActions('Widgets');

interface Widget {
    id: string;
    description: string;
    type: string;
    cache_time: number;
    creator_user_id?: string;
    config: {};
}

const WidgetsStore = Reflux.createStore({
    listenables: [WidgetsActions],
    _serializeWidgetForUpdate(widget: Widget): any {
        return {
            description: widget.description,
            type: widget.type,
            cache_time: widget.cache_time,
            creator_user_id: widget.creator_user_id,
            config: widget.config,
        };
    },

    addWidget(dashboardId: string, widgetType: string, widgetTitle: string, widgetConfig: Object): Promise<string[]> {
        var widgetData = {description: widgetTitle, type: widgetType, config: widgetConfig};
        var url = URLUtils.qualifyUrl(ApiRoutes.DashboardsApiController.addWidget(dashboardId).url);
        var promise = fetch('POST', url, widgetData);

        promise.then(() => UserNotification.success("成功创建部件"),
        (error) => {
            if (error.additional.status !== 404) {
                UserNotification.error("创建部件失败: " + error,
                    "不能创建部件");
            }
        });

        return promise;
    },

    loadWidget(dashboardId: string, widgetId: string): Promise<string[]> {
        var url = URLUtils.qualifyUrl(ApiRoutes.DashboardsApiController.widget(dashboardId, widgetId).url);
        const promise = new Builder('GET', url)
            .authenticated()
            .setHeader('X-Graylog-No-Session-Extension', 'true')
            .json()
            .build();

        promise.catch((error) => {
            if (error.additional.status !== 404) {
                UserNotification.error("加载部件信息失败: " + error,
                    "不能加载部件信息");
            }
        });
        return promise;
    },

    updateWidget(dashboardId: string, widget: Widget): Promise<string[]> {
        var url = URLUtils.qualifyUrl(ApiRoutes.DashboardsApiController.updateWidget(dashboardId, widget.id).url);
        var promise = fetch('PUT', url, this._serializeWidgetForUpdate(widget));

        promise.then(
          () => UserNotification.success("部件更新成功"),
          (error) => {
              UserNotification.error("更新部件 \"" + widget.description + "\" 失败: " + error.message,
                "不能更新部件 ");
          }
        );

        return promise;
    },

    loadValue(dashboardId: string, widgetId: string, resolution: number): Promise<string[]> {
        var url = URLUtils.qualifyUrl(ApiRoutes.DashboardsApiController.widgetValue(dashboardId, widgetId, resolution).url);

        return new Builder('GET', url)
            .authenticated()
            .setHeader('X-Graylog-No-Session-Extension', 'true')
            .json()
            .build();
    },

    removeWidget(dashboardId: string, widgetId: string): Promise<string[]> {
        const url = URLUtils.qualifyUrl(ApiRoutes.DashboardsApiController.removeWidget(dashboardId, widgetId).url);

        const promise = fetch('DELETE', url).then(() => {
            this.trigger({delete: widgetId});
        });
        WidgetsActions.removeWidget.promise(promise);

        return promise;
    },
});

module.exports = WidgetsStore;
