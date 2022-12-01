(function () {
    angular.module('shop.product_categories', ['shop.common']).config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('product_categories', {
                url: '/product_categories/:id',
                parent: 'base',
                templateUrl: '/app/components/product_categories/product_categories.view.html',
                controller: 'productCategoriesController'
            })
    }
})();