(function ($) {
    'use strict';

    angular.module('bowerVersionApp', [    'ngAnimate',
        'ngCookies',
        'ngResource',
        'ui.router',
        'ngSanitize',
        'ngTouch',
        'd3'
        ]).config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('index', {
                url: '/index',
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .state('heatmap', {
                url: '/heatmap',
                templateUrl: 'views/main.html'
            });
    });

    angular.module('bowerVersionApp', []);
    angular.module('bowerVersionApp.services', ['d3', 'ZoneChartService']);
    angular.module('bowerVersionApp.controllers', ['numberInputCtrl']);
    angular.module('bowerVersionApp.directives', ['d3']);
}());