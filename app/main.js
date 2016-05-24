System.register(['@angular/platform-browser-dynamic', './app.component', './tao_edge/tao.edge.service'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var platform_browser_dynamic_1, app_component_1, tao_edge_service_1;
    return {
        setters:[
            function (platform_browser_dynamic_1_1) {
                platform_browser_dynamic_1 = platform_browser_dynamic_1_1;
            },
            function (app_component_1_1) {
                app_component_1 = app_component_1_1;
            },
            function (tao_edge_service_1_1) {
                tao_edge_service_1 = tao_edge_service_1_1;
            }],
        execute: function() {
            platform_browser_dynamic_1.bootstrap(app_component_1.AppComponent, [tao_edge_service_1.EdgeService]);
        }
    }
});
//# sourceMappingURL=main.js.map