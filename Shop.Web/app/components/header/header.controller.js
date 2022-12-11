// Register `phoneList` component, along with its associated controller and template
(function (app) {
    app.component('headerView', {  // This name is what AngularJS uses to match to the `<phone-list>` element.
        templateUrl: "/app/components/header/header.view.html",
        controller: ['$scope', 'apiService', '$q', '$timeout', 'cartService', 'authData', 'loginService', '$state',
            function HeaderController($scope, apiService, $q, $timeout, cartService, authData, loginService, $state) {
            let self = this;
            
            self.loginStatus = false;
            self.fullName = "";
            self.carts = cartService.getAllProductShoppingCart();
            self.totalCart = cartService.getTotalShoppingCart();
            
            self.cartService = cartService;
            
            self.deleteProduct = function (productId) {
                cartService.deleteProductShoppingCart(productId);
            }
            
            self.logOut = logOut;
            // THEO DOI XEM DA DANG NHAP HAY CHUA
            $scope.$watch(function () { return authData.authenticationData; }, function (newVal, oldVal) {
                if(authData.authenticationData.IsAuthenticated === true){
                    self.loginStatus = true;
                    cartService.getUserByUserName(authData.authenticationData.userName).then(result => {
                        self.fullName = result.FullName;
                    });
                }
                else {
                    self.loginStatus = false;
                    self.fullName = "";
                }
            }, true);

            // THEO DOI CART SERVICE
            $scope.$watch(function () { return cartService.shoppingCart.carts; }, function (newVal, oldVal) {
                self.carts = cartService.getAllProductShoppingCart();
                self.totalCart = cartService.getTotalShoppingCart();
            }, true);
            function logOut() {
                loginService.logOut();
                cartService.deleteShoppingCartLocalStorage();
                $state.go('home');
            }
            

            ///////////////////////////////////////////////////////////////////////////////////////////////////////
            //////////////// /////////////////////////////////////////////////////////////////////////////////////
            this.productCategories = [];
            this.rootProductCategories = [];

            this.getAllProductCategoryChild = getAllProductCategoryChild;
            this.checkExistChild = checkExistChild;

            $q.all([getAllRootProductCategory(), getAllProductCategory()]).then(function (result) {
                self.rootProductCategories = result[0];
                self.productCategories = result[1];
                $timeout(init, 0);
            });

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

            function getAllProductCategoryChild(id) {
                return self.productCategories.filter(x => x.ParentId == id);
            }
            // kiểm tra product Category id có tồn tại con hay không?
            function checkExistChild(id) {
                return self.productCategories.some(x => x.ParentId == id);
            }

            // Thêm file js vào cuối body sau khi chạy hết logic angularjs + html/csss
            function init() {
                $('body').append('<script type="text/javascript" src="/assets/client/js/themejs/so_megamenu.js"></script>');
            }
        }]
    });
})(angular.module('shop'));