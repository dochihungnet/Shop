(function (app) {
    app.controller('brandEditController', brandEditController);

    brandEditController.$inject = ['apiService', '$scope', 'notificationService', '$state', '$stateParams', 'commonService'];

    function brandEditController(apiService, $scope, notificationService, $state, $stateParams, commonService) {
        $scope.brand = {
            CreatedDate: new Date(),
            Status: true,
            HomeFlag: true
        }

        $scope.GetSeoTitle = GetSeoTitle;
        $scope.UpdateBrand = UpdateBrand;



        function GetSeoTitle() {
            $scope.brand.Alias = commonService.getSeoTitle($scope.brand.Name);
        }

        function loadBrandDetail() {
            apiService.get(
                'https://localhost:44353/api/productcategory/getbyid/' + $stateParams.id,
                null,
                function (result) {
                    $scope.brand = result.data;
                },
                function (error) {
                    notificationService.displayError(error.data);
                }
            );
        }

        function UpdateBrand() {
            apiService.put(
                'https://localhost:44353/api/brand/update',
                $scope.brand,
                function (result) {
                    notificationService.displaySuccess('Cập nhập thành công.');
                    $state.go('brands');
                },
                function (error) {
                    notificationService.displayError('Cập nhật không thành công.');
                }
            );
        }

        loadBrandDetail();
    }

})(angular.module('shop.brands'));