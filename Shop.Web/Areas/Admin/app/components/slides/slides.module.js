(function () {
    angular.module('shop.slides', ['shop.common']).config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('slides', {
                url: '/slides',
                parent: 'base',
                templateUrl: '/Areas/Admin/app/components/slides/slide_list.view.html',
                controller: 'slideListController'
            })
            .state('slide_add', {
                url: '/slide_add',
                parent: 'base',
                templateUrl: '/Areas/Admin/app/components/slides/slide_add.view.html',
                controller: 'slideAddController'
            })
            .state('slide_edit', {
                url: '/slide_edit/:id',
                parent: 'base',
                templateUrl: '/Areas/Admin/app/components/slides/slide_edit.view.html',
                controller: 'slideEditController'
            });
    }
})();