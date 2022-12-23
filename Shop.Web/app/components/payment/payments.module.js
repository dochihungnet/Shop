(function () {
    angular.module('shop.payments', ['shop.common']).config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('payment', {
                url: '/payment',
                parent: 'base',
                templateUrl: '/app/components/payment/payment.view.html',
                controller: 'paymentController'
            })
    }
})();