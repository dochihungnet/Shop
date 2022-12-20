(function () {
    angular.module('shop.order_details', ['shop.common']).config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('order_detail', {
                url: '/order_detail/:id',
                parent: 'base',
                templateUrl: '/app/components/order_details/order_detail.view.html',
                controller: 'orderDetailController'
            })
    }
})();