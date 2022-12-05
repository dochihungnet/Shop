(function () {
    angular.module('shop.contact', ['shop.common']).config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('contact', {
                url: '/contact',
                parent: 'base',
                templateUrl: '/app/components/contact/contact.view.html',
                controller: 'contactController'
            })
    }
})();