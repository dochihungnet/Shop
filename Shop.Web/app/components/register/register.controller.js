
(function (app) {
    app.controller('registerController', ['$scope', 'loginService', '$injector', 'notificationService', 'apiService',
        function ($scope, loginService, $injector, notificationService, apiService) {
            $scope.user = {};
            $scope.registerStatus = false;

            $scope.Register = Register;

            function Register() {

                console.log($scope.user);
                apiService.post(
                    'https://localhost:44353/api/account/register',
                    $scope.user,
                    function (result) {
                        if (result.status == 400) {
                            notificationService.displayError('Đăng ký thất bại.');
                        } else {
                            notificationService.displaySuccess('Đăng ký thành công');
                        }
                    },
                    function (error) {
                        notificationService.displayError('Đăng ký thất bại.');
                        console.log(error);
                    });

            }
            
        }]);
})(angular.module('shop'));

