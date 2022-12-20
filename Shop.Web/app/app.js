(function () {
    angular.module('shop', [
        'shop.common',
        'shop.footer',
        'shop.list_product_one_home',
        'shop.list_product_two_home',
        'shop.list_post_home', 
        'shop.product_details',
        'shop.product_categories',
        'shop.product_tags',
        'shop.contact',
        'shop.carts',
        'shop.checkout',
        'shop.orders',
        'shop.order_details'
    ]).config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('base', {
                url: '',
                templateUrl: "/app/shared/views/base.view.html",
                abstract: true
            })
            .state('home', {
                url: "/home",
                parent: 'base',
                templateUrl: "/app/components/home/home.view.html",
                controller: "homeController"
            })
            .state('register', {
                url: "/register",
                parent: 'base',
                templateUrl: "/app/components/register/register.view.html",
                controller: "registerController"
            })
            .state('login', {
                url: "/login",
                parent: 'base',
                templateUrl: "/app/components/login/login.view.html",
                controller: "loginController"
            })


        $urlRouterProvider.otherwise('/home');
    }
})();
