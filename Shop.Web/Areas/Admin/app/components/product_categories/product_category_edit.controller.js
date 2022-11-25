(function (app) {
    app.controller('productCategoryEditController', productCategoryEditController);

    productCategoryEditController.$inject = ['apiService', '$scope', 'notificationService', '$state', '$stateParams', 'commonService'];

    function productCategoryEditController(apiService, $scope, notificationService, $state, $stateParams, commonService) {
        $scope.productCategory = {
            CreatedDate: new Date(),
            Status: true,
            HomeFlag: true
        }

        $scope.UpdateProductCategory = UpdateProductCategory;

        $scope.GetSeoTitle = function () {
            $scope.productCategory.Alias = commonService.getSeoTitle($scope.productCategory.Name);
        }

        function loadProductCategoryDetail() {
            apiService.get(
                'https://localhost:44353/api/productcategory/getbyid/' + $stateParams.id,
                null,
                function (result) {
                    $scope.productCategory = result.data;
                },
                function (error) {
                    notificationService.displayError(error.data);
                }
            );
        }

        function UpdateProductCategory() {
            apiService.put(
                'https://localhost:44353/api/productcategory/update',
                $scope.productCategory,
                function (result) {
                    notificationService.displaySuccess('Cập nhập thành công.');
                    $state.go('product_categories');
                },
                function (error) {
                    notificationService.displayError('Cập nhật không thành công.');
                }
            );
        }

        function loadParentCategory() {
            apiService.get(
                'https://localhost:44353/api/productcategory/getallparents',
                null,
                function (result) {
                    $scope.parentCategories = result.data;
                },
                function () {
                    console.log('Cannot get list parent');
                }
            );
        }

        $scope.ChooseImage = function () {
            var finder = new CKFinder();
            finder.selectActionFunction = function (fileUrl) {
                $scope.$apply(function () {
                    $scope.productCategory.Image = fileUrl;
                });
            }
            finder.popup();
        }

        loadParentCategory();
        loadProductCategoryDetail();
    }

})(angular.module('shop.product_categories'));