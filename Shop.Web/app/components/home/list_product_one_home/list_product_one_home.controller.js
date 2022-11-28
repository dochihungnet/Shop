angular.
    module('shop.list_product_one_home', ['shop.common']).
    component('listProductOneHomeView', {  // This name is what AngularJS uses to match to the `<phone-list>` element.
        templateUrl: "/app/components/home/list_product_one_home/list_product_one_home.view.html",
        controller: ['apiService', '$q', '$timeout', function ListProductOneHomeController(apiService, $q, $timeout) {
            var $scope = this;

            $scope.listProductDealsOfTheWeek = [];
            $scope.threeProductCategoryBestSelling = [];
            $scope.listProductBestSelling = [];

            $scope.handlerEventClickChooseProductCategory = handlerEventClickChooseProductCategory;


            $q.all([getAllProductDealsOfTheWeek(), getAllProductCategoryBestSelling(3)]).then(function (result) {
                $scope.listProductDealsOfTheWeek = result[0];
                $scope.threeProductCategoryBestSelling = result[1];

                getAllProductBestSellingByCategory($scope.threeProductCategoryBestSelling[0].Id, 10).then(result => {
                    $scope.listProductBestSelling = result;
                    $timeout(init, 10);
                })
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

            function getAllProductCategoryBestSelling(amount) {
                var deferred = $q.defer();

                var config = {
                    params: {
                        amount: amount
                    }
                }

                apiService.get(
                    'https://localhost:44353/api/productcategory/getbestselling',
                    config,
                    function (result) {
                        deferred.resolve(result.data);
                    },
                    function (error) {
                        deferred.reject('Lấy all product category best selling không thành công');
                    }

                );
                return deferred.promise;
            }

            function getAllProductBestSellingByCategory(categoryId, size) {
                var deferred = $q.defer();

                var config = {
                    params: {
                        categoryId: categoryId,
                        size: size
                    }
                }

                apiService.get(
                    'https://localhost:44353/api/product/getbestsellingbycategory',
                    config,
                    function (result) {
                        deferred.resolve(result.data);
                    },
                    function (error) {
                        deferred.reject('Lấy all product best selling by id không thành công');
                    }

                );
                return deferred.promise;
            }

            function handlerEventClickChooseProductCategory(categoryId, size) {
                getAllProductBestSellingByCategory(categoryId, size).then(result => {
                    $scope.listProductBestSelling = result;
                    $timeout(init, 10);
                })
            }


            // Thêm file js vào cuối body sau khi chạy hết logic angularjs + html/csss
            function init() {
                $('body').append('<script type="text/javascript" src="/assets/client/js/themejs/homepage.js"></script>');
            }
        }]
    });