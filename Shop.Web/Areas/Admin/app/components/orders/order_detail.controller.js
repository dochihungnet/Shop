(function (app) {

    app.controller('orderDetailController', orderDetailController);

    orderDetailController.$inject = ['$scope', 'apiService', '$state', 'notificationService', 'commonService', '$stateParams', '$q'];

    function orderDetailController($scope, apiService, $state, notificationService, commonService, $stateParams, $q) {
        $scope.order = null;
        
        GetOrderById($stateParams.id).then(result => {
            if(result){
                $scope.order = result;
                // xử lý dữ liệu đơn hàng
                orderDataProcessing();
                console.log($scope.order);
            }
        })
        function GetOrderById(id){
            let deferred = $q.defer();

            let config = {
                params: {
                    id: id
                }
            }

            apiService.get(
                'https://localhost:44353/api/order/get-order-by-id',
                config,
                function (response){
                    deferred.resolve(response.data);
                },
                function (error){
                    deferred.reject(error);
                }
            )

            return deferred.promise;
        }

        function orderDataProcessing() {
            $scope.order.OrderDetails.map(od => {
                $scope.order.TotalPayment += od.Price * od.Quantity;
            })
            $scope.order.TotalVat = $scope.order.TotalPayment * $scope.order.Vat / 100;
            $scope.order.TotalPayment = $scope.order.TotalPayment + $scope.order.TotalPayment * $scope.order.Vat / 100 + $scope.order.TransportFee;

            $scope.order.PaymentStatusText = $scope.order.PaymentStatus ? "Đã thanh toán" : "Thanh toán khi nhận hàng";

            switch ($scope.order.OrderStatus) {
                case 1: {
                    $scope.order.OrderStatusText = "Đang chờ duyệt";
                    break
                }
                case 2: {
                    $scope.order.OrderStatusText = "Đã duyệt";
                    break
                }
                case 3: {
                    $scope.order.OrderStatusText = "Đang gói hàng";
                    break
                }
                case 4: {
                    $scope.order.OrderStatusText = "Đang vận chuyển";
                    break
                }
                case 5: {
                    $scope.order.OrderStatusText = "Đang giao hàng";
                    break
                }
            }
        }
        
    }


})(angular.module('shop.orders'));