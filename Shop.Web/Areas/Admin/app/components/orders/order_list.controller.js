(function (app) {

    app.controller('orderListController', orderListController);

    orderListController.$inject = ['$scope', 'apiService', '$state', 'notificationService', 'commonService'];

    function orderListController($scope, apiService, $state, notificationService, commonService) {


    }


})(angular.module('shop.orders'));