
(function (app) {
    app.controller('registerController', ['$scope','notificationService', 'apiService',
        function ($scope, notificationService, apiService) {
            $scope.user = {};
            $scope.registerStatus = false;

            $scope.Register = Register;

            function Register() {
                apiService.post(
                    'https://localhost:44353/api/account/register',
                    $scope.user,
                    function (result) {
                        if (result.status == 400) {
                            notificationService.displayError('Đăng ký thất bại.');
                            $scope.registerStatus = false;
                        } else {
                            notificationService.displaySuccess('Đăng ký thành công');
                            $scope.registerStatus = true;
                        }
                    },
                    function (error) {
                        notificationService.displayError('Đăng ký thất bại.');
                        $scope.registerStatus = false;
                    });

            }
            
        }]);
})(angular.module('shop'));

