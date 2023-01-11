(function (app) {

    app.controller('orderDetailController', orderDetailController);

    orderDetailController.$inject = ['$scope', 'apiService', '$state', 'notificationService', 'commonService', '$stateParams', '$q'];

    function orderDetailController($scope, apiService, $state, notificationService, commonService, $stateParams, $q) {
        $scope.order = null;
        
        $scope.changeOrderStatus = changeOrderStatus;
        $scope.exportOrderToPdf = exportOrderToPdf;
        
        GetOrderById($stateParams.id).then(result => {
            if(result){
                $scope.order = result;
                // xử lý dữ liệu đơn hàng
                orderDataProcessing();
            }
        })
        
        function changeOrderStatus(){
            UpdateOrder().then(result => {
                if(result){
                    notificationService.displaySuccess("Thay đổi trạng thái đơn hàng thành công")
                    $scope.order = result;
                    orderDataProcessing();
                }
            })
        }
        function UpdateOrder(){
            let deferred = $q.defer();
            
            $scope.order.OrderStatus = parseInt($scope.order.OrderStatus);

            apiService.put(
                'https://localhost:44353/api/order/update',
                $scope.order,
                function (response){
                    deferred.resolve(response.data);
                },
                function (error){
                    deferred.reject(error);
                }
            )

            return deferred.promise;
        }
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
            $scope.TotalPayment = 0;
            $scope.order.OrderDetails.map(od => {
                $scope.TotalPayment += od.Price * od.Quantity;
            })
            $scope.Total = $scope.TotalPayment;
            $scope.TotalVat = $scope.TotalPayment * $scope.order.Vat / 100;
            $scope.TotalPayment = $scope.TotalPayment + $scope.TotalPayment * $scope.order.Vat / 100 + $scope.order.TransportFee;

            $scope.PaymentStatusText = $scope.order.PaymentStatus ? "Đã thanh toán" : "Thanh toán khi nhận hàng";
            switch ($scope.order.OrderStatus) {
                case 1: {
                    $scope.OrderStatusText = "Đang chờ duyệt";
                    break
                }
                case 2: {
                    $scope.OrderStatusText = "Đã duyệt";
                    console.log($scope.OrderStatusText);
                    break
                }
                case 3: {
                    $scope.OrderStatusText = "Đang gói hàng";
                    break
                }
                case 4: {
                    $scope.OrderStatusText = "Đang vận chuyển";
                    break
                }
                case 5: {
                    $scope.OrderStatusText = "Đang giao hàng";
                    break
                }
            }
            $scope.order.OrderStatus = `${$scope.order.OrderStatus}`;
        }
        
        function exportOrderToPdf(){

            let element = document.getElementById('pdf');
            let opt = {
                margin:       1,
                filename:     `don-hang-${$scope.order.Id}.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2 },
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
            };

            html2pdf().set(opt).from(element).save();

        }
    }


})(angular.module('shop.orders'));