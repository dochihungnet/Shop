
(function () {
    angular.module('shop', [
        'shop.common',
        'shop.products',
        'shop.product_categories',
        'shop.brands'
    ]).config(config)
        .config(configAuth);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('base', {
                url: '',
                templateUrl: "/Areas/Admin/app/shared/views/base.view.html",
                abstract: true
            })
            .state('login', {
                url: "/login",
                templateUrl: "/Areas/Admin/app/components/login/login.view.html",
                controller: "loginController"
            })
            .state('home', {
                url: "/home",
                parent: 'base',
                templateUrl: "/Areas/Admin/app/components/home/home.view.html",
                controller: "homeController"
            })


        $urlRouterProvider.otherwise('/login');
    }


    function configAuth($httpProvider) {
        $httpProvider.interceptors.push(function ($q, $location) {
            return {
                request: function (config) {

                    return config;
                },
                requestError: function (rejection) {

                    return $q.reject(rejection);
                },
                response: function (response) {
                    if (response.status == "401") {
                        $location.path('/login');
                    }
                    //the same response/modified/or a new one need to be returned.
                    return response;
                },
                responseError: function (rejection) {

                    if (rejection.status == "401") {
                        $location.path('/login');
                    }
                    return $q.reject(rejection);
                }
            };
        });
    }

})();