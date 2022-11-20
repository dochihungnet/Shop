(function (app) {
    app.controller('productDetailsController', productEditController);

    productEditController.$inject = ['apiService', '$scope', '$state', 'notificationService', '$stateParams', 'commonService'];

    function productEditController(apiService, $scope, $state, notificationService, $stateParams, commonService) {
        $scope.brands = [];
        $scope.productCategories = [];
        $scope.product = {

        };

        function loadProductDetail() {
            apiService.get(
                'https://localhost:44353/api/product/getbyid/' + $stateParams.id,
                null,
                function (result) {
                    $scope.product = result.data;
                    $scope.moreImages = JSON.parse($scope.product.MoreImages);
                },
                function (error) {
                    notificationService.displayError(error.data);
                }
            )
        }


        function getListProductCategory() {
            apiService.get(
                'https://localhost:44353/api/productcategory/getallparents',
                null,
                function (result) {
                    $scope.productCategories = result.data;
                    console.log('Lấy danh sách danh mục sản phẩm thành công.');
                },
                function (error) {
                    console.log('Lấy danh sách danh mục sản phẩm thất bại.');
                }
            )
        }

        function getListBrand() {
            apiService.get('https://localhost:44353/api/brand/getall',
                null,
                function (result) {
                    $scope.brands = result.data;
                    console.log('Lấy danh sách thương hiệu thành công.');
                },
                function (error) {
                    console.log('Lấy danh sách thương hiệu thất bại.');
                }
            )
        }

        

        loadProductDetail();
        getListProductCategory();
        getListBrand();
    }
})(angular.module('shop.products'));