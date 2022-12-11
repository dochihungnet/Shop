(function (app) {
    app.controller('productCategoriesController', productCategoriesController);

    productCategoriesController.$inject = [
        'apiService', 
        '$scope',
        '$state', 
        'notificationService',
        '$stateParams',
        '$timeout',
        '$q',
        'cartService'
    ];

    function productCategoriesController(apiService, $scope, $state, notificationService, $stateParams, $timeout, $q, cartService) {
        
        $scope.productCategory = null;
        $scope.products = [];
        $scope.brands = [];
        $scope.productCategoriesChild = [];

        $scope.keyword = '';
        $scope.minPrice = null;
        $scope.maxPrice = null;
        $scope.sortBy = 0;
        $scope.page = 0;
        $scope.pageSize = 15;
        $scope.pageCount = 0;
        $scope.categoryId = null;
        $scope.brandId = null;

        getProductCategory().then(result => {
            $scope.productCategory = result;
        });

        getListBrand().then(result => {
            $scope.brands = result;
        })

        getListProductCategoryChild().then(result => {
            $scope.productCategoriesChild = result;
        })

        getListProduct().then(result => {
            $scope.products = handlerResponseData(result.Items);
            $scope.page = result.Page;
            $scope.pageCount = result.TotalPages;
            $scope.totalCount = result.TotalCount;
        })



        $scope.handlerCheckedInputBrand = handlerCheckedInputBrand;
        $scope.handlerCheckedInputProductCategory = handlerCheckedInputProductCategory;
        $scope.search = search;
        $scope.reset = reset;
        $scope.changeSortBy = changeSortBy;
        $scope.changePageSize = changePageSize;
        $scope.search = search;
        
        $scope.changeRangePrice = changeRangePrice;
        
        $scope.addProductShoppingCart = addProductShoppingCart;

        /////////////////////////////////////////////////////////////////////////////////
        //////////////////// FUNCTION HANDLER
        /////////////////////////////////////////////////////////////////////////////////
        
        function addProductShoppingCart(product){
            cartService.addProductShoppingCart(product);
        }
        function changeRangePrice() {
            $scope.minPrice = $('.min_value').val();
            $scope.maxPrice = $('.max_value').val();
        }

        function reset() {
            $scope.brands = $scope.brands.map(x => {
                x.checked = false;
                return x;
            });
            $scope.productCategoriesChild = $scope.productCategoriesChild.map(x => {
                x.checked = false;
                return x;
            });
            $scope.keyword = '';

            getListProduct().then(result => {
                $scope.products = [];
                $scope.products = handlerResponseData(result.Items);
                $scope.page = result.Page;
                $scope.pageCount = result.TotalPages;
                $scope.totalCount = result.TotalCount;
            })

        }

        function search(page) {
            getListProduct(page).then(result => {
                $scope.products = [];
                $scope.products = handlerResponseData(result.Items);
                $scope.page = result.Page;
                $scope.pageCount = result.TotalPages;
                $scope.totalCount = result.TotalCount;
            })
        }
        function changeSortBy() {
            getListProduct().then(result => {
                $scope.products = [];
                $scope.products = handlerResponseData(result.Items);
                $scope.page = result.Page;
                $scope.pageCount = result.TotalPages;
                $scope.totalCount = result.TotalCount;
            })
        }

        function changePageSize() {
            getListProduct().then(result => {
                $scope.products = [];
                $scope.products = handlerResponseData(result.Items);
                $scope.page = result.Page;
                $scope.pageCount = result.TotalPages;
                $scope.totalCount = result.TotalCount;
            })
        }

        // lấy danh sách sản phẩm theo page
        function getListProduct(page) {
            var deferred = $q.defer();
            page = page || 0;

            var category = $scope.productCategoriesChild.find(x => x.checked);
            $scope.categoryId = category ? category.Id : $stateParams.id;

            var brand = $scope.brands.find(x => x.checked);
            $scope.brandId = brand ? brand.Id : null;

            var config = {
                params: {
                    keyword: $scope.keyword,
                    page: page,
                    pageSize: $scope.pageSize,
                    minPrice: $scope.minPrice,
                    maxPrice: $scope.maxPrice,
                    categoryId: $scope.categoryId,
                    brandId: $scope.brandId,
                    sortBy: $scope.sortBy
                }
            };
            apiService.get(
                'https://localhost:44353/api/product/getall',
                config,
                function (result) {
                    deferred.resolve(result.data);
                },
                function () {
                    deferred.reject('lấy sản phẩm thất bại.')
                }
            );

            return deferred.promise;
        }



        function getProductCategory() {
            var deferred = $q.defer();

            apiService.get(
                'https://localhost:44353/api/productcategory/getbyid/' + $stateParams.id ,
                null,
                function (result) {
                    deferred.resolve(result.data);
                },
                function (error) {
                    deferred.reject(`Lấy product category by id không thành công`);
                }

            );
            return deferred.promise;
        }

        function getListProductCategoryChild(){
            var deferred = $q.defer();

            var config = {
                params: {
                    parentId: $stateParams.id
                }
            }

            apiService.get(
                'https://localhost:44353/api/productcategory/getallchild',
                config,
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

        $timeout(init, 10);

        function handlerCheckedInputProductCategory(id) {
            // nếu productcategory == id và checked == true thì tất cả các ô input khác checked = false và ô input có id thì checked == true
            // nếu productcategory == id và checked == false thì return
            var input = $scope.productCategoriesChild.find(x => x.Id == id);

            if (!input.checked) {
                ///////////////
                return;
            }

            $scope.productCategoriesChild = $scope.productCategoriesChild.map(function (pc) {
                if (pc.Id === id) {
                    return pc;
                }
                else {
                    pc.checked = false;
                    return pc;
                }
            });

            // call data
            //////////////////

        }

        function handlerCheckedInputBrand(id) {
            var input = $scope.brands.find(x => x.Id == id);

            if (!input.checked) {
                ///////////////
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

            // call data
            //////////////////

        }

        // xử lý xem sản phẩm nào là sản phẩm new
        function handlerResponseData(product, days) {
            return product.map(x => {
                var result = new Date(x.CreatedDate);
                result.setDate(result.getDate() + days);

                if (result > new Date()) {
                    x.IsANewProduct = true;
                }
                else {
                    x.IsANewProduct = false;
                }
                return x;
            })
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


})(angular.module('shop.product_categories'));



