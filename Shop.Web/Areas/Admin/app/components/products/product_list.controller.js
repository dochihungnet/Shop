(function (app) {
    app.controller('productListController', productListController);

    productListController.$inject = ['$scope', 'apiService', 'notificationService', '$ngBootbox', '$filter', '$timeout', '$q', '$log'];

    function productListController($scope, apiService, notificationService, $ngBootbox, $filter, $timeout, $q, $log) {
        $scope.products = [];

        $scope.page = 0;
        $scope.pageSize = 10;
        $scope.pageCount = 0;

        $scope.keyword = '';

        $scope.getListProduct = getListProduct;

        $scope.search = search;

        $scope.deleteProduct = deleteProduct;

        $scope.selectAll = selectAll;

        $scope.deleteMultiple = deleteMultiple;

        function deleteMultiple() {
            var listId = [];
            $.each($scope.selected, function (idx, item) {
                listId.push(item.Id);
            });

            var config = {
                params: {
                    checkedProducts: JSON.stringify(listId)
                }
            };

            apiService.del(
                'https://localhost:44353/api/product/deletemultiple',
                config,
                function (result) {
                    notificationService.displaySuccess('Xóa thàn công ' + result.data + ' sản phẩm');
                    search();
                },
                function (error) {
                    notificationService.displayError('Xóa thất bại ..., bùn ghê!')
                }
            )
        }

        $scope.isAll = false;
        function selectAll() {
            // đây là func sẽ chạy nếu sảy ra sự kiện click từ 1 button nào đó
            // nếu isAll đang là true => khi click vào sẽ chuyển thành false
            if ($scope.isAll) {
                angular.forEach($scope.products, function (item) {
                    item.checked = false;
                });
                $scope.isAll = false;
            }
            else {
                angular.forEach($scope.products, function (item) {
                    item.checked = true;
                });
                $scope.isAll = true;
            }
        }

        $scope.$watch("products", function (newVal, oldVal) {

            var checked = $filter("filter")(newVal, { checked: true });

            if (checked.length) {
                $scope.selected = checked;
                $('#btnDelete').removeAttr('disabled');
            }
            else {
                $('#btnDelete').attr('disabled', 'disabled');
            }

        }, true);

        function deleteProduct(id) {
            $ngBootbox.confirm('Bạn có chắc muốn xóa sản phẩm này không?')
                .then(function (result) {

                    var config = {
                        params: {
                            id: id
                        }
                    };

                    apiService.del(
                        'https://localhost:44353/api/product/delete',
                        config,
                        function (result) {
                            notificationService.displaySuccess('Xóa sản phẩm thành công!');
                            search();
                        },
                        function (error) {
                            notificationService.displayError('Xóa sản phẩm thất bại!')
                        }
                    )


                })
        }

        function search() {
            getListProduct();
        }

        // lấy danh sách sản phẩm theo page
        function getListProduct(page) {
            page = page || 0;
            var config = {
                params: {
                    keyword: $scope.keyword,
                    page: page,
                    pageSize: $scope.pageSize
                }
            };
            apiService.get(
                'https://localhost:44353/api/product/getall',
                config,
                function (result) {
                    $scope.products = result.data.Items;
                    $scope.page = result.data.Page;
                    $scope.pageCount = result.data.TotalPages;
                    $scope.totalCount = result.data.TotalCount;
                },
                function () {
                    console.log('load product failed');
                }
            );
        }

        $scope.getListProduct();


        // ==================================

        $scope.simulateQuery = false;
        $scope.isDisabled = false;

        $scope.repos = loadAll();
        $scope.querySearch = querySearch;
        $scope.selectedItemChange = selectedItemChange;
        $scope.searchTextChange = searchTextChange;

        // ******************************
        // Internal methods
        // ******************************

        /**
            * Search for repos... use $timeout to simulate
            * remote dataservice call.
            */
        function querySearch(query) {
            var results = query ? $scope.repos.filter(createFilterFor(query)) : $scope.repos,
                deferred;
            if ($scope.simulateQuery) {
                deferred = $q.defer();
                $timeout(function () { deferred.resolve(results); }, Math.random() * 1000, false);
                return deferred.promise;
            } else {
                return results;
            }
        }

        function searchTextChange(text) {
            $log.info('Text changed to ' + text);
        }

       function selectedItemChange(item) {
            $log.info('Item changed to ' + JSON.stringify(item));
        }

        /**
            * Build `components` list of key/value pairs
            */
        function loadAll() {
            var repos = [
                {
                    'name': 'AngularJS',
                    'url': 'https://github.com/angular/angular.js',
                    'desc': 'AngularJS is JavaScript MVC made easy.',
                    'watchers': '3,623',
                    'forks': '16,175',
                },
                {
                    'name': 'Angular',
                    'url': 'https://github.com/angular/angular',
                    'desc': 'Angular is a development platform for building mobile ' +
                        'and desktop web applications using Typescript/JavaScript ' +
                        'and other languages.',
                    'watchers': '469',
                    'forks': '760',
                },
                {
                    'name': 'AngularJS Material',
                    'url': 'https://github.com/angular/material',
                    'desc': 'An implementation of Google\'s Material Design Specification ' +
                        '(2014-2017) for AngularJS developers',
                    'watchers': '727',
                    'forks': '1,241',
                },
                {
                    'name': 'Angular Material',
                    'url': 'https://github.com/angular/components',
                    'desc': 'Material Design (2018+) components built for and with Angular ' +
                        'and Typescript',
                    'watchers': '727',
                    'forks': '1,241',
                },
                {
                    'name': 'Bower Material',
                    'url': 'https://github.com/angular/bower-material',
                    'desc': 'the repository used for publishing the AngularJS Material ' +
                        'v1.x library and localized installs using npm.',
                    'watchers': '42',
                    'forks': '84',
                },
                {
                    'name': 'Material Start',
                    'url': 'https://github.com/angular/material-start',
                    'desc': 'A sample application purposed as both a learning tool and a ' +
                        'skeleton application for a typical AngularJS Material web app.',
                    'watchers': '81',
                    'forks': '303',
                }
            ];
            return repos.map(function (repo) {
                repo.value = repo.name.toLowerCase();
                return repo;
            });
        }

        /**
            * Create filter function for a query string
            */
        function createFilterFor (query) {
            var lowercaseQuery = query.toLowerCase();

            return function filterFn(item) {
                return (item.value.indexOf(lowercaseQuery) === 0);
            };

        }

    }
})(angular.module('shop.products'));