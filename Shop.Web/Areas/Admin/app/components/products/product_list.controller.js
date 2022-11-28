(function (app) {
    app.controller('productListController', productListController);

    productListController.$inject = ['$scope', '$state', 'apiService', 'notificationService', '$ngBootbox', '$filter', '$timeout', '$q', '$log', '$uibModal'];

    function productListController($scope, $state, apiService, notificationService, $ngBootbox, $filter, $timeout, $q, $log, $uibModal) {
        $scope.products = [];
        $scope.productCategories = [];
        $scope.brands = [];

        $scope.page = 0;
        $scope.pageSize = 10;
        $scope.pageCount = 0;
        $scope.categoryId; 
        $scope.brandId;
        $scope.status = null;

        $scope.deleteProduct = deleteProduct;
        $scope.selectAll = selectAll;
        $scope.deleteMultiple = deleteMultiple;

        // xử lý sự kiện checked Input ProductCategory: search product theo ProductCategory
        $scope.handlerCheckedInputProductCategory = handlerCheckedInputProductCategory;

        // xử lý sự kiện checked Input Brand: search product theo brand
        $scope.handlerCheckedInputBrand = handlerCheckedInputBrand;

        // xử lý sự kiện
        $scope.handlerEventChangeStatus = handlerEventChangeStatus;

        // xử lý sự kiện click input Status của Product
        $scope.handlerEventClickInputStatusProduct = handlerEventClickInputStatusProduct;

        // xử lý sự kiện click input StatusDiscount của product
        $scope.handlerEventClickInputStatusDiscountProduct = handlerEventClickInputStatusDiscountProduct;


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
                    getListProduct();
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

            if (checked && checked.length) {
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
                            getListProduct();
                        },
                        function (error) {
                            notificationService.displayError('Xóa sản phẩm thất bại!')
                        }
                    )


                })
        }

        // lấy danh sách sản phẩm theo page
        function getListProduct(page) {
            page = page || 0;

            var category = $scope.productCategories.find(x => x.checked);
            $scope.categoryId = category ? category.Id : null;

            var brand = $scope.brands.find(x => x.checked);
            $scope.brandId = brand ? brand.Id : null;

            var config = {
                params: {
                    page: page,
                    pageSize: $scope.pageSize,
                    status: $scope.status,
                    categoryId: $scope.categoryId,
                    brandId: $scope.brandId,
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

        function handlerCheckedInputProductCategory(id) {
            // nếu productcategory == id và checked == true thì tất cả các ô input khác checked = false và ô input có id thì checked == true
            // nếu productcategory == id và checked == false thì return
            var input = $scope.productCategories.find(x => x.Id == id);

            if (!input.checked) {
                console.log($scope.productCategories);
                getListProduct();
                return;
            }

            $scope.productCategories = $scope.productCategories.map(function (pc) {
                if (pc.Id === id)
                {
                    return pc;
                }
                else
                {
                    pc.checked = false;
                    return pc;
                }
            });

            // call data
            getListProduct();

        }

        function handlerCheckedInputBrand(id) {
            var input = $scope.brands.find(x => x.Id == id);
            if (!input.checked) {
                // call data
                getListProduct();
                return;
            }

            $scope.brands = $scope.brands.map(function (b) {
                if (b.Id === id) { return b; }
                else {
                    b.checked = false;
                    return b;
                }
            });

            // call data
            getListProduct();
        }

        function handlerEventChangeStatus() {
            getListProduct();
        }

        function handlerEventClickInputStatusProduct($event, id) {
            $event.preventDefault();
            var product = { ...$scope.products.find(x => x.Id == id) };

            product.Status = !product.Status;

            $ngBootbox.confirm('Bạn có chắc chắn muốn thay đổi trạng thái không?')
                .then(function (result) {
                    apiService.put(
                        'https://localhost:44353/api/product/update',
                        product,
                        function (result) {
                            notificationService.displaySuccess('Cập nhập trạng thái thành công!');
                            getListProduct();
                        },
                        function (error) {
                            notificationService.displayError('Cập nhập trạng thái thất bại!')
                        }
                    )
                }, function () {
                    
                }
                )
        }

        function handlerEventClickInputStatusDiscountProduct($event, id) {
            $event.preventDefault();
            var product = { ...$scope.products.find(x => x.Id == id) };
            product.EndDiscountDate = product.StatusDiscount ? new Date(product.EndDiscountDate) : product.EndDiscountDate;

            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: '/Areas/Admin/app/shared/views/modal_add_discount.html',
                controller: 'ModalInstanceCtrl',
                controllerAs: '$ctrl',
                size: 'lg',
                resolve: {
                    product: function () {
                        return product;
                    }
                }
            });

            modalInstance.result.then(function () {
                getListProduct();
            });
        }
        getListProduct();
        getListProductCategory();
        getListBrand();


        // ==================================
        handleSearchProduct($state ,$scope, $q, $log, apiService);
        

    }

    app.controller('ModalInstanceCtrl', function ($uibModalInstance, product, apiService, notificationService) {
        var $ctrl = this;

        $ctrl.product = product;
        $ctrl.minEndDate = new Date();

        if ($ctrl.product.StatusDiscount == false || $ctrl.product.StatusDiscount == null) {

            $ctrl.Title = "Thêm mã giảm giá";

            $ctrl.showBtnDelete = false;
            $ctrl.showBtnUpdate = false;
            $ctrl.showBtnAdd = true;
            $ctrl.showBtnCancel = true;
        }
        else {

            $ctrl.Title = "Cập nhập mã giảm giá";

            $ctrl.showBtnDelete = true;
            $ctrl.showBtnUpdate = true;
            $ctrl.showBtnAdd = false;
            $ctrl.showBtnCancel = true;
        }

        $ctrl.delete = function () {
            $ctrl.product.PromotionPrice = null;
            $ctrl.product.PriceAfterDiscount = null;
            $ctrl.product.EndDiscountDate = null;
            $ctrl.product.StatusDiscount = false;

            apiService.put(
                'https://localhost:44353/api/product/update',
                $ctrl.product,
                function (result) {
                    $uibModalInstance.close();
                    notificationService.displaySuccess('Xóa mã giảm giá thành công');
                },
                function result(error) {
                    notificationService.displayError('Xóa mã giảm giá thất bại.');
                }
            )
        };

        $ctrl.update = function () {

            $ctrl.product.StatusDiscount = true;
            $ctrl.product.PriceAfterDiscount = $ctrl.product.Price - $ctrl.product.Price * $ctrl.product.PromotionPrice / 100;

            apiService.put(
                'https://localhost:44353/api/product/update',
                $ctrl.product,
                function (result) {
                    $uibModalInstance.close();
                    notificationService.displaySuccess('Cập nhập mã giảm giá thành công');
                },
                function result(error) {
                    notificationService.displayError('Cập nhập mã giảm giá thất bại.');
                }
            )
        };

        $ctrl.add = function () {

            $ctrl.product.StatusDiscount = true;
            $ctrl.product.PriceAfterDiscount = $ctrl.product.Price - $ctrl.product.Price * $ctrl.product.PromotionPrice / 100;

            apiService.put(
                'https://localhost:44353/api/product/update',
                $ctrl.product,
                function (result) {
                    $uibModalInstance.close();
                    notificationService.displaySuccess('Thêm mã giảm giá thành công');
                },
                function result(error) {
                    notificationService.displayError('Thêm sản phẩm thất bại.');
                }
            )

        };

        $ctrl.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

})(angular.module('shop.products'));



function handleSearchProduct($state ,$scope, $q, $log, apiService) {
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
        console.log(item);
        var idProductSelect = item.Id;
        console.log(item.Id);
        console.log($state);
        $state.go(`product_details`, { id: idProductSelect });
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
