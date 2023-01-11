(function (app) {

    app.controller('orderListController', orderListController);

    orderListController.$inject = ['$scope', 'apiService', '$state', 'notificationService', 'commonService', '$q'];

    function orderListController($scope, apiService, $state, notificationService, commonService, $q) {
        // Từ khóa
        // Mã đơn hàng
        // Tên khách hàng
        // Email khách hàng
        // Trạng thái thanh toán
        // Trạng thái đơn
        // Ngày thêm đơn
        // string keyword, int? orderId, string customerName, string email, bool? paymentStatus int? orderStatus,
        // Datetime? createdDate, int page, int pageSize
        $scope.keyword = "";
        $scope.orderStatus = null;
        
        $scope.pageSize = "10";
        
        $scope.orderId = null;
        $scope.customerName = "";
        $scope.email = "";
        $scope.paymentStatus = null;
        $scope.createdDate = null;
        
        
        $scope.page = 0;
        
        $scope.pageCount = 0;
        $scope.orders = [];
        
        $scope.getListOrder = function (page){
            getAllOrder(page).then(result => {
                $scope.orders = result.Items;
                ordersDataProcessing();
                $scope.page = result.Page;
                $scope.pageCount = result.TotalPages;
                $scope.totalCount = result.TotalCount;
            })
        };

        $scope.resetFilter = function (){
            $scope.orderId = null;
            $scope.customerName = "";
            $scope.email = "";
            $scope.paymentStatus = null;
            $scope.createdDate = null;
            $scope.orderStatus_ = null;
            
            $scope.getListOrder();

        }
        $scope.filterOrder = function (){
            $scope.keyword = "";
            $scope.orderStatus = $scope.orderStatus_;
            $scope.getListOrder();
        }
        
        $scope.changeKeyword = changeKeyword();

        function changeKeyword() {
            let myTimeout;
            
            const filter = function (){
                $scope.resetFilter();
                $scope.getListOrder();
            }
            function handlerEventChangeKeyword(){
                clearTimeout(myTimeout);
                myTimeout = setTimeout(filter, 2000);
            }
            return handlerEventChangeKeyword;
        }
        
        
        $scope.handlerEventClickChangePageSize = handlerEventClickChangePageSize;
        $scope.handlerEventClickChangeOrderStatus = handlerEventClickChangeOrderStatus;
        
        $scope.getListOrder();
        
        function handlerEventClickChangePageSize(){
            $scope.getListOrder();
        }
        
        function handlerEventClickChangeOrderStatus(){
            $scope.resetFilter();
            $scope.getListOrder();
        }
        
        function getAllOrder(page){
            page = page || 0;
            let status = null;
            if($scope.paymentStatus){
                status = $scope.paymentStatus === "0" ? false : true;
            }
            
            let deferred = $q.defer();
            
            let config = {
                params: {
                    keyword: $scope.keyword,
                    customerName: $scope.customerName,
                    email: $scope.email,
                    paymentStatus: status,
                    orderId: $scope.orderId,
                    orderStatus : $scope.orderStatus ? parseInt($scope.orderStatus) : null,
                    createdDate : $scope.createdDate,
                    page: page,
                    pageSize: parseInt($scope.pageSize)
                }
            };
            console.log(config.params);
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
                x.TotalPayment = 0;
                x.OrderDetails.map(od => {
                    x.TotalPayment += od.Price * od.Quantity;
                    
                })
                
                x.TotalPayment = x.TotalPayment + x.TotalPayment * x.Vat / 100 + x.TransportFee;
                
                return x;
            });
        }

    }


})(angular.module('shop.orders'));