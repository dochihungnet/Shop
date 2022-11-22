(function () {
    angular.module('shop.brands', ['shop.common']).config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('brands', {
                url: '/brands',
                parent: 'base',
                templateUrl: '/Areas/Admin/app/components/brands/brand_list.view.html',
                controller: 'brandListController'
            })
            .state('brand_add', {
                url: '/brand_add',
                parent: 'base',
                templateUrl: '/Areas/Admin/app/components/brands/brand_add.view.html',
                controller: 'brandAddController'
            })
            .state('brand_edit', {
                url: '/brand_edit/:id',
                parent: 'base',
                templateUrl: '/Areas/Admin/app/components/brands/brand_edit.view.html',
                controller: 'brandEditController'
            });
    }
})();