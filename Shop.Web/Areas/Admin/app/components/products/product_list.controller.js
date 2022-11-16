(function (app) {
    app.controller('productListController', productListController);

    productListController.$inject = ['$scope', 'apiService', 'notificationService', '$ngBootbox', '$filter'];

    function productListController($scope, apiService, notificationService, $ngBootbox, $filter) {
        $scope.products = [];

        $scope.page = 0;
        $scope.pageSize = 10;
        $scope.pageCount = 0;

        $scope.keyword = '';

        $scope.getListProduct = getListProduct;

        $scope.search = search;

        $scope.deleteProduct = deleteProduct;

        $scope.selectAll = selectAll;

        $scope.deleteMultiple = deleteMultiple;

        function deleteMultiple() {
            var listId = [];
            $.each($scope.selected, function (idx, item) {
                listId.push(item.Id);
            });

            var config = {
                params: {
                    checkedProducts: JSON.stringify(listId)
                }
            };

            apiService.del(
                'https://localhost:44353/api/product/deletemultiple',
                config,
                function (result) {
                    notificationService.displaySuccess('Xóa thàn công ' + result.data + ' sản phẩm');
                    search();
                },
                function (error) {
                    notificationService.displayError('Xóa thất bại ..., bùn ghê!')
                }
            )
        }

        $scope.isAll = false;
        function selectAll() {
            // đây là func sẽ chạy nếu sảy ra sự kiện click từ 1 button nào đó
            // nếu isAll đang là true => khi click vào sẽ chuyển thành false
            if ($scope.isAll) {
                angular.forEach($scope.products, function (item) {
                    item.checked = false;
                });
                $scope.isAll = false;
            }
            else {
                angular.forEach($scope.products, function (item) {
                    item.checked = true;
                });
                $scope.isAll = true;
            }
        }

        $scope.$watch("products", function (newVal, oldVal) {

            var checked = $filter("filter")(newVal, { checked: true });

            if (checked.length) {
                $scope.selected = checked;
                $('#btnDelete').removeAttr('disabled');
            }
            else {
                $('#btnDelete').attr('disabled', 'disabled');
            }

        }, true);

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
                            search();
                        },
                        function (error) {
                            notificationService.displayError('Xóa sản phẩm thất bại!')
                        }
                    )


                })
        }

        function search() {
            getListProduct();
        }

        // lấy danh sách sản phẩm theo page
        function getListProduct(page) {
            page = page || 0;
            var config = {
                params: {
                    keyword: $scope.keyword,
                    page: page,
                    pageSize: $scope.pageSize
                }
            };
            apiService.get(
                'https://localhost:44353/api/product/getall',
                config,
                function (result) {
                    $scope.products = result.data.Items;
                    $scope.page = result.data.Page;
                    $scope.pageCount = result.data.TotalPages;
                    $scope.totalCount = result.data.TotalCount;
                },
                function () {
                    console.log('load product failed');
                }
            );
        }

        $scope.getListProduct();

    }
})(angular.module('shop.products'));