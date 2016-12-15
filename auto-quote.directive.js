(function () {
    'use strict';
    angular
        .module('baseApp')

        /**
         * Contact Form
         */
        .directive('autoQuoteForm', ['appPath', function (appPath) {
            return {
                restrict: 'EA',
                replace: true,
                transclude: true,
                scope: {
                    view: '@'
                },
                templateUrl: appPath + '/components/auto-quote-form/auto-quote-form.html',
                controller: autoQuoteFormController,
                controllerAs: 'autoQuote'
            };
        }])
        .controller('autoQuoteFormController', autoQuoteFormController);

    autoQuoteFormController.$inject = ['$scope', 'autoQuoteService', '$q', '$analytics', '$http', '$location', 'locationService'];
    /**
     * @param $scope
     * @param autoQuoteService
     * @param $q
     * @param $analytics
     * @param $http
     * @param $location
     */
    function autoQuoteFormController($scope, autoQuoteService, $q, $analytics, $http, $location, locationService) {
        var vm = this;
        vm.user = {
            car_year: null,
            car_make: null,
            car_model: null,
            zip: null,
            email: null
        };

        vm.car = {
            year: null,
            make: null,
            model: null
        };

        vm.searchObj = $location.search();

        vm.progress = false;
        var defUser = angular.copy(vm.user);
        var defCar  = angular.copy(vm.car);

        vm.button_name = 'Compare Quotes';

        getCarYear();

        function getCarYear() {
            vm.progress = true;
            autoQuoteService.getPolkYears(vm.user)
                .then(function (response) {
                    vm.progress = false;
                    vm.car.year = response.Items;

                }, function (response) {
                    vm.msgState = 'error';
                    return $q.reject(response);
                });
        }

        vm.getCarMake = function () {
            getCarMake();
        };

        function getCarMake() {
            vm.progress = true;
            autoQuoteService.getPolkMakes(vm.user.car_year)
                .then(function (response) {
                    vm.progress = false;
                    vm.car.make = response.Items;

                }, function (response) {
                    vm.msgState = 'error';
                    return $q.reject(response);
                });
        }

        vm.getCarModel = function () {
            getCarModel();
        };

        function getCarModel() {
            vm.progress = true;
            autoQuoteService.getPolkModels(vm.user)
                .then(function (response) {
                    vm.progress = false;
                    vm.car.model = response.Items;

                }, function (response) {
                    vm.msgState = 'error';
                    return $q.reject(response);
                });
        }

        vm.submitForm = function () {
            getOffersList();
            if(vm.user.zip){
                setZipCode(vm.user.zip);
            }
            $scope.$emit('submitForm');
        };

        function setZipCode(zip) {
            locationService.zipCheck(zip).then(
                    function successCallback(response) {
                        if (typeof response === 'object') {
                            locationService.setLocation(response.ZipCodeCheck.City, response.ZipCodeCheck.State, response.ZipCodeCheck.ZipCode);
                        }

                    }, function errorCallback(response) {}
                );
        }


        function getOffersList() {
            vm.progress = true;
            vm.button_name = 'Loading ...';

        }

        vm.resetForm = function () {
            vm.msgState = 'ready';
            vm.user = defUser;
            vm.car = defCar;
            getCarYear();

            $scope.autoQuoteForm.$setPristine();
        };

        vm.google_analytics = function () {
            $analytics.eventTrack( 'Auto Quote Form Submit Event', {
                category: 'Tracking',
                action: 'Click',
                label: 'Get Offers List',
                value: vm.user.car_year + ', ' + vm.user.car_make + ', ' +  vm.user.car_model + ', ' + vm.user.zip
            });
        }

    }
})();