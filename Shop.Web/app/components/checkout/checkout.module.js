(function () {
    angular.module('shop.checkout', ['shop.common']).config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('checkout', {
                url: '/checkout',
                parent: 'base',
                templateUrl: '/app/components/checkout/checkout.view.html',
                controller: 'checkOutController'
            })
    }
})();