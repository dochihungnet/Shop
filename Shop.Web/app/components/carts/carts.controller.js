(function (app){
    app.controller('shoppingCartController', shoppingCartController);
    shoppingCartController.$inject = ['$scope', 'apiService', '$q', '$timeout', 'cartService', 'authData', 'loginService', '$state'];
    function shoppingCartController($scope, apiService, $q, $timeout, cartService, authData, loginService, $state){
        
        $scope.vat = 20;
        $scope.carts = cartService.getAllProductShoppingCart();
        $scope.totalCart = cartService.getTotalShoppingCart();

        $scope.cartService = cartService;
        
        $scope.deleteProduct = function (productId) {
            cartService.deleteProductShoppingCart(productId);
        }
        
        $scope.updateProductShoppingCart = function (productId){
            let productShoppingCart =  $scope.carts.find(spc => spc.ProductId === productId);
            cartService.updateProductShoppingCart(productShoppingCart);
        }
        
        $scope.deleteShoppingCart = function (){
            cartService.deleteShoppingCart();
        }

        $scope.updateShoppingCart = function (){
            cartService.updateShoppingCart($scope.carts);
        }

        // theo dõi sự thay đổi của shoppingCart.carts trong cartService
        $scope.$watch(function () { return cartService.shoppingCart.carts; }, function (newVal, oldVal) {
            $scope.carts = cartService.getAllProductShoppingCart();
            $scope.totalCart = cartService.getTotalShoppingCart();
        }, true);
        

    }
    
})(angular.module('shop.carts'));