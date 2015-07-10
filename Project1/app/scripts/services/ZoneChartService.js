(function ($) {
    'use strict';
    angular.module('bowerVersionApp')
        .factory('ZoneChartService', ['$document', '$q', '$rootScope', '$http', function ($document, $q, $rootScope, $http) {
    $http.defaults.useXDomain = true;
    delete $http.defaults.headers.common['X-Requested-With'];

            return {
                getZoneData: function (zipCode) {
                    
                    return $http.post('/Marketing/Zonemap/getzips?zipCode='+zipCode, {
                    
                    })
                        .then(function (response) {
                            return response.data;

                        }, function (response) {
                            return $q.reject(response.data);
                        });
                }
            };
        }]);
}());