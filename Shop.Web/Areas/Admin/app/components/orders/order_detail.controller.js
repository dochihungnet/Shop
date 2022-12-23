(function (app) {

    app.controller('orderDetailController', orderDetailController);

    orderDetailController.$inject = ['$scope', 'apiService', '$state', 'notificationService', 'commonService'];

    function orderDetailController($scope, apiService, $state, notificationService, commonService) {
        

    }


})(angular.module('shop.orders'));