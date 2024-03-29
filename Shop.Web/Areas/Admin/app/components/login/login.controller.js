﻿(function (app) {
    app.controller('loginController', ['$scope', 'loginService', '$injector', 'notificationService', 'authData',
        function ($scope, loginService, $injector, notificationService, authData) {

            $scope.loginData = {
                userName: "",
                password: ""
            };

            $scope.loginSubmit = function () {
                loginService.login($scope.loginData.userName, $scope.loginData.password).then(function (response) {
                    if (response != null && response.data.error != undefined) {
                        notificationService.displayError("Đăng nhập thất bại.");
                    }
                    else {
                        var stateService = $injector.get('$state');
                        stateService.go('home');
                        console.log(authData.authenticationData);
                    }
                });
            }
        }]);
})(angular.module('shop'));