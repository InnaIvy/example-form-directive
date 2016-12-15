(function () {
    'use strict';

    angular
        .module('baseApp')
        .factory('autoQuoteService', autoQuoteService);

    autoQuoteService.$inject = ['$app', '$http', 'themeNs', '$q'];

    function autoQuoteService($app, $http, themeNs, $q) {

        var car = {
            year: null,
            make: null,
            model: null
        };

        var service = {
            getPolkYears: getPolkYears,
            getPolkMakes: getPolkMakes,
            getPolkModels: getPolkModels
        };
        return service;

        function getPolkYears(){

            return 	$http.get( '/wp-json/'+themeNs+'/polk/years/' )
                .then(Complete)
                ["catch"](Failed);

            function Complete(response){

                car.year = angular.fromJson(response.data);

                return car.year;
            }

            function Failed(error){
                $app.error('XHR Failed for getIP.' + error.data);
            }
        }

        function getPolkMakes(data){
            return $http({
                url: '/wp-json/'+themeNs+'/polk/makes/',
                method: "GET",
                params: {data: data}
            })
                .then(Complete)
                ["catch"](Failed);

            function Complete(response){

                car.make = angular.fromJson(response.data);

                return car.make;
            }

            function Failed(error){
                $app.error('XHR Failed for getIP.' + error.data);
            }
        }

        function getPolkModels(data){

            return $http({
                url: '/wp-json/'+themeNs+'/polk/models/',
                method: "GET",
                params: {data: data}
            })
                .then(Complete)
                ["catch"](Failed);

            function Complete(response){

                car.model = angular.fromJson(response.data);

                return car.model;
            }

            function Failed(error){
                $app.error('XHR Failed for getIP.' + error.data);
            }
        }
    }
})();
