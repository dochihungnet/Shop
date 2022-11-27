angular.
    module('shop.list_product_two_home', ['shop.common']).
    component('listProductTwoHomeView', {  // This name is what AngularJS uses to match to the `<phone-list>` element.
        templateUrl: "/app/components/home/list_product_two_home/list_product_two_home.view.html",
        controller: ['apiService', '$q', '$timeout', function ListProductTwoHomeController(apiService, $q, $timeout) {
            var self = this;

            init();
            // Thêm file js vào cuối body sau khi chạy hết logic angularjs + html/csss
            function init() {
                $('body').append('<script type="text/javascript" src="/assets/client/js/themejs/so_megamenu.js"></script>');
            }
        }]
    });