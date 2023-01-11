(function (app) {
    app.controller('homeController', homeController);

    homeController.$inject = ['$scope', 'apiService', 'notificationService', '$q'];
    function homeController($scope, apiService, notificationService, $q) {
        let url = "https://localhost:44353/api/statistical/statistical";
        
        $scope.statistical = {};
        
        getStatistical().then(result => {
            if(result){
                $scope.statistical = result;
                ordersDataProcessing();
            }
        })
        function getStatistical(){
            let deferred = $q.defer();
            
            apiService.get(
                url,
                null,
                function (result){
                    deferred.resolve(result.data);
                },
                function (error){
                    deferred.reject('get statistical failure');
                }
            )
            
            return deferred.promise;
            
        }

        function ordersDataProcessing(){
            $scope.statistical.RecentOrders = $scope.statistical.RecentOrders.map(x => {
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
                x.TotalPayment = 0;
                console.log(x.OrderDetails);
                x.OrderDetails.map(od => {
                    x.TotalPayment += od.Price * od.Quantity;

                })

                x.TotalPayment = x.TotalPayment + x.TotalPayment * x.Vat / 100 + x.TransportFee;

                return x;
            });
        }
    }

})(angular.module('shop'));