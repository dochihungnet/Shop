(function () {
    angular.module('shop.menus', ['shop.common']).config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('menus', {
                url: '/menus',
                parent: 'base',
                templateUrl: '/Areas/Admin/app/components/menus/menu_list.view.html',
                controller: 'menuListController'
            })
            .state('menu_add', {
                url: '/product_category_add',
                parent: 'base',
                templateUrl: '/Areas/Admin/app/components/menus/menu_add.view.html',
                controller: 'menuAddController'
            })
            .state('menu_edit', {
                url: '/product_category_edit/:id',
                parent: 'base',
                templateUrl: '/Areas/Admin/app/components/menus/menu_edit.view.html',
                controller: 'menuEditController'
            });
    }
})();