(function (app) {
    app.controller('productCategoriesController', productCategoriesController);

    productCategoriesController.$inject = ['apiService', '$scope', '$state', 'notificationService', '$stateParams', '$timeout', '$q'];

    function productCategoriesController(apiService, $scope, $state, notificationService, $stateParams, $timeout, $q) {

        $q.all([
            

        ]).then(function (result) {
            
        });




        // get danh sách sản phẩm mới nhất
        function getAllProductLatest(size) {
            var deferred = $q.defer();

            var config = {
                params: {
                    size: size
                }
            }

            apiService.get(
                `https://localhost:44353/api/product/getnew`,
                config,
                function (result) {
                    deferred.resolve(result.data);
                },
                function (error) {
                    deferred.reject(`Lấy product new không thành công`);
                }

            );
            return deferred.promise;
        }

        function getAllRootProductCategory() {
            var deferred = $q.defer();
            apiService.get(
                'https://localhost:44353/api/productcategory/getallroot',
                null,
                function (result) {
                    deferred.resolve(result.data);
                },
                function (error) {
                    deferred.reject('Lấy root product category không thành công');
                }

            );
            return deferred.promise;
        }

        function getAllProductCateory() {
            var deferred = $q.defer();
            apiService.get(
                'https://localhost:44353/api/productcategory/getallparents',
                null,
                function (result) {
                    deferred.resolve(result.data);
                },
                function (error) {
                    deferred.reject('Lấy product category không thành công');
                }

            );
            return deferred.promise;
        }

        function getAllProductCategoryChild(id) {
            return $scope.listProductCategory.filter(x => x.ParentId == id);
        }

        // kiểm tra product Category id có tồn tại con hay không?
        function checkExistChild(id) {
            return $scope.listProductCategory.some(x => x.ParentId == id);
        }

        init();
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



