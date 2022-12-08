(function (app) {
    'use strict'

    app.factory('cartService', ['$scope', 'authData',
        function ($scope, authData) {

            // THEO DOI XEM DA DANG NHAP HAY CHUA
            $scope.$watch(function () { return authData.authenticationData; }, function (newVal, oldVal) {
                console.log("Cart service đang theo dõi authData");

            }, true);
            var CartSeviceFactory = {};
            var cart = [];

            CartSeviceFactory.cart = cart;

            CartSeviceFactory.addProductCart = function (product) {
                CartSeviceFactory.cart.push(product);
            }

            CartSeviceFactory.addListProductCart = function (products) {
                CartSeviceFactory.cart.push(...products);
            }

            CartSeviceFactory.removeProductCart = function (product_id) {
                CartSeviceFactory.cart = CartSeviceFactory.cart.filter(product => product.Id !== product_id);
            }

            CartSeviceFactory.clearCart = function () {
                CartSeviceFactory.cart = [];
            }

            return CartSeviceFactory;
        }
    ])

})(angular.module('shop.common'));