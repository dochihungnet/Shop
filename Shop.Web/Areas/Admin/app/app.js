
(function () {
    angular.module('shop', [
        'shop.common',
        'shop.products',
        'shop.product_categories'
    ]).config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider.state('home', {
            url: "/home",
            templateUrl: "/Areas/Admin/app/components/home/home.view.html",
            controller: "homeController"
        })


        $urlRouterProvider.otherwise('/home');
    }
})();