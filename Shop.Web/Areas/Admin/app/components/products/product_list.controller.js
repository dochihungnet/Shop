(function (app) {
    app.controller('productListController', productListController);

    productListController.$inject = ['$scope', 'apiService', 'notificationService', '$ngBootbox', '$filter', '$timeout', '$q', '$log'];

    function productListController($scope, apiService, notificationService, $ngBootbox, $filter, $timeout, $q, $log) {
        $scope.products = [];
        $scope.productCategories = [];
        $scope.brands = [];

        $scope.page = 0;
        $scope.pageSize = 10;
        $scope.pageCount = 0;

        $scope.keyword = '';

        $scope.getListProduct = getListProduct;
        $scope.search = search;
        $scope.deleteProduct = deleteProduct;
        $scope.selectAll = selectAll;
        $scope.deleteMultiple = deleteMultiple;
        $scope.handlerCheckedInput = handlerCheckedInput;

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

        function handlerCheckedInput(id) {
            console.log(id);
            $scope.productCategories = $scope.productCategories.map(function (pc) {
                if (id === -1) {
                    pc.checked = false;
                    return pc;
                }
                else if (pc.Id === id && pc.checked) {
                    $scope.allProductCategory.checked = false;
                }
                else {
                    pc.checked = false;
                }
                return pc;
            });
        }

        getListProduct();
        getListProductCategory();
        getListBrand();


        // ==================================
        handleSearchProduct($scope, $q, $log, apiService);
        

    }
})(angular.module('shop.products'));



function handleSearchProduct($scope, $q, $log, apiService) {
    $scope.simulateQuery = false;
    $scope.isDisabled = false;

    $scope.repos = loadAll().then(res => {
        $scope.repos = res;
    }).catch();
    $scope.querySearch = querySearch;
    $scope.selectedItemChange = selectedItemChange;
    $scope.searchTextChange = searchTextChange;


    function querySearch(query) {
        console.log($scope.repos);
        var results = query ? $scope.repos.filter(createFilterFor(query)) : $scope.repos, deferred;
        return results;
    }

    function searchTextChange(text) {
        $log.info('Text changed to ' + text);
    }

    function selectedItemChange(item) {
        $log.info('Item changed to ' + JSON.stringify(item));
    }

    function loadAll() {

        var repos = [];
        var deferred = $q.defer();
        apiService.get(
            'https://localhost:44353/api/product/getall',
            null,
            function (result) {
                repos = result.data;
                repos = repos.map(function (repo) {
                    repo.value = repo.Name.toLowerCase();
                    return repo;
                });
                deferred.resolve(repos);

            },
            function () {
                console.log('Lay danh sach san pham that bai.');
                deferred.reject(repos);
            }
        );

        return deferred.promise;

    }

    function createFilterFor(query) {
        var lowercaseQuery = query.toLowerCase();

        return function filterFn(item) {
            return (item.value.indexOf(lowercaseQuery) === 0);
        };

    }
}
