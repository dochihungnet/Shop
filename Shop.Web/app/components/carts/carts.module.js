(function () {
    angular.module('shop.carts', ['shop.common']).config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('carts', {
                url: '/carts',
                parent: 'base',
                templateUrl: '/app/components/carts/carts.view.html',
                controller: 'shoppingCartController'
            })
    }
})();