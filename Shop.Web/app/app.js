(function () {
    angular.module('shop', [
        'shop.header',
        'shop.footer',
    ]).config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('base', {
                url: '',
                templateUrl: "/app/shared/views/base.view.html",
                abstract: true
            })
            .state('home', {
                url: "/home",
                parent: 'base',
                templateUrl: "/app/components/home/home.view.html",
                controller: "homeController"
            })


        $urlRouterProvider.otherwise('/home');
    }
})();
