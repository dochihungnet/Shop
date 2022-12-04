
(function () {
    angular.module('shop.product_tags', ['shop.common']).config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('product_tags', {
                url: '/product_tags/:id',
                parent: 'base',
                templateUrl: '/app/components/product_tags/product_tag.view.html',
                controller: 'productTagsController'
            })
    }
})();