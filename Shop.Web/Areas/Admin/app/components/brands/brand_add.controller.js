(function (app) {
    app.controller('brandAddController', brandAddController);

    brandAddController.$inject = ['$scope', 'apiService', '$state', 'notificationService', 'commonService'];

    function brandAddController($scope, apiService, $state, notificationService, commonService) {
        $scope.brand = {
            Status: true,
            HomeFlag: true
        };

        $scope.GetSeoTitle = GetSeoTitle;
        $scope.AddBrand = AddBrand;
        $scope.ChooseImage = ChooseImage;


        function GetSeoTitle() {
            $scope.brand.Alias = commonService.getSeoTitle($scope.brand.Name);
        }

        function AddBrand() {
            apiService.post(
                'https://localhost:44353/api/brand/create',
                $scope.brand,
                function (result) {
                    notificationService.displaySuccess('Thêm thương hiệu thành công');
                    $state.go('brands');
                },
                function (error) {
                    notificationService.displayError('Thêm mới không thành công.');
                });
        }

        function ChooseImage() {
            let finder = new CKFinder();
            finder.selectActionFunction = function (fileUrl) {
                $scope.$apply(function () {
                    $scope.brand.Image = fileUrl;
                });
            }
            finder.popup();
        }

    }


})(angular.module('shop.brands'));