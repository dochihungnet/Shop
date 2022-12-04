(function (app) {
    app.controller('productTagsController', productTagsController);

    productTagsController.$inject = ['apiService', '$scope', '$state', 'notificationService', '$stateParams', '$timeout', '$q'];

    function productTagsController(apiService, $scope, $state, notificationService, $stateParams, $timeout, $q) {


        $scope.tag;
        $scope.products = [];
        $scope.productCategories = [];
        $scope.brands = [];


        $scope.keyword = '';
        $scope.page = 0;
        $scope.pageSize = 15;
        $scope.sortBy = 0;
        $scope.pageCount = 0;

        $scope.minPrice = 0;
        $scope.maxPrice = 200000000;

        $scope.brandId;
        $scope.categoryId;



        GetTag().then(result => {
            $scope.tag = result;
        });

        getAllProductByTagId().then(result => {
            $scope.products = handlerResponseData(result.Items);
            $scope.page = result.Page;
            $scope.pageCount = result.TotalPages;
            $scope.totalCount = result.TotalCount;
        });

        getListProductCategoryRoot().then(result => {
            $scope.productCategories = result;
        });

        getListBrand().then(result => {
            $scope.brands = result;
        });


        $timeout(init, 0);


        $scope.handlerCheckedInputBrand = handlerCheckedInputBrand;
        $scope.handlerCheckedInputProductCategory = handlerCheckedInputProductCategory;
        $scope.search = search;
        $scope.reset = reset;
        $scope.changeSortBy = changeSortBy;
        $scope.changePageSize = changePageSize;

        $scope.changeRangePrice = changeRangePrice;


        ///////////////////////////////////////////////////////
        //////////////// FUNC HANDLER
        ///////////////////////////////////////////////////////
        function reset() {
            $scope.brand = $scope.brands.map(x => {
                x.checked = false;
                return x;
            })

            $scope.productCategories = $scope.productCategories.map(x => {
                x.checked = false;
                return x;
            })

            getAllProductByTagId().then(result => {
                $scope.products = handlerResponseData(result.Items);
                $scope.page = result.Page;
                $scope.pageCount = result.TotalPages;
                $scope.totalCount = result.TotalCount;
            });
        }
        function search(page) {
            getAllProductByTagId(page).then(result => {
                $scope.products = handlerResponseData(result.Items);
                $scope.page = result.Page;
                $scope.pageCount = result.TotalPages;
                $scope.totalCount = result.TotalCount;
            });
        }

        function changeSortBy() {
            getAllProductByTagId().then(result => {
                $scope.products = [];
                $scope.products = handlerResponseData(result.Items);
                $scope.page = result.Page;
                $scope.pageCount = result.TotalPages;
                $scope.totalCount = result.TotalCount;
            })
        }

        function changePageSize() {
            getAllProductByTagId().then(result => {
                $scope.products = [];
                $scope.products = handlerResponseData(result.Items);
                $scope.page = result.Page;
                $scope.pageCount = result.TotalPages;
                $scope.totalCount = result.TotalCount;
            })
        }

        function GetTag() {
            var deferred = $q.defer();
            apiService.get(
                'https://localhost:44353/api/tag/getbyid/' + $stateParams.id,
                null,
                function (result) {
                    deferred.resolve(result.data);
                },
                function (error) {
                    deferred.reject('Lấy tag by tag id thất bại');
                }
            );

            return deferred.promise;
        }

        //getallproductbytagid
        function getAllProductByTagId(page) {
            var deferred = $q.defer();

            page = page || 0;

            var category = $scope.productCategories.find(x => x.checked);
            $scope.categoryId = category ? category.Id : null;

            var brand = $scope.brands.find(x => x.checked);
            $scope.brandId = brand ? brand.Id : null;

            var config = {
                params: {
                    tagId: $stateParams.id,
                    keyword: $scope.keyword,
                    page: page,
                    pageSize: $scope.pageSize,
                    minPrice: $scope.minPrice,
                    maxPrice: $scope.maxPrice,
                    categoryId: $scope.categoryId,
                    brandId: $scope.brandId,
                    sortBy: $scope.sortBy
                }
            }

            apiService.get(
                'https://localhost:44353/api/product/getallproductbytagid',
                config,
                function (result) {
                    deferred.resolve(result.data);
                },
                function (error) {
                    deferred.reject('Lấy all product by tag id thất bại');
                }
            );

            return deferred.promise;
        }

        function getListProductCategoryRoot() {
            var deferred = $q.defer();

            apiService.get(
                'https://localhost:44353/api/productcategory/getallroot',
                null,
                function (result) {
                    deferred.resolve(result.data);
                },
                function (error) {
                    deferred.reject(`Lấy list product category child không thành công`);
                }

            );
            return deferred.promise;
        }

        function getListBrand() {
            var deferred = $q.defer();

            apiService.get(
                'https://localhost:44353/api/brand/getall',
                null,
                function (result) {
                    deferred.resolve(result.data);
                },
                function (error) {
                    deferred.reject(`Lấy list brand không thành công`);
                }

            );
            return deferred.promise;
        }

        function handlerCheckedInputProductCategory(id) {
            // nếu productcategory == id và checked == true thì tất cả các ô input khác checked = false và ô input có id thì checked == true
            // nếu productcategory == id và checked == false thì return
            var input = $scope.productCategories.find(x => x.Id == id);

            if (!input.checked) {
                return;
            }

            $scope.productCategories = $scope.productCategories.map(function (pc) {
                if (pc.Id === id) {
                    return pc;
                }
                else {
                    pc.checked = false;
                    return pc;
                }
            });

        }

        function handlerCheckedInputBrand(id) {
            var input = $scope.brands.find(x => x.Id == id);

            if (!input.checked) {
                return;
            }

            $scope.brands = $scope.brands.map(function (b) {
                if (b.Id === id) {
                    return b;
                }
                else {
                    b.checked = false;
                    return b;
                }
            });

        }

        // xử lý xem sản phẩm nào là new
        function handlerResponseData(products, days) {
            return products.map(x => {
                var result = new Date(x.CreatedDate);
                result.setDate(result.getDate() + days);

                if (result > new Date()) x.IsANewProduct = true;
                else x.IsANewProduct = false;

                return x;
            });
        }

        // change range price
        function changeRangePrice() {
            $scope.minPrice = $('.min_value').val();
            $scope.maxPrice = $('.max_value').val();
        }

        // Thêm file js vào cuối body sau khi chạy hết logic angularjs + html/csss
        function init() {
            $("script[src='/assets/client/js/themejs/homepage.js']").remove();
            $("script[src='/assets/client/js/themejs/so_megamenu.js']").remove();
            $("script[src='/assets/client/js/themejs/application.js']").remove();

            $('body').append('<script type="text/javascript" src="/assets/client/js/themejs/homepage.js"></script>');
            $('body').append('<script type="text/javascript" src="/assets/client/js/themejs/so_megamenu.js"></script>');
            $('body').append('<script type="text/javascript" src="/assets/client/js/themejs/application.js"></script>');
        }

    }


})(angular.module('shop.product_tags'));



