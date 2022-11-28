angular.
    module('shop.list_post_home', ['shop.common']).
    component('listPostHomeView', {  // This name is what AngularJS uses to match to the `<phone-list>` element.
        templateUrl: "/app/components/home/list_post_home/list_post_home.view.html",
        controller: ['apiService', '$q', '$timeout', function ListPostHomeController(apiService, $q, $timeout) {
            var $scope = this;


            init();
            // Thêm file js vào cuối body sau khi chạy hết logic angularjs + html/csss
            function init() {
                $('body').append('<script type="text/javascript" src="/assets/client/js/themejs/so_megamenu.js"></script>');
            }
        }]
    });