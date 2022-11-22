(function (app) {

    app.controller('brandListController', brandListController);

    brandListController.$inject = ['$scope', 'apiService', 'notificationService', '$ngBootbox', '$filter'];

    function brandListController($scope, apiService, notificationService, $ngBootbox, $filter) {

        $scope.brands = [];

        $scope.page = 0;
        $scope.pageSize = 10;
        $scope.pageCount = 0;
        $scope.keyword = '';

        $scope.isAll = false;

        $scope.deleteBrand = deleteBrand;
        $scope.selectAll = selectAll;
        $scope.deleteMultiple = deleteMultiple;
        $scope.search = search;
        $scope.getListBrand = getListBrand;

        function deleteBrand(id) {
            $ngBootbox.confirm('Bạn có chắc chắn muốn xóa không?')
                .then(function () {
                    var config = {
                        params: {
                            id: id
                        }
                    };
                    apiService.del(
                        'https://localhost:44353/api/brand/delete',
                        config,
                        function () {
                            notificationService.displaySuccess('Xóa thương hiệu thành công.');
                            $scope.search();
                        },
                        function () {
                            notificationService.displayError('Xóa thương hiệu không thành công.');
                        }
                    )
                }
                );
        }

        function selectAll() {
            if ($scope.isAll) {
                angular.forEach($scope.brands, function (item) {
                    item.checked = false;
                });
                $scope.isAll = false;
            }
            else {
                angular.forEach($scope.brands, function (item) {
                    item.checked = true;
                });
                $scope.isAll = true;
            }
        };

        function deleteMultiple() {
            var listId = [];
            $.each($scope.selected, function (i, item) {
                listId.push(item.Id);
            })
            var config = {
                params: {
                    checkedBrands: JSON.stringify(listId)
                }
            }
            apiService.del(
                'https://localhost:44353/api/brand/deletemultiple',
                config,
                function (result) {
                    notificationService.displaySuccess('Xóa thành công thương hiệu.');
                    $scope.search();
                },
                function (error) {
                    notificationService.displaySuccess('Xóa thất bại rùi..., buồn ghê.');
                },
            );
        }

        $scope.$watch("brands", function (newValue, oldValue) {
            // filter (lọc) những giá trị có giá trị mới có checked = true
            var checked = $filter("filter")(newValue, { checked: true })

            if (checked.length) {
                $scope.selected = checked;
                $('#btnDelete').removeAttr('disabled');
            }
            else {
                $('#btnDelete').attr('disabled', 'disabled');
            }
        }, true);

        function search() {
            $scope.getListBrand();
        }

        function getListBrand(page) {
            // params: thông số

            page = page || 0;

            var config = {
                params: {
                    keyword: $scope.keyword,
                    page: page,
                    pageSize: $scope.pageSize,
                }
            }

            apiService.get(
                'https://localhost:44353/api/brand/getall',
                config,
                function (result) {
                    if (result.data.TotalCount == 0) {
                        notificationService.displayWarning("Không tồn tại thương hiệu nào")
                    }
                    $scope.brands = result.data.Items;
                    $scope.page = result.data.Page;
                    $scope.pageCount = result.data.TotalPages;
                    $scope.totalCount = result.data.TotalCount;
                },
                function (error) {
                    console.log('Lấy thương hiệu không thành công');
                }
            );
        }

        // Lấy danh sách thương hiệu
        $scope.getListBrand();


    }


})(angular.module('shop.brands'));
