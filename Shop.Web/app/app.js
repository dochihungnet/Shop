(function () {
    angular.module('shop', [
        'shop.header',
        'shop.footer',
        'shop.list_product_one_home',
        'shop.list_product_two_home',
        'shop.list_post_home', 
        'shop.product_details',
        'shop.product_categories',
        'shop.product_tags',
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


        $urlRouterProvider.otherwise('/home');
    }
})();
