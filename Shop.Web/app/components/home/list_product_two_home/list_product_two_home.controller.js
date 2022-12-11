angular.
    module('shop.list_product_two_home', ['shop.common']).
    component('listProductTwoHomeView', {  // This name is what AngularJS uses to match to the `<phone-list>` element.
        templateUrl: "/app/components/home/list_product_two_home/list_product_two_home.view.html",
        controller: ['apiService', '$q', '$timeout', 'cartService',
            function ListProductTwoHomeController(apiService, $q, $timeout, cartService) {

            let $scope = this;

            $scope.BEST_SELLER = 'bestseller';
            $scope.NEW = 'new';
            $scope.BEST_RATING = 'bestrating';


            $scope.products = [];

            $q.all([getProducts($scope.BEST_SELLER, 10)]).then(function (result) {
                $scope.products = handlerResponseData(result[0], 10);
            });


            // xử lý sự kiện khi người dùng chọn [Bán chạy nhất, mới nhất, Đánh giá tốt]
            $scope.handlerEventClickChooseCategory = handlerEventClickChooseCategory;
            // handler event add product shopping cart
            $scope.addProductShoppingCart = addProductShoppingCart;
            function addProductShoppingCart(product){
                cartService.addProductShoppingCart(product);
            }

            function handlerEventClickChooseCategory(keyword, size) {
                getProducts(keyword, size).then((result) => {
                    console.log(result);
                    $scope.products = handlerResponseData(result, 10);
                });
            }

            function getProducts(keyword, size) {
                let deferred = $q.defer();

                let config = {
                    params: {
                        size: size
                    }
                }

                apiService.get(
                    `https://localhost:44353/api/product/get${keyword}`,
                    config,
                    function (result) {
                        deferred.resolve(result.data);
                    },
                    function (error) {
                        deferred.reject(`Lấy ${keyword} không thành công`);
                    }

                );
                return deferred.promise;
            }



            // xử lý xem sản phẩm nào là sản phẩm new
            function handlerResponseData(product, days) {
                return product.map(x => {
                    let result = new Date(x.CreatedDate);
                    result.setDate(result.getDate() + days);

                    if (result > new Date()) {
                        x.IsANewProduct = true;
                    }
                    else {
                        x.IsANewProduct = false;
                    }
                    return x;
                })
            }

            // Thêm file js vào cuối body sau khi chạy hết logic angularjs + html/csss
            function init() {
                $('body').append('<script type="text/javascript" src="/assets/client/js/themejs/homepage.js"></script>');
            }
        }]
    });