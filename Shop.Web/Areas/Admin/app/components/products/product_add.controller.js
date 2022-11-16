(function (app) {
    app.controller('productAddController', productAddController);

    productAddController.$inject = ['apiService', '$scope', '$state', 'notificationService', 'commonService'];

    function productAddController(apiService, $scope, $state, notificationService, commonService) {
        $scope.product = {
            CreatedDate: new Date,
            Status: true,


        };

        $scope.ckeditorOptions = {
            languague: 'vi',
            height: '200px'
        }
        // handler event click button add product

        $scope.AddProduct = function () {

            $scope.product.MoreImages = JSON.stringify($scope.moreImages);

            apiService.post('https://localhost:44353/api/product/create',
                $scope.product,
                function (result) {
                    notificationService.displaySuccess('Thêm sản phẩm thành công.');
                    $state.go('products');
                },
                function result(error) {
                    notificationService.displayError('Thêm sản phẩm thất bại.');
                }
            )
        };

        $scope.GetSeoTitle = function () {
            $scope.product.Alias = commonService.getSeoTitle($scope.product.Name);
        }


        function getListProductCategory() {
            apiService.get('https://localhost:44353/api/productcategory/getallparents',
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
        getListBrand();
    }
})(angular.module('shop.products'));