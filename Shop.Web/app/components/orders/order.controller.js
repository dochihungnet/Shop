(function (app){
    app.controller('listOrderController', listOrderController);
    
    listOrderController.$inject = ['$scope', 'apiService', '$q', 'authData', 'loginService', '$state', 'notificationService', 'locationService'];
    
    function listOrderController($scope, apiService, $q, authData, loginService, $state, notificationService, locationService){
        
        $scope.loginStatus = false;
        $scope.countListOrder = 0;
        $scope.user = null;
        $scope.listOrderByUser = [];
        // Look up order information: Tra cứu thông tin đơn hàng
        $scope.lookUpOrderInformation = {
            Email: "",
            OrderId: undefined
        };
        
        $scope.GetOrderDetail = GetOrderDetail;
        
        $scope.$watch(function () { return authData.authenticationData; }, function () {
            if(authData.authenticationData.IsAuthenticated === true){
                $scope.loginStatus = true;
                getUserByUserName(authData.authenticationData.userName).then(result => {
                    if(result){
                        $scope.user = result;
                        getAllOrderByUserId($scope.user.Id).then(result => {
                            if(result){
                                $scope.listOrderByUser = result;
                                $scope.countListOrder = $scope.listOrderByUser.length;
                                ordersDataProcessing();
                            }
                        })
                    }
                })
            }
            else {
                $scope.loginStatus = false;
            }
        }, true);
        
        function getAllOrderByUserId(userId){
            let deferred = $q.defer();

            let config = {
                params: {
                    customerId: userId
                }
            }
            
            apiService.get(
                'https://localhost:44353/api/order/get-all-order-by-customer-id',
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

        // get user by user name
        function getUserByUserName(userName){
            let deferred = $q.defer();
            let config = {
                params: {
                    userName: userName
                }
            }
            apiService.get(
                'https://localhost:44353/api/user/get-user-by-user-name',
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
       
        // orderDataProcessing
        function ordersDataProcessing(){
            $scope.listOrderByUser = $scope.listOrderByUser.map(x => {
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
        
        function GetOrderDetail(){
            if( $scope.lookUpOrderInformation.Email &&  $scope.lookUpOrderInformation.OrderId){
                
            }
            else {
                notificationService.displayWarning("Thông tin không hợp lệ")
            }
        }
    }
    
})(angular.module('shop.orders'))