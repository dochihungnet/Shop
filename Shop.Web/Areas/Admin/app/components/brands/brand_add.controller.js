(function (app) {

    app.controller('brandAddController', brandAddController);

    brandAddController.$inject = ['$scope', 'apiService', '$state', 'notificationService', 'commonService'];

    function brandAddController($scope, apiService, $state, notificationService, commonService) {
        $scope.brand = {
            CreatedDate: new Date(),
            CreatedBy: "Admin",
            Status: true,
            HomeFlag: true
        };

        $scope.GetSeoTitle = function () {
            $scope.brand.Alias = commonService.getSeoTitle($scope.brand.Name);
        }

        $scope.AddBrand = function () {
            apiService.post(
                'https://localhost:44353/api/brand/create',
                $scope.brand,
                function (result) {
                    notificationService.displaySuccess('Thêm thương hiệu thành công');
                    $state.go('product_categories');
                },
                function (error) {
                    notificationService.displayError('Thêm mới không thành công.');
                });
        }

    }


})(angular.module('shop.brands'));