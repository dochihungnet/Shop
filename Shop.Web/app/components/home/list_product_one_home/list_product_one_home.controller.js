angular.
    module('shop.list_product_one_home', ['shop.common']).
    component('listProductOneHomeView', {  // This name is what AngularJS uses to match to the `<phone-list>` element.
        templateUrl: "/app/components/home/list_product_one_home/list_product_one_home.view.html",
        controller: ['apiService', '$q', '$timeout', function ListProductOneHomeController(apiService, $q, $timeout) {
            var $scope = this;
            $scope.listProductDealsOfTheWeek = [];

            $q.all([getAllProductDealsOfTheWeek()]).then(function (result) {
                $scope.listProductDealsOfTheWeek = result[0];
                $timeout(init, 0);
            });

            function getAllProductDealsOfTheWeek() {
                var deferred = $q.defer();
                apiService.get(
                    'https://localhost:44353/api/product/getalldealsoftheweek',
                    null,
                    function (result) {
                        deferred.resolve(result.data);
                    },
                    function (error) {
                        deferred.reject('Lấy all product giảm giá trong tuần không thành công');
                    }

                );
                return deferred.promise;
            }

            // Thêm file js vào cuối body sau khi chạy hết logic angularjs + html/csss
            function init() {
                $('body').append('<script type="text/javascript" src="/assets/client/js/themejs/so_megamenu.js"></script>');
            }
        }]
    });