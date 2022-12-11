(function (app) {
    app.controller('rootController', rootController);

    rootController.$inject = ['$scope', 'apiService', '$q', '$timeout', 'cartService', 'authData', 'loginService', '$state'];

    function rootController($scope, apiService, $q, $timeout, cartService, authData, loginService, $state) {
        
        // THEO DOI XEM DA DANG NHAP HAY CHUA
        $scope.$watch(function () { return authData.authenticationData; }, function (newVal, oldVal) {
            if(authData.authenticationData.IsAuthenticated === true){
                cartService.init();
            }
            else {
                cartService.init();
            }
        }, true);
    }
})(angular.module('shop'));