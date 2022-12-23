(function () {
    angular.module('shop.orders', ['shop.common']).config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('orders', {
                url: '/orders',
                parent: 'base',
                templateUrl: '/Areas/Admin/app/components/orders/order_list.view.html',
                controller: 'orderListController'
            })
            .state('order_detail', {
                url: '/order_detail/:id',
                parent: 'base',
                templateUrl: '/Areas/Admin/app/components/orders/order_detail.view.html',
                controller: 'orderDetailController'
            })
    }
})();