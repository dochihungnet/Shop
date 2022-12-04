 (function (app) {

    app.controller('productCategoryAddController', productCategoryAddController);

    productCategoryAddController.$inject = ['$scope', 'apiService', '$state', 'notificationService', 'commonService'];

    function productCategoryAddController($scope, apiService, $state, notificationService, commonService) {
        $scope.productCategory = {
            CreatedDate: new Date(),
            CreatedBy: "Admin",
            Status: true,
            HomeFlag: true
        };

        $scope.parentCategories = [];

        $scope.GetSeoTitle = function () {
            $scope.productCategory.Alias = commonService.getSeoTitle($scope.productCategory.Name);
        }

        $scope.AddProductCategory = function () {
            apiService.post(
                'https://localhost:44353/api/productcategory/create',
                $scope.productCategory,
                function (result) {
                    notificationService.displaySuccess('Thêm danh mục thành công');
                    $state.go('product_categories');
                },
                function (error) {
                    notificationService.displayError('Thêm mới không thành công.');
                });
        }

        function loadParentCategory() {
            apiService.get(
                'https://localhost:44353/api/productcategory/getallroot',
                null,
                function (result) {
                    $scope.parentCategories = result.data;
                },
                function (error) {
                    console.log("Lấy danh sách product category không thành công.")
                }
            )
        };

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

    }


})(angular.module('shop.product_categories'));