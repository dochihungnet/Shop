(function (app) {
    app.controller('productDetailsController', productDetailsController);

    productDetailsController.$inject = ['apiService', '$scope', '$state', 'notificationService', '$stateParams', 'commonService', '$ngBootbox'];

    function productDetailsController(apiService, $scope, $state, notificationService, $stateParams, commonService, $ngBootbox) {
        $scope.brands = [];
        $scope.productCategories = [];
        $scope.product = {

        };

        $scope.deleteProduct = deleteProduct;


        function loadProductDetail() {
            apiService.get(
                'https://localhost:44353/api/product/getbyidinclude/' + $stateParams.id,
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

        function deleteProduct(id) {
            $ngBootbox.confirm('Bạn có chắc muốn xóa sản phẩm này không?')
                .then(function (result) {

                    var config = {
                        params: {
                            id: id
                        }
                    };

                    apiService.del(
                        'https://localhost:44353/api/product/delete',
                        config,
                        function (result) {
                            notificationService.displaySuccess('Xóa sản phẩm thành công!');
                            $state.go('products');
                        },
                        function (error) {
                            notificationService.displayError('Xóa sản phẩm thất bại!')
                        }
                    )


                })
        }

        loadProductDetail();
        getListProductCategory();
        getListBrand();
    }
})(angular.module('shop.products'));