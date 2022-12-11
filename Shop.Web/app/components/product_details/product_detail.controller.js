(function (app) {
    app.controller('productDetailsController', productDetailsController);

    productDetailsController.$inject = ['apiService', '$scope', '$state', 'notificationService', '$stateParams', '$timeout', '$q', 'cartService'];

    function productDetailsController(apiService, $scope, $state, notificationService, $stateParams, $timeout, $q, cartService) {

        $scope.product = null;
        $scope.moreImages = [];

        $scope.listProductLatest = [];
        $scope.listProductRelated = [];
        $scope.listRootProductCategory = [];
        $scope.listProductCategory = [];
        $scope.listTagByProductId = [];

        $scope.getAllProductCategoryChild = getAllProductCategoryChild;
        $scope.checkExistChild = checkExistChild;
        $scope.addProductShoppingCart = addProductShoppingCart;
        $scope.increaseQuantity = increaseQuantity;
        $scope.decreaseQuantity = decreaseQuantity;
        $scope.changeQuantity = changeQuantity;

        $q.all([
            loadProductDetail(),
            getAllRootProductCategory(),
            getAllProductCategory(),

        ]).then(function (result) {
            $scope.product = result[0];
            $scope.product.buyingQuantity = 1;
            $scope.moreImages = JSON.parse($scope.product.MoreImages);

            $scope.listRootProductCategory = result[1];
            $scope.listProductCategory = result[2];

            getAllProductRelated($scope.product.CategoryId, 7).then(result => {
                $scope.listProductRelated = result;
                $timeout(init, 0);
            })
        });

        getAllProductLatest(4).then(result => {
            $scope.listProductLatest = result;
        })


        getAllTagByProductId().then(result => {
            $scope.listTagByProductId = result;
        });

        ////////////////////////////////////////////////////////////////////////
        //////////////////// FUNC HANDELER
        ///////////////////////////////////////////////////////////////////////
        
        function increaseQuantity(){
            $scope.product.buyingQuantity = $scope.product.buyingQuantity + 1;
        }
        
        function decreaseQuantity(){
            if($scope.product.buyingQuantity > 1) $scope.product.buyingQuantity = $scope.product.buyingQuantity - 1;
        }
        
        function changeQuantity(){
            if($scope.product.buyingQuantity < 1) $scope.product.buyingQuantity = 1;
        }
        
        function addProductShoppingCart(product, quantity){
            cartService.addProductShoppingCart(product, quantity);
            $state.go('carts');
        }
        
        function loadProductDetail() {
            let deferred = $q.defer();

            apiService.get(
                'https://localhost:44353/api/product/getbyidinclude/' + $stateParams.id,
                null,
                function (result) {
                    deferred.resolve(result.data);
                },
                function (error) {
                    deferred.reject('lấy product details thất bại.')
                }
            );

            return deferred.promise;
        }

        function getAllTagByProductId() {
            let deferred = $q.defer();

            let config = {
                params: {
                    productId: $stateParams.id
                }
            }

            apiService.get(
                `https://localhost:44353/api/product/getalltagbyproductid`,
                config,
                function (result) {
                    deferred.resolve(result.data);
                },
                function (error) {
                    deferred.reject(`Lấy all tag by product ID không thành công`);
                }

            );

            return deferred.promise;
        }

        function getAllProductLatest(size) {
            let deferred = $q.defer();

            let config = {
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

        function getAllProductRelated(categoryId, size) {
            let deferred = $q.defer();

            let config = {
                params: {
                    productId: $stateParams.id,
                    categoryId: categoryId,
                    size: size
                }
            }

            apiService.get(
                `https://localhost:44353/api/product/getrelated`,
                config,
                function (result) {
                    deferred.resolve(result.data);
                },
                function (error) {
                    deferred.reject(`Lấy product related không thành công`);
                }

            );
            return deferred.promise;
        }

        function getAllRootProductCategory() {
            let deferred = $q.defer();
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

        function getAllProductCategory() {
            let deferred = $q.defer();
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

        // lấy ra danh sách product category con từ category Id
        function getAllProductCategoryChild(id) {
            return $scope.listProductCategory.filter(x => x.ParentId == id);
        }

        // kiểm tra product Category id có tồn tại con hay không?
        function checkExistChild(id) {
            return $scope.listProductCategory.some(x => x.ParentId == id);
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


})(angular.module('shop.product_details'));



