angular.module('shop.products_home', []);

angular.
    module('shop.products_home', ['shop.common']).
    component('headerView', {  // This name is what AngularJS uses to match to the `<phone-list>` element.
        templateUrl: "/app/components/header/header.view.html",
        controller: ['apiService', '$q', '$timeout', function HeaderController(apiService, $q, $timeout) {
            var self = this;

            this.productCategories = [];
            this.rootProductCategories = [];

            this.getAllProductCategoryChild = getAllProductCategoryChild;
            this.checkExistChild = checkExistChild;

            $q.all([getAllRootProductCategory(), getAllProductCateory()]).then(function (result) {
                self.rootProductCategories = result[0];
                self.productCategories = result[1];
                $timeout(init, 0);
            });


            function getAllProductCateory() {
                var deferred = $q.defer();
                apiService.get(
                    'https://localhost:44353/api/productcategory/getallparents',
                    null,
                    function (result) {
                        deferred.resolve(result.data);
                    },
                    function (error) {
                        deferred.reject('Lấy product category không thành công');
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