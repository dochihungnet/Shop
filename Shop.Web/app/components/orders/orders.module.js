(function () {
    angular.module('shop.orders', ['shop.common']).config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('orders', {
                url: '/orders',
                parent: 'base',
                templateUrl: '/app/components/orders/order.view.html',
                controller: 'listOrderController'
            })
    }
})();