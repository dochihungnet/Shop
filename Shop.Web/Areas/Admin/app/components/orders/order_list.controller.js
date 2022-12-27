(function (app) {

    app.controller('orderListController', orderListController);

    orderListController.$inject = ['$scope', 'apiService', '$state', 'notificationService', 'commonService', '$q'];

    function orderListController($scope, apiService, $state, notificationService, commonService, $q) {
        
        $scope.page = 0;
        $scope.orderStatus = 1;
        $scope.pageSize = 10;
        $scope.pageCount = 0;
        $scope.totalCount = 0;
        
        $scope.orders = [];
        
        getAllOrder().then(result => {
            $scope.orders = result.Items;
            ordersDataProcessing();
            $scope.page = result.Page;
            $scope.pageCount = result.TotalPages;
            $scope.totalCount = result.TotalCount;
            console.log($scope.orders);
        })
        
        function getAllOrder(page){
            page = page || 0;
            
            let deferred = $q.defer();
            
            let config = {
                params: {
                    page: page,
                    pageSize: $scope.pageSize,
                    orderStatus: $scope.orderStatus,
                }
            };
            apiService.get(
                'https://localhost:44353/api/order/get-all-order',
                config,
                function (result) {
                    deferred.resolve(result.data);
                },
                function () {
                    deferred.reject('get all order failure');
                }
            );
            
            return deferred.promise;
        }

        function ordersDataProcessing(){
            $scope.orders = $scope.orders.map(x => {
                switch (x.OrderStatus) {
                    case 1: {
                        x.OrderStatusText = "Đang chờ duyệt";
                        break
                    }
                    case 2: {
                        x.OrderStatusText = "Đã duyệt";
                        break
                    }
                    case 3: {
                        x.OrderStatusText = "Đang gói hàng";
                        break
                    }
                    case 4: {
                        x.OrderStatusText = "Đang vận chuyển";
                        break
                    }
                    case 5: {
                        x.OrderStatusText = "Đang giao hàng";
                        break
                    }
                }
                x.OrderDetails.map(od => {
                    x.TotalPayment += od.Price * od.Quantity;
                })
                x.TotalPayment = x.TotalPayment + x.TotalPayment * x.Vat / 100 + x.TransportFee;
                
                return x;
            });
        }

    }


})(angular.module('shop.orders'));