
(function () {
    angular.module('shop.product_details', ['shop.common']).config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('product_details', {
                url: '/product_details/:id',
                parent: 'base',
                templateUrl: '/app/components/product_details/product_detail.view.html',
                controller: 'productDetailsController'
            })
    }
})();