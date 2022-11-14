(function () {
    angular.module('shop.product_categories', ['shop.common']).config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('product_categories', {
                url: '/product_categories',
                templateUrl: '/Areas/Admin/app/components/product_categories/product_category_list.view.html',
                controller: 'productCategoryListController'
            })
            .state('product_category_add', {
                url: '/product_category_add',
                templateUrl: '/Areas/Admin/app/components/product_categories/product_category_add.view.html',
                controller: 'productCategoryAddController'
            })
            .state('product_category_edit', {
                url: '/product_category_edit/:id',
                templateUrl: '/Areas/Admin/app/components/product_categories/product_category_edit.view.html',
                controller: 'productCategoryEditController'
            });
    }
})();