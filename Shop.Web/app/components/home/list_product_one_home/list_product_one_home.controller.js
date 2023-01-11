angular.
    module('shop.list_product_one_home', ['shop.common']).
    component('listProductOneHomeView', {  // This name is what AngularJS uses to match to the `<phone-list>` element.
        templateUrl: "/app/components/home/list_product_one_home/list_product_one_home.view.html",
        controller: ['apiService', '$q', '$timeout', '$scope', 'cartService',
            function ListProductOneHomeController(apiService, $q, $timeout, $scope, cartService) {
            let self = this;

            self.listProductDealsOfTheWeek = [];
            self.threeProductCategoryBestSelling = [];
            self.listProductBestSelling = [];

            self.handlerEventClickChooseProductCategory = handlerEventClickChooseProductCategory;
            self.addProductShoppingCart = addProductShoppingCart;
            
            $q.all([getAllProductDealsOfTheWeek(), getAllProductCategoryBestSelling(3)]).then(function (result) {
                self.listProductDealsOfTheWeek = result[0];
                self.threeProductCategoryBestSelling = result[1];

                getAllProductBestSellingByCategory(self.threeProductCategoryBestSelling[0].Id, 8).then(result => {
                    self.listProductBestSelling = handlerResponseData(result, 1);
                    $timeout(init, 0);
                })
            });

            

            function addProductShoppingCart(product){
                cartService.addProductShoppingCart(product);
            }

            function getAllProductDealsOfTheWeek() {
                let deferred = $q.defer();
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
                let deferred = $q.defer();

                let config = {
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
                let deferred = $q.defer();

                let config = {
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
                    self.listProductBestSelling = handlerResponseData(result, 1);
                    $timeout(init, 0);
                })
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