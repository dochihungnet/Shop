(function (app) {
    app.controller('productEditController', productEditController);

    productEditController.$inject = ['apiService', '$scope', '$state', 'notificationService', '$stateParams', 'commonService'];

    function productEditController(apiService, $scope, $state, notificationService, $stateParams, commonService) {
        $scope.product = {

        };

        $scope.ckeditorOptions = {
            languague: 'vi',
            height: '200px'
        }

        // handler event click button add product

        $scope.UpdateProduct = function () {
            $scope.product.MoreImages = JSON.stringify($scope.moreImages);

            apiService.put(
                'https://localhost:44353/api/product/update',
                $scope.product,
                function (result) {
                    notificationService.displaySuccess('Cập nhập sản phẩm thành công.');
                    $state.go('products');
                },
                function result(error) {
                    notificationService.displayError('Cập nhập sản phẩm thất bại.');
                }
            )
        }

        $scope.GetSeoTitle = function () {
            $scope.product.Alias = commonService.getSeoTitle($scope.product.Name);
        }

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

        $scope.ChooseImage = function () {
            var finder = new CKFinder();
            finder.selectActionFunction = function (fileUrl) {
                $scope.$apply(function () {
                    $scope.product.Image = fileUrl;
                });
            }
            finder.popup();
        }

        $scope.moreImages = [];

        $scope.ChooseMoreImage = function () {
            var finder = new CKFinder();
            finder.selectActionFunction = function (fileUrl) {
                $scope.$apply(function () {
                    $scope.moreImages.push(fileUrl);
                });
            }
            finder.popup();
            console.log($scope.moreImages);
        }

        getListProductCategory();
        loadProductDetail();
    }
})(angular.module('shop.products'));