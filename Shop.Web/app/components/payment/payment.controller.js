(function (app){
    app.controller('paymentController', paymentController);

    paymentController.$inject = ['$scope', 'apiService', '$q', '$location', 'loginService', '$state', 'notificationService', 'locationService', 'paymentService'];

    function paymentController($scope, apiService, $q, $location, loginService, $state, notificationService, locationService, paymentService) {
        $scope.statusPayment = false;
        $scope.orderId =  localStorage.getItem('orderId');
        console.log($scope.orderId);
        let parameter = $location.search();
        
        if(parameter["vnp_ResponseCode"] === "00"){
            $scope.statusPayment = true;
            
        }
        else {
            deleteOrderById($scope.orderId);
            $scope.statusPayment = false;
        }
        
        // delete order by id
        function deleteOrderById(id){
            let deferred = $q.defer();

            let config = {
                params: {
                    id: id
                }
            };

            apiService.get(
                'https://localhost:44353/api/order/delete-order-by-id',
                config,
                function (result){
                    deferred.resolve(result.data);
                },
                function (error){
                    deferred.reject('get order by id failure');
                }
            )

            return deferred.promise;
        }
        
  
    }

})(angular.module('shop.payments'))